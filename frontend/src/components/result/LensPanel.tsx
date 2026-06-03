import { LENS_META_ARRAY } from '../../lib/verdicts';
import type { PitchResult } from '../../types';
import './LensPanel.css';

interface LensPanelProps {
  result: PitchResult;
  visible: boolean;
}

export function LensPanel({ result, visible }: LensPanelProps) {
  return (
    <section className={`lens-panel ${visible ? 'lens-panel--visible' : ''}`}>
      <div className="lens-panel__header">
        <span className="lens-panel__label">Six lenses, one consensus</span>
      </div>
      <div className="lens-panel__grid">
        {LENS_META_ARRAY.map((lens, idx) => {
          const verdict = result.lens_verdicts?.[lens.key];
          if (!verdict) return null;
          const cellStyle = {
            transitionDelay: visible ? `${idx * 100}ms` : '0ms',
            ['--lens-color' as string]: lens.color,
          } as React.CSSProperties;
          return (
            <article
              key={lens.key}
              className={`lens-card ${visible ? 'lens-card--visible' : ''}`}
              style={cellStyle}
            >
              <div className="lens-card__accent" />
              <header className="lens-card__head">
                <h3 className="lens-card__name">{lens.label}</h3>
                <p className="lens-card__personality">{lens.personality}</p>
              </header>
              <p className="lens-card__looks-for">
                <span className="lens-card__looks-for-label">Looks for</span>
                <span className="lens-card__looks-for-value">{lens.looks_for}</span>
              </p>
              <p className="lens-card__verdict">{verdict}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}