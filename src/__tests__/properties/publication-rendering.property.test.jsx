/**
 * Property-based tests for Publication Data Rendering Completeness
 * 
 * **Property 7: Publication Data Rendering Completeness**
 * For any publication object in the data store, the Research page SHALL render
 * a card displaying the title, all authors, venue, publication date, abstract,
 * citation count, and status. Additionally, where a publication has a codeUrl,
 * the rendered card SHALL include a link to that repository.
 * 
 * **Validates: Requirements 5.3, 5.5, 5.7**
 */
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import PublicationCard from '@components/sections/PublicationCard';
import { researchData } from '@utils/data';

describe('Publication Data Rendering Completeness - Property 7', () => {
  /**
   * Property 7.1: PublicationCard renders title for any publication object
   * 
   * For any publication object from the data store, the PublicationCard
   * SHALL display the title field.
   * 
   * **Validates: Requirements 5.3**
   */
  test('PublicationCard renders title for all publication objects', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...researchData),
        (publication) => {
          const { container, unmount } = render(
            <PublicationCard publication={publication} />
          );

          // Title should be rendered
          expect(container.textContent).toContain(publication.title);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7.2: PublicationCard renders all authors for any publication object
   * 
   * For any publication object from the data store, the PublicationCard
   * SHALL display all authors from the authors array.
   * 
   * **Validates: Requirements 5.3**
   */
  test('PublicationCard renders all authors for all publication objects', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...researchData),
        (publication) => {
          const { container, unmount } = render(
            <PublicationCard publication={publication} />
          );

          // All authors should be rendered
          publication.authors.forEach((author) => {
            expect(container.textContent).toContain(author);
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7.3: PublicationCard renders venue for any publication object
   * 
   * For any publication object from the data store, the PublicationCard
   * SHALL display the venue field.
   * 
   * **Validates: Requirements 5.3**
   */
  test('PublicationCard renders venue for all publication objects', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...researchData),
        (publication) => {
          const { container, unmount } = render(
            <PublicationCard publication={publication} />
          );

          // Venue should be rendered
          expect(container.textContent).toContain(publication.venue);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7.4: PublicationCard renders date for any publication object
   * 
   * For any publication object from the data store, the PublicationCard
   * SHALL display the publication date. The component may format the date
   * (e.g., "2024-12" becomes "December 2024"), so we check for year presence.
   * 
   * **Validates: Requirements 5.3**
   */
  test('PublicationCard renders date for all publication objects', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...researchData),
        (publication) => {
          const { container, unmount } = render(
            <PublicationCard publication={publication} />
          );

          // Extract the year from the date for verification
          // Date format can be "YYYY-MM" or "YYYY"
          const year = publication.date.split('-')[0];
          expect(container.textContent).toContain(year);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7.5: PublicationCard renders abstract for any publication object
   * 
   * For any publication object from the data store, the PublicationCard
   * SHALL display the abstract field.
   * 
   * **Validates: Requirements 5.3**
   */
  test('PublicationCard renders abstract for all publication objects', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...researchData),
        (publication) => {
          const { container, unmount } = render(
            <PublicationCard publication={publication} />
          );

          // Abstract should be rendered (may be truncated with line-clamp)
          // Check that at least the beginning of the abstract is present
          const abstractStart = publication.abstract.substring(0, 50);
          expect(container.textContent).toContain(abstractStart);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7.6: PublicationCard renders citation count for any publication object
   * 
   * For any publication object from the data store, the PublicationCard
   * SHALL display the citation count.
   * 
   * **Validates: Requirements 5.7**
   */
  test('PublicationCard renders citation count for all publication objects', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...researchData),
        (publication) => {
          const { container, unmount } = render(
            <PublicationCard publication={publication} />
          );

          // Citation count should be rendered (as "X citation(s)")
          const citationText = publication.citationCount === 1 
            ? '1 citation' 
            : `${publication.citationCount} citations`;
          expect(container.textContent).toContain(citationText);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7.7: PublicationCard renders status for any publication object
   * 
   * For any publication object from the data store, the PublicationCard
   * SHALL display the publication status badge.
   * 
   * **Validates: Requirements 5.7**
   */
  test('PublicationCard renders status for all publication objects', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...researchData),
        (publication) => {
          const { container, unmount } = render(
            <PublicationCard publication={publication} />
          );

          // Status should be rendered in a readable format
          const statusMap = {
            'published': 'Published',
            'under-review': 'Under Review',
            'preprint': 'Preprint'
          };
          const expectedStatus = statusMap[publication.status] || publication.status;
          expect(container.textContent).toContain(expectedStatus);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7.8: PublicationCard shows code repository link when codeUrl exists
   * 
   * For any publication object with a codeUrl, the PublicationCard
   * SHALL include a link to that code repository.
   * 
   * **Validates: Requirements 5.5**
   */
  test('PublicationCard shows code repository link when codeUrl exists', () => {
    // Filter publications that have codeUrl
    const publicationsWithCode = researchData.filter(pub => pub.codeUrl);
    
    if (publicationsWithCode.length === 0) {
      // Skip test if no publications have codeUrl
      return;
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...publicationsWithCode),
        (publication) => {
          const { container, unmount } = render(
            <PublicationCard publication={publication} />
          );

          // Code link should be rendered for publications with codeUrl
          const codeLink = container.querySelector(`a[href="${publication.codeUrl}"]`);
          expect(codeLink).toBeTruthy();
          expect(container.textContent).toContain('Code');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7.9: PublicationCard hides code repository link when no codeUrl
   * 
   * For any publication object without a codeUrl (null or undefined),
   * the PublicationCard SHALL NOT include a code repository link.
   * 
   * **Validates: Requirements 5.5**
   */
  test('PublicationCard hides code repository link when no codeUrl', () => {
    // Filter publications that do NOT have codeUrl
    const publicationsWithoutCode = researchData.filter(pub => !pub.codeUrl);
    
    if (publicationsWithoutCode.length === 0) {
      // Skip test if all publications have codeUrl
      return;
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...publicationsWithoutCode),
        (publication) => {
          const { container, unmount } = render(
            <PublicationCard publication={publication} />
          );

          // There should be no link containing "Code" text that isn't a publication URL
          const allLinks = container.querySelectorAll('a');
          const codeLinks = Array.from(allLinks).filter(link => 
            link.textContent.includes('Code') && 
            !link.getAttribute('href')?.includes(publication.publicationUrl)
          );
          expect(codeLinks.length).toBe(0);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7.10: PublicationCard renders all required fields for any publication
   * 
   * For any publication object from the data store, the PublicationCard
   * SHALL render ALL required fields (title, authors, venue, date, abstract,
   * citation count, status) and conditionally render code repository link.
   * This is the comprehensive property test verifying complete data rendering.
   * 
   * **Validates: Requirements 5.3, 5.5, 5.7**
   */
  test('PublicationCard renders all required fields for any publication object', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...researchData),
        (publication) => {
          const { container, unmount } = render(
            <PublicationCard publication={publication} />
          );

          const textContent = container.textContent;

          // Verify title is rendered
          expect(textContent).toContain(publication.title);

          // Verify all authors are rendered
          publication.authors.forEach((author) => {
            expect(textContent).toContain(author);
          });

          // Verify venue is rendered
          expect(textContent).toContain(publication.venue);

          // Verify year from date is rendered (date may be formatted)
          const year = publication.date.split('-')[0];
          expect(textContent).toContain(year);

          // Verify abstract beginning is rendered
          const abstractStart = publication.abstract.substring(0, 50);
          expect(textContent).toContain(abstractStart);

          // Verify citation count is rendered
          const citationText = publication.citationCount === 1 
            ? '1 citation' 
            : `${publication.citationCount} citations`;
          expect(textContent).toContain(citationText);

          // Verify status is rendered
          const statusMap = {
            'published': 'Published',
            'under-review': 'Under Review',
            'preprint': 'Preprint'
          };
          const expectedStatus = statusMap[publication.status] || publication.status;
          expect(textContent).toContain(expectedStatus);

          // Verify code repository link is present only when codeUrl exists
          if (publication.codeUrl) {
            const codeLink = container.querySelector(`a[href="${publication.codeUrl}"]`);
            expect(codeLink).toBeTruthy();
          } else {
            // No code link should exist
            const allLinks = container.querySelectorAll('a');
            const codeLinks = Array.from(allLinks).filter(link => 
              link.textContent.includes('Code')
            );
            expect(codeLinks.length).toBe(0);
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7.11: PublicationCard renders correctly for any valid generated publication
   * 
   * For any randomly generated publication object that matches the schema,
   * the PublicationCard SHALL render all required fields correctly.
   * This tests the component's ability to handle any valid publication data.
   * 
   * **Validates: Requirements 5.3, 5.5, 5.7**
   */
  test('PublicationCard renders correctly for any valid generated publication', () => {
    // Arbitrary for generating valid publication objects
    // Use simple URLs without special characters that could cause selector issues
    const publicationArbitrary = fc.record({
      id: fc.uuid(),
      title: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
      authors: fc.array(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        { minLength: 1, maxLength: 5 }
      ),
      venue: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      date: fc.oneof(
        // YYYY-MM format
        fc.tuple(
          fc.integer({ min: 2020, max: 2030 }),
          fc.integer({ min: 1, max: 12 })
        ).map(([year, month]) => `${year}-${month.toString().padStart(2, '0')}`),
        // YYYY format
        fc.integer({ min: 2020, max: 2030 }).map(year => year.toString())
      ),
      abstract: fc.string({ minLength: 50, maxLength: 500 }).filter(s => s.trim().length > 0),
      publicationUrl: fc.option(
        fc.constantFrom(
          'https://example.com/paper1',
          'https://doi.org/10.1234/test',
          'https://arxiv.org/abs/1234.5678'
        ),
        { nil: null }
      ),
      codeUrl: fc.option(
        fc.constantFrom(
          'https://github.com/user/repo',
          'https://gitlab.com/user/project'
        ),
        { nil: null }
      ),
      category: fc.constantFrom('conference', 'journal', 'preprint', 'technical-report'),
      citationCount: fc.nat({ max: 1000 }),
      status: fc.constantFrom('published', 'under-review', 'preprint')
    });

    fc.assert(
      fc.property(
        publicationArbitrary,
        (publication) => {
          const { container, unmount } = render(
            <PublicationCard publication={publication} />
          );

          const textContent = container.textContent;

          // Verify title is rendered
          expect(textContent).toContain(publication.title);

          // Verify all authors are rendered
          publication.authors.forEach((author) => {
            expect(textContent).toContain(author);
          });

          // Verify venue is rendered
          expect(textContent).toContain(publication.venue);

          // Verify year from date is rendered
          const year = publication.date.split('-')[0];
          expect(textContent).toContain(year);

          // Verify abstract beginning is rendered
          const abstractStart = publication.abstract.substring(0, 50);
          expect(textContent).toContain(abstractStart);

          // Verify citation count is rendered
          const citationText = publication.citationCount === 1 
            ? '1 citation' 
            : `${publication.citationCount} citations`;
          expect(textContent).toContain(citationText);

          // Verify status is rendered
          const statusMap = {
            'published': 'Published',
            'under-review': 'Under Review',
            'preprint': 'Preprint'
          };
          const expectedStatus = statusMap[publication.status] || publication.status;
          expect(textContent).toContain(expectedStatus);

          // Verify code link presence matches codeUrl existence
          if (publication.codeUrl) {
            // Find all links and check if any point to the code URL
            const allLinks = Array.from(container.querySelectorAll('a'));
            const codeLinks = allLinks.filter(link => 
              link.getAttribute('href') === publication.codeUrl
            );
            expect(codeLinks.length).toBeGreaterThan(0);
          } else {
            // No code link should exist
            const allLinks = container.querySelectorAll('a');
            const codeLinks = Array.from(allLinks).filter(link => 
              link.textContent.includes('Code')
            );
            expect(codeLinks.length).toBe(0);
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
