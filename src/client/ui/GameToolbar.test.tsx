import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import GameToolbar from "./GameToolbar";

const actions = {
  onNewGame: vi.fn(),
  onSurrender: vi.fn(),
};

describe("Game terminal controls", () => {
  it("keeps Surrender as the only terminal action during an active Game", () => {
    const markup = renderToStaticMarkup(
      <GameToolbar
        status="active"
        isStarting={false}
        isProcessing={false}
        {...actions}
      />,
    );

    expect(markup).toContain("Surrender");
    expect(markup).not.toContain("New game");
  });

  it("offers New Game after the Game reaches a terminal outcome", () => {
    const markup = renderToStaticMarkup(
      <GameToolbar
        status="won"
        isStarting={false}
        isProcessing={false}
        {...actions}
      />,
    );

    expect(markup).toContain("New game");
    expect(markup).not.toContain("Surrender");
  });

  it("announces when a new Game is starting", () => {
    const markup = renderToStaticMarkup(
      <GameToolbar
        status="active"
        isStarting
        isProcessing={false}
        {...actions}
      />,
    );

    expect(markup).toContain("Starting a new Game…");
  });

  it("announces when Surrender is processing", () => {
    const markup = renderToStaticMarkup(
      <GameToolbar
        status="active"
        isStarting={false}
        isProcessing
        processingAction="surrender"
        {...actions}
      />,
    );

    expect(markup).toContain("Surrendering…");
    expect(markup).toContain('aria-label="Surrendering…"');
  });
});
