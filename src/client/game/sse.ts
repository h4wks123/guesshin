export function consumeSseEvents(buffer: string): {
  events: string[];
  buffer: string;
} {
  let normalized = buffer.replace(/\r/g, "");
  const events: string[] = [];

  let eventEndIndex: number;
  while ((eventEndIndex = normalized.indexOf("\n\n")) !== -1) {
    const rawEvent = normalized.slice(0, eventEndIndex);
    normalized = normalized.slice(eventEndIndex + 2);
    const dataLines = rawEvent
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice("data:".length).trimStart());
    if (dataLines.length > 0) events.push(dataLines.join("\n"));
  }

  return { events, buffer: normalized };
}
