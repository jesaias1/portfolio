type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const globalRateLimits = globalThis as typeof globalThis & {
  contactRateLimits?: Map<string, RateLimitEntry>;
};

const contactRateLimits = globalRateLimits.contactRateLimits ?? new Map<string, RateLimitEntry>();
globalRateLimits.contactRateLimits = contactRateLimits;

export function checkContactRateLimit(key: string, limit = 5, windowMs = 15 * 60 * 1000) {
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
