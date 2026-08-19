import { forwardRef } from 'react';

/**
 * Button Component
 * 
 * A versatile button component with consistent styling that can render as
 * a button or link element based on props. Supports multiple variants,
 * sizes, and states.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render inside the button
 * @param {'primary'|'secondary'|'ghost'} [props.variant='primary'] - Visual style variant
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size of the button
 * @param {string} [props.href] - URL for link buttons (renders as <a> element)
 * @param {Function} [props.onClick] - Click handler function
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.download] - Download attribute for link buttons
 * @param {string} [props.className] - Additional CSS classes
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    href,
    onClick,
    disabled = false,
    download,
    className = '',
    ...rest
  },
  ref
) {
  // Base classes for all buttons
  const baseClasses = 
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1f0d]';

  // Size variant classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-base gap-2',
    lg: 'px-7 py-3.5 text-lg gap-2.5',
  };

  // Visual variant classes
  const variantClasses = {
    primary: 
      'bg-[var(--accent-gold)] text-[#0d1f0d] border border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/90 hover:border-[var(--accent-gold)]/90 active:bg-[var(--accent-gold)]/80',
    secondary: 
      'bg-[var(--glass-card-bg)] text-[var(--text)] border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] hover:border-[var(--glass-hover-border)] active:bg-[var(--glass-bg)]',
    ghost: 
      'bg-transparent text-[var(--text)] border border-transparent hover:bg-[var(--glass-card-bg)] hover:border-[var(--glass-border)] active:bg-[var(--glass-bg)]',
  };

  // Disabled state classes
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer';

  // Combine all classes
  const combinedClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    disabledClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Handle keyboard activation for custom elements
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      if (!disabled && onClick) {
        event.preventDefault();
        onClick(event);
      }
    }
  };

  // Render as anchor element if href is provided
  if (href && !disabled) {
    return (
      <a
        ref={ref}
        href={href}
        className={combinedClasses}
        onClick={onClick}
        download={download}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }

  // Render as button element
  return (
    <button
      ref={ref}
      type="button"
      className={combinedClasses}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
