/**
 * Property-based tests for Visited Sections Filtering in PlayNextBallWidget
 *
 * **Property 5: Visited sections filtering in PlayNextBallWidget**
 *
 * For any subset of visited section paths (from the set {/experience, /projects,
 * /research, /about, /contact}), the PlayNextBallWidget SHALL display shot targets
 * for exactly (allSections - visitedSections) when the visited set is a proper subset,
 * and SHALL display targets for ALL sections when visitedSections equals the full set.
 *
 * **Validates: Requirements 4.2, 4.3, 4.4**
 */
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { getAvailableShotTargets } from '@utils/shotFiltering';
import { SHOT_TARGETS } from '../../config/shotNavigation.js';

// All section paths from SHOT_TARGETS
const ALL_SECTION_PATHS = SHOT_TARGETS.map(t => t.path);

describe('Visited Sections Filtering - Property 5', () => {
  /**
   * **Property 5.1: Proper subset of visited → show only unvisited**
   *
   * When visitedSections is a proper subset of all section paths,
   * the widget displays shot targets for exactly (allSections - visitedSections).
   *
   * **Validates: Requirements 4.2, 4.3**
   */
  test('proper subset of visited sections → returns only unvisited targets', () => {
    fc.assert(
      fc.property(
        // Generate proper subsets (0 to 4 elements, never all 5)
        fc.subarray(ALL_SECTION_PATHS, { minLength: 0, maxLength: ALL_SECTION_PATHS.length - 1 }),
        (visitedPaths) => {
          const visited = new Set(visitedPaths);
          const result = getAvailableShotTargets(visited);

          // Result should contain exactly the unvisited sections
          const expectedPaths = ALL_SECTION_PATHS.filter(p => !visited.has(p));

          expect(result.map(t => t.path).sort()).toEqual(expectedPaths.sort());
          expect(result.length).toBe(ALL_SECTION_PATHS.length - visited.size);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 5.2: Full set visited → show all sections**
   *
   * When visitedSections equals the full set of all section paths,
   * the widget displays shot targets for ALL sections.
   *
   * **Validates: Requirements 4.4**
   */
  test('all sections visited → returns all shot targets', () => {
    fc.assert(
      fc.property(
        // Always generate the full set (use constant)
        fc.constant(ALL_SECTION_PATHS),
        (visitedPaths) => {
          const visited = new Set(visitedPaths);
          const result = getAvailableShotTargets(visited);

          // Should return all 5 targets
          expect(result.length).toBe(SHOT_TARGETS.length);
          expect(result.map(t => t.path).sort()).toEqual(ALL_SECTION_PATHS.sort());
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 5.3: Unvisited targets are never excluded when proper subset**
   *
   * For any proper subset of visited paths, every unvisited section
   * must appear in the result.
   *
   * **Validates: Requirements 4.2, 4.3**
   */
  test('unvisited targets are always included in result', () => {
    fc.assert(
      fc.property(
        fc.subarray(ALL_SECTION_PATHS, { minLength: 0, maxLength: ALL_SECTION_PATHS.length - 1 }),
        (visitedPaths) => {
          const visited = new Set(visitedPaths);
          const result = getAvailableShotTargets(visited);
          const resultPaths = new Set(result.map(t => t.path));

          // Every unvisited path must be in the result
          for (const path of ALL_SECTION_PATHS) {
            if (!visited.has(path)) {
              expect(resultPaths.has(path)).toBe(true);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 5.4: Visited targets are excluded when proper subset**
   *
   * For any proper subset of visited paths, no visited section
   * should appear in the result.
   *
   * **Validates: Requirements 4.3**
   */
  test('visited targets are excluded from result when proper subset', () => {
    fc.assert(
      fc.property(
        fc.subarray(ALL_SECTION_PATHS, { minLength: 1, maxLength: ALL_SECTION_PATHS.length - 1 }),
        (visitedPaths) => {
          const visited = new Set(visitedPaths);
          const result = getAvailableShotTargets(visited);
          const resultPaths = new Set(result.map(t => t.path));

          // No visited path should be in the result
          for (const path of visitedPaths) {
            expect(resultPaths.has(path)).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 5.5: Result always references valid SHOT_TARGETS entries**
   *
   * For any subset of visited paths, the returned targets are always
   * valid entries from SHOT_TARGETS (not new or mutated objects).
   *
   * **Validates: Requirements 4.2**
   */
  test('result targets are valid SHOT_TARGETS entries', () => {
    fc.assert(
      fc.property(
        fc.subarray(ALL_SECTION_PATHS, { minLength: 0, maxLength: ALL_SECTION_PATHS.length }),
        (visitedPaths) => {
          const visited = new Set(visitedPaths);
          const result = getAvailableShotTargets(visited);

          // Every result entry should be a reference to a SHOT_TARGETS item
          for (const target of result) {
            const original = SHOT_TARGETS.find(t => t.id === target.id);
            expect(original).toBeDefined();
            expect(target).toBe(original);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 5.6: Empty visited set → all sections shown**
   *
   * When no sections have been visited, all targets are displayed
   * (this is a special case of proper subset where visited = ∅).
   *
   * **Validates: Requirements 4.2**
   */
  test('empty visited set returns all shot targets', () => {
    const visited = new Set();
    const result = getAvailableShotTargets(visited);

    expect(result.length).toBe(SHOT_TARGETS.length);
    expect(result.map(t => t.path).sort()).toEqual(ALL_SECTION_PATHS.sort());
  });
});
