/**
 * Timeline Component
 * 
 * A vertical interactive timeline for the Experience page that displays
 * work history chronologically. Supports highlighting the active/selected
 * item and click events to navigate to corresponding experience cards.
 * 
 * Requirement 3.1: THE Experience_Page SHALL display a vertical Timeline_Component on the left side
 */

import TimelineItem from './TimelineItem';

/**
 * @typedef {Object} TimelineItemData
 * @property {string} id - Unique identifier for the timeline item
 * @property {string} company - Company name to display
 * @property {string} date - Date range string (e.g., "Jan 2024 - Present")
 * @property {boolean} isActive - Whether this item is currently active/selected
 */

/**
 * @param {Object} props
 * @param {TimelineItemData[]} props.items - Array of timeline items to display
 * @param {string|null} props.activeId - ID of the currently active/selected item
 * @param {(id: string) => void} props.onItemClick - Callback when a timeline item is clicked
 */
function Timeline({ items = [], activeId = null, onItemClick }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">
        No timeline items to display
      </div>
    );
  }

  return (
    <nav 
      className="relative" 
      aria-label="Experience timeline"
    >
      {/* Vertical line connector */}
      <div 
        className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/10"
        aria-hidden="true"
      />

      {/* Timeline items */}
      <ul className="relative space-y-6">
        {items.map((item) => (
          <TimelineItem
            key={item.id}
            id={item.id}
            company={item.company}
            date={item.date}
            isActive={item.id === activeId || item.isActive}
            onClick={onItemClick}
          />
        ))}
      </ul>
    </nav>
  );
}

export default Timeline;
