import { useEffect, useMemo, useRef } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

/**
 * PitchActionSequence v4 — Two-segment delivery with pitch bounce
 *
 * Segment 1 (flight): Ball arcs through the air from bowler's release
 *   point to the pitch spot (good length), with a subtle curve showing
 *   the delivery trajectory.
 *
 * Segment 2 (after pitch): Ball deviates off the seam from the pitch
 *   spot to the batsman, with a slight lateral movement.
 *
 * A pitch-spot flash marks where the ball lands.
 *
 * 800×800 coordinate space matching CricketFieldCanvas.
 */

// Key positions on the pitch
const RELEASE   = { x: 400, y: 285 }; // bowler releases
const PITCH_SPOT = { x: 403, y: 420 }; // good length, lands here
const BATSMAN   = { x: 400, y: 508 }; // arrives at batsman

// Segment 1: Flight through the air (slight outswing arc)
const FLIGHT = {
  p0: RELEASE,
  p1: { x: 394, y: 330 },  // drifts slightly to off-side in the air
  p2: { x: 398, y: 385 },
  p3: PITCH_SPOT,
};

// Segment 2: Off the pitch (seam movement, nips back in)
const BOUNCE = {
  p0: PITCH_SPOT,
  p1: { x: 406, y: 445 },  // deviates after pitch
  p2: { x: 404, y: 480 },
  p3: BATSMAN,
};

function buildPathD(seg) {
  return `M${seg.p0.x},${seg.p0.y} C${seg.p1.x},${seg.p1.y} ${seg.p2.x},${seg.p2.y} ${seg.p3.x},${seg.p3.y}`;
}

function cubicPoint(t, p0, p1, p2, p3) {
  const u = 1 - t;
  return {
    x: u ** 3 * p0.x + 3 * u ** 2 * t * p1.x + 3 * u * t ** 2 * p2.x + t ** 3 * p3.x,
    y: u ** 3 * p0.y + 3 * u ** 2 * t * p1.y + 3 * u * t ** 2 * p2.y + t ** 3 * p3.y,
  };
}

// The ball spends 55% of the duration in flight, 45% after pitching
const PITCH_T = 0.55;

