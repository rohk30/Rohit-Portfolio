import { motion, useReducedMotion } from 'framer-motion';

/**
 * PageTransition Component
 * 
 * Wraps page content with Framer Motion animations for smooth page transitions.
 * Implements fade-and-slide effect (opacity 0→1, y 20→0) with anticipate easing.
 * Respects user's prefers-reduced-motion accessibility setting.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The page content to wrap
 * @param {string} [props.className] - Optional additional CSS classes
 */
const PageTransition = ({ children, className = '' }) => {
  // Hook to detect user's prefers-reduced-motion setting
  const prefersReducedMotion = useReducedMotion();

  // Animation variants for page transitions
  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 20 
    },
    animate: { 
      opacity: 1, 
      y: 0 
    },
    exit: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : -20 
    }
  };

  // Transition configuration
  // When reduced motion is preferred, use instant transitions
  const pageTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        type: 'tween',
        ease: 'anticipate',
        duration: 0.4
      };

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
