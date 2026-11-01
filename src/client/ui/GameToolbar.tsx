import type { GameStatus } from "../../types";
import Loader from "./Loader";

export type ProcessingAction = "message" | "surrender";

type GameToolbarProps = {
  status: GameStatus;
  isStarting: boolean;
  isProcessing: boolean;
  processingAction?: ProcessingAction;
  onNewGame: () => void;
  onSurrender: () => void;
};

function GameToolbar({
  status,
  isStarting,
  isProcessing,
  processingAction,
  onNewGame,
  onSurrender,
}: GameToolbarProps) {
  const isTerminal = status !== "active";

  return (
    <div className="game-toolbar">
      {isStarting ? (
        <Loader label="Starting a new Game…" />
      ) : (
        <div className="toolbar-actions">
          {isTerminal ? (
            <button
              type="button"
              className="secondary-button"
              onClick={onNewGame}
              disabled={isProcessing}
            >
              New game
            </button>
          ) : (
            <button
              type="button"
              className="surrender-button"
              onClick={onSurrender}
              disabled={isProcessing}
              aria-label={
                processingAction === "surrender" ? "Surrendering…" : undefined
              }
            >
              {processingAction === "surrender" ? (
                <Loader label="Surrendering…" showLabel={false} />
              ) : (
                "Surrender"
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default GameToolbar;
