type TutorialProps = {
  onDismiss: () => void;
};

function Tutorial({ onDismiss }: TutorialProps) {
  return (
    <section className="tutorial" aria-labelledby="tutorial-title">
      <div>
        <p className="eyebrow">How to play</p>
        <h2 id="tutorial-title">Ask the secret character questions.</h2>
        <p>When you are ready, make one Guess.</p>
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
