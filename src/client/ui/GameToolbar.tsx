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
          className="surrender-button"
          onClick={onSurrender}
          disabled={isStarting || isProcessing || isTerminal}
        >
          Surrender
        </button>
      </div>
    </div>
  );
}

export default GameToolbar;
