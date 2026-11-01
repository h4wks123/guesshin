type TutorialProps = {
  onDismiss: () => void;
};

function Tutorial({ onDismiss }: TutorialProps) {
  return (
    <section className="tutorial" aria-labelledby="tutorial-title">
      <div>
        <p className="eyebrow">How to play</p>
        <h2 id="tutorial-title">Ask. Notice. Guess.</h2>
        <p>Ask for clues, then make one Guess.</p>
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
