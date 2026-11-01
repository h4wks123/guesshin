import type { CharacterReveal } from "../../types";

type RevealCardProps = {
  reveal?: CharacterReveal;
};

function RevealCard({ reveal }: RevealCardProps) {
  if (!reveal) return null;

  return (
    <section className="reveal-card" aria-labelledby="reveal-title">
      <p className="eyebrow">The secret character was</p>
      <h2 id="reveal-title">{reveal.name}</h2>
      <div className="reveal-facts">
        <span>{reveal.element}</span>
        <span>{reveal.nation}</span>
        <span>{reveal.weapon}</span>
        <span>{reveal.role}</span>
      </div>
      <p>{reveal.summary}</p>
    </section>
  );
}

export default RevealCard;
