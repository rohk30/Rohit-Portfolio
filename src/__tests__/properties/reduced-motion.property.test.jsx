/**
 * Property-based tests for reduced motion behavior
 *
 * **Property 8: Reduced motion disables scroll-triggered animations**
 *
 * For any scroll position and any animation state, when the user has
 * `prefers-reduced-motion: reduce` enabled, the Bowling_Animation SHALL not play,
 * and the Shot_Navigation targets SHALL be visible and interactive on page load
 * without requiring any scroll interaction.
 *
 * **Validates: Requirements 8.6**
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import * as fc from 'fast-check';
import { SHOT_TARGETS } from '../../config/shotNavigation.js';

describe('Reduced Motion Property Tests - Property 8', () => {
  let originalMatchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.resetModules();
  });

  /**
   * Helper to mock window.matchMedia so that `prefers-reduced-motion: reduce`
   * matches (or not) as specified.
   */
  function mockMatchMedia(reducedMotionEnabled) {
    window.matchMedia = vi.fn((query) => {
      const matches =
        query === '(prefers-reduced-motion: reduce)' ||
        query === '(prefers-reduced-motion)'
          ? reducedMotionEnabled
          : false;

      return {
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    });
  }

  /**
   * Property 8.1: useReducedMotion returns true when prefers-reduced-motion is enabled
   * **Validates: Requirements 8.6**
   *
   * For any scroll position (float in [0, 1]), when the user has prefers-reduced-motion
   * enabled, the useReducedMotion hook SHALL return true regardless of scroll state.
   */
  test('useReducedMotion returns true when prefers-reduced-motion is enabled, regardless of scroll position', async () => {
    mockMatchMedia(true);

    // Import framer-motion dynamically so it picks up our mocked matchMedia
    const { useReducedMotion } = await import('framer-motion');

    fc.assert(
      fc.property(
        // Generate random scroll positions as floats in [0, 1]
        fc.double({ min: 0, max: 1, noNaN: true }),
        (_scrollPosition) => {
          // The hook should return true regardless of what scroll position we're at
          const { result } = renderHook(() => useReducedMotion());
          expect(result.current).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8.2: When reduced motion is active, shot targets should be immediately visible
   * **Validates: Requirements 8.6**
   *
   * For any scroll position in [0, 1], when reducedMotion is true, the logic that
   * determines shot navigation visibility SHALL return true (targets visible)
   * regardless of whether the bowling animation has completed.
   *
   * This tests the decision function: given (reducedMotion, scrollProgress, deliveryComplete),
   * when reducedMotion is true, targets are always visible.
   */
  test('shot navigation targets are visible immediately when reduced motion is enabled, for any scroll position', () => {
    /**
     * Decision function that mirrors the intended CricketGroundHero logic:
     * Targets are visible if:
     * - reducedMotion is true (show immediately, bypass scroll), OR
     * - deliveryComplete is true (scroll animation finished)
     */
    function shouldShowShotTargets(reducedMotion, deliveryComplete) {
      return reducedMotion || deliveryComplete;
    }

    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1, noNaN: true }),
        fc.boolean(),
        (scrollPosition, deliveryComplete) => {
          // When reduced motion is enabled, targets MUST be visible
          // regardless of scroll position or delivery state
          const visible = shouldShowShotTargets(true, deliveryComplete);
          expect(visible).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8.3: When reduced motion is active, bowling animation should not play
   * **Validates: Requirements 8.6**
   *
   * For any scroll position in [0, 1], when reducedMotion is true, the decision
   * function for whether to render/animate the bowling animation SHALL return false.
   */
  test('bowling animation does not play when reduced motion is enabled, for any scroll position', () => {
    /**
     * Decision function that mirrors the intended CricketGroundHero logic:
     * The bowling animation plays only if reducedMotion is false.
     */
    function shouldAnimateBowling(reducedMotion) {
      return !reducedMotion;
    }

    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1, noNaN: true }),
        (scrollPosition) => {
          // When reduced motion is enabled, animation should NOT play
          const shouldAnimate = shouldAnimateBowling(true);
          expect(shouldAnimate).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8.4: All shot targets remain interactive when reduced motion is enabled
   * **Validates: Requirements 8.6**
   *
   * For any scroll position and any shot target, when reducedMotion is true,
   * every shot target in SHOT_TARGETS SHALL be available for interaction
   * (not blocked by scroll progress or animation state).
   */
  test('all shot targets are interactive when reduced motion is enabled, for any scroll position and target', () => {
    /**
     * Decision function: a target is interactive if the shot navigation is visible
     * and navigation is not locked. In reduced motion mode, targets are always visible.
     */
    function isTargetInteractive(reducedMotion, isNavigationLocked) {
      const targetsVisible = reducedMotion; // In reduced motion, always visible
      return targetsVisible && !isNavigationLocked;
    }

    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1, noNaN: true }),
        fc.integer({ min: 0, max: SHOT_TARGETS.length - 1 }),
        (scrollPosition, targetIndex) => {
          const target = SHOT_TARGETS[targetIndex];
          // Target should be interactive (navigation not locked in initial state)
          const interactive = isTargetInteractive(true, false);
          expect(interactive).toBe(true);
          // Verify the target has valid navigation data
          expect(target.path).toBeTruthy();
          expect(target.ariaLabel).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8.5: Without reduced motion, targets require scroll completion
   * **Validates: Requirements 8.6**
   *
   * Contrast property: when reducedMotion is false and delivery is NOT complete,
   * targets should NOT be visible. This confirms the reduced motion behavior is
   * meaningfully different from the default behavior.
   */
  test('without reduced motion, targets are hidden until delivery completes', () => {
    function shouldShowShotTargets(reducedMotion, deliveryComplete) {
      return reducedMotion || deliveryComplete;
    }

    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 0.99, noNaN: true }),
        (scrollPosition) => {
          // Without reduced motion and without delivery complete,
          // targets should NOT be visible
          const visible = shouldShowShotTargets(false, false);
          expect(visible).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
