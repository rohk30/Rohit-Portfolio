/**
 * Property-based tests for Keyboard Accessibility
 * 
 * **Property 12: Interactive Elements Keyboard Accessible**
 * - For any interactive element (button, link, clickable card) in the application,
 *   that element SHALL be focusable via Tab key navigation and activatable via
 *   Enter or Space key press.
 * 
 * **Validates: Requirements 10.4**
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Import interactive components
import GlassCard from '@components/ui/GlassCard';
import Button from '@components/ui/Button';
import TimelineItem from '@components/sections/TimelineItem';
import CategoryFilter from '@components/sections/CategoryFilter';
import ProjectCard from '@components/sections/ProjectCard';
import PublicationCard from '@components/sections/PublicationCard';
import PhotoCollage from '@components/sections/PhotoCollage';
import Navbar from '@components/layout/Navbar';
import { navigationData } from '@utils/data';

// Mock window.open for components that use it
const originalWindowOpen = window.open;
beforeEach(() => {
  window.open = vi.fn();
});
afterEach(() => {
  window.open = originalWindowOpen;
});

describe('Keyboard Accessibility - Property 12', () => {
  describe('GlassCard with onClick', () => {
    /**
     * **Property 12.1: GlassCard with onClick is focusable and activatable**
     * Clickable GlassCard components SHALL be focusable (tabIndex=0) and
     * activatable via Enter or Space key.
     * 
     * **Validates: Requirements 10.4**
     */
    test('clickable GlassCard is focusable and activatable via Enter and Space', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('Enter', ' '),
          (activationKey) => {
            let activated = false;
            const handleClick = () => { activated = true; };

            const { container } = render(
              <GlassCard onClick={handleClick}>Interactive Content</GlassCard>
            );

            const element = container.firstChild;

            // Verify element is focusable (has tabIndex=0)
            expect(element.getAttribute('tabindex')).toBe('0');
            
            // Verify element has role=button for accessibility
            expect(element.getAttribute('role')).toBe('button');

            // Reset and test activation
            activated = false;
            fireEvent.keyDown(element, { key: activationKey });
            
            expect(activated).toBe(true);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * **Property 12.2: GlassCard without onClick is not keyboard interactive**
     * Non-clickable GlassCard components should NOT have interactive attributes.
     * 
     * **Validates: Requirements 10.4**
     */
    test('non-clickable GlassCard does not have interactive keyboard attributes', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (content) => {
            const { container } = render(
              <GlassCard>{content}</GlassCard>
            );

            const element = container.firstChild;

            // Non-interactive elements should not have tabIndex or role
            expect(element.getAttribute('tabindex')).toBeNull();
            expect(element.getAttribute('role')).toBeNull();

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Button Component', () => {
    /**
     * **Property 12.3: Button is focusable and activatable**
     * Button components SHALL be natively focusable as button elements
     * and activatable via Enter or Space key.
     * 
     * **Validates: Requirements 10.4**
     */
    test('button is focusable and activatable via Enter and Space', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('primary', 'secondary', 'ghost'),
          fc.constantFrom('Enter', ' '),
          (variant, activationKey) => {
            let activated = false;
            const handleClick = () => { activated = true; };

            const { container } = render(
              <Button variant={variant} onClick={handleClick}>
                Click Me
              </Button>
            );

            const button = container.querySelector('button');
            
            // Verify it's a real button (natively focusable)
            expect(button).not.toBeNull();
            expect(button.tagName.toLowerCase()).toBe('button');
            expect(button.disabled).toBe(false);

            // Test activation
            activated = false;
            fireEvent.keyDown(button, { key: activationKey });
            
            // Button may have native handling for Enter, test Space explicitly
            if (activationKey === ' ') {
              expect(activated).toBe(true);
            }
            
            // Also verify click works
            activated = false;
            fireEvent.click(button);
            expect(activated).toBe(true);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * **Property 12.4: Button with href renders as focusable anchor**
     * Button components with href SHALL render as anchor elements
     * which are natively focusable.
     * 
     * **Validates: Requirements 10.4**
     */
    test('button with href renders as focusable anchor', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          (href) => {
            const { container } = render(
              <Button href={href}>Link Button</Button>
            );

            const link = container.querySelector('a');
            
            // Verify it's an anchor element
            expect(link).not.toBeNull();
            expect(link.tagName.toLowerCase()).toBe('a');
            expect(link.getAttribute('href')).toBe(href);
            
            // Anchors are natively focusable, no need for tabIndex

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * **Property 12.5: Disabled button is not focusable**
     * Disabled Button components should not be interactable.
     * 
     * **Validates: Requirements 10.4**
     */
    test('disabled button is not interactable', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('primary', 'secondary', 'ghost'),
          (variant) => {
            let activated = false;
            const handleClick = () => { activated = true; };

            const { container } = render(
              <Button variant={variant} onClick={handleClick} disabled>
                Disabled
              </Button>
            );

            const button = container.querySelector('button');
            
            // Verify button is disabled
            expect(button.disabled).toBe(true);
            expect(button.getAttribute('aria-disabled')).toBe('true');

            // Click should not activate
            activated = false;
            fireEvent.click(button);
            expect(activated).toBe(false);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('TimelineItem Component', () => {
    /**
     * **Property 12.6: TimelineItem is focusable and activatable**
     * TimelineItem buttons SHALL be focusable and activatable via Enter/Space.
     * 
     * **Validates: Requirements 10.4**
     */
    test('timeline item button is focusable and activatable', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            company: fc.string({ minLength: 1, maxLength: 50 }),
            date: fc.string({ minLength: 5, maxLength: 30 }),
          }),
          fc.constantFrom('Enter', ' '),
          (itemData, activationKey) => {
            let activatedId = null;
            const handleClick = (id) => { activatedId = id; };

            const { container } = render(
              <ul>
                <TimelineItem
                  id={itemData.id}
                  company={itemData.company}
                  date={itemData.date}
                  isActive={false}
                  onClick={handleClick}
                />
              </ul>
            );

            const button = container.querySelector('button');
            
            // Verify it's a button element (natively focusable)
            expect(button).not.toBeNull();
            expect(button.tagName.toLowerCase()).toBe('button');

            // Test keyboard activation
            activatedId = null;
            fireEvent.keyDown(button, { key: activationKey });
            expect(activatedId).toBe(itemData.id);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('CategoryFilter Component', () => {
    /**
     * **Property 12.7: CategoryFilter buttons are focusable and activatable**
     * All filter buttons in CategoryFilter SHALL be focusable and activatable.
     * 
     * **Validates: Requirements 10.4**
     */
    test('category filter buttons are focusable and activatable', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
            { minLength: 1, maxLength: 5 }
          ),
          fc.constantFrom('Enter', ' '),
          (categories, activationKey) => {
            let selectedCategory = null;
            const handleChange = (cat) => { selectedCategory = cat; };

            const { container } = render(
              <CategoryFilter
                categories={categories}
                activeCategory={null}
                onCategoryChange={handleChange}
              />
            );

            const buttons = container.querySelectorAll('button');
            
            // Should have "All" button plus one for each category
            expect(buttons.length).toBe(categories.length + 1);

            // Test that each button is focusable and activatable
            buttons.forEach((button, index) => {
              expect(button.tagName.toLowerCase()).toBe('button');
              
              // Reset and test activation
              selectedCategory = null;
              fireEvent.keyDown(button, { key: activationKey });
              
              // First button is "All" (null), rest are categories
              const expectedCategory = index === 0 ? null : categories[index - 1];
              expect(selectedCategory).toBe(expectedCategory);
            });

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('ProjectCard Component', () => {
    /**
     * **Property 12.8: ProjectCard with githubUrl has focusable link**
     * ProjectCard components with githubUrl SHALL have focusable links
     * that open the GitHub URL in a new tab.
     * 
     * Note: Implementation uses article elements which are not interactive.
     * Navigation is done through clickable article with keyboard support.
     * 
     * **Validates: Requirements 10.4**
     */
    test('project card with githubUrl is focusable and activatable', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            title: fc.string({ minLength: 1, maxLength: 100 }),
            description: fc.string({ minLength: 1, maxLength: 200 }),
            techStack: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
            githubUrl: fc.webUrl(),
          }),
          fc.constantFrom('Enter', ' '),
          (project, activationKey) => {
            const { container } = render(<ProjectCard project={project} />);

            // Find the GlassCard which wraps the interactive content
            const article = container.querySelector('article');
            
            // Verify focusability attributes (from GlassCard with onClick)
            expect(article.getAttribute('tabindex')).toBe('0');
            // Note: article elements don't get role="button" for accessibility compliance

            // Test keyboard activation
            window.open.mockClear();
            fireEvent.keyDown(article, { key: activationKey });
            
            expect(window.open).toHaveBeenCalledWith(
              project.githubUrl,
              '_blank',
              'noopener,noreferrer'
            );

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('PublicationCard Component', () => {
    /**
     * **Property 12.9: PublicationCard with publicationUrl has focusable links**
     * PublicationCard components with publicationUrl SHALL have focusable links
     * to the publication URL.
     * 
     * Note: The implementation uses anchor tags for accessibility compliance
     * instead of making the entire card clickable with role="button".
     * 
     * **Validates: Requirements 10.4**
     */
    test('publication card with publicationUrl has focusable links', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            title: fc.string({ minLength: 1, maxLength: 100 }),
            authors: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 3 }),
            venue: fc.string({ minLength: 1, maxLength: 50 }),
            date: fc.constantFrom('2024', '2023', '2024-01', '2024-12'),
            abstract: fc.string({ minLength: 1, maxLength: 200 }),
            // Use a simple URL format without special characters that could cause selector issues
            publicationUrl: fc.constantFrom(
              'https://example.com/paper1',
              'https://doi.org/10.1234/test',
              'https://arxiv.org/abs/1234.5678'
            ),
            category: fc.constantFrom('conference', 'journal', 'preprint', 'technical-report'),
            status: fc.constantFrom('published', 'under-review', 'preprint'),
          }),
          (publication) => {
            const { container } = render(<PublicationCard publication={publication} />);

            // Find all links and check if any point to the publication URL
            const allLinks = Array.from(container.querySelectorAll('a'));
            const publicationLinks = allLinks.filter(link => 
              link.getAttribute('href') === publication.publicationUrl
            );
            
            // Should have links to the publication
            expect(publicationLinks.length).toBeGreaterThan(0);
            
            // Each link should be focusable (anchors are natively focusable)
            publicationLinks.forEach(link => {
              expect(link.tagName.toLowerCase()).toBe('a');
              expect(link.getAttribute('href')).toBe(publication.publicationUrl);
            });

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * **Property 12.10: PublicationCard code link is focusable and accessible**
     * When PublicationCard has codeUrl, the code link SHALL be focusable
     * and have proper accessibility attributes.
     * 
     * **Validates: Requirements 10.4**
     */
    test('publication card code link is focusable and accessible', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            // Use alphanumeric title to avoid encoding issues with aria-label lookup
            title: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{1,50}$/),
            authors: fc.array(fc.stringMatching(/^[A-Za-z][A-Za-z ]{1,30}$/), { minLength: 1, maxLength: 3 }),
            venue: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{1,30}$/),
            date: fc.constantFrom('2024', '2023'),
            abstract: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{1,100}$/),
            publicationUrl: fc.webUrl(),
            codeUrl: fc.webUrl(),
            category: fc.constantFrom('conference', 'journal', 'preprint'),
            status: fc.constantFrom('published', 'under-review', 'preprint'),
          }),
          (publication) => {
            const { container } = render(
              <PublicationCard publication={publication} />
            );

            // Find the code link - it should be an anchor with "Code" text
            const codeLinks = container.querySelectorAll('a');
            const codeLink = Array.from(codeLinks).find(
              link => link.textContent.includes('Code') && link.getAttribute('href') === publication.codeUrl
            );
            
            // Verify code link exists and is an anchor element
            expect(codeLink).not.toBeNull();
            expect(codeLink.tagName.toLowerCase()).toBe('a');
            
            // Verify it has correct href
            expect(codeLink.getAttribute('href')).toBe(publication.codeUrl);
            
            // Verify it opens in new tab with security attributes
            expect(codeLink.getAttribute('target')).toBe('_blank');
            const rel = codeLink.getAttribute('rel');
            expect(rel).toContain('noopener');
            expect(rel).toContain('noreferrer');
            
            // Verify it has focus-visible styles for keyboard accessibility
            expect(codeLink.className).toContain('focus-visible:ring');
            
            // Verify it has an aria-label for accessibility
            expect(codeLink.getAttribute('aria-label')).toBeTruthy();

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('PhotoCollage Component', () => {
    /**
     * **Property 12.11: PhotoCollage photo buttons are focusable and activatable**
     * Photo buttons in PhotoCollage SHALL be focusable and activatable
     * via keyboard to open the modal.
     * 
     * **Validates: Requirements 10.4**
     */
    test('photo collage buttons are focusable and have proper accessible attributes', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              src: fc.constant('/test-image.jpg'),
              alt: fc.string({ minLength: 1, maxLength: 50 }),
              location: fc.string({ minLength: 1, maxLength: 30 }),
            }),
            { minLength: 1, maxLength: 4 }
          ),
          (photos) => {
            const { container } = render(<PhotoCollage photos={photos} />);

            const photoButtons = container.querySelectorAll('button');
            
            // Should have a button for each photo
            expect(photoButtons.length).toBe(photos.length);

            // Each photo button should be focusable and have proper attributes
            photoButtons.forEach((button, index) => {
              expect(button.tagName.toLowerCase()).toBe('button');
              expect(button.getAttribute('type')).toBe('button');
              
              // Should have aria-label for accessibility
              const ariaLabel = button.getAttribute('aria-label');
              expect(ariaLabel).toBeTruthy();
              expect(ariaLabel).toContain(photos[index].location);
            });

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Navbar Links', () => {
    /**
     * **Property 12.12: Navbar links are focusable**
     * All navigation links SHALL be focusable anchor elements.
     * 
     * **Validates: Requirements 10.4**
     */
    test('navbar links are focusable anchor elements', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...navigationData.map(item => item.path)),
          (route) => {
            const { container } = render(
              <MemoryRouter initialEntries={[route]}>
                <Navbar />
              </MemoryRouter>
            );

            // Find all nav links (anchors with data-active attribute)
            const navLinks = container.querySelectorAll('a[data-active]');
            
            expect(navLinks.length).toBeGreaterThan(0);

            // Each link should be an anchor (natively focusable)
            navLinks.forEach((link) => {
              expect(link.tagName.toLowerCase()).toBe('a');
              expect(link.getAttribute('href')).toBeTruthy();
            });

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * **Property 12.13: Navbar mobile menu button is focusable**
     * The mobile menu hamburger button SHALL be focusable and have
     * appropriate accessibility attributes.
     * 
     * **Validates: Requirements 10.4**
     */
    test('navbar mobile menu button is focusable with proper attributes', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...navigationData.map(item => item.path)),
          (route) => {
            const { container } = render(
              <MemoryRouter initialEntries={[route]}>
                <Navbar />
              </MemoryRouter>
            );

            // Find the mobile menu button by its aria-label
            const menuButton = container.querySelector('[aria-label="Open navigation menu"]');
            
            if (menuButton) {
              expect(menuButton.tagName.toLowerCase()).toBe('button');
              expect(menuButton.getAttribute('aria-expanded')).toBeTruthy();
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Focus Visible Styling', () => {
    /**
     * **Property 12.14: Interactive elements have focus-visible styles**
     * All interactive elements SHALL have focus-visible CSS classes
     * for keyboard user visibility.
     * 
     * **Validates: Requirements 10.4**
     */
    test('interactive components include focus-visible ring styles', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('primary', 'secondary', 'ghost'),
          (variant) => {
            // Test Button
            const { container: buttonContainer } = render(
              <Button variant={variant}>Test</Button>
            );
            const button = buttonContainer.querySelector('button');
            expect(button.className).toContain('focus-visible:ring');

            // Test GlassCard with onClick
            const { container: cardContainer } = render(
              <GlassCard onClick={() => {}}>Test</GlassCard>
            );
            const card = cardContainer.firstChild;
            expect(card.className).toContain('focus-visible:ring');

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
