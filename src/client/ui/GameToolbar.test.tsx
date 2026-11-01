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
});
