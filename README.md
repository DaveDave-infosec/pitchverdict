# PitchVerdict

**Know what investors really think. Before the room.**

A wallet-gated workspace where six AI investor lenses reach consensus on your startup pitch, built on GenLayer Studio Network's multi-validator infrastructure.

[Live Demo](https://pitchverdict.vercel.app) · [Contract on Explorer](https://explorer-studio.genlayer.com/address/0x5A67f7fC54eD3C4E81FdC9C1eBbcb05F62230c1F) · [Launch Thread](https://x.com/klauss6139)

---

## What it does

You enter your pitch through a 5-step form covering problem, solution, market, business model, traction, team, competition, moat, & ask. Six independent investor personas, each implemented as a distinct LLM validator, evaluate it through their specific lens & reach consensus via GenLayer's `eq_principle.prompt_comparative`.

**The six lenses:**

- **Problem Validator** asks if the pain is real, acute, & urgent
- **Market Analyst** challenges every TAM claim & demands bottom-up math
- **Technical Skeptic** doubts the build is feasible
- **Execution Realist** bets on the team
- **Devil's Advocate** names every failure mode
- **Momentum Tracker** wants proof markets care

You get back an overall verdict (Strong Pass / Conditional Interest / Needs Work / Hard Pass / Too Early to Tell), an investability score 0-100, eight dimension scores, six lens verdicts with rationale, key strengths & key concerns, a one-thing-to-fix recommendation, the sharpest question a real partner would ask, & a disagreement insight that names which lenses split & why.

## The killer feature: disagreement insight

Real investor rooms don't reach unanimous verdicts. They reach contested ones, & the substantive friction is where the actual signal lives. When the Execution Realist sees a rare founder-market fit but the Devil's Advocate sees Datadog about to commoditize you, that split IS the diagnosis. PitchVerdict makes it visible, names the coalition on each side, & explains the substantive reason for the split.

When the consensus is genuinely Contested (validators couldn't agree on overall_verdict or investability), the result page surfaces a CONTESTED badge & the disagreement card pulses, because that's the case where you need to internalize the friction the most.

## How it works

PitchVerdict deploys a Python smart contract on GenLayer Studio Network that wraps the six-lens evaluation into a single on-chain function. When you submit a pitch, the contract sends a structured prompt to multiple validators. Each runs an LLM independently, produces a JSON verdict, & GenLayer's equivalence principle reaches consensus on the final output. The result is stored in contract state & rendered through a cinematic reveal sequence on the frontend.

A typical evaluation finalizes in 1-3 minutes. Hash-based result IDs (`p_a4f8c3e7b2d1c40`) replace sequential IDs to remove enumeration. Each wallet sees only its own pitches in the MyPitches view via the contract's `get_results_by_submitter(address)` method.

## Privacy

Smart contracts on public blockchains are public by design. PitchVerdict stores pitch content & validator output on-chain at the contract address above. The v3 contract restricts the API surface (no public `get_all_results()` method, hash-based result IDs that can't be guessed, queries gated by submitter address) but transaction calldata remains visible to anyone who knows how to decode it via the explorer.

For founders testing pitches before real VC conversations, this is sufficient practical privacy. Casual visitors, other founders, & block-explorer browsers can't easily discover your pitches. Determined actors with calldata-decoding skills technically can. The only path to cryptographic confidentiality on chain is TEE-based confidential validators, which is not currently a GenLayer feature.

If complete pitch confidentiality is critical, run the contract against a local GenLayer Studio validator setup, or wait for confidential-compute primitives to land on GenLayer.

## Tech stack

- **Chain:** GenLayer Studio Network (Chain ID 61999, RPC `https://studio.genlayer.com/api`)
- **Contract:** Python via `py-genlayer` runner v0.2.16
- **Frontend:** React 18 + TypeScript + Vite
- **Web3:** `genlayer-js` v1 + MetaMask
- **Routing:** React Router 6
- **Animation:** requestAnimationFrame for score count-up, CSS transitions for reveal stages, pulse keyframes for Contested badge

## Run it locally

```bash
git clone https://github.com/DaveDave-infosec/pitchverdict.git
cd pitchverdict/frontend
npm install
cp .env.example .env.local
# Set VITE_CONTRACT_ADDRESS in .env.local
npm run dev
```

Open `http://localhost:5173` & connect a MetaMask wallet with test GEN on Studio Network. Use the GenLayer Studio faucet to fund your wallet for evaluations.

## Repo layout

```
pitchverdict/
├── contracts/
│   └── pitchverdict.py        # Six-lens consensus contract
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Header with wallet popover
│   │   │   ├── pitch/         # 5-step submission form
│   │   │   ├── loading/       # ConsensusLoader with lens activity feed
│   │   │   ├── result/        # Cinematic reveal stages
│   │   │   └── feed/          # ResultCard, FilterTabs
│   │   ├── hooks/             # useWallet, usePitch
│   │   ├── lib/               # genlayer client, verdicts metadata, filters
│   │   ├── pages/             # Home, Pitch, Result, MyPitches
│   │   └── types.ts
│   ├── .env.local
│   └── package.json
└── README.md
```

## Roadmap

- ShareCard export for shareable result snapshots
- Industry-specific lens variants (deep-tech, consumer, fintech, infra)
- Validator-by-validator score reveal (currently shows consensus only)
- Confidential evaluation via TEE-based validators when GenLayer supports it
- Pitch revision tracking across multiple submissions of the same idea

## Built by

[David Udeugwu](https://x.com/klauss6139)

Built on [GenLayer Studio Network](https://genlayer.com). The validator consensus model that makes on-chain LLM agreement possible is what makes this product possible.