import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useCricketNav } from '../../context/CricketNavContext.jsx';
import CricketGroundSVG from './CricketGroundSVG.jsx';
import ShotNavigation from './ShotNavigation.jsx';
import BallTrajectory from './BallTrajectory.jsx';
import BowlingAnimation from './BowlingAnimation.jsx';
import SilhouetteBatsman from './SilhouetteBatsman.jsx';
import { SHOT_TARGETS } from '../../config/shotNavigation.js';
import { MOBILE_CONFIG } from '../../config/animationPhases.js';
import { focusSectionHeading } from '../../utils/focusManagement.js';

/**
 * PlayNextBallWidget
 *
 * A fixed-position widget on section pages that provides cricket-themed
 * navigation to unvisited sections. Shows a "Play Next Ball" button that,
 * on click, opens a full-screen cinematic overlay with the cricket ground,
 * bowler run-up animation (1.5-2.5s), batsman figure, and then shot targets
 * for unvisited sections.
 *
 * Full-screen takeover: 100vw × 100vh with semi-transparent backdrop,
 * body scroll lock, aria-modal="true", focus trap, and close button.
 *
 * On mobile (<768px), scales proportionally while maintaining 44px touch targets.
 *
 * @param {object} props
 * @param {string} props.currentPath - Current route path for filtering
 *
 * @validates Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.10
 */
