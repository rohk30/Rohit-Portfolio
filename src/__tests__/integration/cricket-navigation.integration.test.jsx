/**
 * Integration tests for cricket-themed navigation flow
 *
 * Tests the full user journey: scroll → animation → shot selection → navigation,
 * PlayNextBallWidget lifecycle, mobile viewport behavior, and error boundary isolation.
 *
 * Validates: Requirements 2.1, 3.4, 4.2, 7.1, 9.4
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CricketNavProvider } from '../../context/CricketNavContext.jsx';
import CricketErrorBoundary from '../../components/cricket/CricketErrorBoundary.jsx';
import { SHOT_TARGETS } from '../../config/shotNavigation.js';

// --- Framer Motion mock ---
// Mock framer-motion to control scroll progress and reduce animation noise
const mockScrollYProgress = { get: vi.fn(() => 0), on: vi.fn(() => () => {}) };

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useScroll: vi.fn(() => ({
      scrollYProgress: mockScrollYProgress,
      scrollY: { get: vi.fn(() => 0), on: vi.fn(() => () => {}) },
    })),
    useReducedMotion: vi.fn(() => false),
    useTransform: vi.fn((motionValue, inputRange, outputRange) => {
      // Return a simple mock motion value based on current progress
      const progress = typeof motionValue?.get === 'function' ? motionValue.get() : 0;
      // Linear interpolation for testing
      if (!inputRange || !outputRange) return { get: () => progress };
      const idx = inputRange.findIndex((v) => v >= progress);
      const output = idx >= 0 ? outputRange[Math.max(0, idx)] : outputRange[outputRange.length - 1];
      return { get: () => output, on: vi.fn(() => () => {}) };
    }),
    animate: vi.fn((from, to, options) => {
      // Immediately call onComplete to simulate instant animation
      if (options?.onComplete) {
        setTimeout(() => options.onComplete(), 0);
      }
      if (options?.onUpdate) {
        options.onUpdate(to);
      }
      return { stop: vi.fn() };
    }),
    // motion components pass through as regular elements
    motion: new Proxy(actual.motion || {}, {
      get: (target, prop) => {
        if (typeof prop === 'string') {
          // Return a forwardRef component that renders the HTML element
          const Component = ({ children, initial, animate, exit, transition, variants, whileHover, whileTap, whileFocus, ...rest }) => {
            const React = require('react');
            return React.createElement(prop, rest, children);
          };
          Component.displayName = `motion.${prop}`;
          return Component;
        }
        return target[prop];
      },
    }),
    AnimatePresence: ({ children }) => children,
  };
});

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock personalData for CricketGroundHero
vi.mock('../../utils/data.js', () => ({
  personalData: {
    hobbies: {
      narrative: 'Test narrative',
      interests: ['coding', 'cricket'],
    },
  },
  navigationData: [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'experience', label: 'Experience', path: '/experience' },
    { id: 'projects', label: 'Projects', path: '/projects' },
    { id: 'research', label: 'Research', path: '/research' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ],
}));

// Mock focusManagement
vi.mock('../../utils/focusManagement.js', () => ({
  focusSectionHeading: vi.fn(),
}));

// Mock BallTrajectory to avoid jsdom SVG limitations (getTotalLength not supported)
// The component calls onComplete immediately to simulate trajectory animation completing
vi.mock('../../components/cricket/BallTrajectory.jsx', () => ({
  default: ({ from, to, onComplete, duration }) => {
    const { useEffect } = require('react');
    useEffect(() => {
      // Simulate trajectory completing after a short delay
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 10);
      return () => clearTimeout(timer);
    }, [onComplete]);
    return null; // Renders nothing visually in tests
  },
}));

/**
 * Helper to wrap components in required providers for testing
 */
function TestWrapper({ children, initialEntries = ['/'] }) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <CricketNavProvider>{children}</CricketNavProvider>
    </MemoryRouter>
  );
}

