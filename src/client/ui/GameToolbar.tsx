import type { GameStatus } from "../../types";

type GameToolbarProps = {
  status: GameStatus;
  isStarting: boolean;
  isProcessing: boolean;
  onNewGame: () => void;
  onSurrender: () => void;
};

function GameToolbar({
  status,
  isStarting,
  isProcessing,
  onNewGame,
  onSurrender,
}: GameToolbarProps) {
  const isTerminal = status !== "active";

  return (
    <div className="game-toolbar">
      <div>
        <span className="toolbar-label">Current game</span>
        <strong>
          {isStarting
            ? "Preparing a mystery…"
            : isTerminal
              ? "The Game is complete"
              : "The character is listening"}
        </strong>
      </div>
      <div className="toolbar-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onNewGame}
          disabled={isStarting || isProcessing}
        >
          New game
        </button>
        <button
          type="button"
          className="reveal-button"
          onClick={onSurrender}
          disabled={isStarting || isProcessing || isTerminal}
        >
          Reveal character
        </button>
      </div>
    </div>
  );
}

export default GameToolbar;
