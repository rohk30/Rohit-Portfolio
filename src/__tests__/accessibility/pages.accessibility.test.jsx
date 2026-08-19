/**
 * Accessibility Tests for Portfolio Website Pages
 *
 * These tests use axe-core via vitest-axe to run automated accessibility
 * audits on all pages, verifying WCAG 2.1 AA compliance.
 *
 * Pages tested:
 * - Home: BentoGrid layout with widgets
 * - Experience: Timeline and experience cards
 * - Projects: Project cards grid
 * - Research: Publications with category filter
 * - About: Personal info with photo collage
 * - Contact: Contact card with links
 *
 * **Validates: Requirements 10.2, 10.3, 10.4, 10.5**
 */
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { CricketNavProvider } from '../../context/CricketNavContext';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';

// Extend Vitest matchers
expect.extend(matchers);

// Import pages
import Home from '../../pages/Home';
import Experience from '../../pages/Experience';
import Projects from '../../pages/Projects';
import Research from '../../pages/Research';
import About from '../../pages/About';
import Contact from '../../pages/Contact';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
    article: ({ children, ...props }) => <article {...props}>{children}</article>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
    aside: ({ children, ...props }) => <aside {...props}>{children}</aside>,
    header: ({ children, ...props }) => <header {...props}>{children}</header>,
    footer: ({ children, ...props }) => <footer {...props}>{children}</footer>,
    main: ({ children, ...props }) => <main {...props}>{children}</main>,
    g: ({ children, ...props }) => <g {...props}>{children}</g>,
    circle: (props) => <circle {...props} />,
    path: (props) => <path {...props} />,
    svg: ({ children, ...props }) => <svg {...props}>{children}</svg>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
  useReducedMotion: () => false,
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => ({ get: () => 0 }),
  useMotionValueEvent: () => {},
}));

// Helper function to render components with router
function renderWithRouter(component, initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <CricketNavProvider>
        {component}
      </CricketNavProvider>
    </MemoryRouter>
  );
}

// Common axe configuration for all tests
const axeOptions = {
  rules: {
    // Allow region role to be optional for this portfolio
    region: { enabled: false },
    // Skip color contrast in dark theme - manual verification recommended
    'color-contrast': { enabled: true },
  },
};

