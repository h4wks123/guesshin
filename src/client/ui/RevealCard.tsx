import type { CharacterReveal } from "../../types";

type RevealCardProps = {
  reveal?: CharacterReveal;
};

function RevealCard({ reveal }: RevealCardProps) {
  if (!reveal) return null;

  return (
    <section className="reveal-card" aria-labelledby="reveal-title">
      <p className="reveal-card__eyebrow">The secret character was</p>
      <h2 className="reveal-card__title" id="reveal-title">{reveal.name}</h2>
      <div className="reveal-card__facts">
        <span className="reveal-card__fact">{reveal.element}</span>
        <span className="reveal-card__fact">{reveal.nation}</span>
        <span className="reveal-card__fact">{reveal.weapon}</span>
        <span className="reveal-card__fact">{reveal.role}</span>
      </div>
      <p className="reveal-card__summary">{reveal.summary}</p>
    </section>
  );
}

export default RevealCard;
