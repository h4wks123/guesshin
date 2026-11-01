import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MessageComposer from "./MessageComposer";

describe("Game message composer", () => {
  it("covers the composer while a new Game is starting", () => {
    const markup = renderToStaticMarkup(
      <MessageComposer
        disabled
        isStarting
        isTerminal={false}
        onSend={() => undefined}
      />,
    );

    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain("Starting a new Game…");
    expect(markup).toContain("composer-loading");
    expect(markup).not.toContain("Press Enter to send");
  });
});
