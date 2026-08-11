/**
 * Property-based tests for GlassCard component
 * 
 * **Validates: Requirements 8.2, 8.5**
 * - Requirement 8.2: THE GlassCard SHALL apply glassmorphism styling
 * - Requirement 8.5: THE Portfolio_Website SHALL maintain visual consistency using the GlassCard component
 * 
 * Property 13 (partial): Data Schema Validation
 * Verify GlassCard renders children correctly for any valid input
 */
import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import GlassCard from '@components/ui/GlassCard';

describe('GlassCard Property Tests', () => {
  /**
   * Property 1: GlassCard renders children correctly for any valid string input
   * **Validates: Requirements 8.2, 8.5**
   */
  test('renders children correctly for any valid string input', () => {
    fc.assert(
      fc.property(
        // Generate strings without leading/trailing whitespace to avoid text normalization issues
        fc.string({ minLength: 1, maxLength: 500 }).map(s => s.trim()).filter(s => s.length > 0),
        (childText) => {
          const { container, unmount } = render(<GlassCard>{childText}</GlassCard>);
          
          // Check the text content is rendered
          expect(container.textContent).toContain(childText);
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: GlassCard applies correct base classes for any configuration
   * **Validates: Requirements 8.2, 8.5**
   */
  test('applies glassmorphism base classes for all configurations', () => {
    fc.assert(
      fc.property(
        fc.record({
          hover: fc.boolean(),
          className: fc.option(fc.string({ minLength: 0, maxLength: 50 }), { nil: undefined }),
          as: fc.constantFrom('div', 'article', 'section'),
        }),
        (config) => {
          const testId = 'glass-card-test';
          const { container } = render(
            <GlassCard
              hover={config.hover}
              className={config.className}
              as={config.as}
              data-testid={testId}
            >
              Test Content
            </GlassCard>
          );

          const element = container.firstChild;
          
          // Verify base glassmorphism classes are always applied
          expect(element.className).toContain('bg-slate-900/40');
          expect(element.className).toContain('backdrop-blur-md');
          expect(element.className).toContain('border');
          expect(element.className).toContain('border-white/10');
          expect(element.className).toContain('shadow-2xl');
          expect(element.className).toContain('rounded-2xl');
          expect(element.className).toContain('overflow-hidden');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3: GlassCard correctly handles hover prop
   * **Validates: Requirements 8.2, 8.5**
   */
  test('applies hover classes if and only if hover prop is true', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (hoverEnabled) => {
          const { container } = render(
            <GlassCard hover={hoverEnabled}>Content</GlassCard>
          );

          const element = container.firstChild;
          const className = element.className;

          if (hoverEnabled) {
            // When hover is true, hover classes should be present
            expect(className).toContain('hover:bg-slate-800/50');
            expect(className).toContain('hover:border-white/20');
            expect(className).toContain('hover:shadow-blue-500/10');
            expect(className).toContain('transition-all');
            expect(className).toContain('duration-300');
          } else {
            // When hover is false, hover classes should NOT be present
            expect(className).not.toContain('hover:bg-slate-800/50');
            expect(className).not.toContain('hover:border-white/20');
            expect(className).not.toContain('hover:shadow-blue-500/10');
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4: GlassCard correctly renders as different element types
   * **Validates: Requirements 8.2, 8.5**
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
   * Property 5: GlassCard applies custom className alongside base classes
   * **Validates: Requirements 8.2, 8.5**
   */
  test('preserves custom className alongside glassmorphism classes', () => {
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
          
          // Base classes should still be present
          expect(element.className).toContain('bg-slate-900/40');
          expect(element.className).toContain('backdrop-blur-md');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6: GlassCard with onClick becomes interactive
   * **Validates: Requirements 8.5**
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
            // When onClick is provided, interactive attributes should be present
            expect(element.className).toContain('cursor-pointer');
            expect(element.getAttribute('role')).toBe('button');
            expect(element.getAttribute('tabindex')).toBe('0');
          } else {
            // When onClick is not provided, interactive attributes should NOT be present
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
   * **Validates: Requirements 8.5**
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
   * **Validates: Requirements 8.2, 8.5**
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
});
