import type { PitchResult } from '../types';

export type FilterKey =
  | 'all'
  | 'favorites'
  | 'contested'
  | 'hidden-gems'
  | 'polarizing'
  | 'hard-pass';

export interface FilterMeta {
  key: FilterKey;
  label: string;
  description: string;
  emptyMessage: string;
}

export const FILTER_META: FilterMeta[] = [
  { key: 'all', label: 'All', description: 'every pitch', emptyMessage: 'No pitches yet.' },
  { key: 'favorites', label: 'Investor Favorites', description: 'strongest pitches by verdict & confidence', emptyMessage: 'No Strong Pass verdicts yet.' },
  { key: 'contested', label: 'Most Contested', description: 'highest validator disagreement', emptyMessage: 'No contested pitches yet.' },
  { key: 'hidden-gems', label: 'Hidden Gems', description: 'high score despite real concerns', emptyMessage: 'No hidden gems uncovered yet.' },
  { key: 'polarizing', label: 'Polarizing', description: 'widest lens score spread', emptyMessage: 'No polarizing pitches yet.' },
  { key: 'hard-pass', label: 'Hard Pass', description: 'fundamental flaws', emptyMessage: 'No hard passes yet.' },
];

function dimensionSpread(r: PitchResult): number {
  const scores = [
    r.problem_validity, r.solution_credibility, r.market_realism,
    r.business_model_strength, r.traction_signal, r.team_conviction,
    r.competitive_positioning, r.moat_potential,
  ];
  return Math.max(...scores) - Math.min(...scores);
}

export function applyFilter(results: PitchResult[], key: FilterKey): PitchResult[] {
  switch (key) {
    case 'all':
      return results;
    case 'favorites':
      return results.filter((r) =>
        r.overall_verdict === 'Strong Pass' ||
        (r.overall_investability >= 80 && r.confidence_level !== 'Contested' && r.confidence_level !== 'Low')
      );
    case 'contested':
      return results.filter((r) => r.confidence_level === 'Contested');
    case 'hidden-gems':
      return results.filter((r) =>
        r.overall_investability >= 70 &&
        (r.key_concerns?.length || 0) >= 3 &&
        r.overall_verdict !== 'Strong Pass'
      );
    case 'polarizing':
      return results.filter((r) => dimensionSpread(r) >= 25);
    case 'hard-pass':
      return results.filter((r) =>
        r.overall_verdict === 'Hard Pass' || r.overall_investability <= 40
      );
    default:
      return results;
  }
}

export function getFilterCounts(results: PitchResult[]): Record<FilterKey, number> {
  return {
    all: results.length,
    favorites: applyFilter(results, 'favorites').length,
    contested: applyFilter(results, 'contested').length,
    'hidden-gems': applyFilter(results, 'hidden-gems').length,
    polarizing: applyFilter(results, 'polarizing').length,
    'hard-pass': applyFilter(results, 'hard-pass').length,
  };
}