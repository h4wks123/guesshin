# Guesshin

Guess which Genshin character is speaking. Each Game selects a secret character, lets the LLM roleplay in character, and gives the player clues to reason from.

## Features

- Curated playable-character roster with canonical names and Aliases
- Server-authoritative Game state in a Cloudflare Durable Object
- Natural-language Guesses with deterministic matching
- In-character clues with identity-leak validation before SSE delivery
- One-click Surrender and deterministic Reveal
- Accessible, responsive React interface with a separate tutorial
- Vitest coverage at the Worker HTTP boundary

## Getting started

Prerequisites: Node.js 24, Wrangler CLI, and a Cloudflare account with Workers AI access.

Install dependencies:

```bash
npm install
```

Create local environment values:

```bash
cp .env.example .env
```

`PORT` controls the Vite frontend port. `WORKER_PORT` controls the local Worker
port used by the Vite `/api` proxy.

Start the frontend and Worker in separate terminals:

```bash
npm run dev
npm run dev:worker
```

Workers AI usage during local development can incur Cloudflare usage charges.

## Validation

```bash
npm run test:ci
npm run build
npm run check
```

`check` runs TypeScript validation and Wrangler's deployment dry-run. The CI
workflow runs the same validation before production deployment.

## Game API

- `POST /api/games` creates a Game and returns an opaque `gameId`, public status, and opening message.
- `GET /api/games/:gameId` returns the public Game snapshot.
- `POST /api/games/:gameId/messages` accepts `{ "message": "...", "turnId": "..." }` and returns validated SSE events.
- `POST /api/games/:gameId/surrender` ends the Game and returns the Reveal.

The compatibility `POST /api/chat` route accepts the same `gameId` and message
shape. The secret character is never included in an active Game snapshot.

## Project structure

```text
/
├── src/
│   ├── client/              # Guesshin React experience and styling
│   ├── game/                # Roster, Guess rules, roleplay, and Game state
│   ├── index.test.ts        # Worker-boundary behavior tests
│   ├── index.ts             # Worker HTTP entry point
│   └── types.ts             # Shared Game contracts
├── docs/adr/                # Durable architecture decisions
├── GLOSSARY.md              # Canonical domain language
├── wrangler.jsonc           # Worker, AI, assets, and Durable Object config
└── vite.config.ts           # Frontend and Vitest configuration
```

## Deployment

```bash
npm run deploy
```

The GitHub Actions deployment requires `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` repository secrets. Pull requests run tests, build, and
the Wrangler dry-run without deploying; pushes to `main` deploy after
validation. GitHub Actions is the only normal CI/CD pipeline. Disable
Cloudflare Workers Builds for this repository so it cannot run a duplicate
build or deployment.

## Domain documentation

Read [GLOSSARY.md](./GLOSSARY.md) for the Game vocabulary and
[docs/adr](./docs/adr) for the server-authoritative state and validate-before-
streaming decisions.
