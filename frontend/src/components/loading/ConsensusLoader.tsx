import { useEffect, useState } from "react"
import { LensActivityFeed } from "./LensActivityFeed"
import { ConvergenceNodes } from "./ConvergenceNodes"
import "./ConsensusLoader.css"

export type LoaderStage = "submitting" | "evaluating" | "complete"

const LENSES = [
  "Problem Validator",
  "Market Analyst",
  "Technical Skeptic",
  "Execution Realist",
  "Devil's Advocate",
  "Momentum Tracker",
]

export function ConsensusLoader({ stage }: { stage: LoaderStage }) {
  const [visibleLenses, setVisibleLenses] = useState(0)

  useEffect(() => {
    if (stage !== "evaluating" && stage !== "complete") return
    if (visibleLenses >= LENSES.length) return

    const interval = setInterval(() => {
      setVisibleLenses((prev) => {
        if (prev >= LENSES.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 500)

    return () => clearInterval(interval)
  }, [stage, visibleLenses])

  return (
    <div className="consensus-loader">
      <div className="consensus-content">
        {stage === "submitting" && (
          <div className="loader-submit">
            <div className="terminal-line">
              <span className="terminal-prompt">$</span>
              <span>Submitting to GenLayer Studio</span>
              <span className="terminal-cursor">▊</span>
            </div>
            <div className="network-pulse-container">
              <div className="network-pulse" />
              <div className="network-pulse" />
              <div className="network-pulse" />
            </div>
            <p className="loader-footnote">
              Confirming the transaction in MetaMask. This is the quick part.
            </p>
          </div>
        )}

        {(stage === "evaluating" || stage === "complete") && (
          <>
            <div className="loader-header">
              <h2 className="loader-title">
                Independent investor lenses are evaluating your pitch
              </h2>
            </div>

            <div className="lens-list">
              {LENSES.map((lens, i) => (
                <div
                  key={lens}
                  className={`lens-row ${i < visibleLenses ? "visible" : ""}`}
                >
                  <span className="lens-name">{lens}</span>
                  <div className="lens-row-right">
                    <span className="lens-status">
                      reviewing<span className="lens-status-cursor">_</span>
                    </span>
                    <span className="lens-dot" />
                  </div>
                </div>
              ))}
            </div>

            <LensActivityFeed />

            <ConvergenceNodes />

            <p className="loader-footnote">
              Takes 45-90 seconds. Each validator independently reasons before consensus forms.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
