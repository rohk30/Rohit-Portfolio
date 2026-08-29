import { useEffect, useMemo, useRef } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import SilhouetteBowler from './SilhouetteBowler.jsx';
import SilhouetteBatsman from './SilhouetteBatsman.jsx';

const ACTION = {
  bowlerStart: { x: 35, y: 53 },
  bowlerRelease: { x: 47, y: 52 },
  batsman: { x: 54, y: 65 },
};

function cubicPoint(t, p0, p1, p2, p3) {
  const u = 1 - t;
  return {
    x: u ** 3 * p0.x + 3 * u ** 2 * t * p1.x + 3 * u * t ** 2 * p2.x + t ** 3 * p3.x,
    y: u ** 3 * p0.y + 3 * u ** 2 * t * p1.y + 3 * u * t ** 2 * p2.y + t ** 3 * p3.y,
  };
}

/**
 * A compact, broadcast-inspired cricket action layer.
 * The field remains the hero; the players are deliberately small and live
 * inside the pitch area so they never dominate the composition.
 */
export default function PitchActionSequence({ playing, onDeliveryComplete, reducedMotion = false }) {
  const progress = useMotionValue(0);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!playing) return undefined;

    firedRef.current = false;
    progress.set(0);

    const controls = animate(progress, 1, {
      duration: reducedMotion ? 0.01 : 2.7,
      ease: [0.12, 0.72, 0.22, 1],
      onComplete: () => {
        if (!firedRef.current) {
          firedRef.current = true;
          onDeliveryComplete?.();
        }
      },
    });

    return () => controls.stop();
  }, [playing, reducedMotion, onDeliveryComplete, progress]);

  const bowlerX = useTransform(progress, [0, 0.32, 0.55, 0.72], [-4, 2, 8, 12]);
  const bowlerY = useTransform(progress, [0, 0.32, 0.55, 0.72], [0, -1, -1, 0]);
  const bowlerRotate = useTransform(progress, [0, 0.38, 0.62, 0.75], [4, 2, -8, -22]);
  const bowlerOpacity = useTransform(progress, [0, 0.06, 0.84, 1], [0, 1, 1, 0]);

  const ballProgress = useTransform(progress, [0.56, 0.73], [0, 1]);
  const ballOpacity = useTransform(progress, [0.53, 0.57, 0.75, 0.79], [0, 1, 1, 0]);
  const ballScale = useTransform(ballProgress, [0, 0.5, 1], [0.55, 1.15, 0.75]);

  const ballPath = useMemo(() => ({
    p0: ACTION.bowlerRelease,
    p1: { x: 49, y: 52 },
    p2: { x: 51.5, y: 58 },
    p3: { x: 53.2, y: 62.2 },
  }), []);

  const batsmanRotate = useTransform(progress, [0, 0.67, 0.72, 0.82, 1], [0, 0, -2, -28, -12]);
  const batsmanScale = useTransform(progress, [0, 0.7, 0.82, 1], [1, 1, 1.02, 1]);

  const ballX = useTransform(ballProgress, (t) => cubicPoint(t, ballPath.p0, ballPath.p1, ballPath.p2, ballPath.p3).x);
  const ballY = useTransform(ballProgress, (t) => cubicPoint(t, ballPath.p0, ballPath.p1, ballPath.p2, ballPath.p3).y);

  if (!playing) return null;

  return (
    <svg
      className="cricket-action-layer"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* Bowler: deliberately small so the pitch and ball remain the visual focus. */}
      <motion.g
        style={{ x: bowlerX, y: bowlerY, opacity: bowlerOpacity }}
        transform="translate(36 55) scale(0.14)"
      >
        <SilhouetteBowler rotate={bowlerRotate} fill="#10151a" scale={1} />
      </motion.g>

      {/* Batsman: compact silhouette with a restrained contact/follow-through. */}
      <motion.g
        style={{ rotate: batsmanRotate, scale: batsmanScale, transformOrigin: '54px 65px' }}
        transform="translate(54 65) scale(0.13)"
      >
        <SilhouetteBatsman />
      </motion.g>

      {/* Delivery ball: perspective-like scale + curved flight. */}
      <motion.g style={{ x: ballX, y: ballY, scale: ballScale, opacity: ballOpacity }}>
        <circle cx="0" cy="0" r="1.25" fill="#d44a3a" />
        <path d="M-0.9 -0.8 C-0.2 -0.25 0.2 0.25 0.9 0.8" fill="none" stroke="#f5e9d4" strokeWidth="0.18" opacity="0.9" />
        <circle cx="0" cy="0" r="2.4" fill="#ffb06a" opacity="0.08" />
      </motion.g>

      {/* Contact flash gives the bat/ball moment a readable beat without a giant player. */}
      <motion.circle
        cx="53.2"
        cy="62.2"
        r="2.4"
        fill="none"
        stroke="#f3d38a"
        strokeWidth="0.28"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0, 0.9, 0], scale: [0.5, 0.5, 1.35, 1.8] }}
        transition={{ duration: reducedMotion ? 0.01 : 2.7, times: [0, 0.68, 0.74, 0.86], ease: 'easeOut' }}
      />
    </svg>
  );
}
