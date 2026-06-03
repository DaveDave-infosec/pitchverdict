import type { LensVerdicts, PitchResult } from '../types';

export type VerdictColorKey = 'pass' | 'conditional' | 'needs-work' | 'hard-pass' | 'too-early';

const VERDICT_COLOR_MAP: Record<string, VerdictColorKey> = {
  'Strong Pass': 'pass',
  'Conditional Interest': 'conditional',
  'Needs Work': 'needs-work',
  'Hard Pass': 'hard-pass',
  'Too Early to Judge': 'too-early',
};

export function getVerdictColorKey(verdict: string): VerdictColorKey {
  return VERDICT_COLOR_MAP[verdict] || 'too-early';
}

export interface LensMeta {
  key: keyof LensVerdicts;
  label: string;
  personality: string;
  looks_for: string;
  color: string;
}

export const LENS_META_ARRAY: LensMeta[] = [
  {
    key: 'problem_validator',
    label: 'Problem Validator',
    personality: 'asks if the pain is real',
    looks_for: 'acute pain, urgency, willingness to pay',
    color: '#E66B5C',
  },
  {
    key: 'market_analyst',
    label: 'Market Analyst',
    personality: 'challenges every TAM claim',
    looks_for: 'bottom-up sizing, clear beachhead, honest market math',
    color: '#4FBDB5',
  },
  {
    key: 'technical_skeptic',
    label: 'Technical Skeptic',
    personality: 'doubts the build is feasible',
    looks_for: 'achievable architecture, real technical depth',
    color: '#8B9DC3',
  },
  {
    key: 'execution_realist',
    label: 'Execution Realist',
    personality: 'bets on the team',
    looks_for: 'domain expertise, prior execution, founder-market fit',
    color: '#D4A574',
  },
  {
    key: 'devils_advocate',
    label: "Devil's Advocate",
    personality: 'names every failure mode',
    looks_for: 'regulatory risk, incumbents, unit economics, dependencies',
    color: '#7C5CBF',
  },
  {
    key: 'momentum_tracker',
    label: 'Momentum Tracker',
    personality: 'wants proof markets care',
    looks_for: 'traction, retention, real demand evidence',
    color: '#4FB05C',
  },
];

export interface ScoreDimensionMeta {
  key: keyof Pick<PitchResult, 'problem_validity' | 'solution_credibility' | 'market_realism' | 'business_model_strength' | 'traction_signal' | 'team_conviction' | 'competitive_positioning' | 'moat_potential' | 'overall_investability'>;
  label: string;
}

export const SCORE_DIMENSIONS: ScoreDimensionMeta[] = [
  { key: 'problem_validity', label: 'Problem' },
  { key: 'solution_credibility', label: 'Solution' },
  { key: 'market_realism', label: 'Market' },
  { key: 'business_model_strength', label: 'Business Model' },
  { key: 'traction_signal', label: 'Traction' },
  { key: 'team_conviction', label: 'Team' },
  { key: 'competitive_positioning', label: 'Competition' },
  { key: 'moat_potential', label: 'Moat' },
  { key: 'overall_investability', label: 'Overall' },
];