export interface LensVerdicts {
  problem_validator?: string;
  market_analyst?: string;
  technical_skeptic?: string;
  execution_realist?: string;
  devils_advocate?: string;
  momentum_tracker?: string;
}

export interface PitchResult {
  result_id: string;
  submitter: string;
  startup_name: string;
  stage: string;
  industry: string;
  problem_validity: number;
  solution_credibility: number;
  market_realism: number;
  business_model_strength: number;
  traction_signal: number;
  team_conviction: number;
  competitive_positioning: number;
  moat_potential: number;
  overall_investability: number;
  overall_verdict: string;
  confidence_level: string;
  funding_stage_fit: string;
  lens_verdicts: LensVerdicts;
  disagreement_insight: string;
  key_strengths: string[];
  key_concerns: string[];
  one_thing_to_fix: string;
  investor_question: string;
  pitch_preview: string;
  timestamp: number;
}

export interface PitchFields {
  startup_name: string;
  stage: string;
  industry: string;
  problem: string;
  solution: string;
  market: string;
  business_model: string;
  traction: string;
  competition: string;
  team: string;
  moat: string;
  ask: string;
}
