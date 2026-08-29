import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { MOBILE_CONFIG } from '../../config/animationPhases.js';

/**
 * Play Next Ball
 *
 * Interior pages deliberately route back to the real Home hero. The old
 * full-screen top-down cricket overlay is no longer used, so every cricket
 * navigation entry point shares the same cinematic stadium sequence.
 */
function PlayNextBallWidget() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_CONFIG.breakpoint);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePlay = () => {
    navigate('/', {
      state: { startCricket: true },
    });
  };

  return (
    <motion.button
      type="button"
      className="play-next-ball-btn"
      onClick={handlePlay}
      aria-label="Play next ball - return to the cinematic cricket hero"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.3 }}
      style={{
        position: 'fixed',
        bottom: isMobile ? '16px' : '24px',
        right: isMobile ? '16px' : '24px',
        zIndex: 50,
        minWidth: isMobile ? `${MOBILE_CONFIG.widgetSize}px` : 'auto',
        minHeight: `${MOBILE_CONFIG.minTouchTarget}px`,
        width: isMobile ? `${MOBILE_CONFIG.widgetSize}px` : 'auto',
        height: isMobile ? `${MOBILE_CONFIG.widgetSize}px` : 'auto',
        padding: isMobile ? '8px' : '12px 20px',
        border: '1px solid rgba(230, 189, 105, 0.65)',
        borderRadius: isMobile ? '50%' : '999px',
        color: '#f7f0e2',
        background: 'rgba(8, 21, 17, 0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 10px 32px rgba(0,0,0,0.28)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: '0.78rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}
    >
      <span aria-hidden="true" style={{ fontSize: isMobile ? '1.1rem' : '1rem' }}>🏏</span>
      {!isMobile && <span>Play Next Ball</span>}
    </motion.button>
  );
}

export default PlayNextBallWidget;
