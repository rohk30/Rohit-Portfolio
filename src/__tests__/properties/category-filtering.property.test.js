/**
 * Property-based tests for Publication Category Filtering
 * 
 * **Property 9: Publication Category Filtering**
 * - Verify filtering returns only publications matching selected category
 * - Verify clearing filter shows all publications
 * - Verify empty categories are not rendered
 * 
 * **Validates: Requirements 5.6, 5.8, 5.9**
 */
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { 
  filterByCategory, 
  groupByCategory, 
  getUniqueCategories 
} from '@utils/publications';
import { researchData } from '@utils/data';

// Valid publication categories from the data model
const validCategories = ['conference', 'journal', 'preprint', 'technical-report'];

/**
 * Date string arbitrary generator
 * Generates valid date strings in YYYY-MM format (matching researchData format)
 */
const dateArbitrary = fc.tuple(
  fc.integer({ min: 2020, max: 2025 }),
  fc.integer({ min: 1, max: 12 })
).map(([year, month]) => `${year}-${String(month).padStart(2, '0')}`);

/**
 * Publication arbitrary generator
 * Generates random valid publication objects for property testing
 */
const publicationArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 200 }),
  authors: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
  venue: fc.string({ minLength: 1, maxLength: 100 }),
  date: dateArbitrary,
  abstract: fc.string({ minLength: 10, maxLength: 500 }),
  publicationUrl: fc.oneof(fc.constant(null), fc.webUrl()),
  codeUrl: fc.oneof(fc.constant(null), fc.webUrl()),
  category: fc.constantFrom(...validCategories),
  citationCount: fc.nat({ max: 1000 }),
  status: fc.constantFrom('published', 'under-review', 'preprint'),
});

/**
 * Arbitrary for generating arrays of publications
 */
const publicationsArrayArbitrary = fc.array(publicationArbitrary, { minLength: 0, maxLength: 20 });

