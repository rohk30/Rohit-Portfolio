import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CricketNavProvider, useCricketNav } from '../../context/CricketNavContext';

/**
 * Test component that consumes the context and exposes values for testing.
 */
function TestConsumer() {
  const ctx = useCricketNav();
  return (
    <div>
      <span data-testid="progress">{ctx.animationProgress}</span>
      <span data-testid="delivery">{String(ctx.deliveryComplete)}</span>
      <span data-testid="locked">{String(ctx.isNavigationLocked)}</span>
      <span data-testid="visited">{JSON.stringify([...ctx.visitedSections])}</span>
      <button data-testid="mark" onClick={() => ctx.markSectionVisited('/experience')}>Mark</button>
      <button data-testid="lock" onClick={() => ctx.lockNavigation()}>Lock</button>
      <button data-testid="unlock" onClick={() => ctx.unlockNavigation()}>Unlock</button>
    </div>
  );
}

describe('CricketNavContext', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('provides initial state values', () => {
    render(
      <CricketNavProvider>
        <TestConsumer />
      </CricketNavProvider>
    );

    expect(screen.getByTestId('progress').textContent).toBe('0');
    expect(screen.getByTestId('delivery').textContent).toBe('false');
    expect(screen.getByTestId('locked').textContent).toBe('false');
    expect(screen.getByTestId('visited').textContent).toBe('[]');
  });

  it('throws when useCricketNav is used outside provider', () => {
    // Suppress React error boundary console output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      'useCricketNav must be used within a CricketNavProvider'
    );
    consoleSpy.mockRestore();
  });

  it('markSectionVisited adds path to visitedSections and persists to sessionStorage', () => {
    render(
      <CricketNavProvider>
        <TestConsumer />
      </CricketNavProvider>
    );

    act(() => {
      screen.getByTestId('mark').click();
    });

    expect(screen.getByTestId('visited').textContent).toBe('["/experience"]');
    expect(JSON.parse(sessionStorage.getItem('cricket-visited'))).toEqual(['/experience']);
  });

  it('reads visitedSections from sessionStorage on mount', () => {
    sessionStorage.setItem('cricket-visited', JSON.stringify(['/projects', '/about']));

    render(
      <CricketNavProvider>
        <TestConsumer />
      </CricketNavProvider>
    );

    const visited = JSON.parse(screen.getByTestId('visited').textContent);
    expect(visited).toContain('/projects');
    expect(visited).toContain('/about');
  });

  it('falls back to empty Set when sessionStorage has invalid data', () => {
    sessionStorage.setItem('cricket-visited', 'not-valid-json{{{');

    render(
      <CricketNavProvider>
        <TestConsumer />
      </CricketNavProvider>
    );

    expect(screen.getByTestId('visited').textContent).toBe('[]');
  });

  it('lockNavigation sets isNavigationLocked to true', () => {
    render(
      <CricketNavProvider>
        <TestConsumer />
      </CricketNavProvider>
    );

    act(() => {
      screen.getByTestId('lock').click();
    });

    expect(screen.getByTestId('locked').textContent).toBe('true');
  });

  it('unlockNavigation sets isNavigationLocked to false', () => {
    render(
      <CricketNavProvider>
        <TestConsumer />
      </CricketNavProvider>
    );

    act(() => {
      screen.getByTestId('lock').click();
    });
    expect(screen.getByTestId('locked').textContent).toBe('true');

    act(() => {
      screen.getByTestId('unlock').click();
    });
    expect(screen.getByTestId('locked').textContent).toBe('false');
  });

  it('auto-releases navigation lock after 1200ms', () => {
    render(
      <CricketNavProvider>
        <TestConsumer />
      </CricketNavProvider>
    );

    act(() => {
      screen.getByTestId('lock').click();
    });
    expect(screen.getByTestId('locked').textContent).toBe('true');

    // Advance time by 1200ms
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(screen.getByTestId('locked').textContent).toBe('false');
  });

  it('unlockNavigation clears the auto-release timeout', () => {
    render(
      <CricketNavProvider>
        <TestConsumer />
      </CricketNavProvider>
    );

    act(() => {
      screen.getByTestId('lock').click();
    });

    // Unlock manually before the timeout fires
    act(() => {
      screen.getByTestId('unlock').click();
    });
    expect(screen.getByTestId('locked').textContent).toBe('false');

    // Advance past the original timeout — should still be unlocked
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByTestId('locked').textContent).toBe('false');
  });

  it('re-locking resets the 1200ms timeout', () => {
    render(
      <CricketNavProvider>
        <TestConsumer />
      </CricketNavProvider>
    );

    act(() => {
      screen.getByTestId('lock').click();
    });

    // Advance 800ms (not yet expired)
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(screen.getByTestId('locked').textContent).toBe('true');

    // Lock again — resets the timer
    act(() => {
      screen.getByTestId('lock').click();
    });

    // Advance another 800ms (1600ms total from first lock, but only 800ms from second lock)
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(screen.getByTestId('locked').textContent).toBe('true');

    // Advance remaining 400ms to hit 1200ms from second lock
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.getByTestId('locked').textContent).toBe('false');
  });
});