export default function PitchActionSequence({ playing, onDeliveryComplete, reducedMotion = false }) {
  const progress = useMotionValue(0);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!playing) return undefined;
    firedRef.current = false;
    progress.set(0);

    const controls = animate(progress, 1, {
      duration: reducedMotion ? 0.01 : 3.5,
      ease: [0.16, 0.77, 0.2, 1],
    });
    return () => controls.stop();
  }, [playing, reducedMotion, progress]);

  // Fire delivery complete as soon as ball visually arrives (~90% progress)
  // rather than waiting for the full animation tail to finish
  useEffect(() => {
    const unsubscribe = progress.on('change', (v) => {
      if (v >= 0.88 && !firedRef.current) {
        firedRef.current = true;
        onDeliveryComplete?.();
      }
    });
    return unsubscribe;
  }, [progress, onDeliveryComplete]);

  const flightD = useMemo(() => buildPathD(FLIGHT), []);
  const bounceD = useMemo(() => buildPathD(BOUNCE), []);
  // Combined path for animateMotion (SVG needs one continuous path)
  const fullD = useMemo(() =>
    `${flightD} ${bounceD.replace('M', 'L').replace(/C/, ' C')}`,
  [flightD, bounceD]);

  // ── Segment 1 trail (flight) ──
  const flightDraw = useTransform(progress, [0.03, PITCH_T * 0.9], [1, 0]);
  const flightOpacity = useTransform(progress, [0, 0.05, PITCH_T, 1], [0, 0.85, 0.85, 0.4]);

  // ── Segment 2 trail (after pitch) ──
  const bounceDraw = useTransform(progress, [PITCH_T, 0.92], [1, 0]);
  const bounceOpacity = useTransform(progress, [PITCH_T - 0.03, PITCH_T + 0.03, 0.88, 1], [0, 0.9, 0.9, 0.45]);

  // ── Ball position: interpolates across both segments ──
  const ballX = useTransform(progress, (p) => {
    if (p <= PITCH_T) {
      const t = p / PITCH_T;
      return cubicPoint(t, FLIGHT.p0, FLIGHT.p1, FLIGHT.p2, FLIGHT.p3).x;
    }
    const t = (p - PITCH_T) / (1 - PITCH_T);
    return cubicPoint(t, BOUNCE.p0, BOUNCE.p1, BOUNCE.p2, BOUNCE.p3).x;
  });
  const ballY = useTransform(progress, (p) => {
    if (p <= PITCH_T) {
      const t = p / PITCH_T;
      return cubicPoint(t, FLIGHT.p0, FLIGHT.p1, FLIGHT.p2, FLIGHT.p3).y;
    }
    const t = (p - PITCH_T) / (1 - PITCH_T);
    return cubicPoint(t, BOUNCE.p0, BOUNCE.p1, BOUNCE.p2, BOUNCE.p3).y;
  });

  const ballOpacity = useTransform(progress, [0, 0.04, 0.9, 0.98], [0, 1, 1, 0]);
  // Ball shrinks slightly during flight, pops on pitch, then shrinks to batsman
  const ballScale = useTransform(progress,
    [0, PITCH_T - 0.05, PITCH_T, PITCH_T + 0.05, 1],
    [0.7, 1.0, 1.35, 1.1, 0.8],
  );

  // ── Pitch-spot flash ──
  const pitchFlashOpacity = useTransform(progress,
    [PITCH_T - 0.04, PITCH_T, PITCH_T + 0.06, PITCH_T + 0.15],
    [0, 1, 0.6, 0],
  );
  const pitchFlashScale = useTransform(progress,
    [PITCH_T - 0.02, PITCH_T + 0.1],
    [0.3, 2.0],
  );

  // ── Impact flash at batsman end ──
  const impactOpacity = useTransform(progress, [0.88, 0.93, 0.97, 1], [0, 0.9, 0.4, 0]);
  const impactScale = useTransform(progress, [0.88, 0.97, 1], [0.3, 1.6, 2.0]);

  if (!playing) return null;

  return (
    <svg
      className="cricket-action-layer"
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 6 }}
    >
      <defs>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur1" />
          <feGaussianBlur stdDeviation="10" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="flight-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4af5c7" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#38e8d0" stopOpacity="0.75" />
        </linearGradient>

        <linearGradient id="bounce-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="1" />
        </linearGradient>

        <radialGradient id="ball-glow">
          <stop offset="0%" stopColor="#ff6b4a" stopOpacity="1" />
          <stop offset="40%" stopColor="#e05540" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d44a3a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── SEGMENT 1: Flight trail ── */}
      <motion.path
        d={flightD} fill="none" stroke="#4af5c7"
        strokeWidth="12" strokeLinecap="round" pathLength="1" opacity="0.08"
        style={{ strokeDasharray: 1, strokeDashoffset: flightDraw }}
      />
      <motion.path
        d={flightD} fill="none" stroke="url(#flight-grad)"
        strokeWidth="2.5" strokeLinecap="round" filter="url(#neon-glow)"
        pathLength="1" strokeDasharray="8 4"
        style={{ strokeDasharray: '8 4', strokeDashoffset: flightDraw, opacity: flightOpacity }}
      />

      {/* ── Pitch spot flash ── */}
      <motion.circle
        cx={PITCH_SPOT.x} cy={PITCH_SPOT.y} r="12"
        fill="none" stroke="#f3d88a" strokeWidth="2.5" filter="url(#neon-glow)"
        style={{
          opacity: pitchFlashOpacity,
          scale: pitchFlashScale,
          transformOrigin: `${PITCH_SPOT.x}px ${PITCH_SPOT.y}px`,
        }}
      />
      <motion.circle
        cx={PITCH_SPOT.x} cy={PITCH_SPOT.y} r="5"
        fill="#f3d88a"
        style={{
          opacity: pitchFlashOpacity,
          transformOrigin: `${PITCH_SPOT.x}px ${PITCH_SPOT.y}px`,
        }}
      />

      {/* ── SEGMENT 2: After-pitch trail (solid, brighter — seam movement) ── */}
      <motion.path
        d={bounceD} fill="none" stroke="#22d3ee"
        strokeWidth="14" strokeLinecap="round" pathLength="1" opacity="0.1"
        style={{ strokeDasharray: 1, strokeDashoffset: bounceDraw }}
      />
      <motion.path
        d={bounceD} fill="none" stroke="url(#bounce-grad)"
        strokeWidth="3.5" strokeLinecap="round" filter="url(#neon-glow)" pathLength="1"
        style={{ strokeDasharray: 1, strokeDashoffset: bounceDraw, opacity: bounceOpacity }}
      />

      {/* ── Moving ball (follows both segments via useTransform) ── */}
      <motion.g style={{ x: ballX, y: ballY, scale: ballScale, opacity: ballOpacity }}>
        <circle cx="0" cy="0" r="18" fill="url(#ball-glow)" />
        <circle cx="0" cy="0" r="7" fill="#d44a3a" />
        <circle cx="0" cy="0" r="7" fill="none" stroke="#f8ead6" strokeWidth="1" opacity="0.6" />
      </motion.g>

      {/* ── Impact flash at batsman ── */}
      <motion.circle
        cx={BATSMAN.x} cy={BATSMAN.y} r="20"
        fill="none" stroke="#22d3ee" strokeWidth="3" filter="url(#neon-glow)"
        style={{ opacity: impactOpacity, scale: impactScale, transformOrigin: `${BATSMAN.x}px ${BATSMAN.y}px` }}
      />
      <motion.circle
        cx={BATSMAN.x} cy={BATSMAN.y} r="10"
        fill="#22d3ee" opacity="0.15"
        style={{ opacity: impactOpacity, scale: impactScale, transformOrigin: `${BATSMAN.x}px ${BATSMAN.y}px` }}
      />
    </svg>
  );
}
