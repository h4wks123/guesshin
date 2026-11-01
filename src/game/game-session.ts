import type { GameMessage, GameStatus, PublicGameState } from "../types";
import {
  CHARACTER_ROSTER,
  getCharacterProfile,
  toReveal,
} from "./characters";
import type { CharacterProfile } from "./characters";
import { evaluateGuess, isSurrenderMessage } from "./guessing";
import { FALLBACK_RESPONSE } from "./roleplay";

const MAX_MESSAGES = 40;

export type GameTurnResult = PublicGameState & {
  assistant?: string;
};

export type StoredGame = {
  status: GameStatus;
  characterId: string;
  messages: GameMessage[];
  createdAt: number;
  lastActivityAt: number;
  lastTurnId?: string;
  lastTurnResult?: GameTurnResult;
};

export type GameStore = {
  load: () => Promise<StoredGame | undefined>;
  save: (state: StoredGame) => Promise<void>;
};

export type GenerateResponse = (
  profile: CharacterProfile,
  history: GameMessage[],
  userMessage?: string,
) => Promise<string>;

export class GameNotFoundError extends Error {
  constructor() {
    super("Game not found");
  }
}

export class GameFinishedError extends Error {
  constructor(readonly result: GameTurnResult) {
    super("Game is already finished");
  }
}

export class InvalidGameMessageError extends Error {
  constructor() {
    super("Message is required");
  }
}

export type GameSessionDependencies = {
  store: GameStore;
  generateResponse: GenerateResponse;
  now?: () => number;
};

export class GameSession {
  private readonly now: () => number;

  constructor(private readonly dependencies: GameSessionDependencies) {
    this.now = dependencies.now ?? Date.now;
  }

  async initialize(characterId?: string): Promise<GameTurnResult> {
    const existing = await this.dependencies.store.load();
    if (existing) return this.publicResult(existing);

    const profile = characterId
      ? getCharacterProfile(characterId)
      : CHARACTER_ROSTER[0];
    const now = this.now();
    const state: StoredGame = {
      status: "active",
      characterId: profile.id,
      messages: [],
      createdAt: now,
      lastActivityAt: now,
    };

    const greeting = await this.dependencies.generateResponse(
      profile,
      [],
      "Open the Game with one concise in-character greeting. Do not state your identity.",
    );
    state.messages.push({
      role: "assistant",
      content: greeting || FALLBACK_RESPONSE,
    });
    await this.dependencies.store.save(state);
    return this.publicResult(state);
  }

  async snapshot(): Promise<GameTurnResult> {
    return this.publicResult(await this.requireState());
  }

  async message(value: string, turnId?: string): Promise<GameTurnResult> {
    const state = await this.requireState();
    if (state.status !== "active")
      throw new GameFinishedError(this.publicResult(state));

    const message = value.trim();
    if (!message) throw new InvalidGameMessageError();
    if (turnId && state.lastTurnId === turnId && state.lastTurnResult)
      return state.lastTurnResult;

    const profile = getCharacterProfile(state.characterId);
    if (isSurrenderMessage(message)) {
      this.recordMessages(state, [{ role: "user", content: message }]);
      state.status = "revealed";
      const assistant = "The mystery is over. Here is the reveal.";
      this.recordMessages(state, [{ role: "assistant", content: assistant }]);
      const result = this.publicResult(state, assistant);
      await this.saveTurn(state, turnId, result);
      return result;
    }

    const outcome = evaluateGuess(message, profile, CHARACTER_ROSTER);
    if (outcome.kind === "multiple") {
      const assistant = "Please choose one character for your Guess.";
      this.recordMessages(state, [
        { role: "user", content: message },
        { role: "assistant", content: assistant },
      ]);
      const result = this.publicResult(state, assistant);
      await this.saveTurn(state, turnId, result);
      return result;
    }

    if (outcome.kind === "correct") {
      state.status = "won";
      const assistant = "Correct. You found me.";
      this.recordMessages(state, [
        { role: "user", content: message },
        { role: "assistant", content: assistant },
      ]);
      const result = this.publicResult(state, assistant);
      await this.saveTurn(state, turnId, result);
      return result;
    }

    const response = await this.dependencies.generateResponse(
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
    await this.saveTurn(state, turnId, result);
    return result;
  }

  async surrender(): Promise<GameTurnResult> {
    const state = await this.requireState();
    if (state.status !== "active")
      throw new GameFinishedError(this.publicResult(state));

    state.status = "revealed";
    const assistant = "The mystery is over. Here is the reveal.";
    this.recordMessages(state, [{ role: "assistant", content: assistant }]);
    await this.dependencies.store.save(state);
    return this.publicResult(state, assistant);
  }

  private async requireState(): Promise<StoredGame> {
    const state = await this.dependencies.store.load();
    if (!state) throw new GameNotFoundError();
    return state;
  }

  private recordMessages(state: StoredGame, messages: GameMessage[]): void {
    state.messages = [...state.messages, ...messages].slice(-MAX_MESSAGES);
    state.lastActivityAt = this.now();
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
    await this.dependencies.store.save(state);
  }

  private publicResult(
    state: StoredGame,
    assistant?: string,
  ): GameTurnResult {
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
