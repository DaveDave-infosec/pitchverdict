import "./ConvergenceNodes.css"

export function ConvergenceNodes() {
  return (
    <div className="convergence-container">
      <div className="conv-canvas">
        <div className="conv-center" />
        <div className="conv-node conv-node-0" />
        <div className="conv-node conv-node-1" />
        <div className="conv-node conv-node-2" />
        <div className="conv-node conv-node-3" />
        <div className="conv-node conv-node-4" />
        <div className="conv-node conv-node-5" />
      </div>
      <div className="convergence-label">Validators are reaching consensus</div>
    </div>
  )
}
