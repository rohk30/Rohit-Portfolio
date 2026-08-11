import { forwardRef } from 'react';

/**
 * GlassCard Component
 * 
 * A foundational component implementing glassmorphism styling used across all pages.
 * Supports customizable element type, hover animations, and click handling.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render inside the card
 * @param {string} [props.className] - Additional CSS classes to apply
 * @param {boolean} [props.hover=false] - Enable hover animation
 * @param {Function} [props.onClick] - Click handler function
 * @param {'div'|'article'|'section'} [props.as='div'] - HTML element type to render
 */
const GlassCard = forwardRef(function GlassCard(
  { children, className = '', hover = false, onClick, as: Component = 'div', ...rest },
  ref
) {
  // Base glassmorphism classes
  const baseClasses = 
    'bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl overflow-hidden';

  // Hover state classes (applied when hover prop is true)
  const hoverClasses = hover
    ? 'hover:bg-slate-800/50 hover:border-white/20 hover:shadow-blue-500/10 transition-all duration-300'
    : '';

  // Interactive classes for clickable cards
  const interactiveClasses = onClick ? 'cursor-pointer' : '';

  // Focus-visible classes for keyboard users (only for interactive cards)
  const focusClasses = onClick
    ? 'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
    : '';

  // Combine all classes
  const combinedClasses = [baseClasses, hoverClasses, interactiveClasses, focusClasses, className]
    .filter(Boolean)
    .join(' ');

  // Handle keyboard accessibility for clickable cards
  const handleKeyDown = (event) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick(event);
    }
  };

  // Additional props for interactive cards
  // Note: We don't add role="button" to article elements as it's not ARIA-appropriate
  // Instead, we make them focusable and handle keyboard events
  const interactiveProps = onClick
    ? {
        onClick,
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        // Only add role="button" for div elements, not semantic elements like article
        ...(Component === 'div' ? { role: 'button' } : {}),
      }
    : {};

  return (
    <Component
      ref={ref}
      className={combinedClasses}
      {...interactiveProps}
      {...rest}
    >
      {children}
    </Component>
  );
});

export default GlassCard;
