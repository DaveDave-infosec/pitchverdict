import { getVerdictColorKey } from '../../lib/verdicts';
import './VerdictReveal.css';

interface VerdictRevealProps {
  verdict: string;
  visible: boolean;
}

export function VerdictReveal({ verdict, visible }: VerdictRevealProps) {
  const colorKey = getVerdictColorKey(verdict);
  return (
    <div
      className={`verdict-reveal verdict-reveal--${colorKey} ${visible ? 'verdict-reveal--visible' : ''}`}
    >
      {verdict}
    </div>
  );
}