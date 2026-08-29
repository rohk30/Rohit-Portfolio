// src/config/animationPhases.js
export const BOWLING_PHASES = {
  RUNUP: { start: 0, end: 0.4 },
  DELIVERY_STRIDE: { start: 0.4, end: 0.7 },
  BALL_RELEASE: { start: 0.7, end: 1.0 },
};

export const BALL_TRAJECTORY_CONFIG = {
  duration: { min: 600, max: 1000 },  // ms
  easing: [0.4, 0, 0.2, 1],           // cubic-bezier
  ballDiameter: { min: 12, max: 24 }, // px
  ballColor: '#8b1a1a',               // Cricket Red
};

export const MOBILE_CONFIG = {
  breakpoint: 768,
  maxScrollDistance: '50vh',
  widgetSize: 64,        // px
  minTouchTarget: 44,    // px
};

/**
 * Determines which bowling animation phase a given scroll progress value falls into.
 *
 * @param {number} progress - Normalized scroll progress in range [0, 1]
 * @returns {'runup' | 'delivery_stride' | 'ball_release'} The current animation phase
 */
export function getPhase(progress) {
  if (progress < BOWLING_PHASES.DELIVERY_STRIDE.start) {
    return 'runup';
  }
  if (progress < BOWLING_PHASES.BALL_RELEASE.start) {
    return 'delivery_stride';
  }
  return 'ball_release';
}
