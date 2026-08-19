// Feature: cricket-visual-overhaul, Property 9: Bowler Animation Phase Mapping
/**
 * Property-based test for Bowler Animation Phase Mapping (V2)
 *
 * **Property 9: Bowler Animation Phase Mapping**
 *
 * For any progress value in the range [0, 1], the bowler's x-position, y-position,
 * and rotation SHALL fall within the expected output ranges defined by the three
 * animation phases:
 *   - Run-up (progress 0–0.4): x: 60–120, y: 0–20, rotate: 0
 *   - Delivery stride (progress 0.4–0.7): x: 30–60, y: 20–40, rotate: 0 to -25
 *   - Ball release (progress 0.7–1.0): x: 10–30, y: 40–50, rotate: -25 to -35
 *
 * **Validates: Requirements 7.1**
 */
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { BOWLING_PHASES } from '../../config/animationPhases.js';

/**
 * Linear interpolation between keyframes, matching Framer Motion's useTransform behavior.
 * Given input breakpoints and output values, interpolates the output for a given progress.
 *
 * @param {number} progress - Input value (0 to 1)
 * @param {number[]} inputRange - Array of input breakpoints (ascending)
 * @param {number[]} outputRange - Array of corresponding output values
 * @returns {number} Interpolated output value
 */
function interpolate(progress, inputRange, outputRange) {
  // Clamp progress to input range
  if (progress <= inputRange[0]) return outputRange[0];
  if (progress >= inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1];

  // Find the segment that contains this progress value
  for (let i = 0; i < inputRange.length - 1; i++) {
    if (progress >= inputRange[i] && progress <= inputRange[i + 1]) {
      const segmentLength = inputRange[i + 1] - inputRange[i];
      // Avoid division by zero for zero-length segments
      if (segmentLength === 0) return outputRange[i];
      const t = (progress - inputRange[i]) / segmentLength;
      return outputRange[i] + t * (outputRange[i + 1] - outputRange[i]);
    }
  }

  return outputRange[outputRange.length - 1];
}

// Desktop bowler transform keyframes (from BowlingAnimation.jsx)
const BOWLER_X_INPUT = [
  BOWLING_PHASES.RUNUP.start,        // 0
  BOWLING_PHASES.RUNUP.end,          // 0.4
  BOWLING_PHASES.DELIVERY_STRIDE.end, // 0.7
  BOWLING_PHASES.BALL_RELEASE.end,   // 1.0
];
const BOWLER_X_OUTPUT = [120, 60, 30, 10];

const BOWLER_Y_INPUT = [
  BOWLING_PHASES.RUNUP.start,        // 0
  BOWLING_PHASES.RUNUP.end,          // 0.4
  BOWLING_PHASES.DELIVERY_STRIDE.end, // 0.7
  BOWLING_PHASES.BALL_RELEASE.end,   // 1.0
];
const BOWLER_Y_OUTPUT = [0, 20, 40, 50];

const BOWLER_ROTATE_INPUT = [
  BOWLING_PHASES.RUNUP.start,           // 0
  BOWLING_PHASES.RUNUP.end,             // 0.4
  BOWLING_PHASES.DELIVERY_STRIDE.start, // 0.4
  BOWLING_PHASES.DELIVERY_STRIDE.end,   // 0.7
  BOWLING_PHASES.BALL_RELEASE.end,      // 1.0
];
const BOWLER_ROTATE_OUTPUT = [0, 0, 0, -25, -35];

// Small epsilon for floating point tolerance
const EPSILON = 1e-9;

