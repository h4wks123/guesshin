import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MessageComposer from "./MessageComposer";

describe("Game message composer", () => {
  it("shows a disabled loading input while the dialogue owns the loader", () => {
    const markup = renderToStaticMarkup(
      <MessageComposer
        disabled
        isStarting
        isTerminal={false}
        onSend={() => undefined}
      />,
    );

    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('placeholder="Loading…"');
    expect(markup).toContain('disabled=""');
    expect(markup).not.toContain('role="status"');
    expect(markup).not.toContain("Press Enter to send");
  });
});
