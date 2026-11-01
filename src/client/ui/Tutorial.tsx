type TutorialProps = {
  onDismiss: () => void;
};

function Tutorial({ onDismiss }: TutorialProps) {
  return (
    <section className="tutorial" aria-labelledby="tutorial-title">
      <div>
        <p className="eyebrow">How to play</p>
        <h2 id="tutorial-title">Ask. Notice. Guess.</h2>
        <p>
          Ask the hidden character about their life, world, or abilities. They
          may offer clues, but they will not tell you their identity.
        </p>
        <p>
          When you are ready, ask one clear question such as{" "}
          <em>“Are you Amber?”</em> You can reveal the character whenever you
          want.
        </p>
      </div>
      <button
        className="icon-button"
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss tutorial"
      >
        ×
      </button>
    </section>
  );
}

export default Tutorial;
