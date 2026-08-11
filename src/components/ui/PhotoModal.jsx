import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * PhotoModal Component
 * 
 * A lightbox component for displaying enlarged photos with Framer Motion animations.
 * Handles click-outside, Escape key to close, and implements keyboard accessibility
 * with focus trap. Respects user's prefers-reduced-motion setting.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @param {string} props.imageSrc - Source URL of the image to display
 * @param {string} props.imageAlt - Alt text for the image
 * 
 * Requirements: 6.6, 10.4, 10.6
 */
function PhotoModal({ isOpen, onClose, imageSrc, imageAlt }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousActiveElement = useRef(null);
  
  // Use Framer Motion's hook to detect user's prefers-reduced-motion setting
  const prefersReducedMotion = useReducedMotion();

  // Store the previously focused element and focus the close button when modal opens
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      // Focus the close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);
    } else {
      // Restore focus when modal closes
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // Handle Escape key press to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle click outside to close
  const handleBackdropClick = useCallback(
    (event) => {
      // Only close if clicking on the backdrop, not the image
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Focus trap - keep focus within modal
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab: if on first element, move to last
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: if on last element, move to first
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    []
  );

  // Animation variants for the backdrop
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Animation variants for the modal content
  const modalVariants = {
    hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: prefersReducedMotion 
        ? { duration: 0.1 }
        : {
            type: 'spring',
            damping: 25,
            stiffness: 300,
          },
    },
    exit: { 
      opacity: 0, 
      scale: prefersReducedMotion ? 1 : 0.9,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.2,
      },
    },
  };

  // Simplified variants for reduced motion (used for consistency)
  const reducedMotionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged view of ${imageAlt}`}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal content */}
          <motion.div
            className="relative z-10 max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
            variants={prefersReducedMotion ? reducedMotionVariants : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="absolute -top-12 right-0 md:top-0 md:-right-12 p-2 rounded-full 
                         bg-slate-900/60 border border-white/10 text-white 
                         hover:bg-slate-800/80 hover:border-white/20 
                         transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label="Close modal"
              type="button"
            >
              <X size={24} />
            </button>

            {/* Image container with glassmorphism frame */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl overflow-hidden p-2">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-xl"
              />
            </div>

            {/* Image caption */}
            {imageAlt && (
              <p className="mt-4 text-gray-400 text-center text-sm">{imageAlt}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render via portal to ensure modal is above all other content
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(modalContent, document.body);
}

export default PhotoModal;