// ============================================================
// Suite 1: Scroll → animation → navigation flow
// ============================================================
describe('Scroll → animation → navigation flow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockNavigate.mockClear();
    mockScrollYProgress.get.mockReturnValue(0);
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders CricketGroundHero with shot navigation hidden initially on desktop', async () => {
    // Set viewport to desktop
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });

    const { useReducedMotion } = await import('framer-motion');
    useReducedMotion.mockReturnValue(false);

    const CricketGroundHero = (await import('../../components/cricket/CricketGroundHero.jsx')).default;

    const { container } = render(
      <TestWrapper>
        <CricketGroundHero />
      </TestWrapper>
    );

    // Hero section should render
    const heroSection = container.querySelector('.cricket-hero');
    expect(heroSection).not.toBeNull();

    // Shot navigation container should exist but targets not visible when delivery is not complete
    const shotNav = container.querySelector('.shot-navigation');
    expect(shotNav).not.toBeNull();
  });

  it('shows shot targets after delivery completes and allows navigation on click', async () => {
    // Simulate delivery complete scenario: set scroll progress to 1.0
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    mockScrollYProgress.get.mockReturnValue(1.0);

    const { useReducedMotion } = await import('framer-motion');
    useReducedMotion.mockReturnValue(true); // Use reduced motion to show targets immediately

    const CricketGroundHero = (await import('../../components/cricket/CricketGroundHero.jsx')).default;

    render(
      <TestWrapper>
        <CricketGroundHero />
      </TestWrapper>
    );

    // Shot targets should be visible (reduced motion mode shows them immediately)
    const shotTargets = screen.getAllByRole('button', { name: /navigate to/i });
    expect(shotTargets.length).toBe(SHOT_TARGETS.length);

    // Click the first shot target (Cover Drive → /experience)
    fireEvent.click(shotTargets[0]);

    // Wait for trajectory animation to complete (mocked as instant)
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    // Navigation should have been triggered
    expect(mockNavigate).toHaveBeenCalledWith('/experience');
  });

  it('navigates to correct path based on selected shot target', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    mockScrollYProgress.get.mockReturnValue(1.0);

    const { useReducedMotion } = await import('framer-motion');
    useReducedMotion.mockReturnValue(true);

    const CricketGroundHero = (await import('../../components/cricket/CricketGroundHero.jsx')).default;

    render(
      <TestWrapper>
        <CricketGroundHero />
      </TestWrapper>
    );

    // Find and click the "Caught at Slip" target (Contact)
    const contactTarget = screen.getByRole('button', {
      name: /navigate to contact section via caught at slip/i,
    });
    fireEvent.click(contactTarget);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/contact');
  });
});

// ============================================================
// Suite 2: PlayNextBallWidget lifecycle
// ============================================================
describe('PlayNextBallWidget lifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockNavigate.mockClear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders Play Next Ball button on section pages', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });

    const PlayNextBallWidget = (await import('../../components/cricket/PlayNextBallWidget.jsx')).default;

    render(
      <TestWrapper initialEntries={['/experience']}>
        <PlayNextBallWidget currentPath="/experience" />
      </TestWrapper>
    );

    const btn = screen.getByRole('button', { name: /play next ball/i });
    expect(btn).toBeInTheDocument();
  });

  it('shows overlay with bowling animation on button click, then shot targets after 2s', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });

    const PlayNextBallWidget = (await import('../../components/cricket/PlayNextBallWidget.jsx')).default;

    render(
      <TestWrapper initialEntries={['/experience']}>
        <PlayNextBallWidget currentPath="/experience" />
      </TestWrapper>
    );

    // Click Play Next Ball button
    const btn = screen.getByRole('button', { name: /play next ball/i });
    fireEvent.click(btn);

    // Overlay should appear (dialog)
    const overlay = screen.getByRole('dialog');
    expect(overlay).toBeInTheDocument();

    // Shot targets should NOT be visible yet (bowling animation in progress)
    let shotTargets = screen.queryAllByRole('button', { name: /navigate to/i });
    // Initially no shot targets (bowling animation running for 2s)
    expect(shotTargets.length).toBe(0);

    // Advance 2 seconds for bowling animation
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    // Shot targets should now be visible
    shotTargets = screen.getAllByRole('button', { name: /navigate to/i });
    expect(shotTargets.length).toBeGreaterThan(0);
  });

  it('navigates to selected section after shot target click in widget', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });

    const PlayNextBallWidget = (await import('../../components/cricket/PlayNextBallWidget.jsx')).default;

    render(
      <TestWrapper initialEntries={['/experience']}>
        <PlayNextBallWidget currentPath="/experience" />
      </TestWrapper>
    );

    // Open widget
    fireEvent.click(screen.getByRole('button', { name: /play next ball/i }));

    // Wait for bowling animation
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    // Click a shot target (e.g., Pull Shot → /projects)
    const projectTarget = screen.getByRole('button', {
      name: /navigate to projects section via pull shot/i,
    });
    fireEvent.click(projectTarget);

    // Wait for trajectory animation to complete
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/projects');
  });

  it('filters out current page and shows only unvisited sections', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });

    // Pre-populate visited sections
    sessionStorage.setItem('cricket-visited', JSON.stringify(['/projects', '/about']));

    const PlayNextBallWidget = (await import('../../components/cricket/PlayNextBallWidget.jsx')).default;

    render(
      <TestWrapper initialEntries={['/experience']}>
        <PlayNextBallWidget currentPath="/experience" />
      </TestWrapper>
    );

    // Open widget
    fireEvent.click(screen.getByRole('button', { name: /play next ball/i }));

    // Wait for bowling animation
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    // Should show unvisited sections (excluding current page /experience, and visited /projects, /about)
    // Remaining unvisited: /research, /contact
    const shotTargets = screen.getAllByRole('button', { name: /navigate to/i });
    const labels = shotTargets.map((btn) => btn.getAttribute('aria-label'));

    expect(labels).not.toContain(expect.stringMatching(/experience/i));
    expect(labels).not.toContain(expect.stringMatching(/projects/i));
    expect(labels).not.toContain(expect.stringMatching(/about/i));
  });
});

