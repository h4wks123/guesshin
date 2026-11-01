import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Guesshin rendered app boundary", () => {
  it("renders the tutorial, game controls, and accessible dialogue surface", () => {
    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain("How to play");
    expect(markup).toContain("Reveal character");
    expect(markup).toContain("New game");
    expect(markup).toContain('aria-live="polite"');
    expect(markup).toContain('aria-label="Game dialogue"');
    expect(markup).toContain("Ask a question or make a guess");
  });
});

