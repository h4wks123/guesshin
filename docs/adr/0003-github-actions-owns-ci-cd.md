# GitHub Actions owns CI and production deployment

Guesshin uses GitHub Actions as its only normal CI/CD pipeline. Pull requests run tests, the frontend build, TypeScript validation, and Wrangler's deployment dry-run without deploying; pushes to `main` run the same validation and then deploy to Cloudflare Workers. We disable the separate Cloudflare Workers Builds pipeline to avoid duplicate builds and unclear failures, use Node.js 24 consistently in local development and CI, and handle rollback by reverting the responsible commit and redeploying.

## Considered Options

- Cloudflare Workers Builds as a second pipeline: rejected because it duplicates GitHub validation and creates a second failure surface.
- Deploying pull requests to Cloudflare: rejected because preview deployments add complexity that Guesshin does not need yet.
- Automatic rollback: rejected because reverting a commit and rerunning the trusted deployment path is simpler.
