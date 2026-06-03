import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResult } from '../lib/genlayer';
import type { PitchResult } from '../types';
import { VerdictReveal } from '../components/result/VerdictReveal';
import { AnimatedScore } from '../components/result/AnimatedScore';
import { HeaderReveal } from '../components/result/HeaderReveal';
import { ScoreGrid } from '../components/result/ScoreGrid';
import { LensPanel } from '../components/result/LensPanel';
import { FindingsPanel } from '../components/result/FindingsPanel';
import { OneThingToFix } from '../components/result/OneThingToFix';
import { InvestorQuestion } from '../components/result/InvestorQuestion';
import { DisagreementInsight } from '../components/result/DisagreementInsight';
import { ShareButton } from '../components/share/ShareButton';
import './Result.css';

type Stage =
  | 'loading'
  | 'blackout'
  | 'verdict'
  | 'score'
  | 'header'
  | 'score-grid'
  | 'lens-panel'
  | 'findings'
  | 'fix'
  | 'question'
  | 'disagreement';

const STAGE_DURATION_MS: Record<Stage, number> = {
  loading: 0,
  blackout: 300,
  verdict: 900,
  score: 1400,
  header: 600,
  'score-grid': 1100,
  'lens-panel': 800,
  findings: 700,
  fix: 600,
  question: 600,
  disagreement: 0,
};

const STAGE_ORDER: Stage[] = [
  'blackout',
  'verdict',
  'score',
  'header',
  'score-grid',
  'lens-panel',
  'findings',
  'fix',
  'question',
  'disagreement',
];

export function Result() {
  const { resultId } = useParams<{ resultId: string }>();
  const [result, setResult] = useState<PitchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>('loading');

  useEffect(() => {
    if (!resultId) return;
    let cancelled = false;

    getResult(resultId)
      .then((data) => {
        if (cancelled) return;
        if (data && data.result_id) {
          setResult(data);
          setStage('blackout');
        } else {
          setError('Result not found.');
        }
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e?.message || 'Failed to load result.');
      });

    return () => {
      cancelled = true;
    };
  }, [resultId]);

  useEffect(() => {
    if (stage === 'loading' || stage === 'disagreement') return;
    const duration = STAGE_DURATION_MS[stage];
    if (!duration) return;
    const idx = STAGE_ORDER.indexOf(stage);
    if (idx < 0 || idx >= STAGE_ORDER.length - 1) return;

    const t = setTimeout(() => setStage(STAGE_ORDER[idx + 1]), duration);
    return () => clearTimeout(t);
  }, [stage]);

  if (error) {
    return (
      <div className="result-page">
        <Link to="/feed" className="result-back">← Back to Feed</Link>
        <div className="result-error">{error}</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-page">
        <div className="result-loading">Loading consensus result…</div>
      </div>
    );
  }

  const stageIdx = STAGE_ORDER.indexOf(stage);
  const showVerdict = stageIdx >= 1;
  const showScore = stageIdx >= 2;
  const showHeader = stageIdx >= 3;
  const showScoreGrid = stageIdx >= 4;
  const showLensPanel = stageIdx >= 5;
  const showFindings = stageIdx >= 6;
  const showFix = stageIdx >= 7;
  const showQuestion = stageIdx >= 8;
  const showDisagreement = stageIdx >= 9;

  return (
    <div className="result-page">
      <Link to="/feed" className="result-back">← Back to Feed</Link>

      <div className="result-hero">
        <VerdictReveal verdict={result.overall_verdict} visible={showVerdict} />
        {showScore && (
          <AnimatedScore target={result.overall_investability} start={showScore} />
        )}
        <HeaderReveal
          startupName={result.startup_name}
          stage={result.stage}
          industry={result.industry}
          confidenceLevel={result.confidence_level}
          fundingStageFit={result.funding_stage_fit}
          visible={showHeader}
        />
      </div>

      <ScoreGrid result={result} visible={showScoreGrid} />
      <LensPanel result={result} visible={showLensPanel} />
      <FindingsPanel result={result} visible={showFindings} />
      <OneThingToFix text={result.one_thing_to_fix} visible={showFix} />
      <InvestorQuestion question={result.investor_question} visible={showQuestion} />
      <DisagreementInsight
        text={result.disagreement_insight}
        confidenceLevel={result.confidence_level}
        visible={showDisagreement}
      />

      <div className="result-share-actions">
        <ShareButton result={result} />
      </div>
    </div>
  );
}

export default Result;