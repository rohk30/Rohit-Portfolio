import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

/**
 * CricketNavContext
 *
 * Manages animation progress, visited sections, and navigation locking
 * for the cricket-themed navigation system.
 *
 * Requirements: 4.3, 4.4, 3.6
 */

const STORAGE_KEY = 'cricket-visited';
const LOCK_TIMEOUT_MS = 1200;

/**
 * Reads visited sections from sessionStorage with graceful fallback.
 * Returns an empty Set if sessionStorage is unavailable or data is invalid.
 */
function getVisitedSections() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

/**
 * Persists visited sections to sessionStorage.
 * Silently fails if sessionStorage is unavailable — feature degrades to "show all".
 */
function saveVisitedSections(sections) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...sections]));
  } catch {
    // silently fail — feature degrades to "show all"
  }
}

const CricketNavContext = createContext(null);

/**
 * CricketNavProvider
 *
 * Provides cricket navigation state to the component tree:
 * - animationProgress: scroll-linked progress value (0–1)
 * - deliveryComplete: whether the bowling delivery animation finished
 * - visitedSections: Set of section paths visited this session
 * - isNavigationLocked: prevents concurrent ball trajectories
 * - markSectionVisited: records a section path as visited
 * - lockNavigation: locks navigation (with 1200ms auto-release safety)
 * - unlockNavigation: manually releases the navigation lock
 */
export function CricketNavProvider({ children }) {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [deliveryComplete, setDeliveryComplete] = useState(false);
  const [visitedSections, setVisitedSections] = useState(() => getVisitedSections());
  const [isNavigationLocked, setIsNavigationLocked] = useState(false);

  const lockTimeoutRef = useRef(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
      }
    };
  }, []);

  const markSectionVisited = useCallback((path) => {
    setVisitedSections((prev) => {
      const next = new Set(prev);
      next.add(path);
      saveVisitedSections(next);
      return next;
    });
  }, []);

  const lockNavigation = useCallback(() => {
    setIsNavigationLocked(true);

    // Clear any existing timeout before setting a new one
    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
    }

    // Auto-release after 1200ms as safety net if BallTrajectory
    // fails to fire onComplete
    lockTimeoutRef.current = setTimeout(() => {
      setIsNavigationLocked(false);
      lockTimeoutRef.current = null;
    }, LOCK_TIMEOUT_MS);
  }, []);

  const unlockNavigation = useCallback(() => {
    setIsNavigationLocked(false);

    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = null;
    }
  }, []);

  const value = {
    animationProgress,
    setAnimationProgress,
    deliveryComplete,
    setDeliveryComplete,
    visitedSections,
    isNavigationLocked,
    markSectionVisited,
    lockNavigation,
    unlockNavigation,
  };

  return (
    <CricketNavContext.Provider value={value}>
      {children}
    </CricketNavContext.Provider>
  );
}

/**
 * useCricketNav hook
 *
 * Convenience hook for consuming the CricketNavContext.
 * Throws if used outside of CricketNavProvider.
 */
export function useCricketNav() {
  const context = useContext(CricketNavContext);
  if (!context) {
    throw new Error('useCricketNav must be used within a CricketNavProvider');
  }
  return context;
}

export default CricketNavContext;
