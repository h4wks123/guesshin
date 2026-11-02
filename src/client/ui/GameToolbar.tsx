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

  if (isStarting) return null;

  return (
    <div className="game-toolbar">
      <div className="toolbar-ornament" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="m12 1 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" stroke="currentColor" />
          <path d="m12 7 2 5-2 5-2-5Z" fill="currentColor" />
        </svg>
      </div>
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
    </div>
  );
}

export default GameToolbar;
