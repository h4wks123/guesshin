import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Guesshin rendered app boundary", () => {
  it("renders the tutorial, game controls, and accessible dialogue surface", () => {
    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain("How to play");
    expect(markup).toContain("Starting a new Game…");
    expect(markup.indexOf("Starting a new Game…")).toBeLessThan(
      markup.indexOf('<form class="message-input"'),
    );
    expect(markup).not.toContain("New game");
    expect(markup).not.toContain(">Active<");
    expect(markup).not.toContain("status-active");
    expect(markup).toContain("Ask the secret character questions.");
    expect(markup).toContain("When you are ready, make one Guess.");
    expect(markup).not.toContain("Ask. Notice. Guess.");
    expect(markup).not.toContain("Current game");
    expect(markup).not.toContain("Made for curious travelers");
    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-label="Game dialogue"');
    expect(markup).toContain('placeholder="Loading…"');
    expect(markup).not.toContain("The secret character is ready.");
    expect(markup).not.toContain("Mystery character");
    expect(markup).not.toContain("Got it");
    expect(markup).not.toContain("Press Enter to send");
  });

  it("publishes a recognizable browser identity", () => {
    const document = readFileSync(new URL("../../index.html", import.meta.url), "utf8");

    expect(document).toContain("<title>Guesshin · Character guessing game</title>");
    expect(document).toContain(
      '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />',
    );
    expect(document).toContain('content="#101725"');
  });
});
