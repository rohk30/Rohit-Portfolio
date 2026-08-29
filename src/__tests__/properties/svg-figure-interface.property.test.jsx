// Feature: cricket-visual-overhaul, Property 5: SVG Figure Interface Preservation
/**
 * Property-based tests for SVG Figure Interface Preservation
 *
 * **Validates: Requirements 3.5, 4.5**
 * - Requirement 3.5: SilhouetteBowler maintains its interface (x, y, rotate, scale, fill, className)
 * - Requirement 4.5: SilhouetteBatsman maintains its interface (className, style, spread props)
 *
 * Property: For any valid prop set (x, y, rotate, scale, fill, className for SilhouetteBowler;
 * className, style, spread props for SilhouetteBatsman), the component SHALL render without
 * throwing an error AND SHALL apply the provided values to the root <motion.g> or <g> element
 * respectively.
 */
import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import SilhouetteBowler from '@components/cricket/SilhouetteBowler';
import SilhouetteBatsman from '@components/cricket/SilhouetteBatsman';

describe('SVG Figure Interface Preservation - Property 5', () => {
  /**
   * Property 5a: SilhouetteBowler renders without error for any valid prop set
   * and applies fill to path elements and className to the root group.
   * **Validates: Requirements 3.5**
   */
  test('SilhouetteBowler renders without error and applies props for any valid prop combination', () => {
    fc.assert(
      fc.property(
        fc.record({
          x: fc.integer({ min: -500, max: 500 }),
          y: fc.integer({ min: -500, max: 500 }),
          rotate: fc.integer({ min: -720, max: 720 }),
          scale: fc.double({ min: 0.1, max: 10, noNaN: true }),
          fill: fc.tuple(
            fc.integer({ min: 0, max: 255 }),
            fc.integer({ min: 0, max: 255 }),
            fc.integer({ min: 0, max: 255 })
          ).map(([r, g, b]) => `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`),
          className: fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9_-]{0,29}$/),
        }),
        (props) => {
          // Component SHALL render without throwing an error
          const { container } = render(
            <svg viewBox="0 0 200 120">
              <SilhouetteBowler {...props} />
            </svg>
          );

          const svg = container.querySelector('svg');

          // Root element should be a <g> (motion.g renders as <g> in JSDOM)
          const rootGroup = svg.querySelector('g');
          expect(rootGroup).not.toBeNull();

          // className SHALL be applied to root group element
          expect(rootGroup.getAttribute('class')).toContain(props.className);

          // fill SHALL be applied to all path elements
          const paths = svg.querySelectorAll('path');
          expect(paths.length).toBeGreaterThan(0);
          for (const path of paths) {
            expect(path.getAttribute('fill')).toBe(props.fill);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5b: SilhouetteBowler applies numeric transform props (x, y, rotate, scale)
   * to the root motion.g element style.
   * **Validates: Requirements 3.5**
   */
  test('SilhouetteBowler applies transform props to root motion.g element style', () => {
    fc.assert(
      fc.property(
        fc.record({
          x: fc.integer({ min: -200, max: 200 }),
          y: fc.integer({ min: -200, max: 200 }),
          rotate: fc.integer({ min: -360, max: 360 }),
          scale: fc.double({ min: 0.5, max: 3, noNaN: true }),
        }),
        (props) => {
          const { container } = render(
            <svg viewBox="0 0 200 120">
              <SilhouetteBowler {...props} />
            </svg>
          );

          const svg = container.querySelector('svg');
          const rootGroup = svg.querySelector('g');
          expect(rootGroup).not.toBeNull();

          // motion.g renders with a style attribute containing transform values
          const style = rootGroup.getAttribute('style');
          expect(style).toBeTruthy();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5c: SilhouetteBatsman renders without error for any valid prop set
   * and applies className to the root <g> element.
   * **Validates: Requirements 4.5**
   */
  test('SilhouetteBatsman renders without error and applies className for any valid props', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9_-]{0,29}$/),
        (className) => {
          const { container } = render(
            <svg viewBox="0 0 200 120">
              <SilhouetteBatsman className={className} />
            </svg>
          );

          const svg = container.querySelector('svg');

          // Root element should be a <g>
          const rootGroup = svg.querySelector('g');
          expect(rootGroup).not.toBeNull();

          // className SHALL be applied to the root <g> element
          expect(rootGroup.getAttribute('class')).toContain(className);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5d: SilhouetteBatsman applies style prop to the root <g> element.
   * **Validates: Requirements 4.5**
   */
  test('SilhouetteBatsman applies style prop to root g element for any valid style object', () => {
    fc.assert(
      fc.property(
        fc.record({
          opacity: fc.option(fc.double({ min: 0, max: 1, noNaN: true }), { nil: undefined }),
          color: fc.option(
            fc.tuple(
              fc.integer({ min: 0, max: 255 }),
              fc.integer({ min: 0, max: 255 }),
              fc.integer({ min: 0, max: 255 })
            ).map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`),
            { nil: undefined }
          ),
        }).map((obj) => {
          const style = {};
          if (obj.opacity !== undefined) style.opacity = obj.opacity;
          if (obj.color !== undefined) style.color = obj.color;
          return style;
        }),
        (style) => {
          const { container } = render(
            <svg viewBox="0 0 200 120">
              <SilhouetteBatsman style={style} />
            </svg>
          );

          const svg = container.querySelector('svg');
          const rootGroup = svg.querySelector('g');
          expect(rootGroup).not.toBeNull();

          // style SHALL be applied to the root <g> element
          const appliedStyle = rootGroup.getAttribute('style');
          if (Object.keys(style).length > 0) {
            expect(appliedStyle).toBeTruthy();
          }

          // Verify specific style properties are set
          if (style.opacity !== undefined) {
            expect(appliedStyle).toContain('opacity');
          }
          if (style.color !== undefined) {
            expect(appliedStyle).toContain('color');
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5e: SilhouetteBatsman accepts spread props (data-* attributes) and
   * maintains aria-hidden="true" on root element.
   * **Validates: Requirements 4.5**
   */
  test('SilhouetteBatsman applies spread props and maintains aria-hidden="true"', () => {
    fc.assert(
      fc.property(
        fc.record({
          className: fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9_-]{0,19}$/),
          dataTestid: fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9_-]{0,19}$/),
          dataCustom: fc.stringMatching(/^[a-zA-Z0-9_-]{1,20}$/),
        }),
        (props) => {
          const { container } = render(
            <svg viewBox="0 0 200 120">
              <SilhouetteBatsman
                className={props.className}
                data-testid={props.dataTestid}
                data-custom={props.dataCustom}
              />
            </svg>
          );

          const svg = container.querySelector('svg');
          const rootGroup = svg.querySelector('g');
          expect(rootGroup).not.toBeNull();

          // aria-hidden="true" SHALL always be present (decorative element)
          expect(rootGroup.getAttribute('aria-hidden')).toBe('true');

          // className SHALL be applied
          expect(rootGroup.getAttribute('class')).toContain(props.className);

          // data-* spread props SHALL be forwarded to root element
          expect(rootGroup.getAttribute('data-testid')).toBe(props.dataTestid);
          expect(rootGroup.getAttribute('data-custom')).toBe(props.dataCustom);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
