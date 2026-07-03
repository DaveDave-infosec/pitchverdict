import { createClient } from "genlayer-js"
import { studionet } from "genlayer-js/chains"
import { CONTRACT_ADDRESS } from "./constants"
import type { PitchFields, PitchResult } from "../types"

// Read-only client (no account needed)
export const publicClient: any = createClient({
  chain: studionet,
} as any)

// Wallet client per account
export function getWalletClient(account: string): any {
  return createClient({
    chain: studionet,
    account: account as `0x${string}`,
  } as any)
}

// Exponential backoff for read calls
async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastErr: any
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (i < maxAttempts - 1) {
        await new Promise((r) => setTimeout(r, 500 * Math.pow(2, i)))
      }
    }
  }
  throw lastErr
}

// Submit a pitch — twelve positional string arguments in exact order
// IMPORTANT genlayer-js v1.x quirk: account is set on the client at
// createClient time only. Do NOT pass it on the writeContract call —
// doing so makes viem's internal account resolution fail with
// "Address 'undefined' is invalid".
export async function submitPitch(
  fields: PitchFields,
  accountAddress: string
) {
  if (!accountAddress || accountAddress.length !== 42 || !accountAddress.startsWith("0x")) {
    throw new Error("Wallet not connected. Please connect MetaMask to GenLayer Studio.")
  }
  const client = getWalletClient(accountAddress)
  return await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: "evaluate_pitch",
    args: [
      fields.startup_name,
      fields.stage,
      fields.industry,
      fields.problem,
      fields.solution,
      fields.market,
      fields.business_model,
      fields.traction,
      fields.competition,
      fields.team,
      fields.moat,
      fields.ask,
    ],
    value: 0n,
  } as any)
}

export async function getResult(resultId: string): Promise<PitchResult | null> {
  return withRetry(async () => {
    const result = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "get_result",
      args: [resultId],
    } as any)
    if (!result || !result.result_id) return null
    return result as PitchResult
  })
}


export async function getMyPitches(address: string): Promise<PitchResult[]> {
  return withRetry(async () => {
    const results = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "get_results_by_submitter",
      args: [address],
    } as any)
    return (results as PitchResult[]) || []
  })
}

export async function getResultCount(): Promise<number> {
  return withRetry(async () => {
    const count = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "get_result_count",
      args: [],
    } as any)
    return Number(count) || 0
  })
}

export async function getAllResults(): Promise<PitchResult[]> {
  return withRetry(async () => {
    const results = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "get_all_results",
      args: [],
    } as any)
    return (results as PitchResult[]) || []
  })
}

// ---------- Submit + wait helper (v2) ----------
// Polls getMyPitches after submission to detect the new pitch by result_id.
// Avoids relying on transaction receipt return value extraction.

export type SubmitStage = 'submitting' | 'evaluating' | 'finalizing';

const SUBMIT_POLL_INTERVAL_MS = 5000;
const SUBMIT_MAX_WAIT_MS = 360000;

function submitSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitPitchAndWait(
  fields: PitchFields,
  account: string,
  onStage?: (stage: SubmitStage) => void
): Promise<PitchResult> {
  const baseline = await getMyPitches(account);
  const baselineIds = new Set(baseline.map((p) => p.result_id));

  onStage?.('submitting');
  await submitPitch(fields, account);

  onStage?.('evaluating');
  const startTime = Date.now();

  while (Date.now() - startTime < SUBMIT_MAX_WAIT_MS) {
    await submitSleep(SUBMIT_POLL_INTERVAL_MS);
    try {
      const current = await getMyPitches(account);
      const newPitch = current.find((p) => !baselineIds.has(p.result_id));
      if (newPitch) {
        onStage?.('finalizing');
        return newPitch;
      }
    } catch (e) {
      // Continue polling on transient errors.
    }
  }

  throw new Error(
    'Consensus timeout. Your pitch is still being evaluated by validators. Check the Studio explorer or refresh My Pitches in a few minutes.'
  );
}