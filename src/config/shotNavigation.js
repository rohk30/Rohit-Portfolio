/**
 * Shot navigation targets for the cricket field canvas.
 *
 * Positions are PERCENTAGE coordinates (0–100) within the square field area.
 * The 800×800 SVG has center at (400,400) = (50%, 50%).
 * Boundary circle: r=360 → radius = 45% from center.
 * 30-yard circle: r=200 → radius = 25% from center.
 *
 * Boundary edge examples:
 *   Top:    (50, 5)    Bottom: (50, 95)
 *   Left:   (5, 50)    Right:  (95, 50)
 *
 * Batsman: (50%, 63.75%) → (400, 510) in 800×800 coords.
 */
export const SHOT_TARGETS = [
  {
    id: 'cover-drive',
    label: 'Cover Drive',
    subLabel: 'Experience',
    path: '/experience',
    // Off-side cover, on the boundary rope
    position: { x: 85, y: 20 },
    trajectory: 'straight',
    ariaLabel: 'Play a cover drive to navigate to Experience',
    result: { runs: 4, label: 'FOUR', type: 'four' },
  },
  {
    id: 'pull-shot',
    label: 'Pull Shot',
    subLabel: 'Projects',
    path: '/projects',
    // Leg side, deep mid-wicket, on/over boundary
    position: { x: 10, y: 42 },
    trajectory: 'over-boundary',
    ariaLabel: 'Play a pull shot to navigate to Projects',
    result: { runs: 6, label: 'SIX', type: 'six' },
  },
  {
    id: 'defence',
    label: 'Defence',
    subLabel: 'About',
    path: '/about',
    // Dead bat, stays on the pitch near the batsman
    position: { x: 50, y: 58 },
    trajectory: 'short',
    ariaLabel: 'Play a defensive block to navigate to About',
    result: { runs: 0, label: 'DOT BALL', type: 'dot' },
  },
  {
    id: 'flick',
    label: 'Flick',
    subLabel: 'Overview',
    path: '/overview',
    // Leg side, square leg boundary
    position: { x: 15, y: 20 },
    trajectory: 'straight',
    ariaLabel: 'Play a flick through mid-wicket to navigate to Overview',
    result: { runs: 4, label: 'FOUR', type: 'four' },
  },
  {
    id: 'caught-at-point',
    label: 'Caught at Point',
    subLabel: 'Contact',
    path: '/contact',
    // Off-side, point fielder inside 30-yard circle
    position: { x: 70, y: 55 },
    trajectory: 'catch-curve',
    ariaLabel: 'Edge caught at point to navigate to Contact',
    result: { runs: 0, label: 'CAUGHT AT POINT', type: 'wicket' },
  },
  {
    id: 'scoop',
    label: 'Scoop',
    subLabel: 'Research',
    path: '/research',
    // Behind the batsman, fine leg area, near 30-yard mark
    position: { x: 50, y: 82 },
    trajectory: 'scoop-curve',
    ariaLabel: 'Play a scoop shot to navigate to Research',
    result: { runs: 2, label: 'TWO RUNS', type: 'run' },
  },
];
