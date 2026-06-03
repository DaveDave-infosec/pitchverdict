import { STAGE_OPTIONS } from "../../lib/constants"
import "./StageSelector.css"

export function StageSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (stage: string) => void
}) {
  return (
    <div className="stage-selector">
      {STAGE_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`stage-card ${value === opt.id ? "selected" : ""}`}
        >
          <span className="stage-emoji">{opt.emoji}</span>
          <span className="stage-label">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
