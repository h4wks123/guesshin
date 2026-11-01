import { describe, expect, it, vi } from "vitest";
import { createGameClient } from "./game-client";

describe("client Game transport", () => {
  it("hides SSE parsing behind the streamMessage interface", async () => {
    const fetcher = vi.fn(async () =>
      new Response(
        'data: {"type":"state","status":"active"}\n\n' +
          'data: {"type":"message","response":"Hello"}\n\n' +
          "data: [DONE]\n\n",
      ),
    );
    const client = createGameClient(fetcher);
    const events = [];

    for await (const event of client.streamMessage({
      gameId: "game/one",
      message: "Hello?",
      turnId: "turn-1",
    })) {
      events.push(event);
    }

    expect(events).toEqual([
      { type: "state", status: "active" },
      { type: "message", response: "Hello" },
    ]);
    expect(fetcher).toHaveBeenCalledWith(
      "/api/games/game%2Fone/messages",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
