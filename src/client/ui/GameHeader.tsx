import type { GameStatus } from "../../types";

type GameHeaderProps = {
  status: GameStatus;
};

function GameHeader({ status }: GameHeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">A character deduction game</p>
        <h1>Guesshin</h1>
        <p className="tagline">
          Someone from Teyvat is speaking. Can you discover who?
        </p>
      </div>
      <div
        className={`status-badge status-${status}`}
        aria-label={`Game status: ${status}`}
      >
        <span aria-hidden="true" />
        {status === "active"
          ? "Mystery active"
          : status === "won"
            ? "You solved it"
            : "Mystery revealed"}
      </div>
    </header>
  );
}

export default GameHeader;
