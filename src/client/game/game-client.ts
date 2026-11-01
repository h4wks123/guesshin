import type { GameResponse, GameStreamEvent } from "../../types";
import { consumeSseEvents } from "./sse";

type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export type GameClient = {
  startGame: () => Promise<GameResponse>;
  streamMessage: (input: {
    gameId: string;
    message: string;
    turnId: string;
  }) => AsyncGenerator<GameStreamEvent>;
  surrender: (gameId: string) => Promise<GameResponse>;
};

async function readJson(response: Response): Promise<GameResponse> {
  if (!response.ok) throw new Error("The game request failed");
  return (await response.json()) as GameResponse;
}

export function createGameClient(fetcher: Fetcher = fetch): GameClient {
  return {
    async startGame() {
      return readJson(await fetcher("/api/games", { method: "POST" }));
    },

    async *streamMessage({ gameId, message, turnId }) {
      const response = await fetcher(
        `/api/games/${encodeURIComponent(gameId)}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, turnId }),
        },
      );
      if (!response.ok || !response.body)
        throw new Error("Failed to get response");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let sawDone = false;

      while (!sawDone) {
        const { done, value } = await reader.read();
        if (done) {
          buffer += decoder.decode();
          const parsed = consumeSseEvents(`${buffer}\n\n`);
          for (const data of parsed.events) {
            if (data === "[DONE]") {
              sawDone = true;
              continue;
            }
            yield JSON.parse(data) as GameStreamEvent;
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const parsed = consumeSseEvents(buffer);
        buffer = parsed.buffer;
        for (const data of parsed.events) {
          if (data === "[DONE]") {
            sawDone = true;
            continue;
          }
          yield JSON.parse(data) as GameStreamEvent;
        }
      }
    },

    async surrender(gameId) {
      return readJson(
        await fetcher(
          `/api/games/${encodeURIComponent(gameId)}/surrender`,
          { method: "POST" },
        ),
      );
    },
  };
}

export const gameClient = createGameClient();
