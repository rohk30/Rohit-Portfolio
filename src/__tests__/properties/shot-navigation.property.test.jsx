/**
 * Property-based tests for Shot Navigation
 *
 * **Property 2: Shot activation completes navigation and moves focus**
 * - For any shot target in SHOT_TARGETS, when the target is activated
 *   (via click, Enter, or Space) and the ball trajectory animation completes,
 *   the system SHALL navigate to the target's configured path AND move document
 *   focus to the destination section's heading element.
 *
 * This test validates that ShotNavigation correctly communicates the shot
 * selection to its parent via onShotSelect. The actual navigation (React Router
 * push) and focus management happen in the parent (CricketGroundHero).
 *
 * **Validates: Requirements 3.4, 9.6**
 */
import { describe, test, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, fireEvent } from '@testing-library/react';
import ShotNavigation from '@components/cricket/ShotNavigation';
import { SHOT_TARGETS } from '../../config/shotNavigation.js';

describe('Shot Navigation - Property 2: Shot activation completes navigation and moves focus', () => {
  /**
   * **Property 2.1: Click activation calls onShotSelect with correct target**
   * For any shot target in SHOT_TARGETS, clicking the target SHALL call
   * onShotSelect exactly once with the full shot target object (containing
   * id, path, label, ariaLabel).
   *
   * **Validates: Requirements 3.4, 9.6**
   */
  test('click activation calls onShotSelect with the correct shot target', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SHOT_TARGETS),
        (shotTarget) => {
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
            `button[aria-label="${shotTarget.ariaLabel}"]`
          );
          expect(button).not.toBeNull();

          // Click activation
          fireEvent.click(button);

          // onShotSelect should be called exactly once
          expect(onShotSelect).toHaveBeenCalledTimes(1);

          // Should be called with the correct shot target object
          const calledWith = onShotSelect.mock.calls[0][0];
          expect(calledWith.id).toBe(shotTarget.id);
          expect(calledWith.path).toBe(shotTarget.path);
          expect(calledWith.label).toBe(shotTarget.label);
          expect(calledWith.ariaLabel).toBe(shotTarget.ariaLabel);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 2.2: Enter key activation calls onShotSelect with correct target**
   * For any shot target in SHOT_TARGETS, pressing Enter on the focused target
   * SHALL call onShotSelect exactly once with the full shot target object.
   *
   * **Validates: Requirements 3.4, 9.6**
   */
  test('Enter key activation calls onShotSelect with the correct shot target', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SHOT_TARGETS),
        (shotTarget) => {
          const onShotSelect = vi.fn();

          const { container } = render(
            <ShotNavigation
              visible={true}
              shots={SHOT_TARGETS}
              onShotSelect={onShotSelect}
            />
          );

          const button = container.querySelector(
            `button[aria-label="${shotTarget.ariaLabel}"]`
          );
          expect(button).not.toBeNull();

          // Enter key activation
          fireEvent.keyDown(button, { key: 'Enter' });

          // onShotSelect should be called exactly once
          expect(onShotSelect).toHaveBeenCalledTimes(1);

          // Should be called with the correct shot target
          const calledWith = onShotSelect.mock.calls[0][0];
          expect(calledWith.id).toBe(shotTarget.id);
          expect(calledWith.path).toBe(shotTarget.path);
          expect(calledWith.label).toBe(shotTarget.label);
          expect(calledWith.ariaLabel).toBe(shotTarget.ariaLabel);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 2.3: Space key activation calls onShotSelect with correct target**
   * For any shot target in SHOT_TARGETS, pressing Space on the focused target
   * SHALL call onShotSelect exactly once with the full shot target object.
   *
   * **Validates: Requirements 3.4, 9.6**
   */
  test('Space key activation calls onShotSelect with the correct shot target', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SHOT_TARGETS),
        (shotTarget) => {
          const onShotSelect = vi.fn();

          const { container } = render(
            <ShotNavigation
              visible={true}
              shots={SHOT_TARGETS}
              onShotSelect={onShotSelect}
            />
          );

          const button = container.querySelector(
            `button[aria-label="${shotTarget.ariaLabel}"]`
          );
          expect(button).not.toBeNull();

          // Space key activation
          fireEvent.keyDown(button, { key: ' ' });

          // onShotSelect should be called exactly once
          expect(onShotSelect).toHaveBeenCalledTimes(1);

          // Should be called with the correct shot target
          const calledWith = onShotSelect.mock.calls[0][0];
          expect(calledWith.id).toBe(shotTarget.id);
          expect(calledWith.path).toBe(shotTarget.path);
          expect(calledWith.label).toBe(shotTarget.label);
          expect(calledWith.ariaLabel).toBe(shotTarget.ariaLabel);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 2.4: Any activation method produces exactly one onShotSelect call**
   * For any shot target and any activation method (click, Enter, Space),
   * a single activation SHALL produce exactly one onShotSelect call.
   *
   * **Validates: Requirements 3.4, 9.6**
   */
  test('any activation method produces exactly one onShotSelect call', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SHOT_TARGETS),
        fc.constantFrom('click', 'Enter', ' '),
        (shotTarget, activationMethod) => {
          const onShotSelect = vi.fn();

          const { container } = render(
            <ShotNavigation
              visible={true}
              shots={SHOT_TARGETS}
              onShotSelect={onShotSelect}
            />
          );

          const button = container.querySelector(
            `button[aria-label="${shotTarget.ariaLabel}"]`
          );
          expect(button).not.toBeNull();

          // Activate using the chosen method
          if (activationMethod === 'click') {
            fireEvent.click(button);
          } else {
            fireEvent.keyDown(button, { key: activationMethod });
          }

          // Exactly one call regardless of activation method
          expect(onShotSelect).toHaveBeenCalledTimes(1);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 2.5: Shot target object contains all required fields for navigation**
   * For any shot target in SHOT_TARGETS activated by any method, the object
   * passed to onShotSelect SHALL contain id, path, label, and ariaLabel fields
   * necessary for navigation and focus management.
   *
   * **Validates: Requirements 3.4, 9.6**
   */
  test('shot target object contains all required fields (id, path, label, ariaLabel)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SHOT_TARGETS),
        fc.constantFrom('click', 'Enter', ' '),
        (shotTarget, activationMethod) => {
          const onShotSelect = vi.fn();

          const { container } = render(
            <ShotNavigation
              visible={true}
              shots={SHOT_TARGETS}
              onShotSelect={onShotSelect}
            />
          );

          const button = container.querySelector(
            `button[aria-label="${shotTarget.ariaLabel}"]`
          );
          expect(button).not.toBeNull();

          if (activationMethod === 'click') {
            fireEvent.click(button);
          } else {
            fireEvent.keyDown(button, { key: activationMethod });
          }

          const calledWith = onShotSelect.mock.calls[0][0];

          // Verify all required fields exist and are non-empty strings
          expect(typeof calledWith.id).toBe('string');
          expect(calledWith.id.length).toBeGreaterThan(0);

          expect(typeof calledWith.path).toBe('string');
          expect(calledWith.path.length).toBeGreaterThan(0);
          expect(calledWith.path.startsWith('/')).toBe(true);

          expect(typeof calledWith.label).toBe('string');
          expect(calledWith.label.length).toBeGreaterThan(0);

          expect(typeof calledWith.ariaLabel).toBe('string');
          expect(calledWith.ariaLabel.length).toBeGreaterThan(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
