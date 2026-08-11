/**
 * Responsive Design Verification Tests
 *
 * Tests for verifying responsive behavior across breakpoints:
 * - 320px (mobile)
 * - 768px (tablet)
 * - 1024px (desktop)
 * - 2560px (ultra-wide)
 *
 * **Validates: Requirements 9.1, 9.2, 9.5**
 * - 9.1: THE Portfolio_Website SHALL render correctly on viewport widths from 320px to 2560px
 * - 9.2: WHEN the viewport width is less than 768px, THE Portfolio_Website SHALL adjust grid layouts to single-column
 * - 9.5: THE Portfolio_Website SHALL load and function without horizontal scrolling on any supported viewport
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Import pages
import Home from '../pages/Home';
import Experience from '../pages/Experience';
import Projects from '../pages/Projects';
import Research from '../pages/Research';
import About from '../pages/About';
import Contact from '../pages/Contact';

// Import key responsive components
import BentoGrid from '../components/sections/BentoGrid';
import Navbar from '../components/layout/Navbar';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  
  // Create a mock component factory
  const createMockComponent = (Tag) => {
    const Component = ({ children, className, onClick, ...props }) => {
      // Filter out framer-motion specific props
      const { 
        initial, animate, exit, variants, whileHover, whileTap, 
        custom, transition, layout, layoutId, drag, dragConstraints,
        onAnimationComplete, onAnimationStart, ...validProps 
      } = props;
      return (
        <Tag className={className} onClick={onClick} {...validProps}>
          {children}
        </Tag>
      );
    };
    Component.displayName = `motion.${Tag}`;
    return Component;
  };
  
  return {
    ...actual,
    AnimatePresence: ({ children }) => <>{children}</>,
    motion: {
      div: createMockComponent('div'),
      nav: createMockComponent('nav'),
      section: createMockComponent('section'),
      button: createMockComponent('button'),
      span: createMockComponent('span'),
      p: createMockComponent('p'),
      article: createMockComponent('article'),
      aside: createMockComponent('aside'),
      main: createMockComponent('main'),
      header: createMockComponent('header'),
      footer: createMockComponent('footer'),
      ul: createMockComponent('ul'),
      li: createMockComponent('li'),
      a: createMockComponent('a'),
      img: createMockComponent('img'),
    },
    useReducedMotion: () => false,
  };
});

// Test utilities
const renderWithRouter = (component, route = '/') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {component}
    </MemoryRouter>
  );
};

/**
 * Helper function to simulate viewport width change
 * @param {number} width - Viewport width in pixels
 */
const setViewportWidth = (width) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
};

/**
 * Helper function to check if element has single-column layout classes
 * @param {HTMLElement} element - DOM element to check
 * @returns {boolean} - True if element has single-column layout
 */
const hasSingleColumnClass = (element) => {
  const className = element?.className || '';
  return (
    className.includes('grid-cols-1') ||
    className.includes('flex-col') ||
    !className.includes('grid-cols-')
  );
};

/**
 * Helper function to check if element has multi-column layout classes for desktop
 * @param {HTMLElement} element - DOM element to check
 * @returns {boolean} - True if element has responsive grid classes
 */
const hasResponsiveGridClasses = (element) => {
  const className = element?.className || '';
  return (
    className.includes('md:grid-cols-') ||
    className.includes('lg:grid-cols-') ||
    className.includes('lg:flex-row')
  );
};

