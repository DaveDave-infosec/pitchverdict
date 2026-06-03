import type { PitchResult } from '../../types';
import './FindingsPanel.css';

interface FindingsPanelProps {
  result: PitchResult;
  visible: boolean;
}

export function FindingsPanel({ result, visible }: FindingsPanelProps) {
  return (
    <section className={`findings-panel ${visible ? 'findings-panel--visible' : ''}`}>
      <div className="findings-panel__grid">
        <div className="findings-column findings-column--strengths">
          <header className="findings-column__head">
            <span className="findings-column__dot findings-column__dot--strength" />
            <span className="findings-column__label">Key Strengths</span>
          </header>
          <ul className="findings-column__list">
            {result.key_strengths.map((s, i) => (
              <li
                key={i}
                className="findings-column__item"
                style={{ transitionDelay: visible ? `${i * 120}ms` : '0ms' }}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="findings-column findings-column--concerns">
          <header className="findings-column__head">
            <span className="findings-column__dot findings-column__dot--concern" />
            <span className="findings-column__label">Key Concerns</span>
          </header>
          <ul className="findings-column__list">
            {result.key_concerns.map((c, i) => (
              <li
                key={i}
                className="findings-column__item"
                style={{ transitionDelay: visible ? `${i * 120 + 60}ms` : '0ms' }}
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}