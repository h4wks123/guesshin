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
        className="tutorial-dismiss"
        type="button"
        onClick={onDismiss}
      >
        Got it
      </button>
    </section>
  );
}

export default Tutorial;
