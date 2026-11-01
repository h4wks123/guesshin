import { describe, expect, it } from "vitest";
import { consumeSseEvents } from "./sse";

describe("client SSE parsing", () => {
  it("returns complete events and keeps an incomplete event in the buffer", () => {
    expect(
      consumeSseEvents(
        'data: {"type":"state"}\n\ndata: {"type":"message"}',
      ),
    ).toEqual({
      events: ['{"type":"state"}'],
      buffer: 'data: {"type":"message"}',
    });
  });

  it("joins multiple data lines into one event", () => {
    expect(consumeSseEvents("data: first\r\ndata: second\r\n\r\n")).toEqual({
      events: ["first\nsecond"],
      buffer: "",
    });
  });
});
