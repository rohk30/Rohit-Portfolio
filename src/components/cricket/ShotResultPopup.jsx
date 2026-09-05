import { motion } from 'framer-motion';

/**
 * ShotResultPopup — Broadcast-style shot result card
 *
 * Appears top-center after a shot is played, showing the result
 * (SIX, FOUR, TWO RUNS, DOT BALL, CAUGHT AT SLIP) with the
 * shot name underneath. Styled per result type with distinct colors.
 *
 * Automatically calls `onDone` after a display period so the hero
 * can proceed with navigation.
 */

const TYPE_STYLES = {
  six:    { accent: '#e6bd69', bg: 'rgba(230, 189, 105, 0.14)', border: 'rgba(230, 189, 105, 0.4)' },
  four:   { accent: '#4af5c7', bg: 'rgba(74, 245, 199, 0.12)', border: 'rgba(74, 245, 199, 0.35)' },
  run:    { accent: '#f7f0e2', bg: 'rgba(247, 240, 226, 0.08)', border: 'rgba(247, 240, 226, 0.2)' },
  dot:    { accent: 'rgba(247, 240, 226, 0.5)', bg: 'rgba(247, 240, 226, 0.04)', border: 'rgba(247, 240, 226, 0.12)' },
  wicket: { accent: '#e65a48', bg: 'rgba(230, 90, 72, 0.14)', border: 'rgba(230, 90, 72, 0.4)' },
};

export default function ShotResultPopup({ shot, onDone, reducedMotion = false }) {
  if (!shot?.result) return null;

  const { result, label: shotName } = shot;
  const style = TYPE_STYLES[result.type] || TYPE_STYLES.run;

  return (
    <motion.div
      className="shot-result-popup"
      initial={{ opacity: 0, y: -20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.9 }}
      transition={{
        duration: reducedMotion ? 0.01 : 0.4,
        ease: [0.16, 0.77, 0.2, 1],
      }}
      onAnimationComplete={(definition) => {
        // Only fire after the enter animation, not exit
        if (definition.opacity === 1) {
          const delay = reducedMotion ? 50 : 1600;
          setTimeout(() => onDone?.(), delay);
        }
      }}
      style={{
        '--popup-accent': style.accent,
        '--popup-bg': style.bg,
        '--popup-border': style.border,
      }}
    >
      {/* Runs number / WICKET */}
      <span className="shot-result-popup__runs">
        {result.type === 'wicket' ? 'W' : result.runs}
      </span>

      {/* Result label */}
      <span className="shot-result-popup__label">{result.label}</span>

      {/* Shot name */}
      <span className="shot-result-popup__shot">{shotName}</span>
    </motion.div>
  );
}
