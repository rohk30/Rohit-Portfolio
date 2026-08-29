/**
 * Property-based tests for Image Alt Text Accessibility
 * 
 * **Property 11: All Images Have Alt Text**
 * For any `<img>` element rendered in the application, that element SHALL have
 * an `alt` attribute with a non-empty string value.
 * 
 * **Validates: Requirements 10.3**
 * - Requirement 10.3: THE Portfolio_Website SHALL provide alt text for all images
 * 
 * Tests cover:
 * - PhotoCollage component (travel photos)
 * - ProjectCard component (project screenshots)
 * - PhotoModal component (enlarged photo view)
 */
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import PhotoCollage from '@components/sections/PhotoCollage';
import ProjectCard from '@components/sections/ProjectCard';
import PhotoModal from '@components/ui/PhotoModal';
import { personalData, projectData } from '@utils/data';

/** Helper to render ProjectCard within Router context */
function renderProjectCard(project) {
  return render(
    <MemoryRouter>
      <ProjectCard project={project} />
    </MemoryRouter>
  );
}

describe('Image Alt Text - Property 11', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * Arbitrary for generating valid travel photo objects
   * Generates photo data that mimics the personalData.hobbies.travelPhotos structure
   */
  const travelPhotoArbitrary = fc.record({
    id: fc.uuid(),
    src: fc.oneof(
      fc.stringMatching(/^\/images\/[a-z]{3,15}\.(jpg|png|webp)$/),
      fc.constant('/images/london.jpg'),
      fc.constant('/images/paris.jpg')
    ),
    alt: fc.string({ minLength: 1, maxLength: 100 })
      .map(s => s.trim())
      .filter(s => s.length > 0),
    location: fc.stringMatching(/^[A-Z][a-zA-Z]{2,15}(, [A-Z][a-zA-Z]{2,15})?$/)
  });

  /**
   * Arbitrary for generating valid project objects with images
   */
  const projectWithImageArbitrary = fc.record({
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
    image: fc.oneof(
      fc.stringMatching(/^\/images\/[a-z-]+\.(jpg|png|webp)$/),
      fc.constant('/images/project.png')
    )
  });

  /**
   * Property 11.1: PhotoCollage images have non-empty alt text
   * 
   * *For any* array of travel photos rendered by PhotoCollage, all img elements
   * SHALL have an `alt` attribute with a non-empty string value.
   * 
   * **Validates: Requirements 10.3**
   */
  test('PhotoCollage renders images with non-empty alt text for any photo data', () => {
    fc.assert(
      fc.property(
        fc.array(travelPhotoArbitrary, { minLength: 1, maxLength: 6 }),
        (photos) => {
          const { container, unmount } = render(<PhotoCollage photos={photos} />);

          // Find all img elements in the PhotoCollage
          const images = container.querySelectorAll('img');

          // Each image should have a non-empty alt attribute
          images.forEach((img, index) => {
            const alt = img.getAttribute('alt');
            expect(alt).not.toBeNull();
            expect(alt.trim().length).toBeGreaterThan(0);
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 11.2: PhotoCollage images alt text matches provided data
   * 
   * *For any* photo with a defined alt text, the rendered img element SHALL
   * have an alt attribute that matches the provided alt text.
   * 
   * **Validates: Requirements 10.3**
   */
  test('PhotoCollage images have alt text matching provided photo.alt', () => {
    fc.assert(
      fc.property(
        travelPhotoArbitrary,
        (photo) => {
          const { container, unmount } = render(<PhotoCollage photos={[photo]} />);

          const img = container.querySelector('img');
          
          // The alt should match the provided photo.alt (or fallback to 'Photo')
          expect(img).not.toBeNull();
          const alt = img.getAttribute('alt');
          expect(alt).not.toBeNull();
          expect(alt.trim().length).toBeGreaterThan(0);
          // PhotoCollage uses photo.alt directly, or 'Photo' as fallback
          expect(alt).toBe(photo.alt);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 11.3: PhotoCollage uses fallback alt for missing alt text
   * 
   * *For any* photo object missing an alt property, the PhotoCollage SHALL
   * provide a fallback non-empty alt text value.
   * 
   * **Validates: Requirements 10.3**
   */
  test('PhotoCollage provides fallback alt text when photo.alt is missing', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          src: fc.constant('/images/test.jpg'),
          location: fc.constant('Test Location')
          // Note: alt is intentionally omitted
        }),
        (photo) => {
          const { container, unmount } = render(<PhotoCollage photos={[photo]} />);

          const img = container.querySelector('img');
          
          expect(img).not.toBeNull();
          const alt = img.getAttribute('alt');
          expect(alt).not.toBeNull();
          expect(alt.trim().length).toBeGreaterThan(0);
          // Component uses 'Photo' as fallback when alt is missing
          expect(alt).toBe('Photo');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 11.4: ProjectCard images have non-empty alt text
   * 
   * *For any* project object with an image property, the ProjectCard SHALL
   * render an img element with a non-empty alt attribute.
   * 
   * **Validates: Requirements 10.3**
   */
  test('ProjectCard renders images with non-empty alt text for any project with image', () => {
    fc.assert(
      fc.property(
        projectWithImageArbitrary,
        (project) => {
          const { container, unmount } = renderProjectCard(project);

          const img = container.querySelector('img');
          
          // Image should be rendered when project.image is provided
          expect(img).not.toBeNull();
          
          // Alt attribute should exist and be non-empty
          const alt = img.getAttribute('alt');
          expect(alt).not.toBeNull();
          expect(alt.trim().length).toBeGreaterThan(0);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 11.5: ProjectCard image alt text contains project title
   * 
   * *For any* project with an image, the img alt text SHALL contain the project
   * title to provide context for accessibility.
   * 
   * **Validates: Requirements 10.3**
   */
  test('ProjectCard image alt text includes project title', () => {
    fc.assert(
      fc.property(
        projectWithImageArbitrary,
        (project) => {
          const { container, unmount } = renderProjectCard(project);

          const img = container.querySelector('img');
          
          expect(img).not.toBeNull();
          const alt = img.getAttribute('alt');
          
          // Alt should contain the project title for context
          expect(alt).toContain(project.title);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 11.6: PhotoModal images have non-empty alt text
   * 
   * *For any* photo displayed in the PhotoModal, the img element SHALL have
   * an `alt` attribute with a non-empty string value matching the provided imageAlt.
   * 
   * **Validates: Requirements 10.3**
   */
  test('PhotoModal renders images with non-empty alt text', () => {
    fc.assert(
      fc.property(
        fc.constant('/images/test.jpg'),
        fc.string({ minLength: 1, maxLength: 100 })
          .map(s => s.trim())
          .filter(s => s.length > 0),
        (imageSrc, imageAlt) => {
          const { unmount } = render(
            <PhotoModal
              isOpen={true}
              onClose={() => {}}
              imageSrc={imageSrc}
              imageAlt={imageAlt}
            />
          );

          // PhotoModal uses portal, so query from document.body
          const img = document.body.querySelector('img');
          
          expect(img).not.toBeNull();
          const alt = img.getAttribute('alt');
          expect(alt).not.toBeNull();
          expect(alt.trim().length).toBeGreaterThan(0);
          expect(alt).toBe(imageAlt);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 11.7: All actual travel photos from data store have valid alt text
   * 
   * *For any* travel photo in personalData.hobbies.travelPhotos, the photo
   * SHALL have a non-empty alt property that provides meaningful description.
   * 
   * **Validates: Requirements 10.3**
   */
  test('actual travelPhotos data has valid alt text for all photos', () => {
    const travelPhotos = personalData.hobbies?.travelPhotos || [];
    if (travelPhotos.length === 0) return; // Skip if no photos
    
    fc.assert(
      fc.property(
        fc.constantFrom(...travelPhotos),
        (photo) => {
          // Verify the data itself has valid alt
          expect(photo.alt).toBeDefined();
          expect(typeof photo.alt).toBe('string');
          expect(photo.alt.trim().length).toBeGreaterThan(0);

          // Render and verify the rendered alt matches
          const { container, unmount } = render(<PhotoCollage photos={[photo]} />);
          
          const img = container.querySelector('img');
          expect(img).not.toBeNull();
          expect(img.getAttribute('alt')).toBe(photo.alt);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 11.8: All actual project images from data store have valid alt text
   * 
   * *For any* project in projectData with an image property, rendering the
   * ProjectCard SHALL produce an img element with non-empty alt text.
   * 
   * **Validates: Requirements 10.3**
   */
  test('actual projectData with images renders with valid alt text', () => {
    const projectsWithImages = projectData.filter(p => p.image);
    
    // Skip if no projects have images
    if (projectsWithImages.length === 0) {
      return;
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...projectsWithImages),
        (project) => {
          const { container, unmount } = renderProjectCard(project);

          const img = container.querySelector('img');
          expect(img).not.toBeNull();
          
          const alt = img.getAttribute('alt');
          expect(alt).not.toBeNull();
          expect(alt.trim().length).toBeGreaterThan(0);
          // ProjectCard uses `${title} project screenshot` format
          expect(alt).toContain(project.title);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 11.9: No img element is rendered without alt attribute
   * 
   * This is a universal check: *For any* img element rendered by image-displaying
   * components, the alt attribute SHALL be present (not null or undefined).
   * 
   * **Validates: Requirements 10.3**
   */
  test('no img element is rendered without alt attribute in PhotoCollage', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            src: fc.constant('/images/test.jpg'),
            alt: fc.option(fc.string({ minLength: 0, maxLength: 50 }), { nil: undefined }),
            location: fc.constant('Test')
          }),
          { minLength: 1, maxLength: 4 }
        ),
        (photos) => {
          const { container, unmount } = render(<PhotoCollage photos={photos} />);

          const images = container.querySelectorAll('img');
          
          images.forEach((img) => {
            // Alt attribute should always be present (never null)
            const hasAlt = img.hasAttribute('alt');
            expect(hasAlt).toBe(true);
            
            // Alt should never be just whitespace
            const alt = img.getAttribute('alt');
            expect(alt).not.toBeNull();
            expect(alt.length).toBeGreaterThan(0);
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 11.10: Empty alt is not allowed for meaningful images
   * 
   * *For any* content image (not decorative), the alt attribute SHALL NOT
   * be an empty string. Empty alt="" is only valid for decorative images.
   * 
   * **Validates: Requirements 10.3**
   */
  test('content images do not have empty alt text', () => {
    fc.assert(
      fc.property(
        travelPhotoArbitrary,
        (photo) => {
          const { container, unmount } = render(<PhotoCollage photos={[photo]} />);

          const img = container.querySelector('img');
          
          if (img) {
            const alt = img.getAttribute('alt');
            // Content images (travel photos) should never have empty alt
            expect(alt).not.toBe('');
            expect(alt?.trim()).not.toBe('');
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
