/**
 * Badge Component
 * 
 * Displays technology stack pills with glassmorphism styling.
 * Used across Experience, Projects, and Research pages to show tech tags.
 * 
 * @param {Object} props - Component props
 * @param {string} props.text - Text content to display in the badge
 * @param {'default'|'accent'} [props.variant='default'] - Visual variant (default: gray, accent: blue-400)
 * @param {'sm'|'md'} [props.size='sm'] - Size of the badge
 * @param {string} [props.className] - Additional CSS classes to apply
 * 
 * @example
 * // Default gray badge (small)
 * <Badge text="Python" />
 * 
 * @example
 * // Accent blue badge (medium)
 * <Badge text="Featured" variant="accent" size="md" />
 */
function Badge({ text, variant = 'default', size = 'sm', className = '' }) {
  // Base classes for all badges - glassmorphism inspired
  const baseClasses = 
    'inline-flex items-center font-medium rounded-full transition-colors duration-200';

  // Size-specific classes
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  // Variant-specific classes with glassmorphism styling
  const variantClasses = {
    default: 
      'bg-slate-800/60 text-gray-300 border border-white/10 hover:bg-slate-700/60 hover:text-gray-200',
    accent: 
      'bg-blue-500/20 text-blue-400 border border-blue-400/30 hover:bg-blue-500/30 hover:text-blue-300',
  };

  // Combine all classes
  const combinedClasses = [
    baseClasses,
    sizeClasses[size] || sizeClasses.sm,
    variantClasses[variant] || variantClasses.default,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={combinedClasses}>
      {text}
    </span>
  );
}

export default Badge;