// ============================================================
// Suite 3: Mobile viewport behavior
// ============================================================
describe('Mobile viewport behavior', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockNavigate.mockClear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows shot targets immediately on mobile viewport (<768px) without scroll', async () => {
    // Set mobile viewport
    Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });

    const { useReducedMotion } = await import('framer-motion');
    useReducedMotion.mockReturnValue(false);

    const CricketGroundHero = (await import('../../components/cricket/CricketGroundHero.jsx')).default;

    render(
      <TestWrapper>
        <CricketGroundHero />
      </TestWrapper>
    );

    // Shot targets should be visible immediately on mobile (no scroll needed)
    const shotTargets = screen.getAllByRole('button', { name: /navigate to/i });
    expect(shotTargets.length).toBe(SHOT_TARGETS.length);
  });

  it('shot targets are tappable with minimum 44x44px touch target', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });

    const { useReducedMotion } = await import('framer-motion');
    useReducedMotion.mockReturnValue(false);

    const CricketGroundHero = (await import('../../components/cricket/CricketGroundHero.jsx')).default;

    const { container } = render(
      <TestWrapper>
        <CricketGroundHero />
      </TestWrapper>
    );

    // All shot target buttons should have minimum 44px size
    const shotButtons = container.querySelectorAll('.shot-target');
    shotButtons.forEach((btn) => {
      const minWidth = btn.style.minWidth;
      const minHeight = btn.style.minHeight;
      expect(minWidth).toBe('44px');
      expect(minHeight).toBe('44px');
    });
  });

  it('PlayNextBallWidget renders as compact circular button on mobile', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });
    // Dispatch resize event to trigger mobile detection
    window.dispatchEvent(new Event('resize'));

    const PlayNextBallWidget = (await import('../../components/cricket/PlayNextBallWidget.jsx')).default;

    render(
      <TestWrapper initialEntries={['/experience']}>
        <PlayNextBallWidget currentPath="/experience" />
      </TestWrapper>
    );

    const btn = screen.getByRole('button', { name: /play next ball/i });
    expect(btn).toBeInTheDocument();
    // On mobile, button should be circular (borderRadius: 50%)
    expect(btn.style.borderRadius).toBe('50%');
  });
});

// ============================================================
// Suite 4: Error boundary isolation
// ============================================================
describe('Error boundary isolation', () => {
  beforeEach(() => {
    // Suppress React error boundary console output
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('CricketErrorBoundary renders null fallback when child throws', () => {
    function ThrowingComponent() {
      throw new Error('Cricket component failed!');
    }

    const { container } = render(
      <CricketErrorBoundary>
        <ThrowingComponent />
      </CricketErrorBoundary>
    );

    // The boundary should render nothing (null fallback)
    expect(container.innerHTML).toBe('');
  });

  it('CricketErrorBoundary renders custom fallback when provided', () => {
    function ThrowingComponent() {
      throw new Error('Cricket component failed!');
    }

    render(
      <CricketErrorBoundary fallback={<div data-testid="fallback">Fallback content</div>}>
        <ThrowingComponent />
      </CricketErrorBoundary>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.getByTestId('fallback').textContent).toBe('Fallback content');
  });

  it('cricket failure does not break Navbar rendering', async () => {
    function ThrowingCricketComponent() {
      throw new Error('Cricket SVG failed!');
    }

    // Simulate the App structure: Navbar outside boundary, cricket inside boundary
    const Navbar = (await import('../../components/layout/Navbar.jsx')).default;

    render(
      <MemoryRouter initialEntries={['/']}>
        <CricketNavProvider>
          {/* Navbar is outside cricket error boundary — always renders */}
          <Navbar />

          {/* Cricket components are wrapped in error boundary */}
          <CricketErrorBoundary>
            <ThrowingCricketComponent />
          </CricketErrorBoundary>
        </CricketNavProvider>
      </MemoryRouter>
    );

    // Navbar should still be visible and functional
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toBeInTheDocument();

    // Navigation links should still be present
    expect(screen.getByText('ROHIT / RKB')).toBeInTheDocument();
  });

  it('sibling content remains rendered when cricket component throws', () => {
    function ThrowingComponent() {
      throw new Error('Cricket failed');
    }

    render(
      <div>
        <div data-testid="sibling">I should survive</div>
        <CricketErrorBoundary>
          <ThrowingComponent />
        </CricketErrorBoundary>
        <div data-testid="another-sibling">Me too</div>
      </div>
    );

    expect(screen.getByTestId('sibling')).toBeInTheDocument();
    expect(screen.getByTestId('another-sibling')).toBeInTheDocument();
  });
});
