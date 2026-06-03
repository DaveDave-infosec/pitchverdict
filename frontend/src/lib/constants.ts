// GenLayer Studio Network
export const STUDIO_CHAIN_ID = 61999
export const STUDIO_CHAIN_ID_HEX = "0xF22F"
export const STUDIO_CHAIN_NAME = "GenLayer Studio"
export const STUDIO_RPC_URL = "https://studio.genlayer.com/api"
export const STUDIO_EXPLORER_URL = "https://explorer-studio.genlayer.com"
export const STUDIO_CURRENCY = { name: "GEN", symbol: "GEN", decimals: 18 }

// Contract — env var with fallback to deployed address
export const CONTRACT_ADDRESS = (
  import.meta.env.VITE_CONTRACT_ADDRESS &&
  import.meta.env.VITE_CONTRACT_ADDRESS !== "PLACEHOLDER_PASTE_AFTER_DEPLOY"
    ? import.meta.env.VITE_CONTRACT_ADDRESS
    : "0x4FD5aC31E7Afe210084edE7Cb591C1B6BeaDC5d7"
) as `0x${string}`

// App
export const APP_NAME = "PitchVerdict"
export const APP_TAGLINE = "Know what investors really think. Before the room."
export const APP_PUBLIC_URL = "https://pitchverdict.vercel.app"

// Pitch field character limits
export const PITCH_LIMITS = {
  startup_name: 80,
  industry: 60,
  problem: 2000,
  solution: 2000,
  market: 2000,
  business_model: 2000,
  traction: 2000,
  competition: 2000,
  team: 2000,
  moat: 2000,
  ask: 2000,
}

// Combined pitch is truncated to this many chars before validators see it.
// Must match VALIDATOR_TRUNCATION_CHARS in contracts/pitchverdict.py (currently 5000).
export const VALIDATOR_TRUNCATION_CHARS = 5000

// Stage options for StageSelector
export const STAGE_OPTIONS = [
  { id: "Idea", label: "Idea", emoji: "💡" },
  { id: "Pre-seed", label: "Pre-seed", emoji: "🌱" },
  { id: "Seed", label: "Seed", emoji: "🚀" },
  { id: "Series A+", label: "Series A+", emoji: "📈" },
] as const

// Lens metadata (frontend display only)
export const LENS_META = {
  problem_validator: {
    name: "Problem Validator",
    descriptor: "Obsessed with pain intensity.",
    color: "#3B6FD4",
  },
  market_analyst: {
    name: "Market Analyst",
    descriptor: "Questions every market sizing claim.",
    color: "#7B4FBF",
  },
  technical_skeptic: {
    name: "Technical Skeptic",
    descriptor: "Builds things & knows what is hard.",
    color: "#C47020",
  },
  execution_realist: {
    name: "Execution Realist",
    descriptor: "Bets on teams, not ideas.",
    color: "#2B8B7A",
  },
  devils_advocate: {
    name: "Devil's Advocate",
    descriptor: "Actively searching for failure points.",
    color: "#BF3030",
  },
  momentum_tracker: {
    name: "Momentum Tracker",
    descriptor: "Needs proof the market already cares.",
    color: "#2B8B4A",
  },
} as const

export type LensKey = keyof typeof LENS_META

// Loading activity feed (frontend-only scripted strings — NOT from contract)
export const LOADING_ACTIVITY_MESSAGES = [
  "Market sizing assumptions under review",
  "Execution realism lens requesting stronger moat evidence",
  "Momentum validator analyzing traction credibility",
  "Technical skeptic flagging solution complexity",
  "Devil's advocate identifying competitive pressure points",
  "Problem validator confirming pain acuity",
  "Cross-checking business model unit economics",
  "Reviewing team domain credentials",
  "Stress-testing competitive positioning claims",
  "Evaluating funding ask against milestones",
  "Comparing market entry strategy to incumbents",
  "Searching for retention signals in traction data",
]
