import { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { navigationData } from '../../utils/data';

/**
 * NavItem Component
 * 
 * Individual navigation link with active state detection.
 * Uses data-active attribute for testing purposes.
 */
function NavItem({ item }) {
  const location = useLocation();
  const isActive = item.path === '/' 
    ? location.pathname === '/'
    : location.pathname.startsWith(item.path);

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      data-active={isActive ? 'true' : 'false'}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1f0d] ${
        isActive
          ? 'text-[var(--accent-gold)] bg-[rgba(201,162,39,0.08)]'
          : 'text-slate-300 hover:text-white hover:bg-white/5'
      }`}
    >
      {item.label}
    </NavLink>
  );
}

/**
 * MobileNavItem Component
 * 
 * Mobile navigation link with touch-friendly tap targets (44x44px minimum).
 * Triggers menu close on click.
 */
function MobileNavItem({ item, onClose }) {
  const location = useLocation();
  const isActive = item.path === '/' 
    ? location.pathname === '/'
    : location.pathname.startsWith(item.path);

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      onClick={onClose}
      data-active={isActive ? 'true' : 'false'}
      className={`flex items-center min-h-[44px] min-w-[44px] px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1f0d] ${
        isActive
          ? 'text-[var(--accent-gold)] bg-[rgba(201,162,39,0.08)]'
          : 'text-slate-300 hover:text-white hover:bg-white/5 active:bg-white/10'
      }`}
    >
      {item.label}
    </NavLink>
  );
}

/**
 * MobileMenuDrawer Component
 * 
 * Slide-out navigation drawer with Framer Motion animations.
 * Features:
 * - Slides in from the right
 * - Touch-friendly tap targets (44x44px minimum)
 * - Closes on link click
 * - Closes on backdrop click
 * - Closes on Escape key press
 * - Respects prefers-reduced-motion accessibility setting
 * 
 * Requirements: 1.5, 9.3, 9.4, 10.6
 */
function MobileMenuDrawer({ isOpen, onClose }) {
  const drawerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Close drawer on Escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Animation variants for backdrop
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  // Animation variants for drawer - respects reduced motion
  const drawerVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
      }
    : {
        hidden: { x: '100%' },
        visible: { 
          x: 0,
          transition: {
            type: 'tween',
            ease: 'easeOut',
            duration: 0.3
          }
        },
        exit: { 
          x: '100%',
          transition: {
            type: 'tween',
            ease: 'easeIn',
            duration: 0.25
          }
        }
      };

  // Animation variants for staggered children - respects reduced motion
  const containerVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
          }
        }
      };

  const itemVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : {
        hidden: { opacity: 0, x: 20 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: {
            type: 'tween',
            ease: 'easeOut'
          }
        }
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 z-40 glass-overlay md:hidden"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            ref={drawerRef}
            className="fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[80vw] glass-modal md:hidden safe-area-inset"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Drawer header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-[rgba(200,180,140,0.15)]">
              <span className="text-lg font-semibold text-white">Menu</span>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1f0d]"
                aria-label="Close navigation menu"
              >
                {/* X close icon */}
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation links */}
            <motion.nav
              className="p-4 space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {navigationData.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <MobileNavItem item={item} onClose={onClose} />
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Navbar Component
 * 
 * Sticky glassmorphism navigation bar with responsive behavior.
 * Displays navigation links and highlights the active page.
 * 
 * Features:
 * - Desktop: Horizontal link layout
 * - Mobile (<768px): Hamburger menu with slide-out drawer
 * - Touch-friendly tap targets (44x44px minimum)
 * 
 * Requirements: 1.1, 1.2, 1.4, 1.5, 9.3, 9.4
 */
function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleOpenMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-50 portfolio-nav"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-portfolio">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo / Brand */}
            <NavLink 
              to="/" 
              className="text-xl font-semibold text-white hover:text-[var(--accent-gold)] transition-colors duration-200 rounded-lg px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1f0d]"
              aria-label="Go to homepage"
            >
              ROHIT / RKB
            </NavLink>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationData.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>

            {/* Mobile Menu Button - Touch-friendly 44x44px minimum */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={handleOpenMenu}
                className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1f0d]"
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {/* Hamburger icon */}
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMenu}
      />
    </>
  );
}

export default Navbar;
