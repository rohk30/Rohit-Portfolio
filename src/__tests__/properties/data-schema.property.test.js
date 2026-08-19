/**
 * Property-based tests for Data Schema Validation
 * 
 * **Property 13: Data Schema Validation**
 * - Verify all experience objects contain required fields
 * - Verify all project objects contain required fields
 * - Verify all publication objects contain required fields
 * - Verify personalData contains required nested structures
 * - Verify contactData contains required fields
 * 
 * **Validates: Requirements 11.1, 11.2, 11.3, 11.4**
 */
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  experienceData,
  projectData,
  researchData,
  personalData,
  contactData,
  navigationData,
} from '@utils/data';

describe('Data Schema Validation - Property 13', () => {
  /**
   * **Property 13.1: experienceData schema validation**
   * Verify all experience objects contain required fields:
   * id (string), role (string), company (string), location (string),
   * date (string), bullets (string array), techStack (string array)
   * 
   * **Validates: Requirements 11.1**
   */
  describe('Experience Data Schema', () => {
    test('all experience objects contain required fields with correct types', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...experienceData),
          (experience) => {
            // Required fields must exist
            expect(experience).toHaveProperty('id');
            expect(experience).toHaveProperty('role');
            expect(experience).toHaveProperty('company');
            expect(experience).toHaveProperty('location');
            expect(experience).toHaveProperty('date');
            expect(experience).toHaveProperty('bullets');
            expect(experience).toHaveProperty('techStack');

            // Fields must have correct types
            expect(typeof experience.id).toBe('string');
            expect(typeof experience.role).toBe('string');
            expect(typeof experience.company).toBe('string');
            expect(typeof experience.location).toBe('string');
            expect(typeof experience.date).toBe('string');
            expect(Array.isArray(experience.bullets)).toBe(true);
            expect(Array.isArray(experience.techStack)).toBe(true);

            // String fields must be non-empty
            expect(experience.id.length).toBeGreaterThan(0);
            expect(experience.role.length).toBeGreaterThan(0);
            expect(experience.company.length).toBeGreaterThan(0);
            expect(experience.location.length).toBeGreaterThan(0);
            expect(experience.date.length).toBeGreaterThan(0);

            // Arrays must contain strings
            experience.bullets.forEach((bullet) => {
              expect(typeof bullet).toBe('string');
              expect(bullet.length).toBeGreaterThan(0);
            });
            experience.techStack.forEach((tech) => {
              expect(typeof tech).toBe('string');
              expect(tech.length).toBeGreaterThan(0);
            });

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('experience data array is non-empty', () => {
      expect(experienceData.length).toBeGreaterThan(0);
    });

    test('all experience IDs are unique', () => {
      const ids = experienceData.map((exp) => exp.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  /**
   * **Property 13.2: projectData schema validation**
   * Verify all project objects contain required fields:
   * id (string), title (string), description (string),
   * techStack (string array), githubUrl (string)
   * 
   * **Validates: Requirements 11.2**
   */
  describe('Project Data Schema', () => {
    test('all project objects contain required fields with correct types', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...projectData),
          (project) => {
            // Required fields must exist
            expect(project).toHaveProperty('id');
            expect(project).toHaveProperty('title');
            expect(project).toHaveProperty('description');
            expect(project).toHaveProperty('techStack');
            expect(project).toHaveProperty('githubUrl');

            // Fields must have correct types
            expect(typeof project.id).toBe('string');
            expect(typeof project.title).toBe('string');
            expect(typeof project.description).toBe('string');
            expect(Array.isArray(project.techStack)).toBe(true);
            // githubUrl can be string or null
            if (project.githubUrl !== null) {
              expect(typeof project.githubUrl).toBe('string');
            }

            // String fields must be non-empty
            expect(project.id.length).toBeGreaterThan(0);
            expect(project.title.length).toBeGreaterThan(0);
            expect(project.description.length).toBeGreaterThan(0);

            // githubUrl must be a valid URL when present
            if (project.githubUrl) {
              expect(project.githubUrl.length).toBeGreaterThan(0);
              expect(project.githubUrl).toMatch(/^https?:\/\//);
            }

            // techStack must contain strings
            project.techStack.forEach((tech) => {
              expect(typeof tech).toBe('string');
              expect(tech.length).toBeGreaterThan(0);
            });

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('project data array is non-empty', () => {
      expect(projectData.length).toBeGreaterThan(0);
    });

    test('all project IDs are unique', () => {
      const ids = projectData.map((proj) => proj.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  /**
   * **Property 13.3: researchData schema validation**
   * Verify all publication objects contain required fields:
   * id (string), title (string), authors (string array), venue (string),
   * date (string), abstract (string), category (enum), status (enum)
   * 
   * **Validates: Requirements 11.3**
   */
  describe('Research Data Schema', () => {
    const validCategories = ['conference', 'journal', 'preprint', 'technical-report'];
    const validStatuses = ['published', 'under-review', 'preprint', 'ongoing'];

    test('all publication objects contain required fields with correct types', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...researchData),
          (publication) => {
            // Required fields must exist
            expect(publication).toHaveProperty('id');
            expect(publication).toHaveProperty('title');
            expect(publication).toHaveProperty('authors');
            expect(publication).toHaveProperty('venue');
            expect(publication).toHaveProperty('date');
            expect(publication).toHaveProperty('abstract');
            expect(publication).toHaveProperty('category');
            expect(publication).toHaveProperty('status');

            // Fields must have correct types
            expect(typeof publication.id).toBe('string');
            expect(typeof publication.title).toBe('string');
            expect(Array.isArray(publication.authors)).toBe(true);
            expect(typeof publication.venue).toBe('string');
            expect(typeof publication.date).toBe('string');
            expect(typeof publication.abstract).toBe('string');
            expect(typeof publication.category).toBe('string');
            expect(typeof publication.status).toBe('string');

            // String fields must be non-empty
            expect(publication.id.length).toBeGreaterThan(0);
            expect(publication.title.length).toBeGreaterThan(0);
            expect(publication.venue.length).toBeGreaterThan(0);
            expect(publication.date.length).toBeGreaterThan(0);
            expect(publication.abstract.length).toBeGreaterThan(0);

            // Authors array must be non-empty and contain strings
            expect(publication.authors.length).toBeGreaterThan(0);
            publication.authors.forEach((author) => {
              expect(typeof author).toBe('string');
              expect(author.length).toBeGreaterThan(0);
            });

            // Category must be a valid enum value
            expect(validCategories).toContain(publication.category);

            // Status must be a valid enum value
            expect(validStatuses).toContain(publication.status);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('research data array is non-empty', () => {
      expect(researchData.length).toBeGreaterThan(0);
    });

    test('all publication IDs are unique', () => {
      const ids = researchData.map((pub) => pub.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('publications with publicationUrl have valid URLs or null', () => {
      researchData.forEach((publication) => {
        if (publication.publicationUrl !== null && publication.publicationUrl !== undefined) {
          expect(typeof publication.publicationUrl).toBe('string');
          expect(publication.publicationUrl).toMatch(/^https?:\/\//);
        }
      });
    });

    test('publications with codeUrl have valid URLs or null', () => {
      researchData.forEach((publication) => {
        if (publication.codeUrl !== null && publication.codeUrl !== undefined) {
          expect(typeof publication.codeUrl).toBe('string');
          expect(publication.codeUrl).toMatch(/^https?:\/\//);
        }
      });
    });
  });

  /**
   * **Property 13.4: personalData nested structures validation**
   * Verify personalData contains required nested structures:
   * education (object), leadership (object), hobbies (object)
   * with their required nested fields
   * 
   * **Validates: Requirements 11.4**
   */
  describe('Personal Data Schema', () => {
    test('personalData contains required nested structures', () => {
      // Top-level structure
      expect(personalData).toHaveProperty('education');
      expect(personalData).toHaveProperty('leadership');
      expect(personalData).toHaveProperty('hobbies');

      // education object structure
      expect(typeof personalData.education).toBe('object');
      expect(personalData.education).not.toBeNull();
    });

    test('education sub-object contains required fields', () => {
      const { education } = personalData;

      // Required fields
      expect(education).toHaveProperty('institution');
      expect(education).toHaveProperty('degree');
      expect(education).toHaveProperty('specialization');
      expect(education).toHaveProperty('dateRange');
      expect(education).toHaveProperty('gpa');
      expect(education).toHaveProperty('futurePlans');

      // Type validation
      expect(typeof education.institution).toBe('string');
      expect(typeof education.degree).toBe('string');
      expect(typeof education.specialization).toBe('string');
      expect(typeof education.dateRange).toBe('string');
      expect(typeof education.gpa).toBe('string');
      expect(typeof education.futurePlans).toBe('string');

      // Non-empty validation
      expect(education.institution.length).toBeGreaterThan(0);
      expect(education.degree.length).toBeGreaterThan(0);
      expect(education.specialization.length).toBeGreaterThan(0);
      expect(education.dateRange.length).toBeGreaterThan(0);
      expect(education.gpa.length).toBeGreaterThan(0);
      expect(education.futurePlans.length).toBeGreaterThan(0);
    });

    test('leadership sub-object contains required fields', () => {
      const { leadership } = personalData;

      // Required fields
      expect(leadership).toHaveProperty('role');
      expect(leadership).toHaveProperty('organization');
      expect(leadership).toHaveProperty('impact');

      // Type validation
      expect(typeof leadership.role).toBe('string');
      expect(typeof leadership.organization).toBe('string');
      expect(typeof leadership.impact).toBe('string');

      // Non-empty validation
      expect(leadership.role.length).toBeGreaterThan(0);
      expect(leadership.organization.length).toBeGreaterThan(0);
      expect(leadership.impact.length).toBeGreaterThan(0);
    });

    test('hobbies sub-object contains required fields', () => {
      const { hobbies } = personalData;

      // Required fields
      expect(hobbies).toHaveProperty('narrative');
      expect(hobbies).toHaveProperty('travelPhotos');
      expect(hobbies).toHaveProperty('interests');

      // Type validation
      expect(typeof hobbies.narrative).toBe('string');
      expect(Array.isArray(hobbies.travelPhotos)).toBe(true);
      expect(Array.isArray(hobbies.interests)).toBe(true);

      // Non-empty validation
      expect(hobbies.narrative.length).toBeGreaterThan(0);
    });

    test('travelPhotos array contains valid photo objects', () => {
      if (personalData.hobbies.travelPhotos.length === 0) return; // Skip if no photos

      fc.assert(
        fc.property(
          fc.constantFrom(...personalData.hobbies.travelPhotos),
          (photo) => {
            // Required fields for each photo
            expect(photo).toHaveProperty('id');
            expect(photo).toHaveProperty('src');
            expect(photo).toHaveProperty('alt');
            expect(photo).toHaveProperty('location');

            // Type validation
            expect(typeof photo.id).toBe('string');
            expect(typeof photo.src).toBe('string');
            expect(typeof photo.alt).toBe('string');
            expect(typeof photo.location).toBe('string');

            // Non-empty validation
            expect(photo.id.length).toBeGreaterThan(0);
            expect(photo.src.length).toBeGreaterThan(0);
            expect(photo.alt.length).toBeGreaterThan(0);
            expect(photo.location.length).toBeGreaterThan(0);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('interests array contains non-empty strings', () => {
      personalData.hobbies.interests.forEach((interest) => {
        expect(typeof interest).toBe('string');
        expect(interest.length).toBeGreaterThan(0);
      });
    });
  });

  /**
   * **Property 13.5: contactData schema validation**
   * Verify contactData contains required fields:
   * email (string), linkedIn (string), github (string), resumePath (string)
   * 
   * **Validates: Requirements 11.4**
   */
  describe('Contact Data Schema', () => {
    test('contactData contains required fields with correct types', () => {
      // Required fields
      expect(contactData).toHaveProperty('email');
      expect(contactData).toHaveProperty('linkedIn');
      expect(contactData).toHaveProperty('github');
      expect(contactData).toHaveProperty('resumePath');

      // Type validation
      expect(typeof contactData.email).toBe('string');
      expect(typeof contactData.linkedIn).toBe('string');
      expect(typeof contactData.github).toBe('string');
      expect(typeof contactData.resumePath).toBe('string');

      // Non-empty validation
      expect(contactData.email.length).toBeGreaterThan(0);
      expect(contactData.linkedIn.length).toBeGreaterThan(0);
      expect(contactData.github.length).toBeGreaterThan(0);
      expect(contactData.resumePath.length).toBeGreaterThan(0);
    });

    test('email follows valid email format', () => {
      // Basic email format validation
      expect(contactData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    test('linkedIn is a valid URL', () => {
      expect(contactData.linkedIn).toMatch(/^https?:\/\//);
    });

    test('resumePath is a valid path format', () => {
      // Resume path should start with '/' and end with '.pdf'
      expect(contactData.resumePath).toMatch(/^\/.*\.pdf$/);
    });
  });

  /**
   * **Property 13.6: navigationData schema validation**
   * Verify navigation items contain required fields
   * 
   * **Validates: Requirements 11.1**
   */
  describe('Navigation Data Schema', () => {
    test('all navigation items contain required fields with correct types', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...navigationData),
          (navItem) => {
            // Required fields
            expect(navItem).toHaveProperty('id');
            expect(navItem).toHaveProperty('label');
            expect(navItem).toHaveProperty('path');

            // Type validation
            expect(typeof navItem.id).toBe('string');
            expect(typeof navItem.label).toBe('string');
            expect(typeof navItem.path).toBe('string');

            // Non-empty validation
            expect(navItem.id.length).toBeGreaterThan(0);
            expect(navItem.label.length).toBeGreaterThan(0);
            expect(navItem.path.length).toBeGreaterThan(0);

            // Path should start with '/'
            expect(navItem.path).toMatch(/^\//);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('navigation data array is non-empty', () => {
      expect(navigationData.length).toBeGreaterThan(0);
    });

    test('all navigation IDs are unique', () => {
      const ids = navigationData.map((nav) => nav.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('all navigation paths are unique', () => {
      const paths = navigationData.map((nav) => nav.path);
      const uniquePaths = new Set(paths);
      expect(uniquePaths.size).toBe(paths.length);
    });
  });
});
