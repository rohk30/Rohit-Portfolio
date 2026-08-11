/**
 * Publication Utility Functions
 * Provides sorting, filtering, and grouping utilities for research publications.
 * Requirements: 5.1 (sorting), 5.6 (filtering)
 */

/**
 * Sorts publications by date in descending order (most recent first).
 * Property 6: Publications Sorted by Date Descending
 * 
 * @param {Array} publications - Array of publication objects with date field
 * @returns {Array} New sorted array (does not mutate original)
 */
export function sortPublicationsByDate(publications) {
  if (!Array.isArray(publications)) {
    return [];
  }
  
  return [...publications].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // Descending order (most recent first)
  });
}

/**
 * Filters publications by category.
 * Property 9: Publication Category Filtering
 * 
 * @param {Array} publications - Array of publication objects with category field
 * @param {string|null} category - Category to filter by, or null for all publications
 * @returns {Array} Filtered array of publications
 */
export function filterByCategory(publications, category) {
  if (!Array.isArray(publications)) {
    return [];
  }
  
  // If category is null or undefined, return all publications
  if (category === null || category === undefined) {
    return publications;
  }
  
  return publications.filter(pub => pub.category === category);
}

/**
 * Groups publications by their category.
 * Useful for rendering publications in category sections on the Research page.
 * 
 * @param {Array} publications - Array of publication objects with category field
 * @returns {Object} Object with category keys and arrays of publications as values
 */
export function groupByCategory(publications) {
  if (!Array.isArray(publications)) {
    return {};
  }
  
  return publications.reduce((acc, pub) => {
    const category = pub.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(pub);
    return acc;
  }, {});
}

/**
 * Helper function to get all unique categories from publications.
 * 
 * @param {Array} publications - Array of publication objects with category field
 * @returns {Array} Array of unique category strings
 */
export function getUniqueCategories(publications) {
  if (!Array.isArray(publications)) {
    return [];
  }
  
  return [...new Set(publications.map(pub => pub.category))];
}

/**
 * Combined utility: filters, sorts, and optionally groups publications.
 * Convenience function for common Research page operations.
 * 
 * @param {Array} publications - Array of publication objects
 * @param {Object} options - Options object
 * @param {string|null} options.category - Category to filter by (null for all)
 * @param {boolean} options.grouped - Whether to return grouped by category
 * @returns {Array|Object} Sorted array or grouped object depending on options
 */
export function processPublications(publications, options = {}) {
  const { category = null, grouped = false } = options;
  
  // First filter by category
  let result = filterByCategory(publications, category);
  
  // Then sort by date
  result = sortPublicationsByDate(result);
  
  // Optionally group by category
  if (grouped) {
    return groupByCategory(result);
  }
  
  return result;
}
