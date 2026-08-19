// Feature: cricket-visual-overhaul, Property 4: SVG Figure Structural Integrity
/**
 * Property-based tests for SVG Figure Structural Integrity
 *
 * **Validates: Requirements 3.3, 4.3**
 * - Requirement 3.3: SilhouetteBowler uses only <path> elements with cubic bezier (C/c) commands
 * - Requirement 4.3: SilhouetteBatsman uses only <path> elements with cubic bezier (C/c) commands
 *
 * Property: For any valid prop combination passed to SilhouetteBowler or SilhouetteBatsman,
 * the rendered SVG output SHALL contain zero <circle>, <rect>, or <polygon> elements used
 * as body parts — all figure contours SHALL be composed exclusively of <path> elements
 * whose d attribute contains cubic bezier commands (C or c).
 */
import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import SilhouetteBowler from '@components/cricket/SilhouetteBowler';
import SilhouetteBatsman from '@components/cricket/SilhouetteBatsman';

describe('SVG Figure Structural Integrity - Property 4', () => {
  /**
   * Property 4a: SilhouetteBowler contains no circle, rect, or polygon elements
   * and all path elements use cubic bezier commands.
   * **Validates: Requirements 3.3**
   */
  test('SilhouetteBowler renders only path elements with cubic bezier commands for any valid props', () => {
    fc.assert(
      fc.property(
        fc.record({
          x: fc.integer({ min: -200, max: 200 }),
          y: fc.integer({ min: -200, max: 200 }),
          rotate: fc.integer({ min: -360, max: 360 }),
          scale: fc.double({ min: 0.1, max: 5, noNaN: true }),
          fill: fc.tuple(
            fc.integer({ min: 0, max: 255 }),
            fc.integer({ min: 0, max: 255 }),
            fc.integer({ min: 0, max: 255 })
          ).map(([r, g, b]) => `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`),
          className: fc.string({ minLength: 0, maxLength: 30 }),
        }),
        (props) => {
          const { container } = render(
            <svg viewBox="0 0 200 120">
              <SilhouetteBowler {...props} />
            </svg>
          );

          const svg = container.querySelector('svg');

          // 1. Zero <circle>, <rect>, <polygon> elements in the output
          const circles = svg.querySelectorAll('circle');
          const rects = svg.querySelectorAll('rect');
          const polygons = svg.querySelectorAll('polygon');

          expect(circles.length).toBe(0);
          expect(rects.length).toBe(0);
          expect(polygons.length).toBe(0);

          // 2. All <path> elements have a d attribute containing at least one cubic bezier command (C or c)
          const paths = svg.querySelectorAll('path');
          expect(paths.length).toBeGreaterThan(0);

          for (const path of paths) {
            const d = path.getAttribute('d');
            expect(d).toBeTruthy();
            // Must contain at least one cubic bezier command (C or c)
            expect(d).toMatch(/[Cc]/);
          }

          // 3. SilhouetteBowler has ≤8 path elements
          expect(paths.length).toBeLessThanOrEqual(8);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4b: SilhouetteBatsman contains no circle, rect, or polygon elements
   * and all path elements use cubic bezier commands.
   * **Validates: Requirements 4.3**
   */
  test('SilhouetteBatsman renders only path elements with cubic bezier commands for any valid props', () => {
    fc.assert(
      fc.property(
        fc.record({
          className: fc.string({ minLength: 0, maxLength: 30 }),
          style: fc.tuple(
            fc.option(
              fc.tuple(
                fc.integer({ min: 0, max: 255 }),
                fc.integer({ min: 0, max: 255 }),
                fc.integer({ min: 0, max: 255 })
              ).map(([r, g, b]) => `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`),
              { nil: undefined }
            ),
            fc.option(fc.double({ min: 0, max: 1, noNaN: true }), { nil: undefined }),
            fc.option(fc.constantFrom('none', 'scale(1)', 'rotate(0deg)'), { nil: undefined }),
          ).map(([color, opacity, transform]) => {
            const style = {};
            if (color !== undefined) style.color = color;
            if (opacity !== undefined) style.opacity = opacity;
            if (transform !== undefined) style.transform = transform;
            return style;
          }),
          'data-testid': fc.string({ minLength: 0, maxLength: 20 }),
        }),
        (props) => {
          const { container } = render(
            <svg viewBox="0 0 200 120">
              <SilhouetteBatsman {...props} />
            </svg>
          );

          const svg = container.querySelector('svg');

          // 1. Zero <circle>, <rect>, <polygon> elements in the output
          const circles = svg.querySelectorAll('circle');
          const rects = svg.querySelectorAll('rect');
          const polygons = svg.querySelectorAll('polygon');

          expect(circles.length).toBe(0);
          expect(rects.length).toBe(0);
          expect(polygons.length).toBe(0);

          // 2. All <path> elements have a d attribute containing at least one cubic bezier command (C or c)
          const paths = svg.querySelectorAll('path');
          expect(paths.length).toBeGreaterThan(0);

          for (const path of paths) {
            const d = path.getAttribute('d');
            expect(d).toBeTruthy();
            // Must contain at least one cubic bezier command (C or c)
            expect(d).toMatch(/[Cc]/);
          }

          // 4. SilhouetteBatsman has ≥5 path elements
          expect(paths.length).toBeGreaterThanOrEqual(5);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
