import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import stadiumImage from '../../assets/images/cricket-stadium-hero.png';

import ShotNavigation from './ShotNavigation.jsx';
import PitchActionSequence from './PitchActionSequence.jsx';
import ShotBall from './ShotBall.jsx';
import CricketErrorBoundary from './CricketErrorBoundary.jsx';
import { SHOT_TARGETS } from '../../config/shotNavigation.js';
import { useCricketNav } from '../../context/CricketNavContext.jsx';
import { focusSectionHeading } from '../../utils/focusManagement.js';

const BATSMAN_ORIGIN = { x: 54, y: 65 };

function CricketGroundHero() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const { isNavigationLocked, lockNavigation, unlockNavigation, markSectionVisited } = useCricketNav();

  const [animationState, setAnimationState] = useState('idle');
  const [selectedShot, setSelectedShot] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  const startExperience = useCallback(() => {
    setSelectedShot(null);
    setCameraReady(false);
    setAnimationState('playing');
  }, []);

  useEffect(() => {
    if (location.state?.startCricket) {
      startExperience();
      navigate('/', { replace: true, state: null });
    }
  }, [location.state, navigate, startExperience]);

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

  const handleTrajectoryComplete = useCallback(() => {
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
  const isPlaying = animationState === 'playing' || animationState === 'complete' || animationState === 'shot';
  const showTargets = animationState === 'complete';

  return (
    <section className="cricket-hero" aria-label="Cinematic cricket-themed portfolio navigation">
      <div className={`cricket-hero__scene ${isPlaying ? 'is-playing' : ''} ${cameraReady ? 'is-settled' : ''}`}>
        <motion.div
          className="cricket-hero__camera"
          animate={{
            scale: isPlaying ? 2.18 : 1,
            y: isPlaying ? '2.5%' : '0%',
          }}
          transition={{
            duration: reduce ? 0.01 : 1.65,
            ease: [0.12, 0.74, 0.2, 1],
          }}
        >
          <img className="cricket-hero__stadium" src={stadiumImage} alt="A packed cricket stadium at golden hour" />
          <div className="cricket-hero__field-atmosphere" aria-hidden="true" />
          <div className="cricket-hero__pitch-vignette" aria-hidden="true" />

          <CricketErrorBoundary>
            <PitchActionSequence
              playing={isPlaying}
              onDeliveryComplete={handleDeliveryComplete}
              reducedMotion={reduce}
            />
          </CricketErrorBoundary>

          {selectedShot && (
            <CricketErrorBoundary>
              <ShotBall
                from={BATSMAN_ORIGIN}
                to={selectedShot.position}
                onComplete={handleTrajectoryComplete}
                reducedMotion={reduce}
                shotId={selectedShot.id}
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
        </motion.div>
      </div>

      <div className={`cricket-hero__identity ${isPlaying ? 'is-playing' : ''}`}>
        <span className="cricket-hero__eyebrow">ROHIT KUMAR</span>
        <h1>Software Engineer @ Nielsen</h1>
        <p>Working across AI/ML, intelligent retrieval and production systems.</p>
        <div className="cricket-hero__currently">
          <span>Currently exploring</span>
          <strong>AI × software × systems</strong>
        </div>
      </div>

      <div className="cricket-hero__scoremark" aria-hidden="true">
        <span>ROHIT KUMAR</span>
        <span>INNINGS · 01</span>
      </div>

      {!isPlaying && (
        <motion.div
          className="cricket-hero__bowl-cta"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
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

      {isPlaying && !cameraReady && (
        <motion.div className="cricket-hero__action-status" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <span>Play begins</span>
        </motion.div>
      )}

      {cameraReady && !selectedShot && (
        <motion.div className="cricket-hero__field-prompt" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          Choose a shot to continue
        </motion.div>
      )}
    </section>
  );
}

export default CricketGroundHero;
