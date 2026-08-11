/**
 * Property-based tests for Experience Data Rendering Completeness
 * 
 * **Property 2: Experience Data Rendering Completeness**
 * For any experience object in the data store, the Experience page SHALL render
 * a card displaying the role, company, location, date range, all bullet points,
 * and all tech stack badges from that experience object.
 * 
 * **Validates: Requirements 3.2, 3.5**
 */
import { describe, test, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import * as fc from 'fast-check';
import ExperienceCard from '@components/sections/ExperienceCard';
import { experienceData } from '@utils/data';

describe('Experience Data Rendering Completeness - Property 2', () => {
  /**
   * Property 2.1: ExperienceCard renders role for any experience object
   * 
   * For any experience object from the data store, the ExperienceCard
   * SHALL display the role field.
   * 
   * **Validates: Requirements 3.2**
   */
  test('ExperienceCard renders role for all experience objects', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...experienceData),
        (experience) => {
          const { container, unmount } = render(
            <ExperienceCard experience={experience} />
          );

          // Role should be rendered
          expect(container.textContent).toContain(experience.role);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.2: ExperienceCard renders company for any experience object
   * 
   * For any experience object from the data store, the ExperienceCard
   * SHALL display the company field.
   * 
   * **Validates: Requirements 3.2**
   */
  test('ExperienceCard renders company for all experience objects', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...experienceData),
        (experience) => {
          const { container, unmount } = render(
            <ExperienceCard experience={experience} />
          );

          // Company should be rendered
          expect(container.textContent).toContain(experience.company);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.3: ExperienceCard renders location for any experience object
   * 
   * For any experience object from the data store, the ExperienceCard
   * SHALL display the location field.
   * 
   * **Validates: Requirements 3.2**
   */
  test('ExperienceCard renders location for all experience objects', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...experienceData),
        (experience) => {
          const { container, unmount } = render(
            <ExperienceCard experience={experience} />
          );

          // Location should be rendered
          expect(container.textContent).toContain(experience.location);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.4: ExperienceCard renders date for any experience object
   * 
   * For any experience object from the data store, the ExperienceCard
   * SHALL display the date field.
   * 
   * **Validates: Requirements 3.2**
   */
  test('ExperienceCard renders date for all experience objects', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...experienceData),
        (experience) => {
          const { container, unmount } = render(
            <ExperienceCard experience={experience} />
          );

          // Date should be rendered
          expect(container.textContent).toContain(experience.date);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.5: ExperienceCard renders all bullet points for any experience object
   * 
   * For any experience object from the data store, the ExperienceCard
   * SHALL display all bullet points from the bullets array.
   * 
   * **Validates: Requirements 3.2**
   */
  test('ExperienceCard renders all bullet points for all experience objects', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...experienceData),
        (experience) => {
          const { container, unmount } = render(
            <ExperienceCard experience={experience} />
          );

          // All bullet points should be rendered
          experience.bullets.forEach((bullet) => {
            expect(container.textContent).toContain(bullet);
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.6: ExperienceCard renders all tech stack badges for any experience object
   * 
   * For any experience object from the data store, the ExperienceCard
   * SHALL display all tech stack badges from the techStack array.
   * 
   * **Validates: Requirements 3.5**
   */
  test('ExperienceCard renders all tech stack badges for all experience objects', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...experienceData),
        (experience) => {
          const { container, unmount } = render(
            <ExperienceCard experience={experience} />
          );

          // All tech stack items should be rendered
          experience.techStack.forEach((tech) => {
            expect(container.textContent).toContain(tech);
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.7: ExperienceCard renders complete data for any experience
   * 
   * For any experience object from the data store, the ExperienceCard
   * SHALL render ALL required fields (role, company, location, date, all bullets, all techStack).
   * This is the comprehensive property test verifying complete data rendering.
   * 
   * **Validates: Requirements 3.2, 3.5**
   */
  test('ExperienceCard renders all required fields for any experience object', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...experienceData),
        (experience) => {
          const { container, unmount } = render(
            <ExperienceCard experience={experience} />
          );

          const textContent = container.textContent;

          // Verify role is rendered
          expect(textContent).toContain(experience.role);

          // Verify company is rendered
          expect(textContent).toContain(experience.company);

          // Verify location is rendered
          expect(textContent).toContain(experience.location);

          // Verify date is rendered
          expect(textContent).toContain(experience.date);

          // Verify all bullets are rendered
          experience.bullets.forEach((bullet) => {
            expect(textContent).toContain(bullet);
          });

          // Verify all tech stack badges are rendered
          experience.techStack.forEach((tech) => {
            expect(textContent).toContain(tech);
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.8: ExperienceCard renders with generated experience data
   * 
   * For any randomly generated experience object that matches the schema,
   * the ExperienceCard SHALL render all required fields correctly.
   * This tests the component's ability to handle any valid experience data.
   * 
   * **Validates: Requirements 3.2, 3.5**
   */
  test('ExperienceCard renders correctly for any valid generated experience', () => {
    // Arbitrary for generating valid experience objects
    const experienceArbitrary = fc.record({
      id: fc.uuid(),
      role: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      company: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      location: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      date: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
      bullets: fc.array(
        fc.string({ minLength: 10, maxLength: 500 }).filter(s => s.trim().length > 0),
        { minLength: 1, maxLength: 5 }
      ),
      techStack: fc.array(
        fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
        { minLength: 1, maxLength: 8 }
      ),
      metrics: fc.array(
        fc.record({
          value: fc.string({ minLength: 1, maxLength: 20 }),
          description: fc.string({ minLength: 1, maxLength: 100 }),
        }),
        { minLength: 0, maxLength: 3 }
      ),
    });

    fc.assert(
      fc.property(
        experienceArbitrary,
        (experience) => {
          const { container, unmount } = render(
            <ExperienceCard experience={experience} />
          );

          const textContent = container.textContent;

          // Verify role is rendered
          expect(textContent).toContain(experience.role);

          // Verify company is rendered
          expect(textContent).toContain(experience.company);

          // Verify location is rendered
          expect(textContent).toContain(experience.location);

          // Verify date is rendered
          expect(textContent).toContain(experience.date);

          // Verify all bullets are rendered
          experience.bullets.forEach((bullet) => {
            expect(textContent).toContain(bullet);
          });

          // Verify all tech stack badges are rendered
          experience.techStack.forEach((tech) => {
            expect(textContent).toContain(tech);
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.9: ExperienceCard maintains correct count of bullet points
   * 
   * For any experience object, the number of rendered bullet items
   * SHALL equal the length of the bullets array.
   * 
   * **Validates: Requirements 3.2**
   */
  test('ExperienceCard renders correct number of bullet points', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...experienceData),
        (experience) => {
          const { container, unmount } = render(
            <ExperienceCard experience={experience} />
          );

          // Count the list items (bullet points)
          const bulletItems = container.querySelectorAll('li');
          expect(bulletItems.length).toBe(experience.bullets.length);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.10: ExperienceCard maintains correct count of tech stack badges
   * 
   * For any experience object, the number of rendered tech badges
   * SHALL equal the length of the techStack array.
   * 
   * **Validates: Requirements 3.5**
   */
  test('ExperienceCard renders correct number of tech stack badges', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...experienceData),
        (experience) => {
          const { container, unmount } = render(
            <ExperienceCard experience={experience} />
          );

          // Find all badge elements (spans with Badge styling)
          // Badges have the class pattern: inline-flex items-center font-medium rounded-full
          const badges = container.querySelectorAll('span.inline-flex');
          expect(badges.length).toBe(experience.techStack.length);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
