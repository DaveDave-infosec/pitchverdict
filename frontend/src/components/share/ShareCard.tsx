import { forwardRef } from 'react';
import type { PitchResult } from '../../types';
import { getVerdictColorKey } from '../../lib/verdicts';
import { CONTRACT_ADDRESS } from '../../lib/constants';
import './ShareCard.css';

interface ShareCardProps {
  result: PitchResult;
}

const QUOTE_MAX = 200;

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ result }, ref) => {
  const verdictKey = getVerdictColorKey(result.overall_verdict);
  const isContested = result.confidence_level === 'Contested';
  
  const rawQuote = result.one_thing_to_fix || result.investor_question || '';
  const quote = rawQuote.length > QUOTE_MAX 
    ? rawQuote.slice(0, QUOTE_MAX).trim() + '...'
    : rawQuote;
  const quoteLabel = result.one_thing_to_fix 
    ? 'IF YOU FIX ONE THING' 
    : 'THE QUESTION PARTNERS ASK FIRST';

  return (
    <div className="share-card" ref={ref}>
      <div className="share-card__live-bar">
        <span className="share-card__live-dot" />
        <span>LIVE ON GENLAYER STUDIO</span>
      </div>

      <div className="share-card__body">
        <div className="share-card__brand">PitchVerdict</div>

        <div className={`share-card__verdict share-card__verdict--${verdictKey}`}>
          {result.overall_verdict}
        </div>

        <div className="share-card__score-wrap">
          <span className={`share-card__score share-card__score--${verdictKey}`}>
            {result.overall_investability}
          </span>
          <span className="share-card__score-suffix">/100</span>
        </div>

        <div className="share-card__name">{result.startup_name}</div>
        <div className="share-card__meta">
          {result.stage} &middot; {result.industry}
        </div>

        <div className="share-card__chips">
          <span className={`share-card__chip ${isContested ? 'share-card__chip--contested' : ''}`}>
            {result.confidence_level} confidence
          </span>
          <span className="share-card__chip">{result.funding_stage_fit}</span>
        </div>

        {quote && (
          <div className="share-card__quote-block">
            <div className="share-card__quote-label">{quoteLabel}</div>
            <div className="share-card__quote">&ldquo;{quote}&rdquo;</div>
          </div>
        )}

        <div className="share-card__lenses">
          <span>Problem Validator</span>
          <span>Market Analyst</span>
          <span>Technical Skeptic</span>
          <span>Execution Realist</span>
          <span>Devil's Advocate</span>
          <span>Momentum Tracker</span>
        </div>
      </div>

      <div className="share-card__footer">
        <div className="share-card__footer-left">
          <div className="share-card__footer-label">SIX AI INVESTOR LENSES REACH CONSENSUS</div>
          <div className="share-card__footer-sub">via GenLayer Studio Network</div>
        </div>
        <div className="share-card__footer-right">
          <div className="share-card__contract-label">CONTRACT</div>
          <div className="share-card__contract">
            {CONTRACT_ADDRESS.slice(0, 8)}&hellip;{CONTRACT_ADDRESS.slice(-6)}
          </div>
        </div>
      </div>
    </div>
  );
});

ShareCard.displayName = 'ShareCard';