import { handleApiRequest } from "./http/game-routes";
import type { Env } from "./types";

export { GameState } from "./game/durable-object";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
    return handleApiRequest(request, env);
  },
} satisfies ExportedHandler<Env>;
