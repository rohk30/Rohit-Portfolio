import { useEffect, useMemo, useRef } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

/**
 * ShotBall v4 — Trajectory-aware neon ball paths
 *
 * Each shot type gets a distinct curve shape:
 *   over-boundary  → high parabolic arc that clears the ropes (6)
 *   boundary-arc   → fast, flat arc racing to the boundary (4)
 *   short          → barely travels, dies near the pitch (dot)
 *   scoop-curve    → loops backwards over the keeper (behind batsman)
 *   catch-curve    → edge flies on a wobbling curve to fielder + glove icon
 */

function toField(pct) {
  return { x: (pct.x / 100) * 800, y: (pct.y / 100) * 800 };
}

function cubicPoint(t, p0, p1, p2, p3) {
  const u = 1 - t;
  return {
    x: u ** 3 * p0.x + 3 * u ** 2 * t * p1.x + 3 * u * t ** 2 * p2.x + t ** 3 * p3.x,
    y: u ** 3 * p0.y + 3 * u ** 2 * t * p1.y + 3 * u * t ** 2 * p2.y + t ** 3 * p3.y,
  };
}

function buildCurveD(p0, p1, p2, p3) {
  return `M${p0.x},${p0.y} C${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
}

/** Compute control points based on trajectory type */
function computeControls(f, t, trajectory) {
  const dx = t.x - f.x;
  const dy = t.y - f.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  switch (trajectory) {
    case 'over-boundary': {
      // High parabolic arc — ball clears the ropes
      const perpX = -dy / dist;
      const perpY = dx / dist;
      const arcHeight = dist * 0.55;
      return {
        p0: f,
        p1: { x: f.x + dx * 0.25 + perpX * arcHeight * 0.6, y: f.y + dy * 0.15 + perpY * arcHeight * 0.6 },
        p2: { x: f.x + dx * 0.65 + perpX * arcHeight * 0.4, y: f.y + dy * 0.55 + perpY * arcHeight * 0.4 },
        p3: t,
      };
    }

    case 'straight': {
      // Direct line along the ground — barely any curve
      return {
        p0: f,
        p1: { x: f.x + dx * 0.33, y: f.y + dy * 0.33 },
        p2: { x: f.x + dx * 0.66, y: f.y + dy * 0.66 },
        p3: t,
      };
    }

    case 'boundary-arc': {
      // Fast flat arc — races along the ground to the boundary
      const perpX = -dy / dist;
      const perpY = dx / dist;
      const arcHeight = dist * 0;
      return {
        p0: f,
        p1: { x: f.x + dx * 0.3 + perpX * arcHeight, y: f.y + dy * 0.2 + perpY * arcHeight },
        p2: { x: f.x + dx * 0.7 + perpX * arcHeight * 0.3, y: f.y + dy * 0.7 + perpY * arcHeight * 0.3 },
        p3: t,
      };
    }

    case 'short': {
      // Barely moves — dead bat defence near the pitch
      return {
        p0: f,
        p1: { x: f.x + dx * 0.3, y: f.y + dy * 0.2 },
        p2: { x: f.x + dx * 0.6, y: f.y + dy * 0.7 },
        p3: t,
      };
    }

    case 'scoop-curve': {
      // Loops backwards over the keeper — goes up then behind
      return {
        p0: f,
        p1: { x: f.x - dx * 0.2, y: f.y - Math.abs(dy) * 0.6 },
        p2: { x: t.x + dx * 0.1, y: t.y - Math.abs(dy) * 0.3 },
        p3: t,
      };
    }

    case 'catch-curve': {
      // Edge — slight wobble curve to the fielder
      const perpX = -dy / dist;
      const perpY = dx / dist;
      const wobble = dist * 0.25;
      return {
        p0: f,
        p1: { x: f.x + dx * 0.2 - perpX * wobble * 0.3, y: f.y + dy * 0.15 - perpY * wobble * 0.3 },
        p2: { x: f.x + dx * 0.6 + perpX * wobble * 0.5, y: f.y + dy * 0.5 + perpY * wobble * 0.5 },
        p3: t,
      };
    }

    default: {
      // Fallback generic arc
      return {
        p0: f,
        p1: { x: f.x + dx * 0.25, y: f.y + dy * 0.15 - 20 },
        p2: { x: f.x + dx * 0.7, y: f.y + dy * 0.65 - 8 },
        p3: t,
      };
    }
  }
}

export default function ShotBall({ from, to, onComplete, reducedMotion = false, shotId = '', trajectory = '' }) {
  const progress = useMotionValue(0);
  const completeRef = useRef(false);

  const f = useMemo(() => toField(from), [from]);
  const t = useMemo(() => toField(to), [to]);

  const controls = useMemo(
    () => computeControls(f, t, trajectory),
    [f, t, trajectory],
  );

  const pathD = useMemo(
    () => buildCurveD(controls.p0, controls.p1, controls.p2, controls.p3),
    [controls],
  );

  const isCatch = trajectory === 'catch-curve';
  const isSix = trajectory === 'over-boundary';

  // Slower for big shots, faster for edges/defence
  const duration = isSix ? 1.6 : trajectory === 'short' ? 0.7 : isCatch ? 1.0 : 1.25;

  useEffect(() => {
    completeRef.current = false;
    progress.set(0);
    const animation = animate(progress, 1, {
      duration: reducedMotion ? 0.01 : duration,
      ease: [0.18, 0.74, 0.2, 1],
      onComplete: () => {
        if (!completeRef.current) {
          completeRef.current = true;
          setTimeout(() => onComplete?.(), reducedMotion ? 0 : 350);
        }
      },
    });
    return () => animation.stop();
  }, [progress, reducedMotion, onComplete, duration]);

  // Trail draw
  const trailDraw = useTransform(progress, [0, 0.9], [1, 0]);
  const trailOpacity = useTransform(progress, [0, 0.04, 0.85, 1], [0, 0.95, 0.95, 0.7]);

  // Ball position
  const ballX = useTransform(progress, (p) => cubicPoint(p, controls.p0, controls.p1, controls.p2, controls.p3).x);
  const ballY = useTransform(progress, (p) => cubicPoint(p, controls.p0, controls.p1, controls.p2, controls.p3).y);
  const ballScale = useTransform(progress, [0, 0.45, 1], isSix ? [0.9, 1.5, 0.6] : [0.9, 1.3, 0.75]);
  const ballOpacity = useTransform(progress, [0, 0.03, 0.92, 1], [0, 1, 1, 0.6]);

  // Impact ring
  const impactOpacity = useTransform(progress, [0.85, 0.92, 1], [0, 0.9, 0.5]);
  const impactScale = useTransform(progress, [0.85, 1], [0.4, 1.8]);

  // Glove icon opacity (catch only)
  const gloveOpacity = useTransform(progress, [0.75, 0.88, 1], [0, 1, 0.85]);

  // Trail color: red for wicket, gold for six, teal for everything else
  const trailStroke = isCatch ? '#e65a48' : isSix ? '#e6bd69' : '#22d3ee';
  const trailGlowColor = isCatch ? '#e65a48' : isSix ? '#e6bd69' : '#22d3ee';
  const impactColor = isCatch ? '#e65a48' : isSix ? '#e6bd69' : '#4af5c7';

  return (
    <svg
      className="shot-ball-layer"
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 12 }}
    >
      <defs>
        <filter id="shot-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur1" />
          <feGaussianBlur stdDeviation="10" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="shot-trail-grad" gradientUnits="userSpaceOnUse"
          x1={f.x} y1={f.y} x2={t.x} y2={t.y}>
          <stop offset="0%" stopColor={trailStroke} stopOpacity="0.4" />
          <stop offset="60%" stopColor={trailStroke} stopOpacity="0.9" />
          <stop offset="100%" stopColor={trailStroke} stopOpacity="1" />
        </linearGradient>

        <radialGradient id="shot-ball-glow">
          <stop offset="0%" stopColor="#ff6b4a" stopOpacity="1" />
          <stop offset="45%" stopColor="#e05540" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#d44a3a" stopOpacity="0" />
        </radialGradient>

        <filter id="glove-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Wide soft glow trail */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={trailGlowColor}
        strokeWidth="14"
        strokeLinecap="round"
        pathLength="1"
        opacity="0.1"
        style={{ strokeDasharray: 1, strokeDashoffset: trailDraw }}
      />

      {/* Sharp neon core trail */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#shot-trail-grad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        filter="url(#shot-glow)"
        pathLength="1"
        style={{ strokeDasharray: 1, strokeDashoffset: trailDraw, opacity: trailOpacity }}
      />

      {/* Moving ball */}
      <motion.g style={{ x: ballX, y: ballY, scale: ballScale, opacity: ballOpacity }}>
        <circle cx="0" cy="0" r="18" fill="url(#shot-ball-glow)" />
        <circle cx="0" cy="0" r="7" fill="#d44a3a" />
        <path d="M-5 -4 C-1.5 -1.5 1.5 1.5 5 4" fill="none" stroke="#f8ead6" strokeWidth="1" opacity="0.7" />
      </motion.g>

      {/* Impact effect at target */}
      {!isCatch && (
        <>
          <motion.circle
            cx={t.x} cy={t.y} r="18"
            fill="none" stroke={impactColor} strokeWidth="2.5"
            filter="url(#shot-glow)"
            style={{ opacity: impactOpacity, scale: impactScale, transformOrigin: `${t.x}px ${t.y}px` }}
          />
          <motion.circle
            cx={t.x} cy={t.y} r="8"
            fill={impactColor} opacity="0.15"
            style={{ opacity: impactOpacity, scale: impactScale, transformOrigin: `${t.x}px ${t.y}px` }}
          />
        </>
      )}

      {/* ── Neon glove for caught-at-point ── */}
      {isCatch && (
        <motion.g
          style={{ opacity: gloveOpacity }}
          filter="url(#glove-glow)"
        >
          {/* Scale up and center on the exact target position */}
          <g transform={`translate(${t.x}, ${t.y}) scale(1.4) translate(-28, -26)`}>
            {/* Glove outline — stylized catching hands, neon style */}
            <g stroke="#e65a48" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
              {/* Left glove */}
              <path d="M10 38 L10 22 C10 18 12 14 14 12 L14 6 M18 38 L18 16 C18 12 20 9 22 8 L22 4 M22 38 L22 18" />
              {/* Palm */}
              <path d="M8 38 C8 42 12 46 18 46 L38 46 C44 46 48 42 48 38" />
              {/* Right glove */}
              <path d="M34 38 L34 18 M38 38 L38 16 C38 12 36 9 34 8 L34 4 M42 38 L42 22 C42 18 40 14 38 12 L38 6 M46 38 L46 24" />
              {/* Webbing */}
              <path d="M22 20 C24 16 32 16 34 20" strokeDasharray="2 2" opacity="0.6" />
            </g>
            {/* Ball in the gloves */}
            <circle cx="28" cy="32" r="6" fill="#e65a48" opacity="0.3" />
            <circle cx="28" cy="32" r="3.5" fill="#d44a3a" opacity="0.8" />
            <path d="M25.5 30 C27 31 29 33 30.5 34" fill="none" stroke="#f8ead6" strokeWidth="0.6" opacity="0.6" />
          </g>
        </motion.g>
      )}
    </svg>
  );
}
