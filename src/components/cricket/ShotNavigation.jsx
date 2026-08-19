import { motion, AnimatePresence } from 'framer-motion';

/**
 * ShotNavigation Component
 *
 * Renders 5 clickable shot targets positioned at field locations relative
 * to the batsman origin. Each target is a focusable button with aria-labels
 * that include both the destination section and cricket shot name.
 *
 * Targets appear after delivery completes (controlled by `visible` prop)
 * with a spring fade-in animation via Framer Motion.
 *
 * @param {object} props
 * @param {boolean} props.visible - Controls whether targets are shown
 * @param {import('../../config/shotNavigation.js').ShotTarget[]} props.shots - Array of shot target configs
 * @param {(shot: object) => void} props.onShotSelect - Called when a shot is activated
 * @param {boolean} [props.compact=false] - True when rendered inside PlayNextBallWidget
 *
 * @validates Requirements 3.1, 3.2, 3.5, 3.7, 7.1, 9.1, 9.2
 */
function ShotNavigation({ visible, shots, onShotSelect, compact = false }) {
  const handleKeyDown = (event, shot) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onShotSelect(shot);
    }
  };

  return (
    <div
      className="shot-navigation"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
      role="navigation"
      aria-label="Cricket shot navigation"
    >
      <AnimatePresence>
        {visible &&
          shots.map((shot, index) => (
            <motion.button
              key={shot.id}
              type="button"
              className="shot-target"
              aria-label={shot.ariaLabel}
              onClick={() => onShotSelect(shot)}
              onKeyDown={(e) => handleKeyDown(e, shot)}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: index * 0.08,
              }}
              style={{
                position: 'absolute',
                left: `${shot.position.x}%`,
                top: `${shot.position.y}%`,
                transform: 'translate(-50%, -50%)',
                minWidth: '44px',
                minHeight: '44px',
                padding: compact ? '6px 10px' : '8px 14px',
                background: 'rgba(13, 31, 13, 0.85)',
                border: '2px solid var(--accent-gold, #c9a227)',
                borderRadius: '8px',
                color: 'var(--text, #f5f0e8)',
                fontSize: compact ? '0.7rem' : '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
              }}
            >
              <span className="shot-target__label">{shot.label}</span>
              {shot.subLabel && (
                <span
                  className="shot-target__sublabel"
                  style={{
                    fontSize: compact ? '0.55rem' : '0.65rem',
                    color: 'var(--text-soft, #a8b5a0)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                  }}
                >
                  {shot.subLabel}
                </span>
              )}
            </motion.button>
          ))}
      </AnimatePresence>
    </div>
  );
}

export default ShotNavigation;
