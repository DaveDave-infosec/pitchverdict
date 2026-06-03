import { useState, useCallback } from "react"
import type { PitchFields } from "../types"

const EMPTY_FIELDS: PitchFields = {
  startup_name: "",
  stage: "",
  industry: "",
  problem: "",
  solution: "",
  market: "",
  business_model: "",
  traction: "",
  competition: "",
  team: "",
  moat: "",
  ask: "",
}

const TOTAL_STEPS = 5

export function usePitch() {
  const [fields, setFields] = useState<PitchFields>(EMPTY_FIELDS)
  const [step, setStep] = useState<number>(1)

  const updateField = useCallback(
    <K extends keyof PitchFields>(key: K, value: PitchFields[K]) => {
      setFields((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const nextStep = useCallback(
    () => setStep((s) => Math.min(s + 1, TOTAL_STEPS)),
    []
  )

  const prevStep = useCallback(() => setStep((s) => Math.max(s - 1, 1)), [])

  const goToStep = useCallback(
    (target: number) => setStep(Math.max(1, Math.min(target, TOTAL_STEPS))),
    []
  )

  const reset = useCallback(() => {
    setFields(EMPTY_FIELDS)
    setStep(1)
  }, [])

  const isStepValid = useCallback(
    (s: number): boolean => {
      if (s === 1) {
        return (
          fields.startup_name.trim().length > 0 &&
          fields.stage.trim().length > 0 &&
          fields.industry.trim().length > 0
        )
      }
      if (s === 2) {
        return fields.problem.trim().length >= 30 && fields.solution.trim().length >= 30
      }
      if (s === 3) {
        return fields.market.trim().length >= 30
      }
      if (s === 4) {
        return fields.team.trim().length >= 30
      }
      return true
    },
    [fields]
  )

  const totalChars = Object.values(fields).reduce((sum, v) => sum + v.length, 0)

  return {
    fields,
    step,
    totalSteps: TOTAL_STEPS,
    updateField,
    nextStep,
    prevStep,
    goToStep,
    reset,
    isStepValid,
    totalChars,
  }
}
