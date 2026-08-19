import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';
import { BALL_TRAJECTORY_CONFIG } from '../../config/animationPhases.js';

/**
 * BallTrajectory Component
 *
 * Animates a cricket ball along a cubic bezier curve from the batsman position
 * to the selected shot target position. Uses Framer Motion's animate function
 * with custom cubic-bezier easing for a natural ball flight feel.
 *
 * The ball travels along an SVG path defined by a cubic bezier curve, with
 * control points calculated to create an arc between the start and end positions.
 *
 * @param {object} props
 * @param {{ x: number, y: number }} props.from - Start position (batsman, % of viewBox)
 * @param {{ x: number, y: number }} props.to - End position (shot target, % of viewBox)
 * @param {() => void} props.onComplete - Callback fired when trajectory animation finishes
 * @param {number} [props.duration=800] - Animation duration in ms (600–1000)
 *
 * @validates Requirements 3.3, 3.4, 8.4, 8.5
 */
function BallTrajectory({ from, to, onComplete, duration = 800 }) {
  const ballRef = useRef(null);
  const animationRef = useRef(null);

  // Clamp duration to allowed range
  const clampedDuration = Math.min(
    BALL_TRAJECTORY_CONFIG.duration.max,
    Math.max(BALL_TRAJECTORY_CONFIG.duration.min, duration)
  );

  // Calculate bezier control points for a natural arc
  // Control points create a curve that lifts above the straight line between from and to
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  // Offset control points perpendicular to the line between from/to for a nice arc
  const arcHeight = Math.abs(dx + dy) * 0.15;
  const cx1 = from.x + dx * 0.25 - arcHeight * 0.5;
  const cy1 = from.y + dy * 0.25 - arcHeight;
  const cx2 = from.x + dx * 0.75 + arcHeight * 0.5;
  const cy2 = from.y + dy * 0.75 - arcHeight * 0.3;

  // SVG cubic bezier path
  const pathD = `M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`;

  useEffect(() => {
    const ball = ballRef.current;
    if (!ball) return;

    // Get the SVG path element to calculate points along the curve
    const pathEl = ball.closest('svg')?.querySelector('[data-trajectory-path]');
    if (!pathEl) {
      // Fallback: fire onComplete immediately if path not found
      onComplete();
      return;
    }

    const totalLength = pathEl.getTotalLength();

    // Animate progress from 0 to 1 along the path
    animationRef.current = animate(0, 1, {
      duration: clampedDuration / 1000, // convert ms to seconds
      ease: BALL_TRAJECTORY_CONFIG.easing,
      onUpdate: (progress) => {
        // Get the point at the current progress along the path
        const point = pathEl.getPointAtLength(progress * totalLength);
        if (ball) {
          ball.setAttribute('cx', point.x);
          ball.setAttribute('cy', point.y);
        }
      },
      onComplete: () => {
        onComplete();
      },
    });

    return () => {
      // Cleanup animation on unmount
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [from.x, from.y, to.x, to.y, clampedDuration, onComplete]);

  // Ball diameter is 18px as specified in design (radius = 9 in viewBox units)
  const ballRadius = 9;

  return (
    <g aria-hidden="true">
      {/* Invisible bezier path that the ball follows */}
      <path
        d={pathD}
        data-trajectory-path
        fill="none"
        stroke="none"
        pointerEvents="none"
      />

      {/* Animated ball - red circle */}
      <circle
        ref={ballRef}
        cx={from.x}
        cy={from.y}
        r={ballRadius}
        fill={BALL_TRAJECTORY_CONFIG.ballColor}
      />
    </g>
  );
}

export default BallTrajectory;
