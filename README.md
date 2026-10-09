# jesaias.dk

Portfolio for Linas Jesaias: design engineer and product developer in Copenhagen.
Built with Next.js 16, React 19, TypeScript, Tailwind, Framer Motion and Three.js. There is no database or admin: content lives in code.

## Run locally

```bash
npm install
cp .env.local.example .env.local   # fill in the values
npm run dev                        # http://localhost:3000
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js dev server, production build, production server |
| `npm run lint` | ESLint |
| `npm run check:assets` | Fails if an asset in `public/` exceeds its size budget |
| `npm run test:e2e` | Playwright suite (mobile, tablet, desktop, accessibility) |
| `npm run generate:og` | Regenerates the social preview images |

## Where things live

- `src/data/projects.ts` is the single source for project copy, status, media and ordering.
- `src/data/audio-products.ts` drives the `/audio` product pages.
- The Project Reel is a dropdown in `src/components/About.tsx` (files in `public/reel/`).
- `public/projects/videos/` holds the hover previews shown on project cards.
- `src/app/api/contact/route.ts` sends contact mail via Resend (or Gmail as a fallback).

## Deploying

Deployed on Vercel. See [DEPLOY.md](./DEPLOY.md). Environment variables are listed in
`.env.local.example`; only the contact form needs any. Optional: `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` enable a
shared rate limit for the contact form; without them it falls back to a per-instance limit.
