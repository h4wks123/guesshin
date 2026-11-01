import { GameMessage, GameStatus, PublicGameState } from "../types";
import { CHARACTER_ROSTER, getCharacterProfile, toReveal } from "./characters";
import { evaluateGuess, isSurrenderMessage } from "./guessing";
import {
  FALLBACK_RESPONSE,
  generateValidatedResponse,
  toAiRunner,
} from "./roleplay";

const STATE_KEY = "game";
const GAME_TTL_MS = 60 * 60 * 1000;
const MAX_MESSAGES = 40;

type StoredGame = {
  status: GameStatus;
  characterId: string;
  messages: GameMessage[];
  createdAt: number;
  lastActivityAt: number;
  lastTurnId?: string;
  lastTurnResult?: GameTurnResult;
};

export type GameTurnResult = PublicGameState & {
  assistant?: string;
};

type GameEnvironment = {
  AI: Ai;
};

export class GameState implements DurableObject {
  constructor(
    private readonly ctx: DurableObjectState,
    private readonly env: GameEnvironment,
  ) {}

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    try {
      if (url.pathname === "/init" && request.method === "POST")
        return this.initialize(request);
      if (url.pathname === "/snapshot" && request.method === "GET")
        return this.snapshot();
      if (url.pathname === "/message" && request.method === "POST")
        return this.message(request);
      if (url.pathname === "/surrender" && request.method === "POST")
        return this.surrender();
      return json({ error: "Not found" }, 404);
    } catch (error) {
      console.error("Game state error:", error);
      return json({ error: "The game could not be updated." }, 500);
    }
  }

  async alarm(): Promise<void> {
    const state = await this.load();
    if (!state) return;

    const remaining = GAME_TTL_MS - (Date.now() - state.lastActivityAt);
    if (remaining <= 0) {
      await this.ctx.storage.deleteAll();
      return;
    }
    await this.ctx.storage.setAlarm(Date.now() + remaining);
  }

  private async initialize(request: Request): Promise<Response> {
    const existing = await this.load();
    if (existing) return json(this.publicResult(existing));

    const body = (await request.json()) as { characterId?: string };
    const profile = body.characterId
      ? getCharacterProfile(body.characterId)
      : CHARACTER_ROSTER[0];
    const now = Date.now();
    const state: StoredGame = {
      status: "active",
      characterId: profile.id,
      messages: [],
      createdAt: now,
      lastActivityAt: now,
    };

    const greeting = await generateValidatedResponse(
      toAiRunner(this.env.AI),
      profile,
      [],
      "Open the Game with one concise in-character greeting. Do not state your identity.",
    );
    state.messages.push({
      role: "assistant",
      content: greeting || FALLBACK_RESPONSE,
    });
    await this.save(state);
    return json(this.publicResult(state));
  }

  private async snapshot(): Promise<Response> {
    const state = await this.load();
    return state
      ? json(this.publicResult(state))
      : json({ error: "Game not found" }, 404);
  }

  private async message(request: Request): Promise<Response> {
    const state = await this.load();
    if (!state) return json({ error: "Game not found" }, 404);
    if (state.status !== "active") return json(this.publicResult(state), 409);

    const body = (await request.json()) as {
      message?: string;
      turnId?: string;
    };
    const message = body.message?.trim();
    if (!message) return json({ error: "Message is required" }, 400);
    if (body.turnId && state.lastTurnId === body.turnId && state.lastTurnResult)
      return json(state.lastTurnResult);

    const profile = getCharacterProfile(state.characterId);
    if (isSurrenderMessage(message)) {
      this.recordMessages(state, [{ role: "user", content: message }]);
      state.status = "revealed";
      const assistant = "The mystery is over. Here is the reveal.";
      this.recordMessages(state, [{ role: "assistant", content: assistant }]);
      const result = this.publicResult(state, assistant);
      await this.saveTurn(state, body.turnId, result);
      return json(result);
    }

    const outcome = evaluateGuess(message, profile, CHARACTER_ROSTER);
    if (outcome.kind === "multiple") {
      const assistant = "Please choose one character for your Guess.";
      this.recordMessages(state, [
        { role: "user", content: message },
        { role: "assistant", content: assistant },
      ]);
      const result = this.publicResult(state, assistant);
      await this.saveTurn(state, body.turnId, result);
      return json(result);
    }

    if (outcome.kind === "correct") {
      state.status = "won";
      this.recordMessages(state, [
        { role: "user", content: message },
        { role: "assistant", content: "Correct. You found me." },
      ]);
      const result = this.publicResult(state, "Correct. You found me.");
      await this.saveTurn(state, body.turnId, result);
      return json(result);
    }

    const response = await generateValidatedResponse(
      toAiRunner(this.env.AI),
      profile,
      state.messages,
      message,
    );
    const assistant =
      outcome.kind === "incorrect"
        ? `That Guess is not correct. ${response}`
        : response;
    this.recordMessages(state, [
      { role: "user", content: message },
      { role: "assistant", content: assistant },
    ]);
    const result = this.publicResult(state, assistant);
    await this.saveTurn(state, body.turnId, result);
    return json(result);
  }

  private async surrender(): Promise<Response> {
    const state = await this.load();
    if (!state) return json({ error: "Game not found" }, 404);
    if (state.status !== "active") return json(this.publicResult(state), 409);

    state.status = "revealed";
    const assistant = "The mystery is over. Here is the reveal.";
    this.recordMessages(state, [{ role: "assistant", content: assistant }]);
    await this.save(state);
    return json(this.publicResult(state, assistant));
  }

  private async load(): Promise<StoredGame | undefined> {
    return this.ctx.storage.get<StoredGame>(STATE_KEY);
  }

  private async save(state: StoredGame): Promise<void> {
    await this.ctx.storage.put(STATE_KEY, state);
    await this.ctx.storage.setAlarm(Date.now() + GAME_TTL_MS);
  }

  private recordMessages(state: StoredGame, messages: GameMessage[]): void {
    state.messages = [...state.messages, ...messages].slice(-MAX_MESSAGES);
    state.lastActivityAt = Date.now();
  }

  private async saveTurn(
    state: StoredGame,
    turnId: string | undefined,
    result: GameTurnResult,
  ): Promise<void> {
    if (turnId) {
      state.lastTurnId = turnId;
      state.lastTurnResult = result;
    }
    await this.save(state);
  }

  private publicResult(state: StoredGame, assistant?: string): GameTurnResult {
    const result: GameTurnResult = {
      status: state.status,
      messages: state.messages,
    };
    if (assistant) result.assistant = assistant;
    if (state.status !== "active") {
      const profile = getCharacterProfile(state.characterId);
      result.reveal = toReveal(profile);
    }
    return result;
  }
}

function json(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
