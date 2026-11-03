import MusicToggle from "./MusicToggle";

function GameHeader() {
  return (
    <header className="game-header">
      <svg
        className="game-header__crest"
        viewBox="0 0 88 88"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="44" cy="44" r="30" stroke="currentColor" strokeWidth="0.7" />
        <path
          d="M44 3 50 34 81 44 50 50 44 85 38 50 7 44 38 34Z"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="m44 25 5 14 14 5-14 5-5 14-5-14-14-5 14-5Z"
          fill="currentColor"
        />
        <path
          d="m18 18 8 3-5 5Zm52 0-3 8-5-5Zm0 52-8-3 5-5Zm-52 0 3-8 5 5Z"
          fill="currentColor"
        />
        <circle cx="44" cy="44" r="4" fill="var(--page)" />
      </svg>
      <p className="game-header__eyebrow">A character deduction game</p>
      <h1 className="game-header__title">Guesshin</h1>
      <div className="game-header__actions">
        <a
          className="button button--icon"
          href="https://hawks-portfolio.site/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit my portfolio (opens in a new tab)"
          title="Visit my portfolio (opens in a new tab)"
        >
          <svg
            className="button__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m10 13 4-4m-6 2-3 3a4.24 4.24 0 0 0 6 6l3-3m-4-10 3-3a4.24 4.24 0 0 1 6 6l-3 3" />
          </svg>
        </a>
        <MusicToggle />
      </div>
      <p className="game-header__description">
        Someone from Teyvat is hiding their identity! Chat with them to figure
        out who it is. You can ask, “Are you [Character Name]?” or simply type a
        character’s name to make a guess."
      </p>
    </header>
  );
}

export default GameHeader;
