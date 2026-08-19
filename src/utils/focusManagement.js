/**
 * Focus management utility for cricket-themed navigation.
 *
 * After React Router navigates to a new page, moves focus to the
 * destination section's heading element so screen readers announce
 * the new context.
 *
 * Uses a short delay to account for AnimatePresence exit/enter
 * transitions before attempting to find and focus the heading.
 *
 * @validates Requirements 9.6
 */

/**
 * Moves focus to the first heading element on the page after navigation.
 * Searches for h1, h2, or elements with [data-section-heading] attribute.
 * Sets tabindex="-1" if not already focusable, then calls .focus().
 *
 * @param {number} [delay=150] - Delay in ms to wait for page render
 */
export function focusSectionHeading(delay = 150) {
  setTimeout(() => {
    requestAnimationFrame(() => {
      const heading = document.querySelector(
        '[data-section-heading], h1, h2'
      );
      if (heading) {
        // Make the heading programmatically focusable if it isn't already
        if (!heading.getAttribute('tabindex')) {
          heading.setAttribute('tabindex', '-1');
        }
        heading.focus({ preventScroll: false });
      }
    });
  }, delay);
}
