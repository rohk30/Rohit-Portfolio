/**
 * Property-based tests for keyboard activation parity
 *
 * **Validates: Requirements 3.7**
 * - Requirement 3.7: THE Shot_Navigation targets SHALL be focusable via keyboard
 *   Tab navigation and activatable via Enter or Space key press, triggering the
 *   same Ball_Trajectory animation and navigation as a mouse click.
 *
 * Property 4: Keyboard activation produces identical behavior to pointer activation
 * For any shot target, activating it via Enter key or Space key while focused SHALL
 * trigger the same ball trajectory animation and navigation as a pointer click, with
 * no difference in trajectory path, duration, or destination.
 */
import { describe, test, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import ShotNavigation from '../../components/cricket/ShotNavigation';
import { SHOT_TARGETS } from '../../config/shotNavigation';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, onKeyDown, ...props }) => {
      // Extract only valid HTML attributes from framer-motion props
      const {
        initial, animate, exit, transition, whileHover, whileTap,
        variants, layout, layoutId, ...htmlProps
      } = props;
      return (
        <button onClick={onClick} onKeyDown={onKeyDown} {...htmlProps}>
          {children}
        </button>
      );
    },
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('Keyboard Activation Parity Property Tests', () => {
  // Generator: pick a shot target index from SHOT_TARGETS
  const shotTargetIndexArb = fc.integer({ min: 0, max: SHOT_TARGETS.length - 1 });

  // Generator: activation method
  const activationMethodArb = fc.constantFrom('click', 'Enter', 'Space');

  /**
   * Property 4.1: Each activation method (click, Enter, Space) calls onShotSelect
   * with the same shot target object
   * **Validates: Requirements 3.7**
   *
   * For any shot target, activating via click, Enter, or Space shall call
   * onShotSelect with the identical shot target object.
   */
  test('each activation method calls onShotSelect with the same shot target object', () => {
    fc.assert(
      fc.property(
        shotTargetIndexArb,
        activationMethodArb,
        (shotIndex, method) => {
          const shot = SHOT_TARGETS[shotIndex];
          const onShotSelect = vi.fn();

          const { container } = render(
            <ShotNavigation
              visible={true}
              shots={SHOT_TARGETS}
              onShotSelect={onShotSelect}
            />
          );

          // Find the button by aria-label
          const button = container.querySelector(
            `button[aria-label="${shot.ariaLabel}"]`
          );
          expect(button).not.toBeNull();

          // Activate using the specified method
          if (method === 'click') {
            fireEvent.click(button);
          } else if (method === 'Enter') {
            fireEvent.keyDown(button, { key: 'Enter' });
          } else {
            // Space
            fireEvent.keyDown(button, { key: ' ' });
          }

          // Verify onShotSelect was called with the correct shot target
          expect(onShotSelect).toHaveBeenCalledTimes(1);
          expect(onShotSelect).toHaveBeenCalledWith(
            expect.objectContaining({
              id: shot.id,
              label: shot.label,
              path: shot.path,
              ariaLabel: shot.ariaLabel,
            })
          );

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.2: The shot target passed to onShotSelect is identical regardless
   * of activation method
   * **Validates: Requirements 3.7**
   *
   * For any shot target, the argument passed to onShotSelect must be identical
   * whether activated via click, Enter, or Space.
   */
  test('shot target passed to onShotSelect is identical regardless of activation method', () => {
    fc.assert(
      fc.property(
        shotTargetIndexArb,
        (shotIndex) => {
          const shot = SHOT_TARGETS[shotIndex];

          // Collect the argument passed to onShotSelect for each method
          const results = {};

          for (const method of ['click', 'Enter', 'Space']) {
            const onShotSelect = vi.fn();

            const { container, unmount } = render(
              <ShotNavigation
                visible={true}
                shots={SHOT_TARGETS}
                onShotSelect={onShotSelect}
              />
            );

            const button = container.querySelector(
              `button[aria-label="${shot.ariaLabel}"]`
            );
            expect(button).not.toBeNull();

            if (method === 'click') {
              fireEvent.click(button);
            } else if (method === 'Enter') {
              fireEvent.keyDown(button, { key: 'Enter' });
            } else {
              fireEvent.keyDown(button, { key: ' ' });
            }

            expect(onShotSelect).toHaveBeenCalledTimes(1);
            results[method] = onShotSelect.mock.calls[0][0];

            unmount();
          }

          // All three methods should produce the exact same shot target object
          expect(results['click']).toEqual(results['Enter']);
          expect(results['click']).toEqual(results['Space']);
          expect(results['Enter']).toEqual(results['Space']);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.3: All 3 activation methods produce exactly one call per activation
   * **Validates: Requirements 3.7**
   *
   * For any shot target and any activation method, a single activation event
   * shall produce exactly one call to onShotSelect.
   */
  test('all 3 activation methods produce exactly one call per activation', () => {
    fc.assert(
      fc.property(
        shotTargetIndexArb,
        activationMethodArb,
        (shotIndex, method) => {
          const shot = SHOT_TARGETS[shotIndex];
          const onShotSelect = vi.fn();

          const { container } = render(
            <ShotNavigation
              visible={true}
              shots={SHOT_TARGETS}
              onShotSelect={onShotSelect}
            />
          );

          const button = container.querySelector(
            `button[aria-label="${shot.ariaLabel}"]`
          );
          expect(button).not.toBeNull();

          // Before activation: no calls
          expect(onShotSelect).toHaveBeenCalledTimes(0);

          // Perform single activation
          if (method === 'click') {
            fireEvent.click(button);
          } else if (method === 'Enter') {
            fireEvent.keyDown(button, { key: 'Enter' });
          } else {
            fireEvent.keyDown(button, { key: ' ' });
          }

          // After activation: exactly one call
          expect(onShotSelect).toHaveBeenCalledTimes(1);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
