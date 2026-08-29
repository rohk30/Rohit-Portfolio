/**
 * Property-based tests for GlassCard component
 * 
 * **Validates: Requirements 6.1, 6.2, 6.3**
 * - Requirement 6.1: Warm glassmorphism with cream/gold-tinted borders rgba(200, 180, 140, 0.15)
 * - Requirement 6.2: Backdrop-filter blur of 18px with warm-toned semi-transparent fill rgba(30, 25, 18, 0.40)
 * - Requirement 6.3: Hover transitions border color to Gold at 0.45 opacity over 300ms
 * 
 * Property: GlassCard uses warm glassmorphism CSS custom properties
 */
import { describe, test, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import GlassCard from '@components/ui/GlassCard';

describe('GlassCard Property Tests', () => {
  /**
   * Property 1: GlassCard renders children correctly for any valid string input
   * **Validates: Requirements 6.1, 6.2**
   */
  test('renders children correctly for any valid string input', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 500 }).map(s => s.trim()).filter(s => s.length > 0),
        (childText) => {
          const { container, unmount } = render(<GlassCard>{childText}</GlassCard>);
          
          expect(container.textContent).toContain(childText);
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: GlassCard applies warm glassmorphism styles via CSS custom properties
   * **Validates: Requirements 6.1, 6.2**
   */
  test('applies warm glassmorphism CSS custom properties for all configurations', () => {
    fc.assert(
      fc.property(
        fc.record({
          hover: fc.boolean(),
          className: fc.option(fc.string({ minLength: 0, maxLength: 50 }), { nil: undefined }),
          as: fc.constantFrom('div', 'article', 'section'),
        }),
        (config) => {
          const { container } = render(
            <GlassCard
              hover={config.hover}
              className={config.className}
              as={config.as}
            >
              Test Content
            </GlassCard>
          );

          const element = container.firstChild;
          const style = element.style;
          
          // Verify warm glassmorphism CSS custom properties are applied via inline styles
          expect(style.background).toBe('var(--glass-card-bg)');
          expect(style.border).toBe('1px solid var(--glass-border)');
          expect(style.borderRadius).toBe('1rem');
          expect(style.overflow).toBe('hidden');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3: GlassCard hover state transitions border to Gold at 0.45 opacity
   * **Validates: Requirement 6.3**
   */
  test('hover transitions border color to Gold at 0.45 opacity when hover prop is true', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (hoverEnabled) => {
          const { container } = render(
            <GlassCard hover={hoverEnabled}>Content</GlassCard>
          );

          const element = container.firstChild;

          if (hoverEnabled) {
            // Verify transition property includes border-color with 300ms duration
            expect(element.style.transition).toContain('border-color 300ms');
            
            // Simulate hover - verify border changes to gold
            fireEvent.mouseEnter(element);
            expect(element.style.borderColor).toBe('var(--glass-hover-border)');
            
            // Simulate mouse leave - verify border returns to default
            fireEvent.mouseLeave(element);
            expect(element.style.borderColor).toBe('var(--glass-border)');
          } else {
            // When hover is false, no transition should be applied
            expect(element.style.transition).toBe('');
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4: GlassCard correctly renders as different element types
   * **Validates: Requirements 6.1, 6.2**
   */
  test('renders as the correct element type based on "as" prop', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('div', 'article', 'section'),
        (elementType) => {
          const { container } = render(
            <GlassCard as={elementType}>Content</GlassCard>
          );

          const element = container.firstChild;
          expect(element.tagName.toLowerCase()).toBe(elementType);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5: GlassCard applies custom className alongside warm glassmorphism styles
   * **Validates: Requirements 6.1, 6.2**
   */
  test('preserves custom className alongside warm glassmorphism styles', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(s)),
        (customClass) => {
          const { container } = render(
            <GlassCard className={customClass}>Content</GlassCard>
          );

          const element = container.firstChild;
          
          // Custom class should be present
          expect(element.className).toContain(customClass);
          
          // Base glass-card class should still be present
          expect(element.className).toContain('glass-card');
          
          // Warm glassmorphism styles should still be applied
          expect(element.style.background).toBe('var(--glass-card-bg)');
          expect(element.style.border).toBe('1px solid var(--glass-border)');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6: GlassCard with onClick becomes interactive
   * **Validates: Requirements 6.1**
   */
  test('adds interactive attributes when onClick is provided', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (hasOnClick) => {
          const handleClick = hasOnClick ? () => {} : undefined;
          
          const { container } = render(
            <GlassCard onClick={handleClick}>Content</GlassCard>
          );

          const element = container.firstChild;

          if (hasOnClick) {
            expect(element.className).toContain('cursor-pointer');
            expect(element.getAttribute('role')).toBe('button');
            expect(element.getAttribute('tabindex')).toBe('0');
          } else {
            expect(element.className).not.toContain('cursor-pointer');
            expect(element.getAttribute('role')).toBeNull();
            expect(element.getAttribute('tabindex')).toBeNull();
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7: GlassCard onClick is triggered on click and keyboard events
   * **Validates: Requirements 6.1**
   */
  test('onClick handler is invoked on click and keyboard activation', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('click', 'Enter', ' '),
        (eventType) => {
          let clicked = false;
          const handleClick = () => { clicked = true; };
          
          const { container } = render(
            <GlassCard onClick={handleClick}>Content</GlassCard>
          );

          const element = container.firstChild;
          clicked = false;

          if (eventType === 'click') {
            fireEvent.click(element);
          } else {
            fireEvent.keyDown(element, { key: eventType });
          }

          expect(clicked).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8: GlassCard renders complex children correctly
   * **Validates: Requirements 6.1, 6.2**
   */
  test('renders nested content structures correctly', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
        (items) => {
          const { container } = render(
            <GlassCard>
              <ul>
                {items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </GlassCard>
          );

          const listItems = container.querySelectorAll('li');
          expect(listItems.length).toBe(items.length);
          
          items.forEach((item, index) => {
            expect(listItems[index].textContent).toBe(item);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9: GlassCard backdrop-filter uses 18px blur via CSS custom property
   * **Validates: Requirement 6.2**
   */
  test('applies backdrop-filter blur via CSS custom property --glass-card-blur', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('div', 'article', 'section'),
        (elementType) => {
          const { container } = render(
            <GlassCard as={elementType}>Content</GlassCard>
          );

          const element = container.firstChild;
          
          // Verify backdrop-filter references the CSS custom property
          expect(element.style.backdropFilter).toBe('blur(var(--glass-card-blur))');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
