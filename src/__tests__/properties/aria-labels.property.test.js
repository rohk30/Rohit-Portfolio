/**
 * Property-based tests for Aria-labels on Shot Targets
 *
 * **Property 9: Aria-labels contain destination and shot name**
 * For any shot target rendered in ShotNavigation or PlayNextBallWidget,
 * the element's aria-label attribute SHALL contain both the destination
 * section name (e.g., "Experience") and the associated cricket shot name
 * (e.g., "Cover drive").
 *
 * **Validates: Requirements 9.1**
 */
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { SHOT_TARGETS } from '../../config/shotNavigation.js';

/**
 * Maps a route path to the expected section name that should appear
 * in the aria-label. The path "/experience" maps to "Experience", etc.
 */
function getSectionNameFromPath(path) {
  const sectionMap = {
    '/experience': 'Experience',
    '/projects': 'Projects',
    '/research': 'Research',
    '/about': 'About',
    '/contact': 'Contact',
    '/overview': 'Overview',
  };
  return sectionMap[path] || null;
}

describe('Aria-labels contain destination and shot name - Property 9', () => {
  /**
   * **Property 9.1: Each shot target's ariaLabel contains the destination section name**
   * For any shot target, the ariaLabel must include the section name
   * derived from its navigation path.
   *
   * **Validates: Requirements 9.1**
   */
  test('ariaLabel contains the destination section name for every shot target', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SHOT_TARGETS),
        (target) => {
          const sectionName = getSectionNameFromPath(target.path);

          // The section name must be derivable from the path
          expect(sectionName).not.toBeNull();

          // The ariaLabel must contain the section name (case-insensitive check)
          expect(target.ariaLabel.toLowerCase()).toContain(
            sectionName.toLowerCase()
          );

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 9.2: Each shot target's ariaLabel contains the cricket shot name**
   * For any shot target, the ariaLabel must include the shot label name
   * (e.g., "Cover drive", "Pull shot", "Flick").
   *
   * **Validates: Requirements 9.1**
   */
  test('ariaLabel contains the cricket shot name for every shot target', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SHOT_TARGETS),
        (target) => {
          // The ariaLabel must contain the shot name (case-insensitive check)
          expect(target.ariaLabel.toLowerCase()).toContain(
            target.label.toLowerCase()
          );

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 9.3: Each shot target's ariaLabel contains BOTH destination and shot name**
   * Combined property: for any shot target, both the section name and the
   * cricket shot name must be present simultaneously in the ariaLabel.
   *
   * **Validates: Requirements 9.1**
   */
  test('ariaLabel contains both destination section name and cricket shot name simultaneously', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SHOT_TARGETS),
        (target) => {
          const sectionName = getSectionNameFromPath(target.path);

          expect(sectionName).not.toBeNull();

          const ariaLabelLower = target.ariaLabel.toLowerCase();

          // Must contain destination section name
          const containsSection = ariaLabelLower.includes(
            sectionName.toLowerCase()
          );

          // Must contain cricket shot name
          const containsShot = ariaLabelLower.includes(
            target.label.toLowerCase()
          );

          expect(containsSection).toBe(true);
          expect(containsShot).toBe(true);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 9.4: ariaLabel is a non-empty string for every shot target**
   * Structural validation: the ariaLabel field must exist and be non-empty.
   *
   * **Validates: Requirements 9.1**
   */
  test('ariaLabel is a non-empty string for every shot target', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SHOT_TARGETS),
        (target) => {
          expect(target).toHaveProperty('ariaLabel');
          expect(typeof target.ariaLabel).toBe('string');
          expect(target.ariaLabel.length).toBeGreaterThan(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