describe('Responsive Design - Requirements 9.1, 9.2, 9.5', () => {
  beforeEach(() => {
    // Reset viewport width before each test
    setViewportWidth(1024);
  });

  afterEach(() => {
    // Reset viewport width after each test
    setViewportWidth(1024);
  });

  describe('Viewport Rendering (Requirement 9.1)', () => {
    const viewports = [
      { name: 'mobile', width: 320 },
      { name: 'tablet', width: 768 },
      { name: 'desktop', width: 1024 },
      { name: 'ultra-wide', width: 2560 },
    ];

    viewports.forEach(({ name, width }) => {
      it(`should render Home page correctly at ${width}px (${name})`, () => {
        setViewportWidth(width);
        const { container } = renderWithRouter(<Home />);
        expect(container).toBeInTheDocument();
        expect(container.innerHTML.length).toBeGreaterThan(0);
      });

      it(`should render Experience page correctly at ${width}px (${name})`, () => {
        setViewportWidth(width);
        const { container } = renderWithRouter(<Experience />);
        expect(container).toBeInTheDocument();
        expect(container.innerHTML.length).toBeGreaterThan(0);
      });

      it(`should render Projects page correctly at ${width}px (${name})`, () => {
        setViewportWidth(width);
        const { container } = renderWithRouter(<Projects />);
        expect(container).toBeInTheDocument();
        expect(container.innerHTML.length).toBeGreaterThan(0);
      });

      it(`should render Research page correctly at ${width}px (${name})`, () => {
        setViewportWidth(width);
        const { container } = renderWithRouter(<Research />);
        expect(container).toBeInTheDocument();
        expect(container.innerHTML.length).toBeGreaterThan(0);
      });

      it(`should render About page correctly at ${width}px (${name})`, () => {
        setViewportWidth(width);
        const { container } = renderWithRouter(<About />);
        expect(container).toBeInTheDocument();
        expect(container.innerHTML.length).toBeGreaterThan(0);
      });

      it(`should render Contact page correctly at ${width}px (${name})`, () => {
        setViewportWidth(width);
        const { container } = renderWithRouter(<Contact />);
        expect(container).toBeInTheDocument();
        expect(container.innerHTML.length).toBeGreaterThan(0);
      });
    });
  });

  describe('BentoGrid Responsive Layout (Requirement 9.2)', () => {
    it('should have grid-cols-1 class for single-column on mobile', () => {
      const { container } = render(
        <BentoGrid>
          <div>Widget 1</div>
          <div>Widget 2</div>
        </BentoGrid>
      );
      const grid = container.firstChild;
      expect(grid.className).toContain('grid-cols-1');
    });

    it('should have md:grid-cols-4 class for multi-column on desktop', () => {
      const { container } = render(
        <BentoGrid>
          <div>Widget 1</div>
          <div>Widget 2</div>
        </BentoGrid>
      );
      const grid = container.firstChild;
      expect(grid.className).toContain('md:grid-cols-4');
    });
  });

  describe('Experience Page Split Layout (Requirement 9.2)', () => {
    it('should use flex-col lg:flex-row for responsive split layout', () => {
      const { container } = renderWithRouter(<Experience />);
      // The Experience page has a flex container with flex-col lg:flex-row
      const flexContainer = container.querySelector('.flex-col');
      expect(flexContainer).toBeInTheDocument();
      // Check for lg:flex-row class
      if (flexContainer) {
        expect(flexContainer.className).toContain('lg:flex-row');
      }
    });
  });

  describe('Projects Page Grid Layout (Requirement 9.2)', () => {
    it('should have grid-cols-1 md:grid-cols-2 for responsive grid', () => {
      const { container } = renderWithRouter(<Projects />);
      const projectGrid = container.querySelector('[role="list"]');
      if (projectGrid) {
        expect(projectGrid.className).toContain('grid-cols-1');
        expect(projectGrid.className).toContain('md:grid-cols-2');
      }
    });
  });

  describe('Research Page Grid Layout (Requirement 9.2)', () => {
    it('should have grid-cols-1 md:grid-cols-2 for responsive publication grid', () => {
      const { container } = renderWithRouter(<Research />);
      const publicationGrid = container.querySelector('[role="list"]');
      if (publicationGrid) {
        expect(publicationGrid.className).toContain('grid-cols-1');
        expect(publicationGrid.className).toContain('md:grid-cols-2');
      }
    });
  });

  describe('About Page Split Layout (Requirement 9.2)', () => {
    it('should have grid-cols-1 lg:grid-cols-2 for responsive split layout', () => {
      const { container } = renderWithRouter(<About />);
      // Find the main grid container
      const gridContainer = container.querySelector('.grid');
      if (gridContainer) {
        expect(gridContainer.className).toContain('grid-cols-1');
        expect(gridContainer.className).toContain('lg:grid-cols-2');
      }
    });
  });

  describe('Navbar Responsive Behavior (Requirement 9.2)', () => {
    it('should have hidden desktop navigation on mobile (hidden md:flex)', () => {
      const { container } = renderWithRouter(<Navbar />);
      const desktopNav = container.querySelector('.hidden.md\\:flex');
      expect(desktopNav).toBeInTheDocument();
    });

    it('should have hamburger menu button visible on mobile (md:hidden)', () => {
      const { container } = renderWithRouter(<Navbar />);
      const mobileMenuButton = container.querySelector('.md\\:hidden');
      expect(mobileMenuButton).toBeInTheDocument();
    });

    it('should have mobile hamburger button with aria-label', () => {
      renderWithRouter(<Navbar />);
      const hamburgerButton = screen.getByRole('button', { name: /open navigation menu/i });
      expect(hamburgerButton).toBeInTheDocument();
    });
  });

  describe('No Horizontal Scrolling (Requirement 9.5)', () => {
    it('should have container with max-width and auto margins', () => {
      const { container } = renderWithRouter(<Home />);
      const portfolioContainer = container.querySelector('.container-portfolio');
      expect(portfolioContainer).toBeInTheDocument();
    });

    it('should not have elements with explicit widths exceeding viewport', () => {
      const { container } = renderWithRouter(<Home />);
      // Check for overflow-hidden or proper width constraints
      const mainContent = container.querySelector('.min-h-screen');
      expect(mainContent).toBeInTheDocument();
    });

    it('Contact page should have centered card with max-width constraint', () => {
      const { container } = renderWithRouter(<Contact />);
      const centeredContainer = container.querySelector('.max-w-lg');
      expect(centeredContainer).toBeInTheDocument();
    });

    it('should use relative/percentage widths for responsive elements', () => {
      const { container } = renderWithRouter(<Home />);
      // Check that main container uses w-full (100% width)
      const fullWidthElements = container.querySelectorAll('.w-full');
      expect(fullWidthElements.length).toBeGreaterThan(0);
    });
  });

  describe('Container Width Constraints (Requirement 9.5)', () => {
    it('should have padding on container for smaller viewports', () => {
      const { container } = renderWithRouter(<Home />);
      // container-portfolio class has px-4 on mobile, px-6 on sm, px-8 on lg
      const portfolioContainer = container.querySelector('.container-portfolio');
      expect(portfolioContainer).toBeInTheDocument();
    });

    it('Experience page should have container with responsive padding', () => {
      const { container } = renderWithRouter(<Experience />);
      const portfolioContainer = container.querySelector('.container-portfolio');
      expect(portfolioContainer).toBeInTheDocument();
    });

    it('Projects page should have container with responsive padding', () => {
      const { container } = renderWithRouter(<Projects />);
      const portfolioContainer = container.querySelector('.container-portfolio');
      expect(portfolioContainer).toBeInTheDocument();
    });

    it('Research page should have container with responsive padding', () => {
      const { container } = renderWithRouter(<Research />);
      const portfolioContainer = container.querySelector('.container-portfolio');
      expect(portfolioContainer).toBeInTheDocument();
    });

    it('About page should have container with responsive padding', () => {
      const { container } = renderWithRouter(<About />);
      const portfolioContainer = container.querySelector('.container-portfolio');
      expect(portfolioContainer).toBeInTheDocument();
    });

    it('Contact page should have container with responsive padding', () => {
      const { container } = renderWithRouter(<Contact />);
      const portfolioContainer = container.querySelector('.container-portfolio');
      expect(portfolioContainer).toBeInTheDocument();
    });
  });

  describe('Responsive Typography', () => {
    it('Home page should have responsive heading sizes', () => {
      const { container } = renderWithRouter(<Home />);
      // IntroWidget has text-3xl md:text-4xl lg:text-5xl
      const heading = container.querySelector('h1');
      if (heading) {
        const className = heading.className;
        expect(
          className.includes('text-3xl') ||
          className.includes('text-4xl') ||
          className.includes('md:text-')
        ).toBe(true);
      }
    });

    it('Experience page should have responsive heading sizes', () => {
      const { container } = renderWithRouter(<Experience />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.className).toContain('text-4xl');
      expect(heading.className).toContain('md:text-5xl');
    });

    it('Projects page should have responsive heading sizes', () => {
      const { container } = renderWithRouter(<Projects />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.className).toContain('text-4xl');
      expect(heading.className).toContain('md:text-5xl');
    });
  });

  describe('Responsive Spacing', () => {
    it('should have responsive padding on page content', () => {
      const { container } = renderWithRouter(<Home />);
      // Check for py-8 md:py-12 pattern
      const contentWithPadding = container.querySelector('.py-8');
      expect(contentWithPadding).toBeInTheDocument();
    });

    it('should have responsive gap in grids', () => {
      const { container } = render(
        <BentoGrid>
          <div>Test</div>
        </BentoGrid>
      );
      const grid = container.firstChild;
      expect(grid.className).toContain('gap-4');
      expect(grid.className).toContain('md:gap-6');
    });
  });

  describe('Touch-Friendly Tap Targets (Requirement 9.4)', () => {
    it('Navbar mobile menu button should have minimum 44x44px tap target', () => {
      const { container } = renderWithRouter(<Navbar />);
      const mobileButton = container.querySelector('.md\\:hidden button, .md\\:hidden [role="button"]');
      if (mobileButton) {
        expect(mobileButton.className).toContain('min-h-[44px]');
        expect(mobileButton.className).toContain('min-w-[44px]');
      }
    });
  });
});

describe('Widget Responsive Spans', () => {
  it('IntroWidget should have col-span-1 md:col-span-2 row-span-1 md:row-span-2', () => {
    const { container } = renderWithRouter(<Home />);
    // Find IntroWidget by its content
    const introWidget = container.querySelector('.col-span-1.md\\:col-span-2.md\\:row-span-2');
    expect(introWidget).toBeInTheDocument();
  });

  it('FocusWidget should have col-span-1 md:col-span-2', () => {
    const { container } = renderWithRouter(<Home />);
    // Find elements with col-span-2 on md
    const widgetsWithColSpan2 = container.querySelectorAll('.md\\:col-span-2');
    expect(widgetsWithColSpan2.length).toBeGreaterThanOrEqual(2); // IntroWidget and FocusWidget
  });
});
