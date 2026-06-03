import './OneThingToFix.css';

interface OneThingToFixProps {
  text: string;
  visible: boolean;
}

export function OneThingToFix({ text, visible }: OneThingToFixProps) {
  if (!text) return null;
  return (
    <section className={`one-thing-to-fix ${visible ? 'one-thing-to-fix--visible' : ''}`}>
      <header className="one-thing-to-fix__head">
        <span className="one-thing-to-fix__label">If you fix one thing</span>
      </header>
      <p className="one-thing-to-fix__text">{text}</p>
    </section>
  );
}