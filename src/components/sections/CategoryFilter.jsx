/**
 * CategoryFilter Component
 * 
 * Filter mechanism for Research page publications.
 * Displays filter buttons for publication categories with glassmorphism styling.
 * 
 * @param {Object} props - Component props
 * @param {string[]} props.categories - Array of category names to display as filter options
 * @param {string|null} props.activeCategory - Currently selected category (null for "All")
 * @param {Function} props.onCategoryChange - Callback when category is selected: (category: string | null) => void
 * @param {string} [props.className] - Additional CSS classes to apply
 * 
 * **Validates: Requirements 5.6, 5.8**
 * 
 * @example
 * <CategoryFilter
 *   categories={['Conference', 'Journal', 'Preprint', 'Technical Report']}
 *   activeCategory={activeCategory}
 *   onCategoryChange={setActiveCategory}
 * />
 */
function CategoryFilter({ 
  categories = [], 
  activeCategory = null, 
  onCategoryChange, 
  className = '' 
}) {
  // Base classes for all filter buttons - glassmorphism styling
  const baseButtonClasses = 
    'inline-flex items-center justify-center font-medium rounded-full ' +
    'px-4 py-2 text-sm transition-all duration-300 ' +
    'border backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

  // Active button classes
  const activeClasses = 
    'bg-blue-500/30 text-blue-300 border-blue-400/50 shadow-lg shadow-blue-500/20';

  // Inactive button classes
  const inactiveClasses = 
    'bg-slate-800/40 text-gray-400 border-white/10 ' +
    'hover:bg-slate-700/50 hover:text-gray-200 hover:border-white/20';

  /**
   * Handles click on a category button
   * @param {string|null} category - Category to filter by, or null for "All"
   */
  const handleCategoryClick = (category) => {
    onCategoryChange?.(category);
  };

  /**
   * Handles keyboard interaction for accessibility
   * @param {React.KeyboardEvent} event - Keyboard event
   * @param {string|null} category - Category to filter by
   */
  const handleKeyDown = (event, category) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCategoryClick(category);
    }
  };

  /**
   * Determines if a category is currently active
   * @param {string|null} category - Category to check
   * @returns {boolean} - True if category is active
   */
  const isActive = (category) => {
    return activeCategory === category;
  };

  /**
   * Gets the appropriate classes for a button based on its active state
   * @param {string|null} category - Category to get classes for
   * @returns {string} - Combined CSS classes
   */
  const getButtonClasses = (category) => {
    return [
      baseButtonClasses,
      isActive(category) ? activeClasses : inactiveClasses,
    ].join(' ');
  };

  // Handle empty categories gracefully - just show the "All" button
  if (!categories || categories.length === 0) {
    return (
      <div 
        className={`flex flex-wrap gap-2 ${className}`}
        role="group"
        aria-label="Filter publications by category"
      >
        <button
          type="button"
          className={getButtonClasses(null)}
          onClick={() => handleCategoryClick(null)}
          onKeyDown={(e) => handleKeyDown(e, null)}
          aria-pressed={isActive(null)}
          aria-label="Show all publications"
        >
          All
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`flex flex-wrap gap-2 ${className}`}
      role="group"
      aria-label="Filter publications by category"
    >
      {/* "All" button to clear filter */}
      <button
        type="button"
        className={getButtonClasses(null)}
        onClick={() => handleCategoryClick(null)}
        onKeyDown={(e) => handleKeyDown(e, null)}
        aria-pressed={isActive(null)}
        aria-label="Show all publications"
      >
        All
      </button>

      {/* Category filter buttons */}
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={getButtonClasses(category)}
          onClick={() => handleCategoryClick(category)}
          onKeyDown={(e) => handleKeyDown(e, category)}
          aria-pressed={isActive(category)}
          aria-label={`Filter by ${category}`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
