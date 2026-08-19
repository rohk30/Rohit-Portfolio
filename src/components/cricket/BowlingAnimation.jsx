import { useTransform, useMotionValueEvent, useMotionValue, motion, animate } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { BOWLING_PHASES, MOBILE_CONFIG } from '../../config/animationPhases.js';
import SilhouetteBowler from './SilhouetteBowler';

/**
 * BowlingAnimation Component
 *
 * Scroll-linked or timed animation of a bowler running in and delivering the ball,
 * driven by Framer Motion's useTransform. The animation maps progress (0–1) to
 * three sequential phases:
 *   - Run-up (0–0.4): bowler moves from right to center
 *   - Delivery stride (0.4–0.7): bowler rotates and strides forward
 *   - Ball release (0.7–1.0): ball appears and moves toward batsman
 *
 * Supports two modes:
 *   - 'scroll' (default): driven by an external scrollProgress MotionValue
 *   - 'timed': creates an internal MotionValue animated from 0→1 over timedDuration ms
 *
 * On mobile (<768px), the animation is simplified to a single-step sequence
 * that compresses all phases into the full 0–1 range without intermediate
 * keyframes, requiring ≤50vh of scroll distance (controlled by the parent
 * CricketGroundHero which sets hero height to 150vh on mobile).
 *
 * The scroll-mode animation reverses naturally when scrolling back up because
 * useTransform is inherently bidirectional.
 *
 * @param {object} props
 * @param {import('framer-motion').MotionValue<number>} [props.scrollProgress] - Normalized scroll value (0 to 1), used in scroll mode
 * @param {() => void} props.onDeliveryComplete - Called when progress reaches 1.0
 * @param {boolean} [props.mobile=false] - When true, uses simplified single-step animation
 * @param {'scroll' | 'timed'} [props.mode='scroll'] - Animation mode
 * @param {number} [props.timedDuration=2000] - Duration in ms for timed mode animation
 *
 * @validates Requirements 2.1, 2.2, 2.3, 2.6, 2.7, 7.1, 7.2, 8.1, 8.2, 8.3, 8.7, 8.8
 */
function BowlingAnimation({ scrollProgress, onDeliveryComplete, mobile: mobileProp, mode = 'scroll', timedDuration = 2000 }) {
  const deliveryFiredRef = useRef(false);

  // Internal progress value for timed mode
  const internalProgress = useMotionValue(0);

  // Detect mobile viewport if not explicitly provided via prop
  const [isMobileViewport, setIsMobileViewport] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_CONFIG.breakpoint
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobileViewport(window.innerWidth < MOBILE_CONFIG.breakpoint);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = mobileProp !== undefined ? mobileProp : isMobileViewport;

  // --- Timed mode: animate internal progress from 0→1 over timedDuration ms ---
  useEffect(() => {
    if (mode !== 'timed') return;

    // Reset progress to 0 before starting
    internalProgress.set(0);
    deliveryFiredRef.current = false;

    const controls = animate(internalProgress, 1, {
      duration: timedDuration / 1000, // framer-motion uses seconds
      ease: 'linear',
      onComplete: () => {
        if (!deliveryFiredRef.current) {
          deliveryFiredRef.current = true;
          onDeliveryComplete();
        }
      },
    });

    return () => controls.stop();
  }, [mode, timedDuration, internalProgress, onDeliveryComplete]);

  // Select the appropriate progress source based on mode
  const progress = mode === 'timed' ? internalProgress : scrollProgress;

  // --- Bowler transforms mapped to progress ---
  // Desktop: multi-phase with intermediate keyframes
  // Mobile: single-step linear interpolation from start to end (simplified)

  const bowlerX = useTransform(
    progress,
    isMobile
      ? [0, 1]                // Single-step: start → end
      : [
          BOWLING_PHASES.RUNUP.start,
          BOWLING_PHASES.RUNUP.end,
          BOWLING_PHASES.DELIVERY_STRIDE.end,
          BOWLING_PHASES.BALL_RELEASE.end,
        ],
    isMobile
      ? [120, 10]             // Compressed: directly from start to delivery position
      : [120, 60, 30, 10]
  );

  const bowlerY = useTransform(
    progress,
    isMobile
      ? [0, 1]
      : [
          BOWLING_PHASES.RUNUP.start,
          BOWLING_PHASES.RUNUP.end,
          BOWLING_PHASES.DELIVERY_STRIDE.end,
          BOWLING_PHASES.BALL_RELEASE.end,
        ],
    isMobile
      ? [0, 50]
      : [0, 20, 40, 50]
  );

  const bowlerRotate = useTransform(
    progress,
    isMobile
      ? [0, 1]                // Single-step rotation
      : [
          BOWLING_PHASES.RUNUP.start,
          BOWLING_PHASES.RUNUP.end,
          BOWLING_PHASES.DELIVERY_STRIDE.start,
          BOWLING_PHASES.DELIVERY_STRIDE.end,
          BOWLING_PHASES.BALL_RELEASE.end,
        ],
    isMobile
      ? [0, -35]             // Compressed: no intermediate rotation steps
      : [0, 0, 0, -25, -35]
  );

  // --- Ball transforms (appears only during BALL_RELEASE phase) ---
  // Mobile: ball appears at progress 0.5 (halfway through the single-step)
  const ballOpacity = useTransform(
    progress,
    isMobile
      ? [0.49, 0.5, 1]
      : [
          BOWLING_PHASES.BALL_RELEASE.start - 0.01,
          BOWLING_PHASES.BALL_RELEASE.start,
          BOWLING_PHASES.BALL_RELEASE.end,
        ],
    [0, 1, 1]
  );

  const ballX = useTransform(
    progress,
    isMobile
      ? [0.5, 1]
      : [BOWLING_PHASES.BALL_RELEASE.start, BOWLING_PHASES.BALL_RELEASE.end],
    [10, -60]
  );

  const ballY = useTransform(
    progress,
    isMobile
      ? [0.5, 1]
      : [BOWLING_PHASES.BALL_RELEASE.start, BOWLING_PHASES.BALL_RELEASE.end],
    [50, 80]
  );

  // --- Fire onDeliveryComplete when progress reaches 1.0 (scroll mode only) ---
  // In timed mode, the animate() onComplete callback handles this instead.
  useMotionValueEvent(progress, 'change', (latest) => {
    if (mode !== 'scroll') return;
    if (latest >= 1.0 && !deliveryFiredRef.current) {
      deliveryFiredRef.current = true;
      onDeliveryComplete();
    } else if (latest < 1.0) {
      // Reset so callback can fire again if user scrolls back and forward
      deliveryFiredRef.current = false;
    }
  });

  return (
    <svg
      viewBox="0 0 200 120"
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{ overflow: 'visible', position: 'absolute', inset: 0 }}
    >
      {/* Animated bowler silhouette */}
      <SilhouetteBowler
        x={bowlerX}
        y={bowlerY}
        rotate={bowlerRotate}
        scale={0.8}
        fill="#1a1a2e"
      />

      {/* Cricket ball - red circle, 18px diameter (9px radius in viewBox units) */}
      <motion.circle
        cx="100"
        cy="60"
        r="9"
        fill="#8b1a1a"
        style={{
          x: ballX,
          y: ballY,
          opacity: ballOpacity,
        }}
      />
    </svg>
  );
}

export default BowlingAnimation;