describe('Bowler Animation Phase Mapping - Property 9', () => {
  /**
   * **Property 9.1: Run-up phase (progress 0–0.4) produces x in [60, 120], y in [0, 20], rotate = 0**
   *
   * **Validates: Requirements 7.1**
   */
  test('run-up phase: progress in [0, 0.4] produces x in [60, 120], y in [0, 20], rotate = 0', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 0.4, noNaN: true }),
        (progress) => {
          const x = interpolate(progress, BOWLER_X_INPUT, BOWLER_X_OUTPUT);
          const y = interpolate(progress, BOWLER_Y_INPUT, BOWLER_Y_OUTPUT);
          const rotate = interpolate(progress, BOWLER_ROTATE_INPUT, BOWLER_ROTATE_OUTPUT);

          expect(x).toBeGreaterThanOrEqual(60 - EPSILON);
          expect(x).toBeLessThanOrEqual(120 + EPSILON);
          expect(y).toBeGreaterThanOrEqual(0 - EPSILON);
          expect(y).toBeLessThanOrEqual(20 + EPSILON);
          expect(rotate).toBeCloseTo(0, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 9.2: Delivery stride phase (progress 0.4–0.7) produces x in [30, 60], y in [20, 40], rotate in [-25, 0]**
   *
   * **Validates: Requirements 7.1**
   */
  test('delivery stride phase: progress in [0.4, 0.7] produces x in [30, 60], y in [20, 40], rotate in [-25, 0]', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.4, max: 0.7, noNaN: true }),
        (progress) => {
          const x = interpolate(progress, BOWLER_X_INPUT, BOWLER_X_OUTPUT);
          const y = interpolate(progress, BOWLER_Y_INPUT, BOWLER_Y_OUTPUT);
          const rotate = interpolate(progress, BOWLER_ROTATE_INPUT, BOWLER_ROTATE_OUTPUT);

          expect(x).toBeGreaterThanOrEqual(30 - EPSILON);
          expect(x).toBeLessThanOrEqual(60 + EPSILON);
          expect(y).toBeGreaterThanOrEqual(20 - EPSILON);
          expect(y).toBeLessThanOrEqual(40 + EPSILON);
          expect(rotate).toBeGreaterThanOrEqual(-25 - EPSILON);
          expect(rotate).toBeLessThanOrEqual(0 + EPSILON);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 9.3: Ball release phase (progress 0.7–1.0) produces x in [10, 30], y in [40, 50], rotate in [-35, -25]**
   *
   * **Validates: Requirements 7.1**
   */
  test('ball release phase: progress in [0.7, 1.0] produces x in [10, 30], y in [40, 50], rotate in [-35, -25]', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.7, max: 1.0, noNaN: true }),
        (progress) => {
          const x = interpolate(progress, BOWLER_X_INPUT, BOWLER_X_OUTPUT);
          const y = interpolate(progress, BOWLER_Y_INPUT, BOWLER_Y_OUTPUT);
          const rotate = interpolate(progress, BOWLER_ROTATE_INPUT, BOWLER_ROTATE_OUTPUT);

          expect(x).toBeGreaterThanOrEqual(10 - EPSILON);
          expect(x).toBeLessThanOrEqual(30 + EPSILON);
          expect(y).toBeGreaterThanOrEqual(40 - EPSILON);
          expect(y).toBeLessThanOrEqual(50 + EPSILON);
          expect(rotate).toBeGreaterThanOrEqual(-35 - EPSILON);
          expect(rotate).toBeLessThanOrEqual(-25 + EPSILON);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 9.4: Any progress in [0, 1] produces outputs within the full valid range**
   *
   * For any progress value in [0, 1], the bowler x must be in [10, 120],
   * y must be in [0, 50], and rotate must be in [-35, 0].
   *
   * **Validates: Requirements 7.1**
   */
  test('any progress in [0, 1] produces outputs within full valid ranges (x: [10, 120], y: [0, 50], rotate: [-35, 0])', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1.0, noNaN: true }),
        (progress) => {
          const x = interpolate(progress, BOWLER_X_INPUT, BOWLER_X_OUTPUT);
          const y = interpolate(progress, BOWLER_Y_INPUT, BOWLER_Y_OUTPUT);
          const rotate = interpolate(progress, BOWLER_ROTATE_INPUT, BOWLER_ROTATE_OUTPUT);

          expect(x).toBeGreaterThanOrEqual(10 - EPSILON);
          expect(x).toBeLessThanOrEqual(120 + EPSILON);
          expect(y).toBeGreaterThanOrEqual(0 - EPSILON);
          expect(y).toBeLessThanOrEqual(50 + EPSILON);
          expect(rotate).toBeGreaterThanOrEqual(-35 - EPSILON);
          expect(rotate).toBeLessThanOrEqual(0 + EPSILON);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 9.5: Monotonicity — increasing progress produces non-increasing x and non-decreasing y**
   *
   * The bowler moves from right-to-left (x decreasing) and top-to-bottom (y increasing)
   * as progress advances. Rotation is monotonically non-increasing (goes from 0 toward -35).
   *
   * **Validates: Requirements 7.1**
   */
  test('monotonicity: increasing progress produces non-increasing x, non-decreasing y, non-increasing rotate', () => {
    fc.assert(
      fc.property(
        fc.array(fc.double({ min: 0, max: 1.0, noNaN: true }), { minLength: 2, maxLength: 50 }),
        (progressValues) => {
          const sorted = [...progressValues].sort((a, b) => a - b);

          const xValues = sorted.map((p) => interpolate(p, BOWLER_X_INPUT, BOWLER_X_OUTPUT));
          const yValues = sorted.map((p) => interpolate(p, BOWLER_Y_INPUT, BOWLER_Y_OUTPUT));
          const rotateValues = sorted.map((p) => interpolate(p, BOWLER_ROTATE_INPUT, BOWLER_ROTATE_OUTPUT));

          for (let i = 1; i < sorted.length; i++) {
            // x is non-increasing (bowler moves left)
            expect(xValues[i]).toBeLessThanOrEqual(xValues[i - 1] + EPSILON);
            // y is non-decreasing (bowler moves down/forward)
            expect(yValues[i]).toBeGreaterThanOrEqual(yValues[i - 1] - EPSILON);
            // rotate is non-increasing (goes from 0 to -35)
            expect(rotateValues[i]).toBeLessThanOrEqual(rotateValues[i - 1] + EPSILON);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
