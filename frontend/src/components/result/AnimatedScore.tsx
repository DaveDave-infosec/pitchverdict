import { useEffect, useState } from 'react';
import './AnimatedScore.css';

interface AnimatedScoreProps {
  target: number;
  duration?: number;
  start: boolean;
}

export function AnimatedScore({ target, duration = 1200, start }: AnimatedScoreProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(target * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, start]);

  return (
    <div className={`animated-score ${start ? 'animated-score--visible' : ''}`}>
      <span className="animated-score__value">{current}</span>
      <span className="animated-score__suffix">/100</span>
    </div>
  );
}