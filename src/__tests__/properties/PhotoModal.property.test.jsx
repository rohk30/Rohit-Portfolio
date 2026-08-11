/**
 * Property-based tests for PhotoModal component
 * 
 * **Validates: Requirements 6.6**
 * - Requirement 6.6: WHEN a travel photo is clicked, THEN the PhotoModal SHALL display an enlarged view of that exact photo
 * 
 * Property 10: Photo Modal Displays Clicked Photo
 * Verify modal displays the exact photo (same src, alt) that was clicked
 */
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import PhotoModal from '@components/ui/PhotoModal';

describe('PhotoModal Property Tests', () => {
  /**
   * Property 10.1: Modal displays the exact image src that was passed
   * 
   * *For any* valid image src URL passed to PhotoModal, the modal SHALL render
   * an img element with that exact src attribute.
   * 
   * **Validates: Requirements 6.6**
   */
  test('modal displays the exact image src that was passed', () => {
    fc.assert(
      fc.property(
        // Generate valid URL-like strings for image sources
        fc.oneof(
          // Absolute URLs
          fc.webUrl().map(url => `${url}/image.jpg`),
          // Relative paths
          fc.stringMatching(/^\/[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+\.(jpg|png|webp|gif)$/),
          // Asset paths typical in React projects
          fc.stringMatching(/^\/images\/[a-zA-Z0-9-_]+\.(jpg|png|webp|gif)$/),
          // Data URIs (small placeholder)
          fc.constant('data:image/png;base64,iVBORw0KGgo=')
        ),
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        (imageSrc, imageAlt) => {
          const { container, unmount } = render(
            <PhotoModal
              isOpen={true}
              onClose={() => {}}
              imageSrc={imageSrc}
              imageAlt={imageAlt}
            />
          );

          // Find the img element in the modal (rendered via portal to body)
          const imgElement = document.body.querySelector('img');
          
          // Verify the exact src is used
          expect(imgElement).not.toBeNull();
          expect(imgElement.getAttribute('src')).toBe(imageSrc);
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10.2: Modal displays the exact alt text that was passed
   * 
   * *For any* valid alt text passed to PhotoModal, the modal SHALL render
   * an img element with that exact alt attribute.
   * 
   * **Validates: Requirements 6.6**
   */
  test('modal displays the exact alt text that was passed', () => {
    fc.assert(
      fc.property(
        fc.constant('/images/test.jpg'),
        // Generate valid alt text strings - non-empty trimmed strings
        fc.string({ minLength: 1, maxLength: 200 })
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

          // Find the img element in the modal (rendered via portal to body)
          const imgElement = document.body.querySelector('img');
          
          // Verify the exact alt text is used
          expect(imgElement).not.toBeNull();
          expect(imgElement.getAttribute('alt')).toBe(imageAlt);
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10.3: Modal renders correctly for various valid src/alt combinations
   * 
   * *For any* valid combination of image src and alt text, the PhotoModal
   * SHALL render both the image with correct attributes and display the
   * caption text.
   * 
   * **Validates: Requirements 6.6**
   */
  test('modal renders correctly for various valid src/alt combinations', () => {
    fc.assert(
      fc.property(
        // Generate travel photo-like data
        fc.record({
          id: fc.uuid(),
          src: fc.oneof(
            // Common image paths
            fc.stringMatching(/^\/images\/[a-z]{3,15}\.(jpg|png|webp)$/),
            // Full URLs
            fc.webUrl().map(url => `${url}/photo.jpg`),
            // Relative paths with subdirectories
            fc.stringMatching(/^\/assets\/images\/[a-z]{3,10}\.(jpg|png)$/)
          ),
          alt: fc.stringMatching(/^[A-Za-z][a-zA-Z0-9 ]{5,50}$/),
          location: fc.stringMatching(/^[A-Z][a-zA-Z]{2,15}(, [A-Z][a-zA-Z]{2,15})?$/)
        }),
        (photo) => {
          const { unmount } = render(
            <PhotoModal
              isOpen={true}
              onClose={() => {}}
              imageSrc={photo.src}
              imageAlt={photo.alt}
            />
          );

          // Find the img element in the modal (rendered via portal to body)
          const imgElement = document.body.querySelector('img');
          
          // Verify both src and alt are correctly rendered
          expect(imgElement).not.toBeNull();
          expect(imgElement.getAttribute('src')).toBe(photo.src);
          expect(imgElement.getAttribute('alt')).toBe(photo.alt);
          
          // Verify the caption (imageAlt) is displayed in the modal
          const captionElement = document.body.querySelector('p');
          expect(captionElement).not.toBeNull();
          expect(captionElement.textContent).toBe(photo.alt);
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10.4: Modal does not render image when closed
   * 
   * *For any* photo data, when isOpen is false, the PhotoModal SHALL NOT
   * render any img element.
   * 
   * **Validates: Requirements 6.6**
   */
  test('modal does not render image when closed', () => {
    fc.assert(
      fc.property(
        fc.constant('/images/test.jpg'),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        (imageSrc, imageAlt) => {
          const { baseElement, unmount } = render(
            <PhotoModal
              isOpen={false}
              onClose={() => {}}
              imageSrc={imageSrc}
              imageAlt={imageAlt}
            />
          );

          // When modal is closed, there should be no img element in the portal
          const imgElements = document.body.querySelectorAll('[role="dialog"] img');
          expect(imgElements.length).toBe(0);
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10.5: Modal maintains image identity across open states
   * 
   * *For any* photo data, when modal transitions from closed to open,
   * the displayed image SHALL match the provided src and alt exactly.
   * 
   * **Validates: Requirements 6.6**
   */
  test('modal maintains correct image identity when opened', () => {
    fc.assert(
      fc.property(
        fc.record({
          src: fc.oneof(
            fc.stringMatching(/^\/images\/[a-z]+\.(jpg|png)$/),
            fc.constant('/assets/images/travel.webp'),
            fc.constant('/photos/vacation.jpg')
          ),
          alt: fc.stringMatching(/^[A-Z][a-zA-Z ]{3,30}$/)
        }),
        (photo) => {
          // First render with modal closed
          const { rerender, unmount } = render(
            <PhotoModal
              isOpen={false}
              onClose={() => {}}
              imageSrc={photo.src}
              imageAlt={photo.alt}
            />
          );

          // Verify no image when closed
          let imgElement = document.body.querySelector('[role="dialog"] img');
          expect(imgElement).toBeNull();

          // Now open the modal
          rerender(
            <PhotoModal
              isOpen={true}
              onClose={() => {}}
              imageSrc={photo.src}
              imageAlt={photo.alt}
            />
          );

          // Verify image is now present with correct attributes
          imgElement = document.body.querySelector('img');
          expect(imgElement).not.toBeNull();
          expect(imgElement.getAttribute('src')).toBe(photo.src);
          expect(imgElement.getAttribute('alt')).toBe(photo.alt);
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10.6: Modal has proper accessibility attributes
   * 
   * *For any* photo data when modal is open, the modal SHALL have
   * proper ARIA attributes including role="dialog" and aria-modal="true".
   * 
   * **Validates: Requirements 6.6**
   */
  test('modal has proper accessibility attributes when open', () => {
    fc.assert(
      fc.property(
        fc.constant('/images/test.jpg'),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        (imageSrc, imageAlt) => {
          const { unmount } = render(
            <PhotoModal
              isOpen={true}
              onClose={() => {}}
              imageSrc={imageSrc}
              imageAlt={imageAlt}
            />
          );

          // Find the dialog element
          const dialogElement = document.body.querySelector('[role="dialog"]');
          
          expect(dialogElement).not.toBeNull();
          expect(dialogElement.getAttribute('aria-modal')).toBe('true');
          expect(dialogElement.getAttribute('aria-label')).toContain(imageAlt);
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
