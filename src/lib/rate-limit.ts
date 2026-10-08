type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
};

const globalRateLimits = globalThis as typeof globalThis & {
  contactRateLimits?: Map<string, RateLimitEntry>;
};

const contactRateLimits = globalRateLimits.contactRateLimits ?? new Map<string, RateLimitEntry>();
globalRateLimits.contactRateLimits = contactRateLimits;

const CONTACT_LIMIT = 5;
const CONTACT_WINDOW_MS = 15 * 60 * 1000;

/**
 * Contact-form limiter. Uses Upstash Redis (REST) when UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN are set, so the limit is shared across serverless instances.
 * Without them, or if Redis is unreachable, it falls back to a per-instance in-memory limit.
 */
export async function checkContactRateLimit(
  key: string,
  limit = CONTACT_LIMIT,
  windowMs = CONTACT_WINDOW_MS
): Promise<RateLimitResult> {
  const shared = await checkSharedRateLimit(key, limit, windowMs);
  return shared ?? checkMemoryRateLimit(key, limit, windowMs);
}

async function checkSharedRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const redisKey = `contact-rate:${key}`;
  const windowSeconds = Math.ceil(windowMs / 1000);

  try {
    const response = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['INCR', redisKey],
        ['EXPIRE', redisKey, windowSeconds, 'NX'],
        ['TTL', redisKey],
      ]),
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) return null;

    const results = (await response.json()) as { result?: number }[];
    const count = Number(results[0]?.result);
    const ttl = Number(results[2]?.result);
    if (!Number.isFinite(count)) return null;

    if (count > limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Number.isFinite(ttl) && ttl > 0 ? ttl : windowSeconds,
      };
    }
    return { allowed: true, remaining: limit - count, retryAfter: 0 };
  } catch {
    return null;
  }
}

function checkMemoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const current = contactRateLimits.get(key);

  if (!current || current.resetAt <= now) {
    contactRateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  if (contactRateLimits.size > 1000) {
    for (const [entryKey, entry] of contactRateLimits) {
      if (entry.resetAt <= now) contactRateLimits.delete(entryKey);
    }
  }

  return { allowed: true, remaining: limit - current.count, retryAfter: 0 };
}
