import { useState, useRef, useCallback } from 'react';
import PageTransition from '../components/layout/PageTransition';
import Timeline from '../components/sections/Timeline';
import ExperienceCard from '../components/sections/ExperienceCard';
import { experienceData } from '../utils/data';

/**
 * Experience Page
 * 
 * Displays work experience with interactive timeline and detail cards.
 * Features a split layout with:
 * - Sticky Timeline on the left side
 * - Scrollable ExperienceCards on the right side
 * - Click-to-scroll and highlight functionality
 * 
 * Requirements: 3.1, 3.3, 3.6
 * 
 * @example
 * // Used in React Router
 * <Route path="/experience" element={<Experience />} />
 */
function Experience() {
  // Track the currently active/selected experience
  const [activeId, setActiveId] = useState(null);
  
  // Refs to each ExperienceCard for scroll-to functionality
  const cardRefs = useRef({});

  // Graceful degradation: ensure data is an array
  const safeExperienceData = Array.isArray(experienceData) ? experienceData : [];

  /**
   * Handles timeline item click - scrolls to and highlights the corresponding card
   * Requirement 3.4: Timeline click scrolls to and highlights corresponding card
   * 
   * @param {string} id - The experience id to scroll to
   */
  const handleTimelineClick = useCallback((id) => {
    // Update active state to highlight the card
    setActiveId(id);
    
    // Scroll to the corresponding card
    const cardElement = cardRefs.current[id];
    if (cardElement) {
      cardElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, []);

  /**
   * Registers a card ref for scroll-to functionality
   * 
   * @param {string} id - The experience id
   * @param {HTMLElement} element - The card DOM element
   */
  const setCardRef = useCallback((id, element) => {
    cardRefs.current[id] = element;
  }, []);

  // Transform experienceData to timeline items format
  const timelineItems = safeExperienceData.map(exp => ({
    id: exp.id || '',
    company: exp.company || 'Unknown Company',
    date: exp.date || '',
    isActive: exp.id === activeId
  }));

  return (
    <PageTransition className="min-h-screen pt-20 md:pt-24">
      <div className="container-portfolio py-8 md:py-12">
        {/* Page Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Experience
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            A timeline of my professional journey, from internships to current role.
          </p>
        </header>

        {/* Split Layout: Timeline (left) + Experience Cards (right) */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Timeline - Sticky on desktop, stacked on mobile */}
          <aside className="lg:w-64 xl:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-28">
              <Timeline
                items={timelineItems}
                activeId={activeId}
                onItemClick={handleTimelineClick}
              />
            </div>
          </aside>

          {/* Experience Cards - Scrollable list */}
          <main className="flex-1 space-y-6">
            {safeExperienceData.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-white/10">
                <p className="text-gray-400">No experience data available.</p>
                <p className="text-gray-500 text-sm mt-2">Check back later for updates.</p>
              </div>
            ) : (
              safeExperienceData.map(experience => (
                <ExperienceCard
                  key={experience.id || Math.random()}
                  ref={(element) => setCardRef(experience.id, element)}
                  experience={experience}
                  isActive={experience.id === activeId}
                />
              ))
            )}
          </main>
        </div>
      </div>
    </PageTransition>
  );
}

export default Experience;
