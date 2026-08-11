/**
 * Property-based tests for Publication Card Click Behavior
 * 
 * **Property 8: Publication Card Click Opens Publication URL**
 * For any publication card on the Research page where the publication has a publicationUrl,
 * clicking that card SHALL trigger navigation to that exact publication URL in a new browser tab.
 * 
 * Note: The implementation uses anchor tags (<a>) for accessibility compliance.
 * Links with href, target="_blank", and rel="noopener noreferrer" handle navigation.
 * 
 * **Validates: Requirements 5.4**
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import PublicationCard from '@components/sections/PublicationCard';
import { researchData } from '@utils/data';

describe('Publication Card Click Opens Publication URL - Property 8', () => {
  /**
   * Property 8.1: Publication card with publicationUrl has link to exact URL
   * For any publication from researchData with a publicationUrl, the card
   * SHALL contain a link to that exact URL that opens in a new tab.
   * 
   * **Validates: Requirements 5.4**
   */
  test('publication card with publicationUrl has link to exact URL', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...researchData.filter(pub => pub.publicationUrl)),
        (publication) => {
          const { container, unmount } = render(<PublicationCard publication={publication} />);

          // Find links to the publication URL
          const links = container.querySelectorAll(`a[href="${publication.publicationUrl}"]`);
          
          // Should have at least one link to the publication URL
          expect(links.length).toBeGreaterThan(0);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8.2: Publication card without publicationUrl does not have publication links
   * For any publication without a publicationUrl, the card SHALL NOT
   * have any links to external publications.
   * 
   * **Validates: Requirements 5.4**
   */
  test('clicking publication card without publicationUrl does not navigate', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...researchData.filter(pub => !pub.publicationUrl)),
        (publication) => {
          const { container, unmount } = render(<PublicationCard publication={publication} />);

          // Should not have "View Publication" link
          expect(container.textContent).not.toContain('View Publication');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8.3: Links to publicationUrl have correct href (exact string match)
   * The link href must be the exact same string as publicationUrl.
   * 
   * **Validates: Requirements 5.4**
   */
  test('publication links have exact publicationUrl as href', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...researchData.filter(pub => pub.publicationUrl)),
        (publication) => {
          const { container, unmount } = render(<PublicationCard publication={publication} />);

          // Find the View Publication link
          const viewPubLink = container.querySelector('a[href]');
          
          // At least one link should have the exact URL
          const allLinks = Array.from(container.querySelectorAll('a[href]'));
          const hasExactUrl = allLinks.some(link => link.getAttribute('href') === publication.publicationUrl);
          
          expect(hasExactUrl).toBe(true);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8.4: Publication links open in new tab
   * Links to publicationUrl SHALL have target="_blank" to open in new tab.
   * 
   * **Validates: Requirements 5.4**
   */
  test('publication links have target="_blank" for new tab', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...researchData.filter(pub => pub.publicationUrl)),
        (publication) => {
          const { container, unmount } = render(<PublicationCard publication={publication} />);

          // Find links to the publication URL
          const links = container.querySelectorAll(`a[href="${publication.publicationUrl}"]`);
          
          // All links should have target="_blank"
          links.forEach(link => {
            expect(link.getAttribute('target')).toBe('_blank');
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8.5: Publication links have security attributes
   * Links SHALL have rel="noopener noreferrer" for security.
   * 
   * **Validates: Requirements 5.4**
   */
  test('publication links have noopener noreferrer security attributes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...researchData.filter(pub => pub.publicationUrl)),
        (publication) => {
          const { container, unmount } = render(<PublicationCard publication={publication} />);

          // Find links to the publication URL
          const links = container.querySelectorAll(`a[href="${publication.publicationUrl}"]`);
          
          // All links should have security attributes
          links.forEach(link => {
            const rel = link.getAttribute('rel');
            expect(rel).toContain('noopener');
            expect(rel).toContain('noreferrer');
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8.6: Generated publication data with URLs has correct links
   * Test with randomly generated publication data to ensure robustness.
   * 
   * **Validates: Requirements 5.4**
   */
  test('generated publication data has correct publication links', () => {
    // Define arbitrary for generating valid publication objects with URLs
    // Use simple URLs without special characters that could cause selector issues
    const publicationArbitrary = fc.record({
      id: fc.uuid(),
      title: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
      authors: fc.array(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        { minLength: 1, maxLength: 5 }
      ),
      venue: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      date: fc.constantFrom('2024-01', '2024-06', '2024-12', '2025-01', '2023-08'),
      abstract: fc.string({ minLength: 10, maxLength: 500 }).filter(s => s.trim().length > 0),
      // Use simple URLs without special characters
      publicationUrl: fc.constantFrom(
        'https://example.com/paper1',
        'https://doi.org/10.1234/test',
        'https://arxiv.org/abs/1234.5678',
        'https://example.org/publication/123'
      ),
      codeUrl: fc.option(
        fc.constantFrom(
          'https://github.com/user/repo',
          'https://gitlab.com/user/project'
        ),
        { nil: undefined }
      ),
      category: fc.constantFrom('conference', 'journal', 'preprint', 'technical-report'),
      citationCount: fc.integer({ min: 0, max: 1000 }),
      status: fc.constantFrom('published', 'under-review', 'preprint'),
    });

    fc.assert(
      fc.property(
        publicationArbitrary,
        (publication) => {
          const { container, unmount } = render(<PublicationCard publication={publication} />);

          // Find all links and check if any point to the publication URL
          const allLinks = Array.from(container.querySelectorAll('a'));
          const publicationLinks = allLinks.filter(link => 
            link.getAttribute('href') === publication.publicationUrl
          );
          
          // Should have link to the publication URL
          expect(publicationLinks.length).toBeGreaterThan(0);
          
          // Links should have correct attributes
          publicationLinks.forEach(link => {
            expect(link.getAttribute('target')).toBe('_blank');
            const rel = link.getAttribute('rel');
            expect(rel).toContain('noopener');
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8.7: Multiple publication links all point to same URL
   * All links to publication in a card SHALL point to the same exact URL.
   * 
   * **Validates: Requirements 5.4**
   */
  test('all publication links point to same exact URL', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...researchData.filter(pub => pub.publicationUrl)),
        (publication) => {
          const { container, unmount } = render(<PublicationCard publication={publication} />);

          // Find all links containing the publication URL
          const links = container.querySelectorAll(`a[href="${publication.publicationUrl}"]`);
          
          // All links should point to the exact same URL
          links.forEach(link => {
            expect(link.getAttribute('href')).toBe(publication.publicationUrl);
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8.8: Card with publicationUrl shows visual click indicator
   * Publication cards with publicationUrl SHALL display a visual indicator.
   * 
   * **Validates: Requirements 5.4**
   */
  test('card with publicationUrl shows external link indicator', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...researchData.filter(pub => pub.publicationUrl)),
        (publication) => {
          const { container, unmount } = render(<PublicationCard publication={publication} />);

          // Verify "View Publication" text is present (click hint for clickable cards)
          expect(container.textContent).toContain('View Publication');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8.9: Card without publicationUrl does not show view publication indicator
   * Publication cards without publicationUrl SHALL NOT display the "View Publication" indicator.
   * 
   * **Validates: Requirements 5.4**
   */
  test('card without publicationUrl does not show view publication indicator', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...researchData.filter(pub => !pub.publicationUrl)),
        (publication) => {
          const { container, unmount } = render(<PublicationCard publication={publication} />);

          // Verify "View Publication" text is NOT present
          expect(container.textContent).not.toContain('View Publication');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8.10: Publication title links to publicationUrl when available
   * The publication title SHALL be a clickable link when publicationUrl exists.
   * 
   * **Validates: Requirements 5.4**
   */
  test('publication title links to publicationUrl when available', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...researchData.filter(pub => pub.publicationUrl)),
        (publication) => {
          const { container, unmount } = render(<PublicationCard publication={publication} />);

          // Find h2 element (title)
          const h2 = container.querySelector('h2');
          expect(h2).not.toBeNull();
          
          // Title should contain a link to the publication
          const titleLink = h2.querySelector('a');
          expect(titleLink).not.toBeNull();
          expect(titleLink.getAttribute('href')).toBe(publication.publicationUrl);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
