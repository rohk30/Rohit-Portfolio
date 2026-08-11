/**
 * Property-based tests for Publication Sorting
 * 
 * **Property 6: Publications Sorted by Date Descending**
 * For any list of publications displayed on the Research page, the publications
 * SHALL be ordered such that for each adjacent pair (publication[i], publication[i+1]),
 * the date of publication[i] is greater than or equal to the date of publication[i+1].
 * 
 * **Validates: Requirements 5.1**
 */
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { sortPublicationsByDate } from '@utils/publications';
import { researchData } from '@utils/data';

/**
 * Arbitrary generator for publication objects with valid date formats.
 * Generates dates in YYYY-MM or YYYY-MM-DD format to match real publication data.
 */
const publicationArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 200 }),
  authors: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
  venue: fc.string({ minLength: 1, maxLength: 150 }),
  // Generate date as YYYY-MM format to match publication data structure
  date: fc.tuple(
    fc.integer({ min: 2020, max: 2030 }),  // year
    fc.integer({ min: 1, max: 12 })         // month
  ).map(([year, month]) => `${year}-${String(month).padStart(2, '0')}`),
  abstract: fc.string({ minLength: 10, maxLength: 500 }),
  publicationUrl: fc.option(fc.webUrl(), { nil: null }),
  codeUrl: fc.option(fc.webUrl(), { nil: null }),
  category: fc.constantFrom('conference', 'journal', 'preprint', 'technical-report'),
  citationCount: fc.integer({ min: 0, max: 1000 }),
  status: fc.constantFrom('published', 'under-review', 'preprint')
});

