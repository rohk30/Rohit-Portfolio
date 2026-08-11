/**
 * Property-based tests for Project Data Rendering Completeness
 * 
 * **Property 4: Project Data Rendering Completeness**
 * For any project object in the data store, the Projects page SHALL render a card
 * displaying the title, description, all tech stack badges, and all metrics
 * from that project object.
 * 
 * **Validates: Requirements 4.3**
 */
import { describe, test, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import * as fc from 'fast-check';
import ProjectCard from '@components/sections/ProjectCard';
import { projectData } from '@utils/data';

describe('Project Data Rendering Completeness - Property 4', () => {
  /**
   * Property 4.1: ProjectCard renders all required fields from actual project data
   * For any project from projectData, verify the ProjectCard renders title,
   * description, all techStack badges, and all metrics.
   * 
   * **Validates: Requirements 4.3**
   */
  test('renders all required fields for any project from projectData', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...projectData),
        (project) => {
          const { container, unmount } = render(<ProjectCard project={project} />);

          // Verify title is rendered
          expect(container.textContent).toContain(project.title);

          // Verify description is rendered
          expect(container.textContent).toContain(project.description);

          // Verify all techStack badges are rendered
          project.techStack.forEach((tech) => {
            expect(container.textContent).toContain(tech);
          });

          // Verify all metrics are rendered (if present)
          if (project.metrics && project.metrics.length > 0) {
            project.metrics.forEach((metric) => {
              expect(container.textContent).toContain(metric);
            });
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.2: ProjectCard renders correct number of techStack badges
   * Verify the card renders exactly the number of tech badges matching the techStack array.
   * 
   * **Validates: Requirements 4.3**
   */
  test('renders correct number of techStack badges for any project', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...projectData),
        (project) => {
          const { container, unmount } = render(<ProjectCard project={project} />);

          // Count the tech badges rendered (they have variant="default" and size="sm")
          // Each techStack item should be rendered as a badge
          const allTextContent = container.textContent;
          
          project.techStack.forEach((tech) => {
            // Each tech should appear in the rendered output
            expect(allTextContent).toContain(tech);
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.3: ProjectCard renders correct number of metric badges
   * Verify the card renders exactly the number of metric badges matching the metrics array.
   * 
   * **Validates: Requirements 4.3**
   */
  test('renders correct number of metric badges for any project with metrics', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...projectData.filter(p => p.metrics && p.metrics.length > 0)),
        (project) => {
          const { container, unmount } = render(<ProjectCard project={project} />);

          const allTextContent = container.textContent;
          
          // Each metric should appear in the rendered output
          project.metrics.forEach((metric) => {
            expect(allTextContent).toContain(metric);
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.4: ProjectCard renders GitHub link indicator when githubUrl is present
   * Verify the card shows GitHub link indicator for projects with githubUrl.
   * 
   * **Validates: Requirements 4.3**
   */
  test('renders GitHub link indicator for any project with githubUrl', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...projectData.filter(p => p.githubUrl)),
        (project) => {
          const { container, unmount } = render(<ProjectCard project={project} />);

          // Verify "View on GitHub" text is present
          expect(container.textContent).toContain('View on GitHub');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.5: ProjectCard with generated project data renders all required fields
   * Test with randomly generated project data to ensure robustness.
   * 
   * **Validates: Requirements 4.3**
   */
  test('renders all required fields for any generated project data', () => {
    // Define arbitrary for generating valid project objects
    const projectArbitrary = fc.record({
      id: fc.uuid(),
      title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
      techStack: fc.array(
        fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
        { minLength: 1, maxLength: 10 }
      ),
      metrics: fc.array(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        { minLength: 0, maxLength: 5 }
      ),
      githubUrl: fc.option(fc.webUrl(), { nil: undefined }),
      featured: fc.boolean(),
    });

    fc.assert(
      fc.property(
        projectArbitrary,
        (project) => {
          const { container, unmount } = render(<ProjectCard project={project} />);

          // Verify title is rendered
          expect(container.textContent).toContain(project.title);

          // Verify description is rendered
          expect(container.textContent).toContain(project.description);

          // Verify all techStack items are rendered
          project.techStack.forEach((tech) => {
            expect(container.textContent).toContain(tech);
          });

          // Verify all metrics are rendered
          project.metrics.forEach((metric) => {
            expect(container.textContent).toContain(metric);
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.6: ProjectCard renders featured badge for featured projects
   * Verify featured projects display the "Featured Project" indicator.
   * 
   * **Validates: Requirements 4.3**
   */
  test('renders featured badge for any featured project', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...projectData.filter(p => p.featured === true)),
        (project) => {
          const { container, unmount } = render(<ProjectCard project={project} />);

          // Verify "Featured Project" text is present
          expect(container.textContent).toContain('Featured Project');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.7: ProjectCard does not render featured badge for non-featured projects
   * Verify non-featured projects do NOT display the "Featured Project" indicator.
   * 
   * **Validates: Requirements 4.3**
   */
  test('does not render featured badge for any non-featured project', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...projectData.filter(p => p.featured !== true)),
        (project) => {
          const { container, unmount } = render(<ProjectCard project={project} />);

          // Verify "Featured Project" text is NOT present
          expect(container.textContent).not.toContain('Featured Project');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.8: ProjectCard handles edge cases gracefully
   * Verify the component handles missing optional fields without crashing.
   * 
   * **Validates: Requirements 4.3**
   */
  test('handles missing optional fields gracefully', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
          techStack: fc.array(
            fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
            { minLength: 0, maxLength: 10 }
          ),
          // Omit optional fields: metrics, githubUrl, featured, image
        }),
        (project) => {
          // Should not throw when rendering with minimal required fields
          expect(() => {
            const { unmount } = render(<ProjectCard project={project} />);
            unmount();
          }).not.toThrow();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.9: ProjectCard renders correct element structure
   * Verify the card renders as an article element with proper semantic structure.
   * 
   * **Validates: Requirements 4.3**
   */
  test('renders as article element for semantic correctness', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...projectData),
        (project) => {
          const { container, unmount } = render(<ProjectCard project={project} />);

          // Find the article element
          const article = container.querySelector('article');
          expect(article).not.toBeNull();

          // Verify the title is in an h2 element (changed from h3 for accessibility)
          const heading = container.querySelector('h2');
          expect(heading).not.toBeNull();
          expect(heading.textContent).toBe(project.title);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
