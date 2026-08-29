import { useEffect, useMemo, useRef } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

function cubicPoint(t, p0, p1, p2, p3) {
  const u = 1 - t;
  return {
    x: u ** 3 * p0.x + 3 * u ** 2 * t * p1.x + 3 * u * t ** 2 * p2.x + t ** 3 * p3.x,
    y: u ** 3 * p0.y + 3 * u ** 2 * t * p1.y + 3 * u * t ** 2 * p2.y + t ** 3 * p3.y,
  };
}

export default function ShotBall({ from, to, onComplete, reducedMotion = false, shotId = '' }) {
  const progress = useMotionValue(0);
  const completeRef = useRef(false);

  const controls = useMemo(() => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const side = dx >= 0 ? 1 : -1;
    const lift = shotId === 'straight-drive' ? 1.8 : shotId === 'edge-to-slip' ? 3.6 : 2.6;
    const lateral = shotId === 'pull-shot' || shotId === 'flick' ? Math.abs(dx) * 0.08 : Math.abs(dx) * 0.04;
    return {
      p0: from,
      p1: { x: from.x + dx * 0.18 + lateral * side, y: from.y + dy * 0.16 - lift },
      p2: { x: from.x + dx * 0.7 + lateral * side, y: from.y + dy * 0.62 - lift * 0.35 },
      p3: to,
    };
  }, [from, to, shotId]);

  useEffect(() => {
    completeRef.current = false;
    progress.set(0);
    const animation = animate(progress, 1, {
      duration: reducedMotion ? 0.01 : 1.25,
      ease: [0.18, 0.74, 0.2, 1],
      onComplete: () => {
        if (!completeRef.current) {
          completeRef.current = true;
          onComplete?.();
        }
      },
    });
    return () => animation.stop();
  }, [progress, reducedMotion, onComplete]);

  const x = useTransform(progress, (t) => cubicPoint(t, controls.p0, controls.p1, controls.p2, controls.p3).x);
  const y = useTransform(progress, (t) => cubicPoint(t, controls.p0, controls.p1, controls.p2, controls.p3).y);
  const scale = useTransform(progress, [0, 0.45, 1], [0.9, 1.3, 0.75]);
  const opacity = useTransform(progress, [0, 0.03, 0.92, 1], [0, 1, 1, 0]);

  return (
    <svg className="shot-ball-layer" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <motion.g style={{ x, y, scale, opacity }}>
        <circle cx="0" cy="0" r="1.35" fill="#d44a3a" />
        <path d="M-1 -0.9 C-0.2 -0.25 0.2 0.25 1 0.9" fill="none" stroke="#f8ead6" strokeWidth="0.2" />
        <circle cx="0" cy="0" r="3" fill="#f3b76b" opacity="0.09" />
      </motion.g>
    </svg>
  );
}
