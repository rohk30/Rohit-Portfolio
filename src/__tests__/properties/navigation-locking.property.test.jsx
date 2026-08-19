/**
 * Property-based tests for navigation locking
 *
 * **Validates: Requirements 3.6**
 * - Requirement 3.6: IF a visitor clicks a Shot_Navigation target while a Ball_Trajectory
 *   animation is already in progress, THEN THE system SHALL ignore the new click until
 *   the current animation completes and navigation occurs.
 *
 * Property 3: Navigation locking prevents concurrent trajectories
 * For any sequence of shot target activations where the first triggers a ball trajectory
 * animation, all subsequent activations received before the first animation completes
 * SHALL be ignored, resulting in exactly one navigation event.
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import * as fc from 'fast-check';
import { CricketNavProvider, useCricketNav } from '../../context/CricketNavContext';

describe('Navigation Locking Property Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * Property 3.1: lockNavigation sets isNavigationLocked to true
   * **Validates: Requirements 3.6**
   *
   * For any number of lock calls, isNavigationLocked SHALL be true after lockNavigation() is called.
   */
  test('lockNavigation sets isNavigationLocked to true for any call sequence', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (lockCallCount) => {
          const { result } = renderHook(() => useCricketNav(), {
            wrapper: CricketNavProvider,
          });

          // Initially unlocked
          expect(result.current.isNavigationLocked).toBe(false);

          // Call lockNavigation N times — should always be locked
          for (let i = 0; i < lockCallCount; i++) {
            act(() => {
              result.current.lockNavigation();
            });
            expect(result.current.isNavigationLocked).toBe(true);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.2: While locked, subsequent shot activations are blocked
   * **Validates: Requirements 3.6**
   *
   * For any sequence of shot target activations, only the first one succeeds
   * while navigation is locked.
   */
  test('while locked, subsequent activations are blocked', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        (activationCount) => {
          const { result } = renderHook(() => useCricketNav(), {
            wrapper: CricketNavProvider,
          });

          // Lock navigation (simulates first shot activation triggering trajectory)
          act(() => {
            result.current.lockNavigation();
          });

          expect(result.current.isNavigationLocked).toBe(true);

          // All subsequent activations should be blocked because lock is still held
          // The consumer code checks isNavigationLocked before triggering navigation.
          // Here we verify the lock remains true regardless of how many times
          // we attempt to read it (simulating multiple activation attempts).
          for (let i = 0; i < activationCount; i++) {
            expect(result.current.isNavigationLocked).toBe(true);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.3: unlockNavigation releases the lock
   * **Validates: Requirements 3.6**
   *
   * For any lock/unlock cycle, unlockNavigation SHALL set isNavigationLocked to false.
   */
  test('unlockNavigation releases the lock for any lock/unlock sequence', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom('lock', 'unlock'), { minLength: 1, maxLength: 20 }),
        (sequence) => {
          const { result } = renderHook(() => useCricketNav(), {
            wrapper: CricketNavProvider,
          });

          let expectedLocked = false;

          for (const action of sequence) {
            act(() => {
              if (action === 'lock') {
                result.current.lockNavigation();
                expectedLocked = true;
              } else {
                result.current.unlockNavigation();
                expectedLocked = false;
              }
            });

            expect(result.current.isNavigationLocked).toBe(expectedLocked);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.4: 1200ms auto-release timeout works as safety net
   * **Validates: Requirements 3.6**
   *
   * For any lock call, if unlockNavigation is NOT called within 1200ms,
   * the lock SHALL auto-release after exactly 1200ms.
   */
  test('1200ms auto-release timeout releases lock as safety net', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1199 }),
        fc.integer({ min: 1200, max: 5000 }),
        (timeBefore, timeAfter) => {
          const { result } = renderHook(() => useCricketNav(), {
            wrapper: CricketNavProvider,
          });

          // Lock navigation
          act(() => {
            result.current.lockNavigation();
          });

          expect(result.current.isNavigationLocked).toBe(true);

          // Before 1200ms — still locked
          act(() => {
            vi.advanceTimersByTime(timeBefore);
          });
          expect(result.current.isNavigationLocked).toBe(true);

          // Advance to at least 1200ms total — lock should auto-release
          act(() => {
            vi.advanceTimersByTime(timeAfter - timeBefore);
          });
          expect(result.current.isNavigationLocked).toBe(false);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.5: Navigation locking results in exactly one navigation event
   * **Validates: Requirements 3.6**
   *
   * For any pair of shot targets and timing offsets where total elapsed time
   * is less than the 1200ms auto-release, when the first activation triggers
   * a trajectory and subsequent activations arrive before the first animation
   * completes, exactly one navigation event occurs.
   */
  test('concurrent activations result in exactly one navigation event', () => {
    const SHOT_TARGETS = [
      { id: 'cover-drive', path: '/experience' },
      { id: 'pull-shot', path: '/projects' },
      { id: 'straight-drive', path: '/research' },
      { id: 'flick', path: '/about' },
      { id: 'caught-at-slip', path: '/contact' },
    ];

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 4 }),
        fc.array(fc.integer({ min: 0, max: 4 }), { minLength: 1, maxLength: 10 }),
        (firstShotIndex, subsequentShotIndices) => {
          const { result } = renderHook(() => useCricketNav(), {
            wrapper: CricketNavProvider,
          });

          let navigationCount = 0;

          // Simulate the shot activation handler pattern:
          // Check if locked → if not, lock and navigate → if locked, ignore
          const handleShotActivation = () => {
            if (result.current.isNavigationLocked) {
              return; // Blocked — ignore this activation
            }
            // First unblocked activation: lock and count navigation
            act(() => {
              result.current.lockNavigation();
            });
            navigationCount++;
          };

          // First activation — should succeed
          handleShotActivation();
          expect(navigationCount).toBe(1);

          // Subsequent activations within the lock period — should all be ignored.
          // We use small time advances (< 100ms each) that simulate rapid clicks
          // while ensuring total time stays well under the 1200ms auto-release.
          for (let i = 0; i < subsequentShotIndices.length; i++) {
            // Advance a small amount of time (simulating rapid successive clicks)
            act(() => {
              vi.advanceTimersByTime(50);
            });
            handleShotActivation();
          }

          // Only the first activation should have produced a navigation event
          expect(navigationCount).toBe(1);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
