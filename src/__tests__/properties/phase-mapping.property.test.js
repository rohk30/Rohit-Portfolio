/**
 * Property-based tests for Scroll Progress Phase Mapping
 *
 * **Property 1: Scroll progress maps to correct animation phase**
 *
 * For any scroll progress value in the range [0, 1], the phase mapping function
 * SHALL return 'runup' for values in [0, 0.4), 'delivery_stride' for values in
 * [0.4, 0.7), and 'ball_release' for values in [0.7, 1.0], and the mapping SHALL
 * be monotonic (increasing progress never returns to an earlier phase).
 *
 * **Validates: Requirements 2.3, 8.2**
 */
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { getPhase, BOWLING_PHASES } from '../../config/animationPhases.js';

// Phase ordering for monotonicity check
const PHASE_ORDER = ['runup', 'delivery_stride', 'ball_release'];

function phaseIndex(phase) {
  return PHASE_ORDER.indexOf(phase);
}

describe('Scroll Progress Phase Mapping - Property 1', () => {
  /**
   * **Property 1.1: Progress in [0, 0.4) maps to 'runup'**
   *
   * **Validates: Requirements 2.3, 8.2**
   */
  test('progress in [0, 0.4) maps to runup phase', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 0.4, noNaN: true, maxExcluded: true }),
        (progress) => {
          const phase = getPhase(progress);
          expect(phase).toBe('runup');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1.2: Progress in [0.4, 0.7) maps to 'delivery_stride'**
   *
   * **Validates: Requirements 2.3, 8.2**
   */
  test('progress in [0.4, 0.7) maps to delivery_stride phase', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.4, max: 0.7, noNaN: true, maxExcluded: true }),
        (progress) => {
          const phase = getPhase(progress);
          expect(phase).toBe('delivery_stride');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1.3: Progress in [0.7, 1.0] maps to 'ball_release'**
   *
   * **Validates: Requirements 2.3, 8.2**
   */
  test('progress in [0.7, 1.0] maps to ball_release phase', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.7, max: 1.0, noNaN: true }),
        (progress) => {
          const phase = getPhase(progress);
          expect(phase).toBe('ball_release');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1.4: Monotonicity - sorted progress values map to non-decreasing phase ordering**
   *
   * For any sequence of progress values, sorting them in ascending order must produce
   * a sequence of phases whose ordering never decreases (never goes from a later phase
   * back to an earlier phase).
   *
   * **Validates: Requirements 2.3, 8.2**
   */
  test('monotonicity: sorted progress values produce non-decreasing phase order', () => {
    fc.assert(
      fc.property(
        fc.array(fc.double({ min: 0, max: 1.0, noNaN: true }), { minLength: 2, maxLength: 50 }),
        (progressValues) => {
          const sorted = [...progressValues].sort((a, b) => a - b);
          const phases = sorted.map(getPhase);

          for (let i = 1; i < phases.length; i++) {
            expect(phaseIndex(phases[i])).toBeGreaterThanOrEqual(phaseIndex(phases[i - 1]));
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1.5: Phase mapping covers exactly three valid phases**
   *
   * Any progress value in [0, 1] must return one of the three defined phases.
   *
   * **Validates: Requirements 2.3, 8.2**
   */
  test('any progress in [0, 1] returns a valid phase name', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1.0, noNaN: true }),
        (progress) => {
          const phase = getPhase(progress);
          expect(PHASE_ORDER).toContain(phase);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1.6: Phase boundaries align with BOWLING_PHASES config**
   *
   * The phase transitions happen at exactly the configured boundary values.
   *
   * **Validates: Requirements 2.3, 8.2**
   */
  test('boundary values map to correct phases', () => {
    // Exact boundary: 0 → runup
    expect(getPhase(0)).toBe('runup');
    // Just below 0.4 → runup
    expect(getPhase(0.39999)).toBe('runup');
    // Exact boundary: 0.4 → delivery_stride
    expect(getPhase(0.4)).toBe('delivery_stride');
    // Just below 0.7 → delivery_stride
    expect(getPhase(0.69999)).toBe('delivery_stride');
    // Exact boundary: 0.7 → ball_release
    expect(getPhase(0.7)).toBe('ball_release');
    // Exact boundary: 1.0 → ball_release
    expect(getPhase(1.0)).toBe('ball_release');
  });
});
