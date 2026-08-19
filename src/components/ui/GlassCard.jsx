import { forwardRef } from 'react';

/**
 * GlassCard Component
 * 
 * A foundational component implementing warm glassmorphism styling used across all pages.
 * Uses CSS custom properties for the cricket evening-match color palette:
 * - --glass-card-bg: rgba(30, 25, 18, 0.40)
 * - --glass-card-blur: 18px
 * - --glass-border: rgba(200, 180, 140, 0.15)
 * - --glass-hover-border: rgba(201, 162, 39, 0.45) (Gold at 0.45 opacity)
 * 
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
  // Base warm glassmorphism styles using CSS custom properties
  const baseStyle = {
    background: 'var(--glass-card-bg)',
    backdropFilter: 'blur(var(--glass-card-blur))',
    WebkitBackdropFilter: 'blur(var(--glass-card-blur))',
    border: '1px solid var(--glass-border)',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 24px 70px rgba(0, 0, 0, 0.28)',
    ...(hover ? { transition: 'border-color 300ms ease, background 300ms ease, transform 300ms ease, box-shadow 300ms ease' } : {}),
  };

  // Base structural classes (non-color related)
  const baseClasses = 'glass-card';

  // Interactive classes for clickable cards
  const interactiveClasses = onClick ? 'cursor-pointer' : '';

  // Focus-visible classes for keyboard users (only for interactive cards)
  const focusClasses = onClick
    ? 'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1f0d]'
    : '';

  // Combine all classes
  const combinedClasses = [baseClasses, interactiveClasses, focusClasses, className]
    .filter(Boolean)
    .join(' ');

  // Handle keyboard accessibility for clickable cards
  const handleKeyDown = (event) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick(event);
    }
  };

  // Handle hover state for border-color transition to Gold at 0.45 opacity
  const handleMouseEnter = hover
    ? (e) => {
        e.currentTarget.style.borderColor = 'var(--glass-hover-border)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 28px 80px rgba(201, 162, 39, 0.06)';
      }
    : undefined;

  const handleMouseLeave = hover
    ? (e) => {
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 24px 70px rgba(0, 0, 0, 0.28)';
      }
    : undefined;

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
      style={baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...interactiveProps}
      {...rest}
    >
      {children}
    </Component>
  );
});

export default GlassCard;
