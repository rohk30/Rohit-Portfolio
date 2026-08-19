import { useRef, useState, useCallback, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import CricketGroundSVG from './CricketGroundSVG';
import BowlingAnimation from './BowlingAnimation';
import ShotNavigation from './ShotNavigation';
import BallTrajectory from './BallTrajectory';
import SilhouetteBatsman from './SilhouetteBatsman';
import CricketErrorBoundary from './CricketErrorBoundary';
import { SHOT_TARGETS } from '../../config/shotNavigation';
import { MOBILE_CONFIG } from '../../config/animationPhases';
import { useCricketNav } from '../../context/CricketNavContext';
import { focusSectionHeading } from '../../utils/focusManagement.js';

/**
 * CricketGroundHero
 *
 * Orchestrates the full cricket-themed hero section on the Home page:
 * - CricketGroundSVG as background
 * - Click-triggered BowlingAnimation (timed mode, 2s)
 * - ShotNavigation targets shown after delivery completes (including 6th Overview target)
 * - BallTrajectory on shot selection → React Router navigation
 *
 * The hero section is exactly 100vh with overflow hidden — no scrolling.
 * Animation is triggered by a "Play" button click (idle → playing → complete).
 *
 * When prefers-reduced-motion is enabled or on mobile, the animation is skipped
 * and ShotNavigation targets are shown immediately without the play button.
 *
 * @validates Requirements 8.1, 8.7, 8.8, 8.10
 */
function CricketGroundHero() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const {
    isNavigationLocked,
    lockNavigation,
    unlockNavigation,
    markSectionVisited,
  } = useCricketNav();

  // Mobile detection
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_CONFIG.breakpoint
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_CONFIG.breakpoint);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation state machine: 'idle' | 'playing' | 'complete'
  // When prefers-reduced-motion or mobile: skip directly to 'complete'
  const shouldSkipAnimation = (prefersReducedMotion ?? false) || isMobile;

  const [animationState, setAnimationState] = useState(() =>
    shouldSkipAnimation ? 'complete' : 'idle'
  );

  // Sync state if reduced motion / mobile changes after initial render
  useEffect(() => {
    if (shouldSkipAnimation && animationState === 'idle') {
      setAnimationState('complete');
    }
  }, [shouldSkipAnimation, animationState]);

  // State: selected shot for ball trajectory animation
  const [selectedShot, setSelectedShot] = useState(null);

  // Batsman origin in SVG coordinate % (where the ball starts for trajectory)
  const batsmanOrigin = { x: 50, y: 55 };

  // --- Callbacks ---

  const handlePlay = useCallback(() => {
    setAnimationState('playing');
  }, []);

  const handleDeliveryComplete = useCallback(() => {
    setAnimationState('complete');
  }, []);

  const handleShotSelect = useCallback(
    (shot) => {
      // Ignore if navigation is locked (trajectory already in progress)
      if (isNavigationLocked) return;

      // Lock navigation to prevent concurrent trajectories
      lockNavigation();

      // Set selected shot → triggers BallTrajectory render
      setSelectedShot(shot);
    },
    [isNavigationLocked, lockNavigation]
  );

  const handleTrajectoryComplete = useCallback(() => {
    if (!selectedShot) return;

    // Mark section as visited
    markSectionVisited(selectedShot.path);

    // Navigate to the selected section
    navigate(selectedShot.path);

    // Unlock navigation
    unlockNavigation();

    // Reset selected shot
    setSelectedShot(null);

    // Move focus to the destination section's heading for screen reader announcement
    focusSectionHeading();
  }, [selectedShot, markSectionVisited, navigate, unlockNavigation]);

  // Determine if shot targets should be visible
  const showShotTargets = animationState === 'complete';

  return (
    <section
      className="cricket-hero"
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
      aria-label="Cricket-themed hero section with interactive navigation"
    >
      {/* Layer 1: SVG Cricket Ground Background */}
      <CricketErrorBoundary>
        <div
          className="cricket-hero__ground"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CricketGroundSVG
            width="100%"
            height="100%"
            className="cricket-hero__svg"
          />
        </div>
      </CricketErrorBoundary>

      {/* Layer 2: Batsman silhouette (positioned at batting crease area) */}
      <CricketErrorBoundary>
        <svg
          viewBox="0 0 500 500"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <g transform="translate(225, 255) scale(0.6)">
            <SilhouetteBatsman />
          </g>
        </svg>
      </CricketErrorBoundary>

      {/* Layer 3: Play Button (shown only in idle state, when animation is not skipped) */}
      {animationState === 'idle' && !shouldSkipAnimation && (
        <div
          className="cricket-hero__play-trigger"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15,
          }}
        >
          <button
            type="button"
            onClick={handlePlay}
            aria-label="Play bowling animation"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #c0392b, #8b1a1a)',
              border: '3px solid var(--floodlight-amber, #e8a020)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 -2px 6px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.boxShadow = '0 6px 28px rgba(0, 0, 0, 0.5), inset 0 -2px 6px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 -2px 6px rgba(0,0,0,0.3)';
            }}
          >
            {/* Play triangle icon */}
            <svg
              width="24"
              height="28"
              viewBox="0 0 24 28"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 2L22 14L4 26V2Z"
                fill="#f5f0e8"
                stroke="#f5f0e8"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span
            style={{
              position: 'absolute',
              bottom: 'calc(50% - 56px)',
              left: '50%',
              transform: 'translateX(-50%) translateY(100%)',
              marginTop: '12px',
              color: 'var(--text, #f5f0e8)',
              fontSize: '0.85rem',
              fontWeight: 500,
              textShadow: '0 2px 6px rgba(0,0,0,0.6)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            Tap to bowl
          </span>
        </div>
      )}

      {/* Layer 4: Bowling Animation (timed mode, triggered by Play button) */}
      {animationState === 'playing' && (
        <CricketErrorBoundary>
          <div
            className="cricket-hero__bowling"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            }}
          >
            <BowlingAnimation
              mode="timed"
              timedDuration={2000}
              onDeliveryComplete={handleDeliveryComplete}
              mobile={isMobile}
            />
          </div>
        </CricketErrorBoundary>
      )}

      {/* Layer 5: Shot Navigation Targets */}
      <CricketErrorBoundary>
        <ShotNavigation
          visible={showShotTargets}
          shots={SHOT_TARGETS}
          onShotSelect={handleShotSelect}
        />
      </CricketErrorBoundary>

      {/* Layer 6: Ball Trajectory (rendered when a shot is selected) */}
      {selectedShot && (
        <CricketErrorBoundary>
          <svg
            viewBox="0 0 100 100"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          >
            <BallTrajectory
              from={batsmanOrigin}
              to={selectedShot.position}
              onComplete={handleTrajectoryComplete}
              duration={800}
            />
          </svg>
        </CricketErrorBoundary>
      )}
    </section>
  );
}

export default CricketGroundHero;
