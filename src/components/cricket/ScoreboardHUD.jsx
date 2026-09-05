import { motion } from 'framer-motion';

/**
 * ScoreboardHUD — Broadcast-style match graphics
 *
 * Positioned outside the boundary ring on the dark field canvas.
 * Top-left: match info / score summary
 * Bottom-right: bowler & batsman stats
 *
 * All data is decorative / sample — purely for atmosphere.
 */
export default function ScoreboardHUD({ visible, reducedMotion = false }) {
  const dur = reducedMotion ? 0.01 : 0.6;

  return (
    <>
      {/* ── Top-left: Match scoreboard ── */}
      <motion.div
        className="hud-scoreboard"
        initial={{ opacity: 0, x: -20 }}
        animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: dur, delay: visible ? 0.3 : 0 }}
        aria-hidden="true"
      >
        <div className="hud-scoreboard__header">
          <span className="hud-scoreboard__badge">MATCH DAY</span>
        </div>
        <div className="hud-scoreboard__stats">
          <div className="hud-scoreboard__stat">
            <span className="hud-scoreboard__label">OVERS</span>
            <span className="hud-scoreboard__value">15.4</span>
          </div>
          <div className="hud-scoreboard__divider" />
          <div className="hud-scoreboard__stat">
            <span className="hud-scoreboard__label">RUNS</span>
            <span className="hud-scoreboard__value">124/3</span>
          </div>
          <div className="hud-scoreboard__divider" />
          <div className="hud-scoreboard__stat">
            <span className="hud-scoreboard__label">RUN RATE</span>
            <span className="hud-scoreboard__value">7.91</span>
          </div>
        </div>
      </motion.div>

      {/* ── Bottom-right: Bowler & Batsman ── */}
      <motion.div
        className="hud-players"
        initial={{ opacity: 0, x: 20 }}
        animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: dur, delay: visible ? 0.5 : 0 }}
        aria-hidden="true"
      >
        <div className="hud-players__row">
          <span className="hud-players__role">BOWLER</span>
          <span className="hud-players__name">ANDERSON</span>
          <span className="hud-players__detail">(FAST)</span>
          <span className="hud-players__figures">3-0-22-1</span>
        </div>
        <div className="hud-players__separator" />
        <div className="hud-players__row">
          <span className="hud-players__role">BATSMAN</span>
          <span className="hud-players__name">ROHIT K.</span>
          <span className="hud-players__detail">(82*)</span>
          <span className="hud-players__figures">96b · 9×4 · 2×6</span>
        </div>
      </motion.div>

      {/* ── Top-right: This over ── */}
      <motion.div
        className="hud-over"
        initial={{ opacity: 0, y: -10 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: dur, delay: visible ? 0.7 : 0 }}
        aria-hidden="true"
      >
        <span className="hud-over__label">THIS OVER</span>
        <div className="hud-over__balls">
          <span className="hud-over__ball hud-over__ball--run">1</span>
          <span className="hud-over__ball hud-over__ball--dot">·</span>
          <span className="hud-over__ball hud-over__ball--four">4</span>
          <span className="hud-over__ball hud-over__ball--run">2</span>
        </div>
      </motion.div>
    </>
  );
}
