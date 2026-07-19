# MSM Lookup

A static search engine for [My Singing Monsters](https://www.mysingingmonsters.com/) breeding combinations. Search any monster by name and instantly see its breeding pairs, times, and enhanced times across all islands.

**Live site:** [dbruce32.github.io/msm-lookup](https://dbruce32.github.io/msm-lookup)

## Features

- Real-time monster search by name (instant filtering, no page loads)
- Breeding combinations grouped by island (common, rare, epic variants)
- Breeding times and enhanced breeding times displayed
- Keyboard-accessible (arrow keys, Enter, Escape)
- Fully static — no server required, hosted on GitHub Pages
- Daily data sync from [msm-db](https://github.com/dbruce32/msm-db) API

## Tech Stack

- **Framework:** Next.js 14 (App Router, static export)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **Package Manager:** pnpm
- **Hosting:** GitHub Pages
- **CI/CD:** GitHub Actions

## Local Development

```bash
# Install dependencies
pnpm install

# Fetch monster data from the API
pnpm prebuild

# Start dev server
pnpm dev
```

Open [http://localhost:3000/msm-lookup](http://localhost:3000/msm-lookup) in your browser.

## Build

```bash
pnpm prebuild   # Fetch latest data from msm-db API
pnpm build      # Build static site to /out
```

## How It Works

1. At build time, `scripts/fetch-data.ts` fetches all monster data from the [msm-db API](https://dbruce32.github.io/msm-db/api/monsters/index.json) and writes it to `src/data/monsters.json`
2. Next.js bakes all 180+ monsters into the static HTML via React Server Components
3. The client-side search component filters monsters instantly in the browser — no runtime API calls
4. A daily GitHub Actions cron job rebuilds and redeploys to pick up any upstream data changes

## Data Source

Monster data comes from [dbruce32/msm-db](https://github.com/dbruce32/msm-db), a static JSON API with breeding combinations scraped from the My Singing Monsters wiki.

## Deployment

Deployment is fully automated via GitHub Actions:

- **On push to `main`:** lint, build, and deploy to GitHub Pages
- **Daily at 6 AM UTC:** rebuild with latest API data
- **Manual trigger:** available via workflow_dispatch

## Project Structure

```
msm-lookup/
├── .github/workflows/    # CI and deploy pipelines
├── scripts/
│   └── fetch-data.ts     # Pre-build data fetcher
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── MonsterSearch.tsx   # Search input + results list
│   │   ├── MonsterDetail.tsx   # Monster info display
│   │   └── BreedingCard.tsx    # Island breeding combo card
│   ├── data/             # Generated monster data (gitignored)
│   └── lib/              # Types and API utilities
├── next.config.js        # Static export + basePath config
└── package.json
```
