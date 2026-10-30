# LLM Chat Application Template

A simple, ready-to-deploy chat application template powered by Cloudflare Workers AI. This template provides a clean starting point for building AI chat applications with streaming responses.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/llm-chat-app-template)

<!-- dash-content-start -->

## Demo

This template demonstrates how to build an AI-powered chat interface using Cloudflare Workers AI with streaming responses. It features:

- Real-time streaming of AI responses using Server-Sent Events (SSE)
- Easy customization of models and system prompts
- Support for AI Gateway integration
- Clean, responsive React UI that works on mobile and desktop

## Features

- 💬 Simple and responsive chat interface
- ⚡ Server-Sent Events (SSE) for streaming responses
- 🧠 Powered by Cloudflare Workers AI LLMs
- 🛠️ Built with React, Vite, TypeScript, and Cloudflare Workers
- 📱 Mobile-friendly design
- 🔄 Maintains chat history on the client
- 🔎 Built-in Observability logging
<!-- dash-content-end -->

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- A Cloudflare account with Workers AI access

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/cloudflare/templates.git
   cd templates/llm-chat-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Generate Worker type definitions:
   ```bash
   npm run cf-typegen
   ```

### Development

Start the Vite frontend:

```bash
npm run dev
```

This will start a local server at http://localhost:5173. The `/api` requests are
proxied to a local Worker at http://localhost:8787, so start the Worker in a
second terminal when you want to use the chat API:

```bash
npm run dev:worker
```

For a single server that serves the built frontend and Worker together, run
`npm run start`.

Note: Using Workers AI accesses your Cloudflare account even during local development, which will incur usage charges.

### Docker

Build and run the Worker locally in a container:

```bash
docker compose up --build
```

Open http://localhost:8787 after the container starts. The image runs Wrangler
in local mode as a non-root user and does not include secrets. To use the remote
Workers AI binding from Docker, provide `CLOUDFLARE_API_TOKEN` at runtime and
override the command with `npx wrangler dev --remote --ip 0.0.0.0`.

To run the same containerized validation used by GitHub Actions:

```bash
docker build --target ci .
```

### GitHub and Cloudflare CI/CD

GitHub Actions validates pull requests and pushes to `main` by building the
Docker `ci` target. A push to `main` deploys only after that target succeeds.
The deployment runs `wrangler deploy` inside the same validated Docker image,
so CI and deployment use the same Node.js version and installed dependencies.

Add these GitHub repository secrets before enabling production deployment:

- `CLOUDFLARE_API_TOKEN`: a token with permission to deploy Workers
- `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID

If the repository is connected to Cloudflare Workers Builds, disable its
automatic production deployment or configure it not to promote versions. It
must not deploy independently, otherwise it can bypass the GitHub CI gate.

### Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

### Monitor

View real-time logs associated with any deployed Worker:

```bash
npm wrangler tail
```

## Project Structure

```
/
├── index.html          # Vite HTML entry point
├── Dockerfile           # Multi-stage local/CI container build
├── compose.yaml         # Local Worker container
├── .github/workflows/
│   └── ci.yml           # Docker-based GitHub validation
├── src/
│   ├── client/
│   │   ├── App.tsx     # React chat UI and streaming client
│   │   ├── main.tsx    # React entry point
│   │   └── styles.css  # Chat UI styles
│   ├── index.ts        # Main Worker entry point
│   └── types.ts        # TypeScript type definitions
├── wrangler.jsonc      # Cloudflare Worker configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # This documentation
```

## How It Works

### Backend

The backend is built with Cloudflare Workers and uses the Workers AI platform to generate responses. The main components are:

1. **API Endpoint** (`/api/chat`): Accepts POST requests with chat messages and streams responses
2. **Streaming**: Uses Server-Sent Events (SSE) for real-time streaming of AI responses
3. **Workers AI Binding**: Connects to Cloudflare's AI service via the Workers AI binding

### Frontend

The frontend is a React/Vite application that:

1. Presents a chat interface
2. Sends user messages to the API
3. Processes streaming responses in real-time
4. Maintains chat history on the client side

## Customization

### Changing the Model

To use a different AI model, update the `MODEL_ID` constant in `src/index.ts`. You can find available models in the [Cloudflare Workers AI documentation](https://developers.cloudflare.com/workers-ai/models/).

### Using AI Gateway

The template includes commented code for AI Gateway integration, which provides additional capabilities like rate limiting, caching, and analytics.

To enable AI Gateway:

1. [Create an AI Gateway](https://dash.cloudflare.com/?to=/:account/ai/ai-gateway) in your Cloudflare dashboard
2. Uncomment the gateway configuration in `src/index.ts`
3. Replace `YOUR_GATEWAY_ID` with your actual AI Gateway ID
4. Configure other gateway options as needed:
   - `skipCache`: Set to `true` to bypass gateway caching
   - `cacheTtl`: Set the cache time-to-live in seconds

Learn more about [AI Gateway](https://developers.cloudflare.com/ai-gateway/).

### Modifying the System Prompt

The default system prompt can be changed by updating the `SYSTEM_PROMPT` constant in `src/index.ts`.

### Styling

The UI styling is contained in `src/client/styles.css`. You can modify the CSS variables at the top to quickly change the color scheme.

## Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Workers AI Models](https://developers.cloudflare.com/workers-ai/models/)
