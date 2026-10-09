# Deploying

The site is a static-first Next.js app deployed on Vercel from the `main` branch. There is no database.

1. Push to `main`. Vercel builds with `npm run build`.
2. In the Vercel project settings, add the environment variables you want (all optional):
   - `RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_TO_EMAIL` for contact-form email via Resend.
   - `EMAIL_USER`, `EMAIL_PASS` for the Gmail fallback.
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` for a rate limit shared across instances.
3. Domains: `www.jesaias.dk` is canonical; `jesaias.dk` redirects to it; `audio.jesaias.dk` is rewritten to `/audio`.

## Game links

`/play/ordbomben` and `/play/playhead` redirect to the live deployments (see `next.config.ts`), so the hosting URLs are never shown on the page.

## Before pushing

```bash
npm run lint && npx tsc --noEmit && npm run check:assets && npm run test:e2e
```
