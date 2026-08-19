/**
 * CricketGroundSVG - Top-down cricket field rendered as inline SVG.
 *
 * Layers (bottom to top):
 *   1. Outfield ellipse (green fill)
 *   2. Boundary rope (stroke, slightly inside outfield edge)
 *   3. 30-yard circle (dashed stroke)
 *   4. Pitch strip (lighter green/tan rectangle)
 *   5. Crease lines (popping, bowling, return x2)
 *   6. Decorative marks (aria-hidden)
 *
 * Uses a fixed viewBox so the illustration scales proportionally
 * across viewports from 320px to 2560px.
 */

export default function CricketGroundSVG({
  width = '100%',
  height = '100%',
  className = '',
  showCreaseLines = true,
  show30YardCircle = true,
  compact = false,
}) {
  // ViewBox dimensions — fixed coordinate system for proportional scaling
  const vw = 500;
  const vh = 500;
  const cx = vw / 2; // center x
  const cy = vh / 2; // center y

  // Outfield ellipse radii
  const outfieldRx = 230;
  const outfieldRy = 240;

  // Boundary rope sits slightly inside outfield edge
  const boundaryRx = outfieldRx - 6;
  const boundaryRy = outfieldRy - 6;

  // 30-yard circle radius (relative to center)
  const thirtyYardRadius = compact ? 100 : 120;

  // Pitch dimensions (centered rectangle)
  const pitchWidth = 24;
  const pitchHeight = 140;
  const pitchX = cx - pitchWidth / 2;
  const pitchY = cy - pitchHeight / 2;

  // Crease positions (relative to pitch center)
  const creaseWidth = 38;
  const poppingCreaseOffset = 58; // distance from center
  const bowlingCreaseOffset = 52;
  const returnCreaseLength = 12;

  return (
    <svg
      role="img"
      aria-label="Top-down view of a cricket field showing the outfield, boundary rope, 30-yard circle, pitch, and crease markings"
      width={width}
      height={height}
      viewBox={`0 0 ${vw} ${vh}`}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outfield - green oval */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={outfieldRx}
        ry={outfieldRy}
        fill="#2d8a4e"
        data-layer="outfield"
      />

      {/* Boundary rope - thin stroke inside outfield edge */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={boundaryRx}
        ry={boundaryRy}
        fill="none"
        stroke="#f5f0e8"
        strokeWidth={compact ? 1.5 : 2}
        opacity={0.7}
        data-layer="boundary"
      />

      {/* 30-yard circle - dashed ring */}
      {show30YardCircle && (
        <circle
          cx={cx}
          cy={cy}
          r={thirtyYardRadius}
          fill="none"
          stroke="#f5f0e8"
          strokeWidth={compact ? 1 : 1.5}
          strokeDasharray={compact ? '6 4' : '8 5'}
          opacity={0.5}
          data-layer="30-yard-circle"
        />
      )}

      {/* Pitch strip - lighter green/tan rectangle */}
      <rect
        x={pitchX}
        y={pitchY}
        width={pitchWidth}
        height={pitchHeight}
        fill="#7ab87a"
        rx={2}
        data-layer="pitch"
      />

      {/* Crease lines */}
      {showCreaseLines && (
        <g data-layer="crease-lines">
          {/* Batting end (bottom) - popping crease */}
          <line
            x1={cx - creaseWidth / 2}
            y1={cy + poppingCreaseOffset}
            x2={cx + creaseWidth / 2}
            y2={cy + poppingCreaseOffset}
            stroke="#f5f0e8"
            strokeWidth={1.5}
            opacity={0.85}
            data-crease="popping-batting"
          />

          {/* Batting end (bottom) - bowling crease */}
          <line
            x1={cx - creaseWidth / 2}
            y1={cy + bowlingCreaseOffset}
            x2={cx + creaseWidth / 2}
            y2={cy + bowlingCreaseOffset}
            stroke="#f5f0e8"
            strokeWidth={1.5}
            opacity={0.85}
            data-crease="bowling-batting"
          />

          {/* Batting end - return crease left */}
          <line
            x1={cx - creaseWidth / 2}
            y1={cy + bowlingCreaseOffset}
            x2={cx - creaseWidth / 2}
            y2={cy + bowlingCreaseOffset + returnCreaseLength}
            stroke="#f5f0e8"
            strokeWidth={1.5}
            opacity={0.85}
            data-crease="return-batting-left"
          />

          {/* Batting end - return crease right */}
          <line
            x1={cx + creaseWidth / 2}
            y1={cy + bowlingCreaseOffset}
            x2={cx + creaseWidth / 2}
            y2={cy + bowlingCreaseOffset + returnCreaseLength}
            stroke="#f5f0e8"
            strokeWidth={1.5}
            opacity={0.85}
            data-crease="return-batting-right"
          />

          {/* Bowling end (top) - popping crease */}
          <line
            x1={cx - creaseWidth / 2}
            y1={cy - poppingCreaseOffset}
            x2={cx + creaseWidth / 2}
            y2={cy - poppingCreaseOffset}
            stroke="#f5f0e8"
            strokeWidth={1.5}
            opacity={0.85}
            data-crease="popping-bowling"
          />

          {/* Bowling end (top) - bowling crease */}
          <line
            x1={cx - creaseWidth / 2}
            y1={cy - bowlingCreaseOffset}
            x2={cx + creaseWidth / 2}
            y2={cy - bowlingCreaseOffset}
            stroke="#f5f0e8"
            strokeWidth={1.5}
            opacity={0.85}
            data-crease="bowling-bowling"
          />

          {/* Bowling end - return crease left */}
          <line
            x1={cx - creaseWidth / 2}
            y1={cy - bowlingCreaseOffset}
            x2={cx - creaseWidth / 2}
            y2={cy - bowlingCreaseOffset - returnCreaseLength}
            stroke="#f5f0e8"
            strokeWidth={1.5}
            opacity={0.85}
            data-crease="return-bowling-left"
          />

          {/* Bowling end - return crease right */}
          <line
            x1={cx + creaseWidth / 2}
            y1={cy - bowlingCreaseOffset}
            x2={cx + creaseWidth / 2}
            y2={cy - bowlingCreaseOffset - returnCreaseLength}
            stroke="#f5f0e8"
            strokeWidth={1.5}
            opacity={0.85}
            data-crease="return-bowling-right"
          />
        </g>
      )}

      {/* Decorative marks - center circle and fielding dots */}
      <g aria-hidden="true" data-layer="decorative">
        {/* Center spot */}
        <circle cx={cx} cy={cy} r={2} fill="#f5f0e8" opacity={0.4} />

        {/* Subtle outfield grass lines */}
        {!compact && (
          <>
            <ellipse
              cx={cx}
              cy={cy}
              rx={170}
              ry={178}
              fill="none"
              stroke="#2a5c2a"
              strokeWidth={0.5}
              opacity={0.3}
            />
            <ellipse
              cx={cx}
              cy={cy}
              rx={195}
              ry={205}
              fill="none"
              stroke="#2a5c2a"
              strokeWidth={0.5}
              opacity={0.2}
            />
          </>
        )}
      </g>
    </svg>
  );
}
