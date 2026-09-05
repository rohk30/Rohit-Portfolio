import { motion, AnimatePresence } from 'framer-motion';

/**
 * ShotNavigation — Field position buttons
 *
 * Buttons are positioned as percentages of the cricket field square.
 * The field SVG uses viewBox="0 0 800 800" with preserveAspectRatio="xMidYMid meet",
 * so it renders as a centered square within the viewport. This component
 * wraps its buttons in an identical centered-square container so the %
 * coordinates align perfectly with the SVG field markings.
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
      className={`shot-navigation ${compact ? 'shot-navigation--compact' : ''}`}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 8,
      }}
      role="navigation"
      aria-label="Cricket shot navigation"
    >
      {/* Square container matching the SVG's rendered area */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '100vh',
          aspectRatio: '1 / 1',
          maxHeight: '100%',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <AnimatePresence>
          {visible && shots.map((shot, index) => (
            <motion.button
              key={shot.id}
              type="button"
              className="shot-target"
              aria-label={shot.ariaLabel}
              onClick={() => onShotSelect(shot)}
              onKeyDown={(event) => handleKeyDown(event, shot)}
              initial={{ opacity: 0, scale: 0.55, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 6 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20, delay: index * 0.06 }}
              style={{ left: `${shot.position.x}%`, top: `${shot.position.y}%` }}
            >
              <span className="shot-target__dot" aria-hidden="true" />
              <span className="shot-target__copy">
                <span className="shot-target__label">{shot.label}</span>
                <span className="shot-target__sublabel">{shot.subLabel}</span>
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ShotNavigation;
