import "./StepHeader.css"

const STEP_META: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: "The Basics",
    subtitle: "Set the context before walking into the room.",
  },
  2: {
    title: "The Problem & Solution",
    subtitle: "Convince investors this pain actually matters.",
  },
  3: {
    title: "The Market",
    subtitle: "Show why this opportunity is large enough to matter.",
  },
  4: {
    title: "Proof & Team",
    subtitle: "Why should anyone believe YOU can execute this?",
  },
  5: {
    title: "Final Review",
    subtitle: "Read it back. This is what validators will see.",
  },
}

export function StepHeader({ step }: { step: number }) {
  const meta = STEP_META[step]
  if (!meta) return null

  return (
    <div className="step-header">
      <h2 className="step-title">{meta.title}</h2>
      <p className="step-subtitle">{meta.subtitle}</p>
    </div>
  )
}
