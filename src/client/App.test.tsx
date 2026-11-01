import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Guesshin rendered app boundary", () => {
  it("renders the tutorial, game controls, and accessible dialogue surface", () => {
    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain("How to play");
    expect(markup).toContain("Surrender");
    expect(markup).not.toContain("New game");
    expect(markup).toContain(">Active<");
    expect(markup).toContain("Ask for clues, then make one Guess.");
    expect(markup).not.toContain("Current game");
    expect(markup).not.toContain("Made for curious travelers");
    expect(markup).toContain('aria-live="polite"');
    expect(markup).toContain('aria-label="Game dialogue"');
    expect(markup).toContain("Ask a question or make a guess");
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
