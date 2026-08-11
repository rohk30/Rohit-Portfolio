/**
 * Property-based tests for Navigation Active State
 * 
 * **Property 1: Navigation Active State Matches Current Route**
 * - For any route in the navigation, only that route's link should have data-active="true"
 * - All other links should have data-active="false"
 * 
 * **Validates: Requirements 1.4**
 */
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '@components/layout/Navbar';
import { navigationData } from '@utils/data';

describe('Navigation Active State - Property 1', () => {
  /**
   * **Property 1.1: Active nav link matches current route**
   * For any route in the navigation, the corresponding navigation link
   * SHALL be highlighted as active (data-active="true"), and no other
   * navigation link SHALL be highlighted.
   * 
   * **Validates: Requirements 1.4**
   */
  test('for any route, only the corresponding nav link has data-active="true"', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...navigationData),
        (navItem) => {
          const { container } = render(
            <MemoryRouter initialEntries={[navItem.path]}>
              <Navbar />
            </MemoryRouter>
          );

          // Get all navigation links with data-active attribute
          const allNavLinks = container.querySelectorAll('[data-active]');
          
          // Should have at least one link
          expect(allNavLinks.length).toBeGreaterThan(0);

          // Find the active link (should be exactly one)
          const activeLinks = container.querySelectorAll('[data-active="true"]');
          expect(activeLinks.length).toBe(1);

          // The active link should correspond to the current route
          const activeLink = activeLinks[0];
          expect(activeLink.getAttribute('href')).toBe(navItem.path);

          // All other links should have data-active="false"
          const inactiveLinks = container.querySelectorAll('[data-active="false"]');
          expect(inactiveLinks.length).toBe(navigationData.length - 1);

          // Verify none of the inactive links point to the current route
          inactiveLinks.forEach((link) => {
            expect(link.getAttribute('href')).not.toBe(navItem.path);
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1.2: Exactly one nav link is active at any time**
   * For any valid route, exactly one navigation link should be marked as active.
   * 
   * **Validates: Requirements 1.4**
   */
  test('exactly one navigation link is active at any time', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...navigationData.map((item) => item.path)),
        (route) => {
          const { container } = render(
            <MemoryRouter initialEntries={[route]}>
              <Navbar />
            </MemoryRouter>
          );

          // Count links with data-active="true"
          const activeLinks = container.querySelectorAll('[data-active="true"]');
          
          // There should be exactly one active link
          expect(activeLinks.length).toBe(1);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1.3: All navigation data links have data-active attribute**
   * Every navigation link corresponding to navigationData should have the data-active attribute.
   * 
   * **Validates: Requirements 1.4**
   */
  test('all navigation data links have data-active attribute', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...navigationData.map((item) => item.path)),
        (route) => {
          const { container } = render(
            <MemoryRouter initialEntries={[route]}>
              <Navbar />
            </MemoryRouter>
          );

          // For each route in navigationData, verify the link has data-active attribute
          navigationData.forEach((navItem) => {
            // Find links by their href matching the nav path
            const link = container.querySelector(`a[href="${navItem.path}"][data-active]`);
            expect(link).not.toBeNull();
            
            const dataActive = link.getAttribute('data-active');
            // data-active should be either "true" or "false"
            expect(['true', 'false']).toContain(dataActive);
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1.4: Active state is mutually exclusive**
   * If a link has data-active="true", no other link should have data-active="true".
   * 
   * **Validates: Requirements 1.4**
   */
  test('active state is mutually exclusive across all nav links', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...navigationData),
        (navItem) => {
          const { container } = render(
            <MemoryRouter initialEntries={[navItem.path]}>
              <Navbar />
            </MemoryRouter>
          );

          // Get counts of active and inactive links
          const activeCount = container.querySelectorAll('[data-active="true"]').length;
          const inactiveCount = container.querySelectorAll('[data-active="false"]').length;
          const totalNavLinks = navigationData.length;

          // Active + inactive should equal total nav links
          expect(activeCount + inactiveCount).toBe(totalNavLinks);
          
          // Exactly one should be active
          expect(activeCount).toBe(1);
          
          // Rest should be inactive
          expect(inactiveCount).toBe(totalNavLinks - 1);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1.5: Active link label matches navigation data**
   * The active link's text content should match the label from navigationData.
   * 
   * **Validates: Requirements 1.4**
   */
  test('active link label matches the corresponding navigation data', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...navigationData),
        (navItem) => {
          const { container } = render(
            <MemoryRouter initialEntries={[navItem.path]}>
              <Navbar />
            </MemoryRouter>
          );

          // Get the active link
          const activeLink = container.querySelector('[data-active="true"]');
          
          // The active link should exist
          expect(activeLink).not.toBeNull();
          
          // The active link's text should match the expected label
          expect(activeLink.textContent).toBe(navItem.label);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