describe('Publication Category Filtering - Property 9', () => {
  /**
   * **Property 9.1: Filtering by category returns only matching publications**
   * 
   * When a specific category is selected, only publications with that category
   * SHALL be displayed.
   * 
   * **Validates: Requirements 5.6**
   */
  describe('Filtering returns only matching category', () => {
    test('filtering by category returns only publications with that category', () => {
      fc.assert(
        fc.property(
          publicationsArrayArbitrary,
          fc.constantFrom(...validCategories),
          (publications, category) => {
            const filtered = filterByCategory(publications, category);
            
            // All filtered publications must have the selected category
            filtered.forEach(pub => {
              expect(pub.category).toBe(category);
            });
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('filtering returns subset of original publications', () => {
      fc.assert(
        fc.property(
          publicationsArrayArbitrary,
          fc.constantFrom(...validCategories),
          (publications, category) => {
            const filtered = filterByCategory(publications, category);
            
            // Filtered count should be <= original count
            expect(filtered.length).toBeLessThanOrEqual(publications.length);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('filtering preserves all publications matching the category', () => {
      fc.assert(
        fc.property(
          publicationsArrayArbitrary,
          fc.constantFrom(...validCategories),
          (publications, category) => {
            const filtered = filterByCategory(publications, category);
            const expectedCount = publications.filter(p => p.category === category).length;
            
            // Filtered count should match expected count
            expect(filtered.length).toBe(expectedCount);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('filtering with actual research data returns correct category', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...validCategories),
          (category) => {
            const filtered = filterByCategory(researchData, category);
            
            // All filtered publications must have the selected category
            filtered.forEach(pub => {
              expect(pub.category).toBe(category);
            });
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Property 9.2: Clearing filter shows all publications**
   * 
   * When the filter is cleared (null category), all publications SHALL be
   * displayed grouped by their respective categories.
   * 
   * **Validates: Requirements 5.8**
   */
  describe('Clearing filter shows all publications', () => {
    test('null category returns all publications', () => {
      fc.assert(
        fc.property(
          publicationsArrayArbitrary,
          (publications) => {
            const filtered = filterByCategory(publications, null);
            
            // All publications should be returned
            expect(filtered.length).toBe(publications.length);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('undefined category returns all publications', () => {
      fc.assert(
        fc.property(
          publicationsArrayArbitrary,
          (publications) => {
            const filtered = filterByCategory(publications, undefined);
            
            // All publications should be returned
            expect(filtered.length).toBe(publications.length);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('clearing filter preserves all original publications', () => {
      fc.assert(
        fc.property(
          publicationsArrayArbitrary,
          (publications) => {
            const filtered = filterByCategory(publications, null);
            
            // Each original publication should be in filtered result
            publications.forEach(pub => {
              expect(filtered).toContainEqual(pub);
            });
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('filter to category then clear restores all publications', () => {
      fc.assert(
        fc.property(
          publicationsArrayArbitrary,
          fc.constantFrom(...validCategories),
          (publications, category) => {
            // Filter by category first
            const filtered = filterByCategory(publications, category);
            
            // Then clear filter (simulate user clearing filter)
            const restored = filterByCategory(publications, null);
            
            // Restored should equal original publications
            expect(restored.length).toBe(publications.length);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Property 9.3: Empty categories have no entries**
   * 
   * When no publications exist in a category, that category section SHALL NOT
   * be rendered (groupByCategory returns empty array for that category).
   * 
   * **Validates: Requirements 5.9**
   */
  describe('Empty categories are not rendered', () => {
    test('groupByCategory does not include categories with no publications', () => {
      fc.assert(
        fc.property(
          publicationsArrayArbitrary,
          (publications) => {
            const grouped = groupByCategory(publications);
            
            // Each category in grouped result should have at least one publication
            Object.keys(grouped).forEach(category => {
              expect(grouped[category].length).toBeGreaterThan(0);
            });
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('categories without publications are absent from grouped result', () => {
      fc.assert(
        fc.property(
          publicationsArrayArbitrary,
          (publications) => {
            const grouped = groupByCategory(publications);
            const presentCategories = Object.keys(grouped);
            const actualCategories = getUniqueCategories(publications);
            
            // Grouped categories should exactly match actual categories in data
            expect(presentCategories.sort()).toEqual(actualCategories.sort());
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('filtering by non-existent category returns empty array', () => {
      fc.assert(
        fc.property(
          fc.array(publicationArbitrary.filter(p => p.category === 'conference'), { minLength: 1, maxLength: 10 }),
          (conferenceOnlyPubs) => {
            // Filter by a category that doesn't exist in the data
            const filtered = filterByCategory(conferenceOnlyPubs, 'journal');
            
            // Should return empty array
            expect(filtered).toEqual([]);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('getUniqueCategories returns only categories present in publications', () => {
      fc.assert(
        fc.property(
          publicationsArrayArbitrary,
          (publications) => {
            const uniqueCategories = getUniqueCategories(publications);
            
            // Each unique category must exist in at least one publication
            uniqueCategories.forEach(category => {
              const hasCategory = publications.some(pub => pub.category === category);
              expect(hasCategory).toBe(true);
            });
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Property 9.4: Filtering preserves publication integrity**
   * 
   * Filtered publications should maintain all their original fields and values.
   */
  describe('Filtering preserves publication integrity', () => {
    test('filtered publications are not mutated', () => {
      fc.assert(
        fc.property(
          publicationsArrayArbitrary,
          fc.constantFrom(...validCategories),
          (publications, category) => {
            // Create deep copies for comparison
            const originalPublications = JSON.parse(JSON.stringify(publications));
            
            // Perform filtering
            filterByCategory(publications, category);
            
            // Original publications should not be mutated
            expect(publications).toEqual(originalPublications);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('filtered publications maintain all original fields', () => {
      fc.assert(
        fc.property(
          publicationsArrayArbitrary,
          fc.constantFrom(...validCategories),
          (publications, category) => {
            const filtered = filterByCategory(publications, category);
            
            // Each filtered publication should have all required fields
            filtered.forEach(pub => {
              expect(pub).toHaveProperty('id');
              expect(pub).toHaveProperty('title');
              expect(pub).toHaveProperty('authors');
              expect(pub).toHaveProperty('venue');
              expect(pub).toHaveProperty('date');
              expect(pub).toHaveProperty('abstract');
              expect(pub).toHaveProperty('category');
              expect(pub).toHaveProperty('status');
            });
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Property 9.5: Edge cases for category filtering**
   */
  describe('Edge cases', () => {
    test('filtering empty array returns empty array', () => {
      validCategories.forEach(category => {
        const filtered = filterByCategory([], category);
        expect(filtered).toEqual([]);
      });
    });

    test('filtering with null publications array returns empty array', () => {
      const filtered = filterByCategory(null, 'conference');
      expect(filtered).toEqual([]);
    });

    test('groupByCategory with empty array returns empty object', () => {
      const grouped = groupByCategory([]);
      expect(grouped).toEqual({});
    });

    test('getUniqueCategories with empty array returns empty array', () => {
      const categories = getUniqueCategories([]);
      expect(categories).toEqual([]);
    });

    test('filtering with invalid category returns empty array', () => {
      fc.assert(
        fc.property(
          publicationsArrayArbitrary,
          fc.string({ minLength: 1 }).filter(s => !validCategories.includes(s)),
          (publications, invalidCategory) => {
            const filtered = filterByCategory(publications, invalidCategory);
            
            // Should return empty array for invalid category
            expect(filtered).toEqual([]);
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * **Property 9.6: Real data validation**
   * Verify filtering works correctly with actual researchData
   */
  describe('Real data validation', () => {
    test('filterByCategory with real researchData returns correct results', () => {
      validCategories.forEach(category => {
        const filtered = filterByCategory(researchData, category);
        const expected = researchData.filter(pub => pub.category === category);
        
        expect(filtered.length).toBe(expected.length);
        filtered.forEach(pub => {
          expect(pub.category).toBe(category);
        });
      });
    });

    test('groupByCategory with real researchData groups correctly', () => {
      const grouped = groupByCategory(researchData);
      
      // Verify each group contains only publications of that category
      Object.entries(grouped).forEach(([category, publications]) => {
        publications.forEach(pub => {
          expect(pub.category).toBe(category);
        });
      });
      
      // Verify total count matches original
      const totalGrouped = Object.values(grouped).flat().length;
      expect(totalGrouped).toBe(researchData.length);
    });

    test('getUniqueCategories with real researchData returns actual categories', () => {
      const categories = getUniqueCategories(researchData);
      
      // Each category should exist in researchData
      categories.forEach(category => {
        const hasCategory = researchData.some(pub => pub.category === category);
        expect(hasCategory).toBe(true);
      });
    });
  });
});
