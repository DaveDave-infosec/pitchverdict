import './HeaderReveal.css';

interface HeaderRevealProps {
  startupName: string;
  stage: string;
  industry: string;
  confidenceLevel: string;
  fundingStageFit: string;
  visible: boolean;
}

export function HeaderReveal({
  startupName,
  stage,
  industry,
  confidenceLevel,
  fundingStageFit,
  visible,
}: HeaderRevealProps) {
  return (
    <div className={`header-reveal ${visible ? 'header-reveal--visible' : ''}`}>
      <h1 className="header-reveal__name">{startupName}</h1>
      <div className="header-reveal__meta">
        <span>{stage}</span>
        <span className="header-reveal__sep">·</span>
        <span>{industry}</span>
      </div>
      <div className="header-reveal__qualifiers">
        <span className="header-reveal__qualifier">
          <span className="header-reveal__qualifier-label">Confidence</span>
          <span className="header-reveal__qualifier-value">{confidenceLevel}</span>
        </span>
        <span className="header-reveal__qualifier-divider" aria-hidden="true">·</span>
        <span className="header-reveal__qualifier">
          <span className="header-reveal__qualifier-label">Stage Fit</span>
          <span className="header-reveal__qualifier-value">{fundingStageFit}</span>
        </span>
      </div>
    </div>
  );
}