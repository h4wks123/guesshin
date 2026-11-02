function GameHeader() {
  return (
    <header className="app-header">
      <svg
        className="header-crest"
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
        <path d="m44 25 5 14 14 5-14 5-5 14-5-14-14-5 14-5Z" fill="currentColor" />
        <path d="m18 18 8 3-5 5Zm52 0-3 8-5-5Zm0 52-8-3 5-5Zm-52 0 3-8 5 5Z" fill="currentColor" />
        <circle cx="44" cy="44" r="4" fill="var(--page)" />
      </svg>
      <p className="eyebrow">A character deduction game</p>
      <h1>Guesshin</h1>
      <p className="tagline">
        Someone from Teyvat is hiding their identity! Chat with them to figure
        out who it is. You can ask, “Are you [Character Name]?” or simply type a
        character’s name to make a guess."
      </p>
    </header>
  );
}

export default GameHeader;
