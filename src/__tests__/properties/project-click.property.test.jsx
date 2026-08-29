/**
 * Property-based tests for Project Card Click Opens GitHub URL
 * 
 * **Property 5: Project Card Click Opens GitHub URL**
 * For any project card on the Projects page where the project has a githubUrl,
 * clicking that card SHALL trigger navigation to that exact GitHub URL in a new browser tab.
 * 
 * **Validates: Requirements 4.4**
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import ProjectCard from '@components/sections/ProjectCard';
import { projectData } from '@utils/data';

/** Helper to render ProjectCard within Router context */
function renderProjectCard(project) {
  return render(
    <MemoryRouter>
      <ProjectCard project={project} />
    </MemoryRouter>
  );
}

describe('Project Card Click Opens GitHub URL - Property 5', () => {
  let windowOpenSpy;

  beforeEach(() => {
    // Mock window.open to capture calls
    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    // Restore window.open after each test
    windowOpenSpy.mockRestore();
  });

  /**
   * Property 5.1: Clicking project card opens exact GitHub URL in new tab
   * For any project from projectData with a githubUrl, clicking the card
   * shall trigger navigation to that exact URL in a new browser tab.
   * 
   * **Validates: Requirements 4.4**
   */
  test('clicking project card opens exact GitHub URL in new tab for any project with githubUrl', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...projectData.filter(p => p.githubUrl && !p.caseStudy)),
        (project) => {
          windowOpenSpy.mockClear();
          
          const { container, unmount } = renderProjectCard(project);

          // Find and click the article element (the GlassCard)
          const card = container.querySelector('article');
          expect(card).not.toBeNull();
          
          fireEvent.click(card);

          // Verify window.open was called with the exact GitHub URL
          expect(windowOpenSpy).toHaveBeenCalledTimes(1);
          expect(windowOpenSpy).toHaveBeenCalledWith(
            project.githubUrl,
            '_blank',
            'noopener,noreferrer'
          );

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5.2: GitHub URL is opened with correct target and security options
   * Verify the window.open call uses '_blank' target and 'noopener,noreferrer' for security.
   * 
   * **Validates: Requirements 4.4**
   */
  test('opens GitHub URL with _blank target and security options for any project', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...projectData.filter(p => p.githubUrl && !p.caseStudy)),
        (project) => {
          windowOpenSpy.mockClear();
          
          const { container, unmount } = renderProjectCard(project);
          const card = container.querySelector('article');
          
          fireEvent.click(card);

          // Verify security options
          const [url, target, options] = windowOpenSpy.mock.calls[0];
          expect(target).toBe('_blank');
          expect(options).toBe('noopener,noreferrer');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5.3: No navigation occurs when project lacks githubUrl
   * For projects without a githubUrl, clicking should not trigger window.open.
   * 
   * **Validates: Requirements 4.4**
   */
  test('no navigation occurs when clicking project without githubUrl', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
          techStack: fc.array(
            fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
            { minLength: 1, maxLength: 5 }
          ),
          metrics: fc.array(
            fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
            { minLength: 0, maxLength: 3 }
          ),
          // Explicitly no githubUrl
          featured: fc.boolean(),
        }),
        (project) => {
          windowOpenSpy.mockClear();
          
          const { container, unmount } = renderProjectCard(project);
          const card = container.querySelector('article');
          
          fireEvent.click(card);

          // Verify window.open was NOT called
          expect(windowOpenSpy).not.toHaveBeenCalled();

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5.4: URL opened matches exactly the githubUrl field
   * The URL passed to window.open must be identical to the project's githubUrl.
   * 
   * **Validates: Requirements 4.4**
   */
  test('URL opened matches exactly the githubUrl field for any generated project', () => {
    const projectWithUrlArbitrary = fc.record({
      id: fc.uuid(),
      title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
      techStack: fc.array(
        fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
        { minLength: 1, maxLength: 5 }
      ),
      metrics: fc.array(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        { minLength: 0, maxLength: 3 }
      ),
      githubUrl: fc.webUrl(),
      featured: fc.boolean(),
    });

    fc.assert(
      fc.property(
        projectWithUrlArbitrary,
        (project) => {
          windowOpenSpy.mockClear();
          
          const { container, unmount } = renderProjectCard(project);
          const card = container.querySelector('article');
          
          fireEvent.click(card);

          // Verify the exact URL is passed
          expect(windowOpenSpy).toHaveBeenCalledTimes(1);
          const [openedUrl] = windowOpenSpy.mock.calls[0];
          expect(openedUrl).toBe(project.githubUrl);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5.5: Card remains interactive for multiple clicks
   * Each click on the card should trigger a new window.open call with the same URL.
   * 
   * **Validates: Requirements 4.4**
   */
  test('card triggers window.open on each click for any project', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...projectData.filter(p => p.githubUrl && !p.caseStudy)),
        fc.integer({ min: 1, max: 5 }),
        (project, clickCount) => {
          windowOpenSpy.mockClear();
          
          const { container, unmount } = renderProjectCard(project);
          const card = container.querySelector('article');
          
          // Click multiple times
          for (let i = 0; i < clickCount; i++) {
            fireEvent.click(card);
          }

          // Verify window.open was called correct number of times
          expect(windowOpenSpy).toHaveBeenCalledTimes(clickCount);
          
          // Verify each call used the same URL
          windowOpenSpy.mock.calls.forEach(call => {
            expect(call[0]).toBe(project.githubUrl);
            expect(call[1]).toBe('_blank');
            expect(call[2]).toBe('noopener,noreferrer');
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5.6: Card with empty string githubUrl does not trigger navigation
   * Empty string URLs should be treated as missing and not trigger window.open.
   * 
   * **Validates: Requirements 4.4**
   */
  test('empty string githubUrl does not trigger navigation', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
          techStack: fc.array(
            fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
            { minLength: 1, maxLength: 5 }
          ),
          githubUrl: fc.constant(''), // Empty string
        }),
        (project) => {
          windowOpenSpy.mockClear();
          
          const { container, unmount } = renderProjectCard(project);
          const card = container.querySelector('article');
          
          fireEvent.click(card);

          // Empty string is falsy, so onClick should be undefined
          // and window.open should not be called
          expect(windowOpenSpy).not.toHaveBeenCalled();

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5.7: Card aria-label indicates clickability when githubUrl is present
   * Cards with githubUrl should have aria-label mentioning GitHub repository.
   * 
   * **Validates: Requirements 4.4**
   */
  test('card has appropriate aria-label when githubUrl is present', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...projectData.filter(p => p.githubUrl && !p.caseStudy)),
        (project) => {
          const { container, unmount } = renderProjectCard(project);
          const card = container.querySelector('article');
          
          const ariaLabel = card.getAttribute('aria-label');
          expect(ariaLabel).toContain(project.title);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5.8: Card displays "View GitHub" text when githubUrl is present
   * Cards with githubUrl should display the "View GitHub" hint text.
   * 
   * **Validates: Requirements 4.4**
   */
  test('card displays "View GitHub" hint when githubUrl is present', () => {
    const projectsWithGithubOnly = projectData.filter(p => p.githubUrl && !p.caseStudy);
    if (projectsWithGithubOnly.length === 0) return;

    fc.assert(
      fc.property(
        fc.constantFrom(...projectsWithGithubOnly),
        (project) => {
          const { container, unmount } = renderProjectCard(project);
          
          expect(container.textContent).toContain('View GitHub');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5.9: Card does not display "View GitHub" when githubUrl is missing
   * Cards without githubUrl should not display the GitHub hint.
   * 
   * **Validates: Requirements 4.4**
   */
  test('card does not display "View GitHub" when githubUrl is missing', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
          techStack: fc.array(
            fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
            { minLength: 1, maxLength: 5 }
          ),
          // No githubUrl
        }),
        (project) => {
          const { container, unmount } = renderProjectCard(project);
          
          expect(container.textContent).not.toContain('View GitHub');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
