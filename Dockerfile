# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=24.22.1

FROM node:${NODE_VERSION}-bookworm-slim AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
	npm ci --ignore-scripts

FROM dependencies AS build

RUN mkdir -p /app/dist /app/.wrangler && chown -R node:node /app/dist /app/.wrangler

COPY --chown=node:node . .
USER node

RUN npm run build

FROM build AS dev

ENV NODE_ENV=development \
	WRANGLER_SEND_METRICS=false

USER node

EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
	CMD node -e "fetch('http://127.0.0.1:8787/').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["npx", "wrangler", "dev", "--local", "--ip", "0.0.0.0"]

FROM build AS test

RUN npm run test:ci && npm run check

FROM test AS ci

FROM ci AS deploy

CMD ["npx", "wrangler", "deploy"]

FROM dev AS runtime
