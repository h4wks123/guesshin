import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Dialogue from "./Dialogue";

describe("Game dialogue loading feedback", () => {
  it("replaces previous dialogue with the startup loader", () => {
    const markup = renderToStaticMarkup(
      <Dialogue
        messages={[{ role: "assistant", content: "Previous Game message" }]}
        isStarting
        isProcessing={false}
        messagesRef={{ current: null }}
      />,
    );

    expect(markup).toContain('aria-label="Starting a new Game…"');
    expect(markup).not.toContain("Previous Game message");
    expect(markup).not.toContain("Mystery character");
  });

  it("announces that the secret character is thinking", () => {
    const markup = renderToStaticMarkup(
      <Dialogue messages={[]} isProcessing messagesRef={{ current: null }} />,
    );

    expect(markup).toContain('aria-label="The character is thinking…"');
  });
});
