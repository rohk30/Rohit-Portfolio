import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import stadiumImage from '../../assets/images/cricket-stadium-hero.png';

import CricketFieldCanvas from './CricketFieldCanvas.jsx';
import ScoreboardHUD from './ScoreboardHUD.jsx';
import ShotNavigation from './ShotNavigation.jsx';
import PitchActionSequence from './PitchActionSequence.jsx';
import ShotBall from './ShotBall.jsx';
import ShotResultPopup from './ShotResultPopup.jsx';
import CricketErrorBoundary from './CricketErrorBoundary.jsx';
import { SHOT_TARGETS } from '../../config/shotNavigation.js';
import { useCricketNav } from '../../context/CricketNavContext.jsx';
import { focusSectionHeading } from '../../utils/focusManagement.js';

/**
 * CricketGroundHero — Two-scene architecture
 *
 * Scene 1 (idle/returning): Stadium photo + identity overlay + CTA
 * Scene 2 (playing): Dark top-down cricket field + neon animations
 *
 * States: idle → returning → playing → complete → shot → result → idle
 *                                        ↑ user picks shot    ↑ popup done → navigate
 */
const BATSMAN_ORIGIN = { x: 50, y: 63.75 };

function CricketGroundHero() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const { isNavigationLocked, lockNavigation, unlockNavigation, markSectionVisited } = useCricketNav();

  // States: 'idle' | 'returning' | 'playing' | 'complete' | 'shot' | 'result'
  const [animationState, setAnimationState] = useState('idle');
  const [selectedShot, setSelectedShot] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  const startExperience = useCallback(() => {
    setSelectedShot(null);
    setCameraReady(false);
    setAnimationState('transitioning');
  }, []);

  const startReturning = useCallback(() => {
    setSelectedShot(null);
    setCameraReady(false);
    setAnimationState('returning');
  }, []);

  // Auto-start if navigated back with state
  useEffect(() => {
    if (location.state?.startCricket) {
      startReturning();
      navigate('/', { replace: true, state: null });
    }
  }, [location.state, navigate, startReturning]);

  // 'returning' → show stadium for 1.5s, then transition to 'playing'
  useEffect(() => {
    if (animationState !== 'returning') return undefined;
    const timer = setTimeout(() => {
      setAnimationState('playing');
    }, 1500);
    return () => clearTimeout(timer);
  }, [animationState]);

  // 'transitioning' → hold stadium for 1.2s after button press, then go to field
  useEffect(() => {
    if (animationState !== 'transitioning') return undefined;
    const timer = setTimeout(() => {
      setAnimationState('playing');
    }, 1200);
    return () => clearTimeout(timer);
  }, [animationState]);

  const handleDeliveryComplete = useCallback(() => {
    setCameraReady(true);
    setAnimationState('complete');
  }, []);

  const handleShotSelect = useCallback((shot) => {
    if (isNavigationLocked) return;
    lockNavigation();
    setSelectedShot(shot);
    setAnimationState('shot');
  }, [isNavigationLocked, lockNavigation]);

  // Trajectory done → show result popup
  const handleTrajectoryComplete = useCallback(() => {
    if (!selectedShot) return;
    setAnimationState('result');
  }, [selectedShot]);

  // Result popup done → navigate away
  const handleResultDone = useCallback(() => {
    if (!selectedShot) return;
    markSectionVisited(selectedShot.path);
    unlockNavigation();
    navigate(selectedShot.path);
    setSelectedShot(null);
    setAnimationState('idle');
    focusSectionHeading();
  }, [selectedShot, markSectionVisited, unlockNavigation, navigate]);

  const reduce = prefersReducedMotion ?? false;

  useEffect(() => {
    if (reduce && animationState === 'idle') {
      setAnimationState('complete');
      setCameraReady(true);
    }
  }, [reduce, animationState]);

  const isFieldScene = animationState === 'playing' || animationState === 'complete'
    || animationState === 'shot' || animationState === 'result';
  const isStadiumVisible = animationState === 'idle' || animationState === 'returning'
    || animationState === 'transitioning';
  const showTargets = animationState === 'complete';

  return (
    <section className="cricket-hero" aria-label="Cinematic cricket-themed portfolio navigation">

      {/* ── Scene 1: Stadium photo ── */}
      <AnimatePresence>
        {isStadiumVisible && (
          <motion.div
            className="cricket-hero__scene"
            key="stadium-scene"
            initial={{ opacity: animationState === 'returning' ? 0 : 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.01 : 1.0, ease: 'easeInOut' }}
          >
            <div className="cricket-hero__camera">
              <img
                className="cricket-hero__stadium"
                src={stadiumImage}
                alt="A packed cricket stadium at golden hour"
              />
              <div className="cricket-hero__field-atmosphere" aria-hidden="true" />
              <div className="cricket-hero__pitch-vignette" aria-hidden="true" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scene 2: Dark top-down field ── */}
      <AnimatePresence>
        {isFieldScene && (
          <motion.div
            className="cricket-hero__scene"
            key="field-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.01 : 1.0, ease: 'easeInOut' }}
          >
            <CricketFieldCanvas>
              <CricketErrorBoundary>
                <PitchActionSequence
                  playing={isFieldScene}
                  onDeliveryComplete={handleDeliveryComplete}
                  reducedMotion={reduce}
                />
              </CricketErrorBoundary>

              {selectedShot && animationState === 'shot' && (
                <CricketErrorBoundary>
                  <ShotBall
                    from={BATSMAN_ORIGIN}
                    to={selectedShot.position}
                    onComplete={handleTrajectoryComplete}
                    reducedMotion={reduce}
                    shotId={selectedShot.id}
                    trajectory={selectedShot.trajectory}
                  />
                </CricketErrorBoundary>
              )}

              <CricketErrorBoundary>
                <ShotNavigation
                  visible={showTargets}
                  shots={SHOT_TARGETS}
                  onShotSelect={handleShotSelect}
                />
              </CricketErrorBoundary>
            </CricketFieldCanvas>

            <ScoreboardHUD visible={isFieldScene} reducedMotion={reduce} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Shot result popup ── */}
      <AnimatePresence>
        {animationState === 'result' && selectedShot && (
          <ShotResultPopup
            key="shot-result"
            shot={selectedShot}
            onDone={handleResultDone}
            reducedMotion={reduce}
          />
        )}
      </AnimatePresence>

      {/* ── Welcome text (idle stadium scene) ── */}
      <AnimatePresence>
        {animationState === 'idle' && (
          <motion.div
            className="cricket-hero__welcome"
            key="welcome"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            aria-hidden="true"
          >
            Welcome to Rohit's cricket-themed portfolio
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Identity panel ── */}
      <AnimatePresence>
        {animationState === 'idle' && (
          <motion.div
            className="cricket-hero__identity"
            key="identity"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: reduce ? 0.01 : 0.5 }}
          >
            <span className="cricket-hero__eyebrow">ROHIT KUMAR</span>
            <h1>Software Engineer @ Nielsen</h1>
            <p>Working across AI/ML, intelligent retrieval and production systems.</p>
            <div className="cricket-hero__currently">
              <span>Currently exploring</span>
              <strong>AI × software × systems</strong>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scoremark ── */}
      <AnimatePresence>
        {animationState === 'idle' && (
          <motion.div
            className="cricket-hero__scoremark"
            key="scoremark"
            aria-hidden="true"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span>ROHIT KUMAR</span>
            <span>INNINGS · 01</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bowl to explore CTA ── */}
      <AnimatePresence>
        {animationState === 'idle' && (
          <motion.div
            className="cricket-hero__bowl-cta"
            key="bowl-cta"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <button type="button" onClick={startExperience} aria-label="Bowl to explore the portfolio">
              <span className="cricket-hero__ball-icon" aria-hidden="true" />
              <span>Bowl to explore</span>
              <span className="cricket-hero__cta-arrow" aria-hidden="true">↗</span>
            </button>
            <span>Play a shot to enter a section</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Status messages ── */}
      <AnimatePresence>
        {animationState === 'transitioning' && (
          <motion.div
            className="cricket-hero__action-status"
            key="transitioning-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span>Get ready...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {animationState === 'returning' && (
          <motion.div
            className="cricket-hero__action-status"
            key="returning-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span>Back to the crease</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFieldScene && !cameraReady && (
          <motion.div
            className="cricket-hero__action-status"
            key="action-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span>Play begins</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cameraReady && !selectedShot && animationState === 'complete' && (
          <motion.div
            className="cricket-hero__field-prompt"
            key="field-prompt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Choose a shot to continue
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default CricketGroundHero;
