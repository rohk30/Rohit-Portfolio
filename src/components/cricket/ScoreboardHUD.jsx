import { motion } from 'framer-motion';

/**
 * ScoreboardHUD — Broadcast-style match graphics
 *
 * Top-left:     Match scoreboard (overs, runs, run rate)
 * Top-right:    This over balls
 * Bottom-left:  Bowler card
 * Bottom-right: Batsman card
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

      {/* ── Bottom-left: Bowler card ── */}
      <motion.div
        className="hud-player-card hud-player-card--bowler"
        initial={{ opacity: 0, x: -20 }}
        animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: dur, delay: visible ? 0.5 : 0 }}
        aria-hidden="true"
      >
        <span className="hud-player-card__role">BOWLER</span>
        <span className="hud-player-card__name">ANDERSON</span>
        <span className="hud-player-card__detail">(FAST)</span>
        <div className="hud-player-card__figures">3-0-22-1</div>
      </motion.div>

      {/* ── Bottom-right: Batsman card ── */}
      <motion.div
        className="hud-player-card hud-player-card--batsman"
        initial={{ opacity: 0, x: 20 }}
        animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: dur, delay: visible ? 0.5 : 0 }}
        aria-hidden="true"
      >
        <span className="hud-player-card__role">BATSMAN</span>
        <span className="hud-player-card__name">ROHIT K.</span>
        <span className="hud-player-card__detail">(62*)</span>
        <div className="hud-player-card__figures">39b · 9×4 · 2×6</div>
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