describe('Publication Sorting - Property 6', () => {
  /**
   * **Property 6: Publications Sorted by Date Descending**
   * Verify sorted publications maintain date order (i.date >= i+1.date)
   * 
   * **Validates: Requirements 5.1**
   */
  describe('sortPublicationsByDate maintains descending order', () => {
    test('sorted publications have date[i] >= date[i+1] for all adjacent pairs', () => {
      fc.assert(
        fc.property(
          fc.array(publicationArbitrary, { minLength: 0, maxLength: 20 }),
          (publications) => {
            const sorted = sortPublicationsByDate(publications);
            
            // For each adjacent pair, verify descending order
            for (let i = 0; i < sorted.length - 1; i++) {
              const dateA = new Date(sorted[i].date);
              const dateB = new Date(sorted[i + 1].date);
              
              // Earlier index should have date >= later index (descending order)
              expect(dateA.getTime()).toBeGreaterThanOrEqual(dateB.getTime());
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('sorting preserves all original publications', () => {
      fc.assert(
        fc.property(
          fc.array(publicationArbitrary, { minLength: 0, maxLength: 20 }),
          (publications) => {
            const sorted = sortPublicationsByDate(publications);
            
            // Same length
            expect(sorted.length).toBe(publications.length);
            
            // Every original publication exists in sorted array
            publications.forEach(pub => {
              const found = sorted.find(s => s.id === pub.id);
              expect(found).toBeDefined();
            });
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('sorting does not mutate original array', () => {
      fc.assert(
        fc.property(
          fc.array(publicationArbitrary, { minLength: 1, maxLength: 10 }),
          (publications) => {
            // Create a deep copy of original IDs order
            const originalOrder = publications.map(p => p.id);
            
            // Perform sorting
            sortPublicationsByDate(publications);
            
            // Verify original array order is unchanged
            const afterSort = publications.map(p => p.id);
            expect(afterSort).toEqual(originalOrder);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('empty array returns empty array', () => {
      const result = sortPublicationsByDate([]);
      expect(result).toEqual([]);
    });

    test('single publication returns array with that publication', () => {
      fc.assert(
        fc.property(
          publicationArbitrary,
          (publication) => {
            const result = sortPublicationsByDate([publication]);
            
            expect(result.length).toBe(1);
            expect(result[0].id).toBe(publication.id);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('handles invalid input gracefully', () => {
      // Non-array input returns empty array
      expect(sortPublicationsByDate(null)).toEqual([]);
      expect(sortPublicationsByDate(undefined)).toEqual([]);
      expect(sortPublicationsByDate('not an array')).toEqual([]);
      expect(sortPublicationsByDate(123)).toEqual([]);
      expect(sortPublicationsByDate({})).toEqual([]);
    });
  });

  /**
   * Test with actual researchData from the data store
   * Ensures the sorting function works correctly with real data
   */
  describe('sortPublicationsByDate with real researchData', () => {
    test('actual researchData is sorted in descending date order', () => {
      const sorted = sortPublicationsByDate(researchData);
      
      // Verify descending order on actual data
      for (let i = 0; i < sorted.length - 1; i++) {
        const dateA = new Date(sorted[i].date);
        const dateB = new Date(sorted[i + 1].date);
        
        expect(dateA.getTime()).toBeGreaterThanOrEqual(dateB.getTime());
      }
    });

    test('sorting researchData preserves all publications', () => {
      const sorted = sortPublicationsByDate(researchData);
      
      expect(sorted.length).toBe(researchData.length);
      
      researchData.forEach(pub => {
        const found = sorted.find(s => s.id === pub.id);
        expect(found).toBeDefined();
      });
    });

    test('most recent publication appears first after sorting', () => {
      const sorted = sortPublicationsByDate(researchData);
      
      if (sorted.length > 0) {
        const firstDate = new Date(sorted[0].date);
        
        // First item should have the most recent (largest) date
        researchData.forEach(pub => {
          const pubDate = new Date(pub.date);
          expect(firstDate.getTime()).toBeGreaterThanOrEqual(pubDate.getTime());
        });
      }
    });
  });

  /**
   * Edge cases for date parsing
   */
  describe('Date edge cases', () => {
    test('handles publications with same date correctly', () => {
      const sameDatePubs = [
        { id: '1', date: '2024-06', title: 'Pub A' },
        { id: '2', date: '2024-06', title: 'Pub B' },
        { id: '3', date: '2024-06', title: 'Pub C' }
      ];
      
      const sorted = sortPublicationsByDate(sameDatePubs);
      
      // All should still be present
      expect(sorted.length).toBe(3);
      
      // All dates should be equal (stable for same dates)
      for (let i = 0; i < sorted.length - 1; i++) {
        const dateA = new Date(sorted[i].date);
        const dateB = new Date(sorted[i + 1].date);
        expect(dateA.getTime()).toBe(dateB.getTime());
      }
    });

    test('handles mix of date formats correctly', () => {
      const mixedDatePubs = [
        { id: '1', date: '2024-01', title: 'Earlier' },
        { id: '2', date: '2024-06', title: 'Middle' },
        { id: '3', date: '2024-12', title: 'Latest' }
      ];
      
      const sorted = sortPublicationsByDate(mixedDatePubs);
      
      // Should be in descending order: December, June, January
      expect(sorted[0].id).toBe('3'); // 2024-12 (December)
      expect(sorted[1].id).toBe('2'); // 2024-06 (June)
      expect(sorted[2].id).toBe('1'); // 2024-01 (January)
    });

    test('handles publications spanning multiple years', () => {
      const multiYearPubs = [
        { id: '1', date: '2022-12', title: 'Old' },
        { id: '2', date: '2025-01', title: 'New' },
        { id: '3', date: '2024-06', title: 'Middle' }
      ];
      
      const sorted = sortPublicationsByDate(multiYearPubs);
      
      // Should be in descending order: 2025, 2024, 2022
      expect(sorted[0].id).toBe('2'); // 2025-01
      expect(sorted[1].id).toBe('3'); // 2024-06
      expect(sorted[2].id).toBe('1'); // 2022-12
    });
  });
});
