import { Link } from 'react-router-dom';
import { getVerdictColorKey } from '../../lib/verdicts';
import type { PitchResult } from '../../types';
import './ResultCard.css';

interface ResultCardProps {
  result: PitchResult;
}

const PREVIEW_MAX = 140;

export function ResultCard({ result }: ResultCardProps) {
  const verdictKey = getVerdictColorKey(result.overall_verdict);
  const isContested = result.confidence_level === 'Contested';
  const previewSource = result.disagreement_insight || result.one_thing_to_fix || '';
  const previewText =
    previewSource.length > PREVIEW_MAX
      ? previewSource.slice(0, PREVIEW_MAX).trim() + '…'
      : previewSource;

  return (
    <Link to={`/result/${result.result_id}`} className="result-card">
      <header className="result-card__top">
        <div className="result-card__title-wrap">
          <h3 className="result-card__title">{result.startup_name}</h3>
          <div className="result-card__meta">
            <span>{result.stage}</span>
            <span className="result-card__sep">·</span>
            <span>{result.industry}</span>
          </div>
        </div>
        <div className="result-card__score-wrap">
          <span className={`result-card__score result-card__score--${verdictKey}`}>
            {result.overall_investability}
          </span>
          <span className="result-card__score-suffix">/100</span>
        </div>
      </header>

      <div className="result-card__chip-row">
        <span className={`result-card__chip result-card__chip--verdict-${verdictKey}`}>
          {result.overall_verdict}
        </span>
        <span
          className={`result-card__chip result-card__chip--confidence ${
            isContested ? 'result-card__chip--contested' : ''
          }`}
        >
          {result.confidence_level}
        </span>
      </div>

      {previewText && <p className="result-card__preview">{previewText}</p>}

      <footer className="result-card__footer">
        <span className="result-card__id">{result.result_id}</span>
        <span className="result-card__view">view →</span>
      </footer>
    </Link>
  );
}