import type { GameTurnResult } from "../game/game-session";

const DEFAULT_CHUNK_SIZE = 48;
const STREAM_DELAY_MS = 12;

export function createSseResponse(turn: GameTurnResult): Response {
  const messageEvents = turn.assistant
    ? chunkText(turn.assistant).map(
        (chunk) =>
          `data: ${JSON.stringify({ type: "message", response: chunk })}\n\n`,
      )
    : [];
  const events = [
    `data: ${JSON.stringify({ type: "state", status: turn.status, reveal: turn.reveal })}\n\n`,
    ...messageEvents,
    "data: [DONE]\n\n",
  ];

  return new Response(
    new ReadableStream({
      async start(controller) {
        for (const event of events) {
          controller.enqueue(new TextEncoder().encode(event));
          await new Promise((resolve) => setTimeout(resolve, STREAM_DELAY_MS));
        }
        controller.close();
      },
    }),
    {
      headers: {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-cache",
        connection: "keep-alive",
      },
    },
  );
}

export function chunkText(
  value: string,
  chunkSize = DEFAULT_CHUNK_SIZE,
): string[] {
  const chunks: string[] = [];
  for (let index = 0; index < value.length; index += chunkSize)
    chunks.push(value.slice(index, index + chunkSize));
  return chunks;
}
