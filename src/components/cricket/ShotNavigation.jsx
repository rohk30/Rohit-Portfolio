import { motion, AnimatePresence } from 'framer-motion';

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
      style={{ position: 'absolute', inset: 0, pointerEvents: visible ? 'auto' : 'none', zIndex: 8 }}
      role="navigation"
      aria-label="Cricket shot navigation"
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
  );
}

export default ShotNavigation;
