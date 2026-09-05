/**
 * CricketFieldCanvas — Dark, stylized top-down cricket ground
 *
 * A self-contained scene that renders a broadcast-style overhead cricket field.
 * Dark background with subtle green pitch gradients, neon-accented field markings,
 * and ambient glow — inspired by the Hawk-Eye / broadcast graphics aesthetic.
 *
 * This is the "Scene 2" that replaces the stadium photo when the user clicks
 * "Bowl to explore". All neon delivery/shot animations live inside this scene.
 */
export default function CricketFieldCanvas({ children }) {
  return (
    <div className="cricket-field-canvas" aria-hidden="true">
      {/* Dark radial ground */}
      <div className="cricket-field-canvas__ground" />

      {/* SVG field markings */}
      <svg
        className="cricket-field-canvas__svg"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Outfield gradient — dark green, lighter toward center */}
          <radialGradient id="field-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a4a28" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#143a1e" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0a1e10" stopOpacity="1" />
          </radialGradient>

          {/* Pitch strip gradient — lighter green */}
          <linearGradient id="pitch-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e5c30" />
            <stop offset="25%" stopColor="#2a7a3c" />
            <stop offset="50%" stopColor="#2e8842" />
            <stop offset="75%" stopColor="#2a7a3c" />
            <stop offset="100%" stopColor="#1e5c30" />
          </linearGradient>

          {/* Neon glow for markings */}
          <filter id="field-line-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Ambient light on the pitch */}
          <filter id="pitch-ambient" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Outfield — dark green ellipse */}
        <ellipse
          cx="400" cy="400" rx="370" ry="370"
          fill="url(#field-gradient)"
        />

        {/* Boundary rope */}
        <ellipse
          cx="400" cy="400" rx="360" ry="360"
          fill="none"
          stroke="rgba(74, 245, 199, 0.12)"
          strokeWidth="2"
        />

        {/* 30-yard circle */}
        <ellipse
          cx="400" cy="400" rx="200" ry="200"
          fill="none"
          stroke="rgba(74, 245, 199, 0.1)"
          strokeWidth="1.5"
          strokeDasharray="12 8"
        />

        {/* Pitch ambient glow */}
        <rect
          x="370" y="240" width="60" height="320" rx="6"
          fill="rgba(46, 136, 66, 0.3)"
          filter="url(#pitch-ambient)"
        />

        {/* Pitch strip */}
        <rect
          x="374" y="250" width="52" height="300" rx="3"
          fill="url(#pitch-gradient)"
          stroke="rgba(74, 245, 199, 0.08)"
          strokeWidth="1"
        />

        {/* Pitch stripe pattern — mowing lines */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <rect
            key={i}
            x="374"
            y={250 + i * 30}
            width="52"
            height="15"
            fill={i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}
          />
        ))}

        {/* Bowling crease — bowler's end */}
        <line
          x1="360" y1="290" x2="440" y2="290"
          stroke="rgba(247, 240, 226, 0.45)"
          strokeWidth="1.5"
          filter="url(#field-line-glow)"
        />

        {/* Popping crease — bowler's end */}
        <line
          x1="355" y1="305" x2="445" y2="305"
          stroke="rgba(247, 240, 226, 0.55)"
          strokeWidth="1.5"
          filter="url(#field-line-glow)"
        />

        {/* Return creases — bowler's end */}
        <line x1="365" y1="290" x2="365" y2="310" stroke="rgba(247, 240, 226, 0.25)" strokeWidth="1" />
        <line x1="435" y1="290" x2="435" y2="310" stroke="rgba(247, 240, 226, 0.25)" strokeWidth="1" />

        {/* Bowling crease — batsman's end */}
        <line
          x1="360" y1="510" x2="440" y2="510"
          stroke="rgba(247, 240, 226, 0.45)"
          strokeWidth="1.5"
          filter="url(#field-line-glow)"
        />

        {/* Popping crease — batsman's end */}
        <line
          x1="355" y1="495" x2="445" y2="495"
          stroke="rgba(247, 240, 226, 0.55)"
          strokeWidth="1.5"
          filter="url(#field-line-glow)"
        />

        {/* Return creases — batsman's end */}
        <line x1="365" y1="490" x2="365" y2="510" stroke="rgba(247, 240, 226, 0.25)" strokeWidth="1" />
        <line x1="435" y1="490" x2="435" y2="510" stroke="rgba(247, 240, 226, 0.25)" strokeWidth="1" />

        {/* Stumps — bowler's end */}
        <rect x="395" y="287" width="2" height="8" rx="0.5" fill="rgba(247, 240, 226, 0.6)" />
        <rect x="399" y="287" width="2" height="8" rx="0.5" fill="rgba(247, 240, 226, 0.6)" />
        <rect x="403" y="287" width="2" height="8" rx="0.5" fill="rgba(247, 240, 226, 0.6)" />

        {/* Stumps — batsman's end */}
        <rect x="395" y="505" width="2" height="8" rx="0.5" fill="rgba(247, 240, 226, 0.6)" />
        <rect x="399" y="505" width="2" height="8" rx="0.5" fill="rgba(247, 240, 226, 0.6)" />
        <rect x="403" y="505" width="2" height="8" rx="0.5" fill="rgba(247, 240, 226, 0.6)" />

        {/* Subtle circuit-board / tech texture lines on outfield */}
        <g opacity="0.04" stroke="rgba(74, 245, 199, 1)" strokeWidth="0.5">
          <line x1="400" y1="30" x2="400" y2="770" />
          <line x1="30" y1="400" x2="770" y2="400" />
          <line x1="145" y1="145" x2="655" y2="655" />
          <line x1="655" y1="145" x2="145" y2="655" />
        </g>

        {/* Corner dots — subtle tech accents */}
        {[
          [400, 50], [400, 750], [50, 400], [750, 400],
          [145, 145], [655, 145], [145, 655], [655, 655],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3" fill="rgba(74, 245, 199, 0.08)" />
        ))}
      </svg>

      {/* Children slot — delivery trail, shot ball, shot targets render here */}
      {children}
    </div>
  );
}
