# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=24.22.1

FROM node:${NODE_VERSION}-bookworm-slim AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

# Keep dependency installation reproducible and cache npm downloads without
# including the cache in an image layer.
RUN --mount=type=cache,target=/root/.npm \
	npm ci --ignore-scripts

FROM dependencies AS build

RUN mkdir -p /app/dist /app/.wrangler && chown -R node:node /app/dist /app/.wrangler

COPY --chown=node:node . .
USER node

RUN npm run build

# This target is used by GitHub Actions to validate the same artifact that is
# later deployed by Cloudflare Workers Builds.
FROM build AS ci

RUN npm run check

FROM node:${NODE_VERSION}-bookworm-slim AS runtime

ENV NODE_ENV=production \
	WRANGLER_SEND_METRICS=false

WORKDIR /app

RUN mkdir -p /app/.wrangler && chown node:node /app/.wrangler

COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json /app/package-lock.json ./
COPY --from=build --chown=node:node /app/src ./src
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/tsconfig.json /app/wrangler.jsonc /app/worker-configuration.d.ts ./

USER node

EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
	CMD node -e "fetch('http://127.0.0.1:8787/').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["npx", "wrangler", "dev", "--local", "--ip", "0.0.0.0"]
