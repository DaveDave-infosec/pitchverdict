import { useEffect, useState } from 'react';
import { SCORE_DIMENSIONS } from '../../lib/verdicts';
import type { PitchResult } from '../../types';
import './ScoreGrid.css';

interface ScoreGridProps {
  result: PitchResult;
  visible: boolean;
}

export function ScoreGrid({ result, visible }: ScoreGridProps) {
  return (
    <section className={`score-grid ${visible ? 'score-grid--visible' : ''}`}>
      <div className="score-grid__header">
        <span className="score-grid__label">Dimension scores</span>
      </div>
      <div className="score-grid__grid">
        {SCORE_DIMENSIONS.map((dim, idx) => {
          const value = result[dim.key] as number;
          return (
            <ScoreCell
              key={dim.key}
              label={dim.label}
              value={value}
              delay={idx * 80}
              fill={visible}
            />
          );
        })}
      </div>
    </section>
  );
}

interface ScoreCellProps {
  label: string;
  value: number;
  delay: number;
  fill: boolean;
}

function ScoreCell({ label, value, delay, fill }: ScoreCellProps) {
  const [animatedFill, setAnimatedFill] = useState(0);

  useEffect(() => {
    if (!fill) {
      setAnimatedFill(0);
      return;
    }
    const t = setTimeout(() => setAnimatedFill(value), delay);
    return () => clearTimeout(t);
  }, [fill, delay, value]);

  const colorClass = scoreColorClass(value);

  return (
    <div
      className={`score-cell ${fill ? 'score-cell--visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="score-cell__head">
        <span className="score-cell__label">{label}</span>
        <span className={`score-cell__value score-cell__value--${colorClass}`}>{value}</span>
      </div>
      <div className="score-cell__bar">
        <div
          className={`score-cell__bar-fill score-cell__bar-fill--${colorClass}`}
          style={{ width: `${animatedFill}%` }}
        />
      </div>
    </div>
  );
}

function scoreColorClass(value: number): string {
  if (value >= 81) return 'excellent';
  if (value >= 66) return 'strong';
  if (value >= 51) return 'mid';
  if (value >= 31) return 'weak';
  return 'critical';
}