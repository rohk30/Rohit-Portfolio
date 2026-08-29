import { motion } from 'framer-motion';

/**
 * SilhouetteBowler Component
 *
 * Renders a professional cricket fast bowler SVG silhouette using cubic bezier
 * path curves. The figure depicts a fast bowling delivery action: bowling arm
 * extended above the head at the point of release, front leg braced forward,
 * back leg trailing, side-on shoulder alignment.
 *
 * Cricket-specific details: trouser leg shapes widening below the knee,
 * bowling hand visible at arm terminus, front-arm counterbalance forward
 * of the chest.
 *
 * Bounding box: ≤40 units wide × ≤60 units tall at scale=1 within a 200×120
 * viewBox coordinate system.
 *
 * Accepts animated transform props (x, y, rotate) driven by Framer Motion's
 * useTransform during bowling animation phases (run-up, delivery stride,
 * ball release).
 *
 * This is a purely decorative element and is hidden from assistive technology.
 *
 * @param {object} props
 * @param {import('framer-motion').MotionValue|number} [props.x=0] - Horizontal position offset
 * @param {import('framer-motion').MotionValue|number} [props.y=0] - Vertical position offset
 * @param {import('framer-motion').MotionValue|number} [props.rotate=0] - Rotation in degrees
 * @param {number} [props.scale=1] - Uniform scale factor
 * @param {string} [props.fill='#1a1a2e'] - Fill color for the silhouette
 * @param {string} [props.className] - Additional CSS class names
 *
 * @validates Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */
function SilhouetteBowler({
  x = 0,
  y = 0,
  rotate = 0,
  scale = 1,
  fill = '#1a1a2e',
  className,
}) {
  return (
    <motion.g
      aria-hidden="true"
      className={className}
      style={{ x, y, rotate, scale }}
    >
      {/* Head - oval, bowler looking toward batsman end, side-on */}
      <path
        d="M 0,-28 C -2.5,-28 -4,-26.5 -4,-24.5 C -4,-22.5 -2.5,-21 0,-21 C 2.5,-21 4,-22.5 4,-24.5 C 4,-26.5 2.5,-28 0,-28 Z"
        fill={fill}
      />

      {/* Torso - side-on bowling action lean, chest angled */}
      <path
        d="M -2,-21 C -5,-20 -6,-17.5 -6,-14.5 C -6,-12 -5.5,-9.5 -4.5,-7 C -3.5,-5.5 -1.5,-4.5 0.5,-4.5 C 3,-4.5 4.5,-5.5 5.5,-7 C 6.5,-9.5 6.5,-12 5.5,-14.5 C 4.5,-17 2,-20 0,-21 Z"
        fill={fill}
      />

      {/* Bowling arm - extended above head at point of release with hand */}
      <path
        d="M -3,-18 C -5,-20 -7.5,-23 -9,-26 C -10.5,-28.5 -11.5,-30.5 -11,-32 C -10.5,-33 -9.5,-33.5 -8.5,-33 C -7.5,-32.5 -7,-31 -6.5,-29.5 C -5.5,-27 -5,-24.5 -4,-22 C -3.5,-20 -3,-19 -3,-18"
        fill={fill}
      />

      {/* Front arm - counterbalance extended forward and downward */}
      <path
        d="M 3.5,-16 C 5.5,-15 8,-13 10,-11 C 11.5,-9.5 12.5,-8 12.5,-6.5 C 12.5,-5.5 11.5,-5 10.5,-5.5 C 9.5,-6 8.5,-7 7.5,-8.5 C 6,-10 5,-12 4,-13.5 C 3.5,-14.5 3.5,-15.5 3.5,-16"
        fill={fill}
      />

      {/* Front leg - braced forward, planted, trouser widens below knee */}
      <path
        d="M -1,-4.5 C -2,-2 -3.5,1.5 -5.5,5 C -7,8 -8.5,11 -9.5,14 C -10,16 -10.5,18 -10.5,20 C -10.5,21.5 -9.5,22 -8,22 C -6.5,22 -6,21 -5.5,19.5 C -5,17 -4.5,14.5 -3.5,12 C -2.5,9 -1.5,6.5 -0.5,4 C 0,2 0,-0.5 0,-3"
        fill={fill}
      />

      {/* Back leg - trailing behind in delivery stride, trouser shape */}
      <path
        d="M 2,-4.5 C 3.5,-2 5.5,1.5 7.5,5 C 9,8 10.5,11 11.5,14 C 12,16 12.5,18 12.5,20 C 12.5,21.5 11.5,22 10,22 C 8.5,22 8,21 8.5,19.5 C 8.5,17 8,14.5 7,12 C 6,9 5,6.5 3.5,4 C 2.5,2 2,-0.5 2,-3"
        fill={fill}
      />

      {/* Bowling hand with ball - grip detail at arm terminus */}
      <path
        d="M -10,-32 C -11,-33.5 -9.5,-34.5 -8,-33.5 C -7,-32.5 -7,-31.5 -8,-31 C -9,-30.5 -10.5,-31 -10,-32 Z"
        fill={fill}
      />
    </motion.g>
  );
}

export default SilhouetteBowler;
