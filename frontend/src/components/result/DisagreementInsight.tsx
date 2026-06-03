import { useEffect, useState } from 'react';
import './DisagreementInsight.css';

interface DisagreementInsightProps {
  text: string;
  confidenceLevel: string;
  visible: boolean;
}

export function DisagreementInsight({ text, confidenceLevel, visible }: DisagreementInsightProps) {
  const [glowActive, setGlowActive] = useState(false);
  const isContested = confidenceLevel === 'Contested';

  useEffect(() => {
    if (!visible) {
      setGlowActive(false);
      return;
    }
    const t = setTimeout(() => setGlowActive(true), 450);
    return () => clearTimeout(t);
  }, [visible]);

  if (!text) return null;

  return (
    <section
      className={[
        'disagreement-insight',
        visible ? 'disagreement-insight--visible' : '',
        glowActive ? 'disagreement-insight--glow' : '',
        isContested && glowActive ? 'disagreement-insight--contested' : '',
      ].filter(Boolean).join(' ')}
    >
      <header className="disagreement-insight__head">
        <span className="disagreement-insight__icon" aria-hidden="true">◆</span>
        <span className="disagreement-insight__label">Investor panel disagreement</span>
        {isContested && (
          <span className="disagreement-insight__badge">Contested</span>
        )}
      </header>
      <p className="disagreement-insight__text">{text}</p>
    </section>
  );
}