import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { usePitch } from "../../hooks/usePitch"
import { useWallet } from "../../hooks/useWallet"
import { StepHeader } from "./StepHeader"
import { StageSelector } from "./StageSelector"
import { ConsensusLoader, type LoaderStage } from "../loading/ConsensusLoader"
import { PITCH_LIMITS, VALIDATOR_TRUNCATION_CHARS } from "../../lib/constants"
import { submitPitch, getResultCount, getMyPitches } from "../../lib/genlayer"
import "./PitchForm.css"

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

// ───────── Step indicator ─────────

function StepIndicator({
  current,
  total,
  onJump,
}: {
  current: number
  total: number
  onJump: (n: number) => void
}) {
  return (
    <div className="step-indicator">
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
        const cls =
          n === current ? "step-dot active" : n < current ? "step-dot completed" : "step-dot"
        return (
          <button
            key={n}
            type="button"
            onClick={() => n < current && onJump(n)}
            className={cls}
            disabled={n > current}
            aria-label={`Step ${n}`}
          >
            {n}
          </button>
        )
      })}
    </div>
  )
}

// ───────── Inputs ─────────

function PitchInput({
  label,
  value,
  onChange,
  maxLength,
  placeholder,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  maxLength: number
  placeholder?: string
  required?: boolean
}) {
  return (
    <div className="field">
      <label className="field-label">
        {label}
        {required && <span className="field-required"> *</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        maxLength={maxLength}
        className="field-input"
      />
    </div>
  )
}

function PitchTextarea({
  label,
  value,
  onChange,
  maxLength,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  maxLength: number
  placeholder?: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto"
      ref.current.style.height = `${Math.max(96, ref.current.scrollHeight)}px`
    }
  }, [value])

  const charCount = value.length
  const overThreshold = charCount >= maxLength * 0.4

  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <div className="field-textarea-wrapper">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder={placeholder}
          maxLength={maxLength}
          className="field-textarea"
        />
        <div className="char-counter">
          {charCount} / {maxLength}
        </div>
      </div>
      {overThreshold && (
        <p className="field-confidence-hint">Detailed claims improve validator confidence.</p>
      )}
    </div>
  )
}

// ───────── Review section ─────────

function ReviewSection({
  label,
  value,
  onEdit,
}: {
  label: string
  value: string
  onEdit: () => void
}) {
  const isEmpty = !value || !value.trim()
  return (
    <div className={`review-section ${isEmpty ? "empty" : ""}`}>
      <div className="review-section-header">
        <span className="review-section-label">{label}</span>
        <button type="button" onClick={onEdit} className="review-edit-btn">
          Edit
        </button>
      </div>
      <div className="review-section-value">
        {isEmpty ? <em className="review-empty">Not provided</em> : value}
      </div>
    </div>
  )
}

// ───────── Main form ─────────

