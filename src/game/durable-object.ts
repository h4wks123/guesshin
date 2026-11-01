import {
  GameFinishedError,
  GameNotFoundError,
  GameSession,
  InvalidGameMessageError,
} from "./game-session";
import { DurableObjectGameStore, GAME_TTL_MS } from "./game-store";
import { generateValidatedResponse, toAiRunner } from "./roleplay";

type GameEnvironment = {
  AI: Ai;
};

export type { GameTurnResult } from "./game-session";

export class GameState implements DurableObject {
  private readonly store: DurableObjectGameStore;

  constructor(
    private readonly ctx: DurableObjectState,
    private readonly env: GameEnvironment,
  ) {
    this.store = new DurableObjectGameStore(ctx);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    try {
      if (url.pathname === "/init" && request.method === "POST")
        return await this.initialize(request);
      if (url.pathname === "/snapshot" && request.method === "GET")
        return await this.snapshot();
      if (url.pathname === "/message" && request.method === "POST")
        return await this.message(request);
      if (url.pathname === "/surrender" && request.method === "POST")
        return await this.surrender();
      return json({ error: "Not found" }, 404);
    } catch (error) {
      if (error instanceof GameNotFoundError)
        return json({ error: error.message }, 404);
      if (error instanceof GameFinishedError) return json(error.result, 409);
      if (error instanceof InvalidGameMessageError)
        return json({ error: error.message }, 400);

      console.error("Game state error:", error);
      return json({ error: "The game could not be updated." }, 500);
    }
  }

  async alarm(): Promise<void> {
    const state = await this.store.load();
    if (!state) return;

    const remaining = GAME_TTL_MS - (Date.now() - state.lastActivityAt);
    if (remaining <= 0) {
      await this.store.clear();
      return;
    }
    await this.store.setAlarm(Date.now() + remaining);
  }

  private createSession(): GameSession {
    return new GameSession({
      store: this.store,
      generateResponse: (profile, history, userMessage) =>
        generateValidatedResponse(
          toAiRunner(this.env.AI),
          profile,
          history,
          userMessage,
        ),
    });
  }

  private async initialize(request: Request): Promise<Response> {
    const body = (await request.json()) as { characterId?: string };
    return json(await this.createSession().initialize(body.characterId));
  }

  private async snapshot(): Promise<Response> {
    return json(await this.createSession().snapshot());
  }

  private async message(request: Request): Promise<Response> {
    const body = (await request.json()) as {
      message?: string;
      turnId?: string;
    };
    return json(
      await this.createSession().message(body.message ?? "", body.turnId),
    );
  }

  private async surrender(): Promise<Response> {
    return json(await this.createSession().surrender());
  }
}

function json(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
