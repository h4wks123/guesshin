import { describe, expect, it } from "vitest";
import { chunkText, createSseResponse } from "./sse";

describe("Worker SSE delivery", () => {
  it("keeps the existing message chunk size", () => {
    expect(chunkText("a".repeat(49))).toEqual(["a".repeat(48), "a"]);
  });

  it("serializes state, message, and completion events", async () => {
    const response = createSseResponse({
      status: "active",
      messages: [],
      assistant: "Hello",
    });

    expect(response.headers.get("content-type")).toContain("text/event-stream");
    expect(await response.text()).toContain(
      'data: {"type":"message","response":"Hello"}',
    );
    expect(
      await createSseResponse({ status: "active", messages: [] }).text(),
    ).toContain("data: [DONE]");
  });
});