function PlayNextBallWidget({ currentPath }) {
  const navigate = useNavigate();
  const { visitedSections, isNavigationLocked, lockNavigation, unlockNavigation, markSectionVisited } = useCricketNav();
  const shouldReduceMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(false);
  const [showTargets, setShowTargets] = useState(false);
  const [selectedShot, setSelectedShot] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('idle'); // 'idle' | 'fadein' | 'bowling' | 'complete'

  const widgetRef = useRef(null);
  const closeButtonRef = useRef(null);
  const triggerButtonRef = useRef(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_CONFIG.breakpoint);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Body scroll lock when overlay is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Focus close button when overlay opens
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      // Small delay to allow AnimatePresence to render
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  /**
   * Filter shot targets to show only unvisited sections.
   * If all sections have been visited, show all targets.
   * Always exclude the current page from targets.
   */
  const getAvailableShots = useCallback(() => {
    const unvisited = SHOT_TARGETS.filter(
      (shot) => shot.path !== currentPath && !visitedSections.has(shot.path)
    );

    // If all sections visited (or no unvisited remain after excluding current),
    // show all sections except current
    if (unvisited.length === 0) {
      return SHOT_TARGETS.filter((shot) => shot.path !== currentPath);
    }

    return unvisited;
  }, [currentPath, visitedSections]);

  /**
   * Opens the widget overlay. If reduced motion, shows targets immediately
   * after fade-in. Otherwise starts the bowling animation sequence.
   */
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setShowTargets(false);
    setSelectedShot(null);

    if (shouldReduceMotion) {
      // Skip bowling animation, show targets after fade-in
      setAnimationPhase('complete');
      // Show targets immediately after the fade-in (400ms)
      setTimeout(() => {
        setShowTargets(true);
      }, 400);
    } else {
      setAnimationPhase('fadein');
    }
  }, [shouldReduceMotion]);

  /**
   * Called when the fade-in animation completes — starts bowling phase.
   */
  const handleFadeInComplete = useCallback(() => {
    if (shouldReduceMotion) return;
    setAnimationPhase('bowling');
  }, [shouldReduceMotion]);

  /**
   * Called when the bowling animation completes — show targets.
   */
  const handleBowlingComplete = useCallback(() => {
    setAnimationPhase('complete');
    setShowTargets(true);
  }, []);

  /**
   * Closes the overlay and resets state. Restores focus to trigger button.
   */
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setShowTargets(false);
    setSelectedShot(null);
    setAnimationPhase('idle');

    // Restore focus to the trigger button
    setTimeout(() => {
      triggerButtonRef.current?.focus();
    }, 50);
  }, []);

  /**
   * Handles shot selection: locks navigation, starts ball trajectory,
   * then navigates on completion.
   */
  const handleShotSelect = useCallback(
    (shot) => {
      if (isNavigationLocked) return;

      lockNavigation();
      setSelectedShot(shot);
    },
    [isNavigationLocked, lockNavigation]
  );

  /**
   * Called when ball trajectory animation completes.
   * Navigates to the shot's path and cleans up.
   */
  const handleTrajectoryComplete = useCallback(() => {
    if (!selectedShot) return;

    markSectionVisited(selectedShot.path);
    unlockNavigation();
    handleClose();
    navigate(selectedShot.path);

    // Move focus to the destination section's heading for screen reader announcement
    focusSectionHeading();
  }, [selectedShot, markSectionVisited, unlockNavigation, handleClose, navigate]);

  /**
   * Focus trap: prevent Tab from escaping the overlay when targets are visible.
   * Cycles through close button → shot target buttons (in DOM order).
   * Only active when overlay is open and targets are shown (animationPhase === 'complete').
   *
   * @validates Requirements 5.9, 7.4, 7.6
   */
  useEffect(() => {
    if (!isOpen || !showTargets) return;

    const overlayEl = document.querySelector('.play-next-ball-overlay');
    if (!overlayEl) return;

    const handleFocusTrap = (e) => {
      if (e.key !== 'Tab') return;

      // Query all focusable elements inside the overlay
      const focusableElements = overlayEl.querySelectorAll(
        'button:not([disabled]):not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    overlayEl.addEventListener('keydown', handleFocusTrap);
    return () => {
      overlayEl.removeEventListener('keydown', handleFocusTrap);
    };
  }, [isOpen, showTargets]);

  /**
   * Handle Escape key to close overlay
   */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

  // Batsman origin for trajectory (center-bottom of the ground)
  const batsmanOrigin = { x: 50, y: 55 };

  const availableShots = getAvailableShots();

  return (
    <div
      ref={widgetRef}
      className="play-next-ball-widget"
      style={{
        position: 'fixed',
        bottom: isMobile ? '16px' : '24px',
        right: isMobile ? '16px' : '24px',
        zIndex: 50,
      }}
    >
      {/* Play Next Ball Button */}
      {!isOpen && (
        <motion.button
          ref={triggerButtonRef}
          type="button"
          className="play-next-ball-btn"
          onClick={handleOpen}
          aria-label="Play next ball - navigate to another section"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            width: isMobile ? `${MOBILE_CONFIG.widgetSize}px` : 'auto',
            height: isMobile ? `${MOBILE_CONFIG.widgetSize}px` : 'auto',
            minWidth: `${MOBILE_CONFIG.minTouchTarget}px`,
            minHeight: `${MOBILE_CONFIG.minTouchTarget}px`,
            padding: isMobile ? '8px' : '12px 20px',
            background: 'var(--glass-bg, rgba(13, 31, 13, 0.72))',
            border: '2px solid var(--accent-gold, #c9a227)',
            borderRadius: isMobile ? '50%' : '12px',
            color: 'var(--text, #f5f0e8)',
            fontSize: isMobile ? '0.7rem' : '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(var(--glass-blur, 12px))',
            WebkitBackdropFilter: 'blur(var(--glass-blur, 12px))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          }}
        >
          {isMobile ? (
            // Cricket ball icon for mobile
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" fill="var(--accent-red, #8b1a1a)" />
              <path
                d="M7 5 C9 8, 9 16, 7 19"
                stroke="var(--text, #f5f0e8)"
                strokeWidth="1.2"
                fill="none"
              />
              <path
                d="M17 5 C15 8, 15 16, 17 19"
                stroke="var(--text, #f5f0e8)"
                strokeWidth="1.2"
                fill="none"
              />
            </svg>
          ) : (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" fill="var(--accent-red, #8b1a1a)" />
                <path
                  d="M7 5 C9 8, 9 16, 7 19"
                  stroke="var(--text, #f5f0e8)"
                  strokeWidth="1.2"
                  fill="none"
                />
                <path
                  d="M17 5 C15 8, 15 16, 17 19"
                  stroke="var(--text, #f5f0e8)"
                  strokeWidth="1.2"
                  fill="none"
                />
              </svg>
              <span>Play Next Ball</span>
            </>
          )}
        </motion.button>
      )}

      {/* Full-Screen Cricket Ground Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="play-next-ball-overlay"
            role="dialog"
            aria-label="Cricket ground - select your next shot to navigate"
            aria-modal="true"
            onKeyDown={handleKeyDown}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.4 }}
            onAnimationComplete={(definition) => {
              // Only trigger on the animate (entry) phase, not exit
              if (definition.opacity === 1) {
                handleFadeInComplete();
              }
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(10, 20, 10, 0.9)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Close button - top-right, 44×44px minimum, 3:1 contrast */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Close cricket ground overlay"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 10001,
                width: '48px',
                height: '48px',
                minWidth: `${MOBILE_CONFIG.minTouchTarget}px`,
                minHeight: `${MOBILE_CONFIG.minTouchTarget}px`,
                background: 'rgba(13, 31, 13, 0.9)',
                border: '2px solid rgba(245, 240, 232, 0.6)',
                borderRadius: '50%',
                color: '#f5f0e8',
                fontSize: '1.4rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                lineHeight: 1,
              }}
            >
              ✕
            </button>

            {/* Cricket ground at full viewport scale */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                maxWidth: '100vw',
                maxHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Ground SVG - full scale (not compact) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CricketGroundSVG width="100%" height="100%" />
              </div>

              {/* Bowling Animation - bowler run-up (1.5-2.5s timed mode) */}
              {animationPhase === 'bowling' && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                  }}
                >
                  <BowlingAnimation
                    mode="timed"
                    timedDuration={2000}
                    onDeliveryComplete={handleBowlingComplete}
                  />
                </div>
              )}

              {/* Batsman silhouette - visible once bowling phase starts */}
              {(animationPhase === 'bowling' || animationPhase === 'complete') && (
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                  }}
                  aria-hidden="true"
                >
                  <SilhouetteBatsman
                    style={{ transform: 'translate(42px, 40px) scale(0.3)' }}
                  />
                </svg>
              )}

              {/* Bowling indicator (during bowling phase) */}
              {animationPhase === 'bowling' && (
                <motion.div
                  aria-live="polite"
                  aria-label="Bowling animation in progress"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    position: 'absolute',
                    bottom: '48px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'var(--text-soft, #a8b5a0)',
                    fontSize: '0.9rem',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <motion.div
                    animate={{ x: [0, 12, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    style={{ display: 'inline-block' }}
                  >
                    🏏
                  </motion.div>
                  <div style={{ marginTop: '4px' }}>Bowling...</div>
                </motion.div>
              )}

              {/* Shot navigation targets */}
              <ShotNavigation
                visible={showTargets}
                shots={availableShots}
                onShotSelect={handleShotSelect}
                compact={false}
              />

              {/* Ball trajectory animation */}
              {selectedShot && (
                <svg
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                  }}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <BallTrajectory
                    from={batsmanOrigin}
                    to={selectedShot.position}
                    onComplete={handleTrajectoryComplete}
                    duration={800}
                  />
                </svg>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PlayNextBallWidget;
