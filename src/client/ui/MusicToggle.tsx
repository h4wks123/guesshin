import { useEffect, useRef, useState } from "react";

function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const shouldAutoPlayRef = useRef(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let disposed = false;
    audio.volume = 0.35;

    function removeInteractionListeners() {
      document.removeEventListener("click", startOnInteraction, true);
      document.removeEventListener("keydown", startOnInteraction, true);
    }

    function tryAutoPlay() {
      if (!audio || !shouldAutoPlayRef.current) return;
      void audio.play()
        .then(() => {
          if (!disposed) removeInteractionListeners();
        })
        .catch((cause: unknown) => {
          if (disposed) return;
          if (
            cause instanceof DOMException &&
            (cause.name === "NotAllowedError" || cause.name === "AbortError")
          ) return;
          removeInteractionListeners();
          setError("Music could not play. Select the button to try again.");
        });
    }

    function startOnInteraction(event: Event) {
      // Let the music button handle its own click without toggling twice.
      if (
        event.target instanceof Node &&
        buttonRef.current?.contains(event.target)
      ) return;
      tryAutoPlay();
    }

    document.addEventListener("click", startOnInteraction, true);
    document.addEventListener("keydown", startOnInteraction, true);
    tryAutoPlay();

    return () => {
      disposed = true;
      removeInteractionListeners();
      audio.pause();
    };
  }, []);

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    shouldAutoPlayRef.current = false;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    setError("");
    if (audio.error) audio.load();
    audio.volume = 0.35;
    void audio.play().catch((cause: unknown) => {
      // A second click can pause playback before the play request completes.
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      setIsPlaying(false);
      setError("Music could not play. Select the button to try again.");
    });
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/nin-kiggia-message.m4a"
        preload="auto"
        loop
        hidden
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(event) => {
          event.currentTarget.pause();
          setIsPlaying(false);
          setError("Music could not play. Select the button to try again.");
        }}
      />
      <button
        ref={buttonRef}
        type="button"
        className={`button button--icon music-toggle${isPlaying ? " music-toggle--playing" : ""}`}
        aria-label="Background music"
        aria-pressed={isPlaying}
        title={
          error || (isPlaying ? "Pause background music" : "Play background music")
        }
        onClick={toggleMusic}
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
          <path d="m11 4-5 4H3v8h3l5 4V4Z" />
          {isPlaying ? (
            <path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" />
          ) : (
            <path d="m16 9 6 6m0-6-6 6" />
          )}
        </svg>
      </button>
      <span className="visually-hidden" role="status">
        {error}
      </span>
    </>
  );
}

export default MusicToggle;
