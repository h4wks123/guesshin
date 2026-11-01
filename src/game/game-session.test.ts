import { describe, expect, it, vi } from "vitest";
import { GameSession } from "./game-session";
import type { StoredGame } from "./game-session";

function createSession(response = "The road is pleasant today.") {
  let stored: StoredGame | undefined;
  const generateResponse = vi.fn(async () => response);
  const session = new GameSession({
    store: {
      load: async () => stored,
      save: async (state) => {
        stored = state;
      },
    },
    generateResponse,
    now: () => 1_000,
  });
  return { session, generateResponse };
}

describe("GameSession", () => {
  it("keeps Game transitions behind the session interface", async () => {
    const { session } = createSession();

    await session.initialize();
    const result = await session.message("Are you Amber?", "winning-turn");

    expect(result).toMatchObject({
      status: "won",
      reveal: { name: "Amber" },
      assistant: "Correct. You found me.",
    });
  });

  it("replays an idempotent turn without invoking roleplay twice", async () => {
    const { session, generateResponse } = createSession();

    await session.initialize();
    const first = await session.message("What do you enjoy?", "retry-turn");
    const second = await session.message("What do you enjoy?", "retry-turn");

    expect(second).toEqual(first);
    expect(generateResponse).toHaveBeenCalledTimes(2);
  });
});
