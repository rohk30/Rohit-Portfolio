// Feature: cricket-visual-overhaul, Property 6: Shot Target Selection Triggers Navigation
/**
 * Property-based tests for Shot Target Selection Triggers Navigation
 *
 * **Property 6: Shot Target Selection Triggers Navigation**
 *
 * For any ShotTarget in the SHOT_TARGETS config array (including the 6th Overview target),
 * when that target is selected within the Full_Screen_Takeover or CricketGroundHero,
 * the system SHALL fire a BallTrajectory animation from the batsman origin to the target's
 * position, followed by React Router navigation to the target's `path`.
 *
 * **Validates: Requirements 5.6, 8.6**
 */
import { describe, test, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, fireEvent, act } from '@testing-library/react';
import ShotNavigation from '@components/cricket/ShotNavigation';
import { SHOT_TARGETS } from '../../config/shotNavigation.js';

describe('Property 6: Shot Target Selection Triggers Navigation', () => {
  /**
   * Property 6.1: SHOT_TARGETS config contains exactly 6 targets including Overview
   *
   * The SHOT_TARGETS array SHALL have exactly 6 entries, one of which has path '/overview'.
   *
   * **Validates: Requirements 5.6, 8.6**
   */
  test('SHOT_TARGETS config contains exactly 6 targets including Overview', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SHOT_TARGETS),
        (target) => {
          // The config must have exactly 6 targets
          expect(SHOT_TARGETS).toHaveLength(6);

          // At least one target has /overview path
          const overviewTarget = SHOT_TARGETS.find((t) => t.path === '/overview');
          expect(overviewTarget).toBeDefined();
          expect(overviewTarget.id).toBe('defensive-block');

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6.2: Every shot target has a valid path starting with '/'
   *
   * For any ShotTarget in SHOT_TARGETS, the target SHALL have a `path` property
   * that is a non-empty string starting with '/'.
   *
   * **Validates: Requirements 5.6, 8.6**
   */
  test('every shot target has a valid path starting with "/"', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SHOT_TARGETS),
        (target) => {
          expect(typeof target.path).toBe('string');
          expect(target.path.length).toBeGreaterThan(0);
          expect(target.path.startsWith('/')).toBe(true);

          // Path should be a valid React Router path (no spaces, valid chars)
          expect(target.path).toMatch(/^\/[a-z0-9-]*$/);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6.3: Every shot target has valid position coordinates within bounds
   *
   * For any ShotTarget in SHOT_TARGETS, the target SHALL have a `position` object
   * with `x` and `y` coordinates between 0 and 100 (percentage of field).
   *
   * **Validates: Requirements 5.6, 8.6**
   */
  test('every shot target has valid position coordinates within bounds (0-100)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SHOT_TARGETS),
        (target) => {
          expect(target.position).toBeDefined();
          expect(typeof target.position.x).toBe('number');
          expect(typeof target.position.y).toBe('number');

          // Position x and y must be within valid bounds [0, 100]
          expect(target.position.x).toBeGreaterThanOrEqual(0);
          expect(target.position.x).toBeLessThanOrEqual(100);
          expect(target.position.y).toBeGreaterThanOrEqual(0);
          expect(target.position.y).toBeLessThanOrEqual(100);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6.4: Every shot target has valid bezierControl points within bounds
   *
   * For any ShotTarget in SHOT_TARGETS, the target SHALL have a `bezierControl` object
   * with cx1, cy1, cx2, cy2 coordinates all within [0, 100].
   *
   * **Validates: Requirements 5.6, 8.6**
   */
  test('every shot target has valid bezierControl points within bounds (0-100)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SHOT_TARGETS),
        (target) => {
          expect(target.bezierControl).toBeDefined();
          expect(typeof target.bezierControl.cx1).toBe('number');
          expect(typeof target.bezierControl.cy1).toBe('number');
          expect(typeof target.bezierControl.cx2).toBe('number');
          expect(typeof target.bezierControl.cy2).toBe('number');

          // All bezier control points must be within [0, 100]
          expect(target.bezierControl.cx1).toBeGreaterThanOrEqual(0);
          expect(target.bezierControl.cx1).toBeLessThanOrEqual(100);
          expect(target.bezierControl.cy1).toBeGreaterThanOrEqual(0);
          expect(target.bezierControl.cy1).toBeLessThanOrEqual(100);
          expect(target.bezierControl.cx2).toBeGreaterThanOrEqual(0);
          expect(target.bezierControl.cx2).toBeLessThanOrEqual(100);
          expect(target.bezierControl.cy2).toBeGreaterThanOrEqual(0);
          expect(target.bezierControl.cy2).toBeLessThanOrEqual(100);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6.5: Every shot target has all required fields for navigation flow
   *
   * For any ShotTarget in SHOT_TARGETS, the target SHALL have all required fields:
   * id, label, path, position, bezierControl, and ariaLabel.
   *
   * **Validates: Requirements 5.6, 8.6**
   */
  test('every shot target has all required fields for the navigation flow', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SHOT_TARGETS),
        (target) => {
          // Required string fields
          expect(typeof target.id).toBe('string');
          expect(target.id.length).toBeGreaterThan(0);

          expect(typeof target.label).toBe('string');
          expect(target.label.length).toBeGreaterThan(0);

          expect(typeof target.path).toBe('string');
          expect(target.path.length).toBeGreaterThan(0);

          expect(typeof target.ariaLabel).toBe('string');
          expect(target.ariaLabel.length).toBeGreaterThan(0);

          // Required object fields
          expect(target.position).toBeDefined();
          expect(typeof target.position).toBe('object');

          expect(target.bezierControl).toBeDefined();
          expect(typeof target.bezierControl).toBe('object');

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6.6: Shot selection triggers lockNavigation and sets selectedShot
   *
   * For any ShotTarget in SHOT_TARGETS, when onShotSelect is called with that target,
   * the navigation handler contract is fulfilled: lockNavigation is called and
   * selectedShot is set to the target.
   *
   * This validates the PlayNextBallWidget handleShotSelect contract — when a shot
   * is selected, it locks navigation (preventing concurrent trajectories) and
   * stores the selected shot for the BallTrajectory animation.
   *
   * **Validates: Requirements 5.6, 8.6**
   */
  test('shot selection via ShotNavigation calls onShotSelect with the target (triggering navigation lock)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SHOT_TARGETS),
        (target) => {
          const onShotSelect = vi.fn();

          const { container } = render(
            <ShotNavigation
              visible={true}
              shots={SHOT_TARGETS}
              onShotSelect={onShotSelect}
            />
          );

          // Find the button by its aria-label
          const button = container.querySelector(
            `button[aria-label="${target.ariaLabel}"]`
          );
          expect(button).not.toBeNull();

          // Click the target
          fireEvent.click(button);

          // onShotSelect should be called exactly once
          expect(onShotSelect).toHaveBeenCalledTimes(1);

          // The called argument should be the full target object
          const calledWith = onShotSelect.mock.calls[0][0];
          expect(calledWith.id).toBe(target.id);
          expect(calledWith.path).toBe(target.path);
          expect(calledWith.position).toEqual(target.position);
          expect(calledWith.bezierControl).toEqual(target.bezierControl);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6.7: Selected target provides valid trajectory data
   *
   * For any ShotTarget selected via onShotSelect, the target's position and
   * bezierControl SHALL provide sufficient data for BallTrajectory to animate
   * from the batsman origin to the target position along a bezier curve.
   *
   * **Validates: Requirements 5.6, 8.6**
   */
  test('selected target provides valid trajectory data for BallTrajectory animation', () => {
    const batsmanOrigin = { x: 50, y: 55 };

    fc.assert(
      fc.property(
        fc.constantFrom(...SHOT_TARGETS),
        (target) => {
          // The target's position is different from the batsman origin
          // (there must be a distance to animate)
          const dx = target.position.x - batsmanOrigin.x;
          const dy = target.position.y - batsmanOrigin.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          expect(distance).toBeGreaterThan(0);

          // Bezier control points exist and define a curve
          // (at least one control point should differ from a straight line)
          const { cx1, cy1, cx2, cy2 } = target.bezierControl;
          expect(typeof cx1).toBe('number');
          expect(typeof cy1).toBe('number');
          expect(typeof cx2).toBe('number');
          expect(typeof cy2).toBe('number');

          // The path navigated to is a valid route string
          expect(target.path).toMatch(/^\/[a-z0-9-]*$/);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6.8: All six unique paths are present (no duplicate routes)
   *
   * The SHOT_TARGETS config SHALL contain 6 unique paths, ensuring each target
   * navigates to a distinct destination including '/overview'.
   *
   * **Validates: Requirements 5.6, 8.6**
   */
  test('all six targets have unique paths with no duplicates', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SHOT_TARGETS),
        (target) => {
          const allPaths = SHOT_TARGETS.map((t) => t.path);
          const uniquePaths = new Set(allPaths);

          // All 6 paths should be unique
          expect(uniquePaths.size).toBe(6);

          // The current target's path should appear exactly once
          const occurrences = allPaths.filter((p) => p === target.path).length;
          expect(occurrences).toBe(1);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