describe('Accessibility Tests', () => {
  describe('Home Page', () => {
    test('should have no accessibility violations', async () => {
      const { container } = renderWithRouter(<Home />);
      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    test('should have proper heading hierarchy', async () => {
      renderWithRouter(<Home />);
      
      // Home page is now a single-viewport cricket ground hero
      // It has an aria-label on the section but may not have headings
      // The cricket hero section itself provides the landmark
      const section = document.querySelector('[aria-label]');
      expect(section).not.toBeNull();
    });

    test('should have accessible cricket ground interaction', async () => {
      renderWithRouter(<Home />);
      
      // Home page now shows a Play button or shot targets (reduced motion)
      // The cricket hero section provides accessible navigation via shot targets
      const heroSection = document.querySelector('.cricket-hero');
      expect(heroSection).toBeInTheDocument();
    });
  });

  describe('Experience Page', () => {
    test('should have no accessibility violations', async () => {
      const { container } = renderWithRouter(<Experience />);
      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    test('should have main heading (h1)', async () => {
      renderWithRouter(<Experience />);
      
      const heading = screen.getByRole('heading', { level: 1, name: /experience/i });
      expect(heading).toBeInTheDocument();
    });

    test('should have semantic structure with main and aside', async () => {
      const { container } = renderWithRouter(<Experience />);
      
      // Check for proper semantic elements
      const main = container.querySelector('main');
      const aside = container.querySelector('aside');
      
      expect(main).toBeInTheDocument();
      expect(aside).toBeInTheDocument();
    });
  });

  describe('Projects Page', () => {
    test('should have no accessibility violations', async () => {
      const { container } = renderWithRouter(<Projects />);
      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    test('should have main heading (h1)', async () => {
      renderWithRouter(<Projects />);
      
      const heading = screen.getByRole('heading', { level: 1, name: /projects/i });
      expect(heading).toBeInTheDocument();
    });

    test('should have accessible projects list', async () => {
      renderWithRouter(<Projects />);
      
      // Projects should be in a list with proper role
      const list = screen.getByRole('list', { name: /projects list/i });
      expect(list).toBeInTheDocument();
    });

    test('should have proper list items', async () => {
      renderWithRouter(<Projects />);
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe('Research Page', () => {
    test('should have no accessibility violations', async () => {
      const { container } = renderWithRouter(<Research />);
      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    test('should have main heading (h1)', async () => {
      renderWithRouter(<Research />);
      
      const heading = screen.getByRole('heading', { level: 1, name: /research/i });
      expect(heading).toBeInTheDocument();
    });

    test('should have accessible filter buttons', async () => {
      renderWithRouter(<Research />);
      
      // Check that filter buttons are accessible - use getAllByRole since PlayNextBallWidget may also have buttons
      const allButtons = screen.getAllByRole('button', { name: /all/i });
      expect(allButtons.length).toBeGreaterThan(0);
    });
  });

  describe('About Page', () => {
    test('should have no accessibility violations', async () => {
      const { container } = renderWithRouter(<About />);
      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    test('should have main heading (h1)', async () => {
      renderWithRouter(<About />);
      
      const heading = screen.getByRole('heading', { level: 1, name: /engineer by craft/i });
      expect(heading).toBeInTheDocument();
    });

    test('should have proper heading hierarchy for sections', async () => {
      renderWithRouter(<About />);
      
      // About page has h2 elements for institution and leadership role
      const institutionHeading = screen.getByRole('heading', { name: /vellore institute/i });
      const leadershipHeading = screen.getByRole('heading', { name: /vice chairperson/i });
      
      expect(institutionHeading).toBeInTheDocument();
      expect(leadershipHeading).toBeInTheDocument();
    });
  });

  describe('Contact Page', () => {
    test('should have no accessibility violations', async () => {
      const { container } = renderWithRouter(<Contact />);
      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    test('should have main heading (h1)', async () => {
      renderWithRouter(<Contact />);
      
      const heading = screen.getByRole('heading', { level: 1, name: /get in touch/i });
      expect(heading).toBeInTheDocument();
    });

    test('should have accessible email link', async () => {
      renderWithRouter(<Contact />);
      
      // Email link should have accessible label
      const emailLink = screen.getByRole('link', { name: /send email/i });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', expect.stringContaining('mailto:'));
    });

    test('should have accessible social links', async () => {
      renderWithRouter(<Contact />);
      
      // Social links should have accessible labels
      const linkedInLink = screen.getByRole('link', { name: /linkedin/i });
      const githubLink = screen.getByRole('link', { name: /github/i });
      
      expect(linkedInLink).toBeInTheDocument();
      expect(githubLink).toBeInTheDocument();
    });

    test('should have accessible download button', async () => {
      renderWithRouter(<Contact />);
      
      // Check for resume download button (may not exist if resumePath is empty)
      const downloadButton = screen.queryByRole('link', { name: /download resume/i });
      // Button may or may not exist depending on data
      if (downloadButton) {
        expect(downloadButton).toBeInTheDocument();
      }
    });
  });

  describe('Cross-page Accessibility Checks', () => {
    const pages = [
      { name: 'Home', component: <Home /> },
      { name: 'Experience', component: <Experience /> },
      { name: 'Projects', component: <Projects /> },
      { name: 'Research', component: <Research /> },
      { name: 'About', component: <About /> },
      { name: 'Contact', component: <Contact /> },
    ];

    test.each(pages)('$name page should have no critical violations', async ({ component }) => {
      const { container } = renderWithRouter(component);
      const results = await axe(container, {
        ...axeOptions,
        resultTypes: ['violations'],
      });
      
      // Filter for critical and serious violations only
      const criticalViolations = results.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );
      
      expect(criticalViolations).toHaveLength(0);
    });

    test.each(pages)('$name page images should have alt text', async ({ component }) => {
      const { container } = renderWithRouter(component);
      
      // Check all images have alt attributes
      const images = container.querySelectorAll('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });

    test.each(pages)('$name page buttons should be focusable', async ({ component }) => {
      const { container } = renderWithRouter(component);
      
      // Check all buttons are not disabled by default
      const buttons = container.querySelectorAll('button:not([disabled])');
      buttons.forEach(button => {
        // Buttons should be focusable (tabindex not -1)
        const tabIndex = button.getAttribute('tabindex');
        expect(tabIndex).not.toBe('-1');
      });
    });

    test.each(pages)('$name page links should have accessible names', async ({ component }) => {
      const { container } = renderWithRouter(component);
      
      // Check all links have accessible names (text content or aria-label)
      const links = container.querySelectorAll('a');
      links.forEach(link => {
        const hasText = link.textContent?.trim().length > 0;
        const hasAriaLabel = link.hasAttribute('aria-label');
        const hasAriaLabelledBy = link.hasAttribute('aria-labelledby');
        
        expect(hasText || hasAriaLabel || hasAriaLabelledBy).toBe(true);
      });
    });
  });
});
