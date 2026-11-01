import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Dialogue from "./Dialogue";

describe("Game dialogue loading feedback", () => {
  it("announces that the secret character is thinking", () => {
    const markup = renderToStaticMarkup(
      <Dialogue messages={[]} isProcessing messagesRef={{ current: null }} />,
    );

    expect(markup).toContain('aria-label="The character is thinking…"');
  });
});