export function PitchForm() {
  const navigate = useNavigate()
  const {
    fields,
    step,
    totalSteps,
    updateField,
    nextStep,
    prevStep,
    goToStep,
    isStepValid,
    totalChars,
  } = usePitch()
  const { account, connect, isConnecting, ensureStudioNetwork } = useWallet()

  const [loaderStage, setLoaderStage] = useState<LoaderStage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const cancelledRef = useRef(false)

  useEffect(() => {
    return () => {
      cancelledRef.current = true
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [step])

  const canContinue = isStepValid(step)
  const isSubmitting = loaderStage !== null

  const handleSubmit = async () => {
    if (!account) {
      await connect()
      return
    }

    setError(null)
    cancelledRef.current = false
    setLoaderStage("submitting")

    try {
      // Make sure we are on Studio Network
      await ensureStudioNetwork()

      // Capture count before submit so we can detect the new result
      const beforeCount = await getResultCount()

      // Triggers MetaMask sign + tx
      await submitPitch(fields, account)

      // Tx accepted — switch to evaluating stage
      setLoaderStage("evaluating")

      // Poll for new result
      const startTime = Date.now()
      const MAX_WAIT_MS = 360_000

      while (!cancelledRef.current && Date.now() - startTime < MAX_WAIT_MS) {
        await sleep(5000)
        if (cancelledRef.current) return

        const currentCount = await getResultCount()
        if (currentCount > beforeCount) {
          const mine = await getMyPitches(account)
          if (mine.length > 0) {
            const newest = mine[0]
            setLoaderStage("complete")
            await sleep(300)
            navigate(`/result/${newest.result_id}`)
            return
          }
        }
      }

      throw new Error(
        "Consensus is taking longer than expected. Check the Feed in a few minutes to find your result."
      )
    } catch (err: any) {
      console.error("Pitch submission failed:", err)
      const msg = err?.message?.toString() || ""
      if (err?.code === 4001 || msg.toLowerCase().includes("rejected") || msg.toLowerCase().includes("denied")) {
        setError("Transaction rejected. Try again whenever you are ready.")
      } else {
        setError(msg || "Something went wrong. Please try again.")
      }
      setLoaderStage(null)
    }
  }

  let submitLabel = "Submit to GenLayer Validators →"
  if (!account) submitLabel = isConnecting ? "Connecting..." : "Connect Wallet to Submit"

  return (
    <>
      <div className="pitch-form">
        <StepIndicator current={step} total={totalSteps} onJump={goToStep} />
        <StepHeader step={step} />

        <div key={step} className="step-content">
          {step === 1 && (
            <div className="step-fields">
              <PitchInput
                label="Startup Name"
                value={fields.startup_name}
                onChange={(v) => updateField("startup_name", v)}
                maxLength={PITCH_LIMITS.startup_name}
                placeholder="What is it called?"
                required
              />
              <div className="field">
                <label className="field-label">
                  Funding Stage<span className="field-required"> *</span>
                </label>
                <StageSelector
                  value={fields.stage}
                  onChange={(v) => updateField("stage", v)}
                />
              </div>
              <PitchInput
                label="Industry"
                value={fields.industry}
                onChange={(v) => updateField("industry", v)}
                maxLength={PITCH_LIMITS.industry}
                placeholder="Fintech, biotech, climate, developer tools..."
                required
              />
            </div>
          )}

          {step === 2 && (
            <div className="step-fields">
              <PitchTextarea
                label="The Problem"
                value={fields.problem}
                onChange={(v) => updateField("problem", v)}
                maxLength={PITCH_LIMITS.problem}
                placeholder="What pain does your target customer feel? How acute is it? Why now?"
              />
              <PitchTextarea
                label="The Solution"
                value={fields.solution}
                onChange={(v) => updateField("solution", v)}
                maxLength={PITCH_LIMITS.solution}
                placeholder="How do you solve this pain? What is the actual mechanism?"
              />
              <PitchTextarea
                label="Moat"
                value={fields.moat}
                onChange={(v) => updateField("moat", v)}
                maxLength={PITCH_LIMITS.moat}
                placeholder="What do you have that competitors structurally cannot replicate?"
              />
            </div>
          )}

          {step === 3 && (
            <div className="step-fields">
              <PitchTextarea
                label="The Market"
                value={fields.market}
                onChange={(v) => updateField("market", v)}
                maxLength={PITCH_LIMITS.market}
                placeholder="How big is this opportunity? TAM, SAM, SOM. Bottom-up if you can."
              />
              <PitchTextarea
                label="Competition"
                value={fields.competition}
                onChange={(v) => updateField("competition", v)}
                maxLength={PITCH_LIMITS.competition}
                placeholder="Who else is solving this? Direct, indirect, status quo. Why do you win?"
              />
              <PitchTextarea
                label="Business Model"
                value={fields.business_model}
                onChange={(v) => updateField("business_model", v)}
                maxLength={PITCH_LIMITS.business_model}
                placeholder="How do you make money? Pricing, unit economics, gross margins."
              />
            </div>
          )}

          {step === 4 && (
            <div className="step-fields">
              <PitchTextarea
                label="Traction"
                value={fields.traction}
                onChange={(v) => updateField("traction", v)}
                maxLength={PITCH_LIMITS.traction}
                placeholder="What proof exists that the market cares? Users, revenue, retention, real partnerships."
              />
              <PitchTextarea
                label="The Team"
                value={fields.team}
                onChange={(v) => updateField("team", v)}
                maxLength={PITCH_LIMITS.team}
                placeholder="Why should anyone believe YOU can execute this? Domain expertise, prior wins."
              />
              <PitchTextarea
                label="The Ask"
                value={fields.ask}
                onChange={(v) => updateField("ask", v)}
                maxLength={PITCH_LIMITS.ask}
                placeholder="How much are you raising, & what milestones does it unlock?"
              />
            </div>
          )}

          {step === 5 && (
            <div className="review-step">
              <ReviewSection label="Startup Name" value={fields.startup_name} onEdit={() => goToStep(1)} />
              <ReviewSection label="Funding Stage" value={fields.stage} onEdit={() => goToStep(1)} />
              <ReviewSection label="Industry" value={fields.industry} onEdit={() => goToStep(1)} />
              <ReviewSection label="The Problem" value={fields.problem} onEdit={() => goToStep(2)} />
              <ReviewSection label="The Solution" value={fields.solution} onEdit={() => goToStep(2)} />
              <ReviewSection label="Moat" value={fields.moat} onEdit={() => goToStep(2)} />
              <ReviewSection label="The Market" value={fields.market} onEdit={() => goToStep(3)} />
              <ReviewSection label="Competition" value={fields.competition} onEdit={() => goToStep(3)} />
              <ReviewSection label="Business Model" value={fields.business_model} onEdit={() => goToStep(3)} />
              <ReviewSection label="Traction" value={fields.traction} onEdit={() => goToStep(4)} />
              <ReviewSection label="The Team" value={fields.team} onEdit={() => goToStep(4)} />
              <ReviewSection label="The Ask" value={fields.ask} onEdit={() => goToStep(4)} />

              <div className="review-meta">
                <div className="review-total-chars">Total: {totalChars} characters</div>
                {totalChars < 500 && (
                  <div className="review-warning">
                    Your pitch is under 500 characters total. Validators will struggle to evaluate sparse content.
                  </div>
                )}
                {totalChars > VALIDATOR_TRUNCATION_CHARS && (
                  <div className="review-warning">
                    Your pitch exceeds the {VALIDATOR_TRUNCATION_CHARS.toLocaleString()}-character validator window. The contract will truncate the end of the combined content before evaluation, which means some of your later sections (Competition, Team, Moat, The Ask) may not reach the validators.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="form-nav">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="btn-secondary nav-back"
              disabled={isSubmitting}
            >
              ← Back
            </button>
          )}

          {step === 1 && <div className="form-nav-spacer" />}
          {step > 1 && step < 5 && <div className="form-nav-spacer" />}

          {step < 5 && (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canContinue}
              className="btn-primary"
            >
              Continue →
            </button>
          )}

          {step === 5 && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || (account !== null && totalChars < 200)}
              className="btn-primary nav-submit"
            >
              {submitLabel}
            </button>
          )}
        </div>

        {error && step === 5 && <p className="submit-error">{error}</p>}
      </div>

      {loaderStage !== null && <ConsensusLoader stage={loaderStage} />}
    </>
  )
}
