/**
 * Timeline Component
 *
 * Vertical interactive timeline for the Experience page.
 * Detects consecutive roles at the same company and renders a
 * "Promoted" connector between them.
 */

import { ArrowUp } from 'lucide-react';
import TimelineItem from './TimelineItem';
import { experienceData } from '../../utils/data';

function Timeline({ items = [], activeId = null, onItemClick }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-[var(--text-soft)] text-center py-8">
        No timeline items to display
      </div>
    );
  }

  // Build a lookup for companyShort from experienceData
  const companyMap = {};
  experienceData.forEach((exp) => {
    companyMap[exp.id] = exp.companyShort;
  });

  return (
    <nav className="relative" aria-label="Experience timeline">
      {/* Vertical line connector */}
      <div
        className="absolute left-3 top-0 bottom-0 w-0.5 bg-[var(--glass-border)]"
        aria-hidden="true"
      />

      <ul className="relative space-y-1">
        {items.map((item, index) => {
          const prevItem = items[index - 1];
          const isSameCompany =
            prevItem && companyMap[prevItem.id] && companyMap[prevItem.id] === companyMap[item.id];

          return (
            <li key={item.id} className="relative">
              {/* Promotion connector between same-company roles */}
              {isSameCompany && (
                <div className="timeline-promotion" aria-hidden="true">
                  <div className="timeline-promotion__line" />
                  <span className="timeline-promotion__badge">
                    <ArrowUp size={11} />
                    Promoted
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => item.id && onItemClick?.(item.id)}
                className={`
                  group w-full text-left pl-8 pr-4 py-3 rounded-lg
                  transition-all duration-300 ease-out
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]
                  focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1f0d]
                  ${item.id === activeId || item.isActive
                    ? 'bg-[var(--glass-card-bg)]'
                    : 'hover:bg-[var(--glass-card-bg)]'
                  }
                `}
                aria-current={item.id === activeId || item.isActive ? 'true' : undefined}
                aria-label={`${item.company}, ${item.date}${item.id === activeId ? ' (currently selected)' : ''}`}
              >
                {/* Timeline dot */}
                <span
                  className={`
                    absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full
                    border-2 transition-all duration-300
                    ${item.id === activeId || item.isActive
                      ? 'bg-[var(--accent-gold)] border-[var(--accent-gold)] shadow-lg shadow-[rgba(201,162,39,0.5)]'
                      : 'bg-[#0d1f0d] border-[var(--glass-border)] group-hover:border-[var(--accent-gold)]/50'
                    }
                  `}
                  aria-hidden="true"
                />

                <span
                  className={`
                    block text-sm font-medium transition-colors duration-300
                    ${item.id === activeId || item.isActive ? 'text-[var(--accent-gold)]' : 'text-[var(--text)] group-hover:text-[var(--accent-gold)]'}
                  `}
                >
                  {item.company}
                </span>
                <span className="block text-xs mt-1 text-[var(--text-soft)]">
                  {item.date}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Timeline;
