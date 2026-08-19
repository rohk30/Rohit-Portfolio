import { SHOT_TARGETS } from '../config/shotNavigation.js';

/**
 * Filters shot targets based on visited sections.
 *
 * Requirements: 4.2, 4.3, 4.4
 *
 * Rules:
 * - When visitedSections is a proper subset of all section paths,
 *   return only unvisited shot targets (allSections - visitedSections).
 * - When visitedSections equals the full set of all section paths,
 *   return ALL shot targets (reset behavior).
 *
 * @param {Set<string>|string[]} visitedSections - Set or array of visited section paths
 * @param {Array} allTargets - All available shot targets (defaults to SHOT_TARGETS)
 * @returns {Array} Filtered shot targets to display
 */
export function getAvailableShotTargets(visitedSections, allTargets = SHOT_TARGETS) {
  const visited = visitedSections instanceof Set
    ? visitedSections
    : new Set(visitedSections);

  const allPaths = allTargets.map(t => t.path);
  const allVisited = allPaths.every(path => visited.has(path));

  // If all sections have been visited, show all targets
  if (allVisited) {
    return allTargets;
  }

  // Otherwise, show only unvisited sections
  return allTargets.filter(target => !visited.has(target.path));
}
