import { useState, useMemo } from 'react';
import PageTransition from '../components/layout/PageTransition';
import CategoryFilter from '../components/sections/CategoryFilter';
import PublicationCard from '../components/sections/PublicationCard';
import PlayNextBallWidget from '../components/cricket/PlayNextBallWidget';
import { researchData } from '../utils/data';
import {
  sortPublicationsByDate,
  filterByCategory,
  groupByCategory,
  getUniqueCategories,
} from '../utils/publications';

/**
 * Research Page
 * 
 * Displays research publications with category filtering.
 * Publications are grouped by category and sorted by date within each category.
 * Empty categories are hidden from the display.
 * 
 * **Validates: Requirements 5.1, 5.2, 5.9**
 * 
 * Features:
 * - Category filter to show publications by type
 * - Publications grouped by category (Conference, Journal, Preprint, Technical Report)
 * - Sorted by date (most recent first) within each category
 * - Empty category sections are not rendered
 * - Graceful degradation for missing or empty data
 * 
 * @example
 * <Research />
 */
function Research() {
  // State for active category filter (null means "All")
  const [activeCategory, setActiveCategory] = useState(null);

  // Graceful degradation: ensure data is an array
  const safeResearchData = Array.isArray(researchData) ? researchData : [];

  // Define display-friendly category names and order
  const categoryDisplayNames = {
    'conference': 'Conference Papers',
    'journal': 'Journal Articles',
    'preprint': 'Preprints',
    'technical-report': 'Technical Reports',
  };

  // Define the order in which categories should appear
  const categoryOrder = ['conference', 'journal', 'preprint', 'technical-report'];

  // Get all unique categories from the data
  const allCategories = useMemo(() => {
    const uniqueCategories = getUniqueCategories(safeResearchData);
    // Sort categories by the defined order
    return categoryOrder.filter(cat => uniqueCategories.includes(cat));
  }, [safeResearchData]);

  // Get category names for the filter component (display-friendly names)
  const filterCategories = useMemo(() => {
    return allCategories.map(cat => categoryDisplayNames[cat] || cat);
  }, [allCategories]);

  // Map display-friendly name back to category key
  const getCategoryKey = (displayName) => {
    if (displayName === null) return null;
    const entry = Object.entries(categoryDisplayNames).find(
      ([, name]) => name === displayName
    );
    return entry ? entry[0] : displayName;
  };

  // Handle category change from filter
  const handleCategoryChange = (displayCategory) => {
    const categoryKey = getCategoryKey(displayCategory);
    setActiveCategory(categoryKey);
  };

  // Get the display name for current active category
  const getActiveDisplayCategory = () => {
    if (activeCategory === null) return null;
    return categoryDisplayNames[activeCategory] || activeCategory;
  };

  // Process publications based on active filter
  const processedPublications = useMemo(() => {
    // Filter by selected category
    const filtered = filterByCategory(safeResearchData, activeCategory);
    
    // If showing all (no filter), group by category
    if (activeCategory === null) {
      const grouped = groupByCategory(filtered);
      
      // Sort publications within each category by date
      const sortedGroups = {};
      Object.keys(grouped).forEach(category => {
        sortedGroups[category] = sortPublicationsByDate(grouped[category]);
      });
      
      return sortedGroups;
    }
    
    // If filtered to single category, sort by date and return as single group
    return {
      [activeCategory]: sortPublicationsByDate(filtered),
    };
  }, [activeCategory, safeResearchData]);

  // Get categories to display (filtered to only non-empty ones)
  // Property 9: Empty categories are not rendered
  const categoriesToDisplay = useMemo(() => {
    return categoryOrder.filter(
      cat => processedPublications[cat] && processedPublications[cat].length > 0
    );
  }, [processedPublications]);

  // Calculate total publication count
  const totalPublications = useMemo(() => {
    return categoriesToDisplay.reduce(
      (total, cat) => total + (processedPublications[cat]?.length || 0),
      0
    );
  }, [categoriesToDisplay, processedPublications]);

  return (
    <PageTransition className="min-h-screen pt-20 md:pt-24">
      <div className="container-portfolio py-8 md:py-12">
        {/* Page Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
            Research
          </h1>
          <p className="text-[var(--text-soft)] text-lg max-w-2xl">
            Research publications and academic contributions in AI, machine learning,
            and data science. Click on any publication to read more.
          </p>
        </header>

        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter
            categories={filterCategories}
            activeCategory={getActiveDisplayCategory()}
            onCategoryChange={handleCategoryChange}
            className="mb-4"
          />
          <p className="text-sm text-[var(--text-soft)]">
            Showing {totalPublications} publication{totalPublications !== 1 ? 's' : ''}
            {activeCategory && ` in ${categoryDisplayNames[activeCategory]}`}
          </p>
        </div>

        {/* Publications by Category */}
        {categoriesToDisplay.length > 0 ? (
          <div className="space-y-12">
            {categoriesToDisplay.map(category => (
              <section key={category} aria-labelledby={`category-${category}`}>
                {/* Category Header - only show when displaying all categories */}
                {activeCategory === null && (
                  <h2 
                    id={`category-${category}`}
                    className="text-2xl font-semibold text-[var(--text)] mb-6 pb-2 border-b border-[var(--glass-border)]"
                  >
                    {categoryDisplayNames[category]}
                    <span className="ml-3 text-sm font-normal text-[var(--text-soft)]">
                      ({processedPublications[category].length})
                    </span>
                  </h2>
                )}

                {/* Publications Grid */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  role="list"
                  aria-label={`${categoryDisplayNames[category]} publications`}
                >
                  {processedPublications[category].map(publication => (
                    <div key={publication.id} role="listitem">
                      <PublicationCard publication={publication} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[var(--glass-card-bg)] rounded-2xl border border-[var(--glass-border)]">
            <p className="text-[var(--text-soft)]">
              No publications found
              {activeCategory && ` in ${categoryDisplayNames[activeCategory]}`}.
            </p>
            <p className="text-[var(--text-soft)] text-sm mt-2">Check back later for updates.</p>
          </div>
        )}
      </div>

      {/* Cricket-themed navigation widget */}
      <PlayNextBallWidget currentPath="/research" />
    </PageTransition>
  );
}

export default Research;
