/**
 * Property-based tests for Timeline Click Scrolls to Correct Card
 * 
 * **Property 3: Timeline Click Scrolls to Correct Card**
 * For any timeline item on the Experience page, clicking that item SHALL scroll
 * the viewport to position the corresponding experience card into view and 
 * apply highlight styling to that card.
 * 
 * **Validates: Requirements 3.4**
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { MemoryRouter } from 'react-router-dom';
import Experience from '@pages/Experience';
import Timeline from '@components/sections/Timeline';
import TimelineItem from '@components/sections/TimelineItem';
import ExperienceCard from '@components/sections/ExperienceCard';
import { experienceData } from '@utils/data';

describe('Timeline Click Scrolls to Correct Card - Property 3', () => {
  // Mock scrollIntoView for all tests
  let scrollIntoViewMock;

  beforeEach(() => {
    scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Property 3.1: Clicking timeline item calls onClick with correct id
   * 
   * For any timeline item, clicking that item SHALL trigger the onClick
   * callback with the item's id.
   * 
   * **Validates: Requirements 3.4**
   */
  test('clicking timeline item calls onClick with correct id', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...experienceData),
        (experience) => {
          const onClickMock = vi.fn();
          const items = experienceData.map(exp => ({
            id: exp.id,
            company: exp.company,
            date: exp.date,
            isActive: false
          }));

          const { unmount } = render(
            <Timeline
              items={items}
              activeId={null}
              onItemClick={onClickMock}
            />
          );

          // Find and click the button for this experience
          const button = screen.getByRole('button', {
            name: new RegExp(experience.company, 'i')
          });
          fireEvent.click(button);

          // Verify onClick was called with the correct id
          expect(onClickMock).toHaveBeenCalledWith(experience.id);

          onClickMock.mockClear();
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.2: Timeline item click triggers scroll to corresponding card
   * 
   * For any experience, clicking its timeline item SHALL trigger scrollIntoView
   * on the corresponding experience card element.
   * 
   * **Validates: Requirements 3.4**
   */
  test('clicking timeline item triggers scrollIntoView on Experience page', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...experienceData),
        (experience) => {
          const { container, unmount } = render(
            <MemoryRouter initialEntries={['/experience']}>
              <Experience />
            </MemoryRouter>
          );

          // Reset the mock before each click
          scrollIntoViewMock.mockClear();

          // Find the timeline button for this experience
          const timelineNav = container.querySelector('nav[aria-label="Experience timeline"]');
          expect(timelineNav).not.toBeNull();

          const timelineButton = within(timelineNav).getByRole('button', {
            name: new RegExp(experience.company, 'i')
          });
          
          // Use act() for synchronous state updates
          act(() => {
            fireEvent.click(timelineButton);
          });

          // Verify scrollIntoView was called
          expect(scrollIntoViewMock).toHaveBeenCalled();

          // Verify it was called with smooth scroll and centered block
          expect(scrollIntoViewMock).toHaveBeenCalledWith({
            behavior: 'smooth',
            block: 'center'
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.3: Timeline item click sets correct activeId state
   * 
   * For any experience, after clicking its timeline item, that item SHALL
   * become the active item (reflected in aria-current attribute).
   * 
   * **Validates: Requirements 3.4**
   */
  test('clicking timeline item sets correct active state', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...experienceData),
        (experience) => {
          const { container, unmount } = render(
            <MemoryRouter initialEntries={['/experience']}>
              <Experience />
            </MemoryRouter>
          );

          // Find the timeline button for this experience
          const timelineNav = container.querySelector('nav[aria-label="Experience timeline"]');
          const timelineButton = within(timelineNav).getByRole('button', {
            name: new RegExp(experience.company, 'i')
          });
          
          // Click the timeline item with act()
          act(() => {
            fireEvent.click(timelineButton);
          });

          // Verify the button has aria-current="true"
          expect(timelineButton).toHaveAttribute('aria-current', 'true');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.4: Clicked timeline item highlights corresponding card
   * 
   * For any experience, after clicking its timeline item, the corresponding
   * ExperienceCard SHALL display highlight styling (blue border/ring).
   * 
   * **Validates: Requirements 3.4**
   */
  test('clicking timeline item highlights corresponding experience card', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...experienceData),
        (experience) => {
          const { container, unmount } = render(
            <MemoryRouter initialEntries={['/experience']}>
              <Experience />
            </MemoryRouter>
          );

          // Find the timeline button for this experience
          const timelineNav = container.querySelector('nav[aria-label="Experience timeline"]');
          const timelineButton = within(timelineNav).getByRole('button', {
            name: new RegExp(experience.company, 'i')
          });
          
          // Click the timeline item with act()
          act(() => {
            fireEvent.click(timelineButton);
          });

          // Find the corresponding experience card
          const cards = container.querySelectorAll('article');
          let targetCard = null;
          
          cards.forEach(card => {
            if (card.textContent.includes(experience.role)) {
              targetCard = card;
            }
          });

          expect(targetCard).not.toBeNull();
          
          // Verify the card has highlight styling (blue border class)
          // The ExperienceCard applies 'border-blue-400/50' when isActive
          expect(targetCard.className).toContain('border-blue-400');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.5: Only one card is highlighted after timeline click
   * 
   * For any timeline item click, exactly one experience card SHALL be
   * highlighted, and all others SHALL not have highlight styling.
   * 
   * **Validates: Requirements 3.4**
   */
  test('only the clicked timeline item card is highlighted', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...experienceData),
        (experience) => {
          const { container, unmount } = render(
            <MemoryRouter initialEntries={['/experience']}>
              <Experience />
            </MemoryRouter>
          );

          // Find the timeline button for this experience
          const timelineNav = container.querySelector('nav[aria-label="Experience timeline"]');
          const timelineButton = within(timelineNav).getByRole('button', {
            name: new RegExp(experience.company, 'i')
          });
          
          // Click the timeline item with act()
          act(() => {
            fireEvent.click(timelineButton);
          });

          // Get all experience cards
          const cards = container.querySelectorAll('article');
          let highlightedCount = 0;
          
          cards.forEach(card => {
            if (card.className.includes('border-blue-400')) {
              highlightedCount++;
              // Verify the highlighted card is the correct one
              expect(card.textContent).toContain(experience.role);
            }
          });

          // Exactly one card should be highlighted
          expect(highlightedCount).toBe(1);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.6: Timeline click and card correspondence is bidirectional
   * 
   * For any experience in the data, there SHALL exist both a timeline item
   * and an experience card that are linked by the same id.
   * 
   * **Validates: Requirements 3.4**
   */
  test('timeline items and experience cards are correctly linked', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...experienceData),
        (experience) => {
          const { container, unmount } = render(
            <MemoryRouter initialEntries={['/experience']}>
              <Experience />
            </MemoryRouter>
          );

          // Verify timeline item exists for this experience
          const timelineNav = container.querySelector('nav[aria-label="Experience timeline"]');
          const timelineButton = within(timelineNav).getByRole('button', {
            name: new RegExp(experience.company, 'i')
          });
          expect(timelineButton).toBeInTheDocument();

          // Verify experience card exists for this experience
          const cards = container.querySelectorAll('article');
          let foundCard = false;
          
          cards.forEach(card => {
            if (card.textContent.includes(experience.role) && 
                card.textContent.includes(experience.company)) {
              foundCard = true;
            }
          });
          
          expect(foundCard).toBe(true);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.7: Sequential clicks update active state correctly
   * 
   * When clicking different timeline items in sequence, only the most
   * recently clicked item SHALL be active, and only its corresponding
   * card SHALL be highlighted.
   * 
   * **Validates: Requirements 3.4**
   */
  test('sequential timeline clicks update active state correctly', () => {
    // Only run if we have at least 2 experiences
    if (experienceData.length < 2) {
      return;
    }

    fc.assert(
      fc.property(
        // Generate pairs of different experiences
        fc.tuple(
          fc.constantFrom(...experienceData),
          fc.constantFrom(...experienceData)
        ).filter(([a, b]) => a.id !== b.id),
        ([firstExp, secondExp]) => {
          const { container, unmount } = render(
            <MemoryRouter initialEntries={['/experience']}>
              <Experience />
            </MemoryRouter>
          );

          const timelineNav = container.querySelector('nav[aria-label="Experience timeline"]');
          
          // Click first timeline item
          const firstButton = within(timelineNav).getByRole('button', {
            name: new RegExp(firstExp.company, 'i')
          });
          
          act(() => {
            fireEvent.click(firstButton);
          });

          expect(firstButton).toHaveAttribute('aria-current', 'true');

          // Click second timeline item
          const secondButton = within(timelineNav).getByRole('button', {
            name: new RegExp(secondExp.company, 'i')
          });
          
          act(() => {
            fireEvent.click(secondButton);
          });

          // First should no longer be active
          expect(firstButton).not.toHaveAttribute('aria-current', 'true');
          // Second should now be active
          expect(secondButton).toHaveAttribute('aria-current', 'true');

          // Verify only the second card is highlighted
          const cards = container.querySelectorAll('article');
          let highlightedCards = [];
          
          cards.forEach(card => {
            if (card.className.includes('border-blue-400')) {
              highlightedCards.push(card);
            }
          });

          expect(highlightedCards.length).toBe(1);
          expect(highlightedCards[0].textContent).toContain(secondExp.role);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.8: TimelineItem keyboard activation triggers click handler
   * 
   * For any timeline item, pressing Enter or Space when focused SHALL
   * trigger the same behavior as clicking (scroll and highlight).
   * 
   * **Validates: Requirements 3.4, 10.4**
   */
  test('timeline item keyboard activation (Enter/Space) triggers click handler', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.constantFrom(...experienceData),
          fc.constantFrom('Enter', ' ') // Test both Enter and Space keys
        ),
        ([experience, key]) => {
          const onClickMock = vi.fn();
          const items = experienceData.map(exp => ({
            id: exp.id,
            company: exp.company,
            date: exp.date,
            isActive: false
          }));

          const { unmount } = render(
            <Timeline
              items={items}
              activeId={null}
              onItemClick={onClickMock}
            />
          );

          // Find the button for this experience
          const button = screen.getByRole('button', {
            name: new RegExp(experience.company, 'i')
          });

          // Focus the button
          button.focus();
          expect(button).toHaveFocus();

          // Simulate keyboard activation using fireEvent
          fireEvent.keyDown(button, { key: key, code: key === ' ' ? 'Space' : 'Enter' });

          // Verify onClick was called with the correct id
          expect(onClickMock).toHaveBeenCalledWith(experience.id);

          onClickMock.mockClear();
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
