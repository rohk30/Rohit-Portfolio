/**
 * TimelineItem Component
 * 
 * Individual timeline item displaying company name and date range.
 * Handles click events to trigger scroll and highlight of the corresponding
 * experience card.
 * 
 * Requirement 3.4: WHEN a Visitor clicks a timeline item, THE Experience_Page
 * SHALL scroll to and highlight the corresponding experience card
 */

/**
 * @typedef {Object} TimelineItemProps
 * @property {string} id - Unique identifier for the timeline item
 * @property {string} company - Company name to display
 * @property {string} date - Date range string (e.g., "Jan 2024 - Present")
 * @property {boolean} isActive - Whether this item is currently active/selected
 * @property {(id: string) => void} onClick - Callback when the item is clicked
 */

/**
 * @param {TimelineItemProps} props
 */
function TimelineItem({ 
  id = '', 
  company = 'Unknown Company', 
  date = '', 
  isActive = false, 
  onClick 
}) {
  const handleClick = () => {
    if (id) {
      onClick?.(id);
    }
  };

  const handleKeyDown = (event) => {
    // Allow activation via Enter or Space key for accessibility
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (id) {
        onClick?.(id);
      }
    }
  };

  return (
    <li className="relative">
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`
          group w-full text-left pl-8 pr-4 py-3 rounded-lg
          transition-all duration-300 ease-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] 
          focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1f0d]
          ${isActive 
            ? 'bg-[var(--glass-card-bg)]' 
            : 'hover:bg-[var(--glass-card-bg)]'
          }
        `}
        aria-current={isActive ? 'true' : undefined}
        aria-label={`${company}, ${date}${isActive ? ' (currently selected)' : ''}`}
      >
        {/* Timeline dot indicator */}
        <span 
          className={`
            absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full
            border-2 transition-all duration-300
            ${isActive 
              ? 'bg-[var(--accent-gold)] border-[var(--accent-gold)] shadow-lg shadow-[rgba(201,162,39,0.5)]' 
              : 'bg-[#0d1f0d] border-[var(--glass-border)] group-hover:border-[var(--accent-gold)]/50'
            }
          `}
          aria-hidden="true"
        />

        {/* Company name */}
        <span 
          className={`
            block text-sm font-medium transition-colors duration-300
            ${isActive ? 'text-[var(--accent-gold)]' : 'text-[var(--text)] group-hover:text-[var(--accent-gold)]'}
          `}
        >
          {company}
        </span>

        {/* Date range */}
        <span 
          className={`
            block text-xs mt-1 transition-colors duration-300
            ${isActive ? 'text-[var(--text-soft)]' : 'text-[var(--text-soft)] group-hover:text-[var(--text-soft)]'}
          `}
        >
          {date}
        </span>
      </button>
    </li>
  );
}

export default TimelineItem;
