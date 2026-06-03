import { Link } from "react-router-dom"
import { HeroBackground } from "../components/home/HeroBackground"
import "./Home.css"

export function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <HeroBackground />
        <div className="hero-inner">
          <h1 className="hero-title">PitchVerdict</h1>
          <p className="hero-tagline">
            Know what investors really think.
            <br />
            Before the room.
          </p>
          <p className="hero-subtext">
            Six independent GenLayer validator lenses evaluate your startup pitch
            through the same disagreements real investor rooms have every day.
          </p>
          <Link to="/pitch" className="btn-primary hero-cta">
            Enter The Room <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-number">6</div>
              <div className="stat-label">Investor Lenses</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">9</div>
              <div className="stat-label">Evaluation Dimensions</div>
            </div>
            <div className="stat-card">
              <div className="stat-number stat-symbol">✓</div>
              <div className="stat-label">Consensus-Graded</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
