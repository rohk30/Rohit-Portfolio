# Implementation Plan: Cricket Theme Redesign

## Overview

This plan transforms the existing portfolio from a cool-toned dark glassmorphism aesthetic into an immersive cricket evening-match experience. Implementation follows a layered approach: theming first, then SVG illustration, animation layer, navigation layer, state management, and finally integration with existing pages. The existing data layer, routing, and tech stack remain unchanged.

## Tasks

- [x] 1. Set up cricket color palette and warm glassmorphism theming
  - [x] 1.1 Replace CSS custom properties in `src/styles/index.css` with Cricket_Color_Palette
    - Replace all `:root` color variables with the cricket palette: `--bg: #0d1f0d`, `--bg-deep: #0a2e2a`, `--accent-orange: #e8760a`, `--accent-red: #8b1a1a`, `--accent-gold: #c9a227`, `--text: #f5f0e8`, `--text-soft: #a8b5a0`
    - Add warm glassmorphism tokens: `--glass-border`, `--glass-bg`, `--glass-blur`, `--glass-card-bg`, `--glass-card-blur`, `--glass-hover-border`
    - Replace the `#root` background gradient with the cricket palette gradient using Deep Green, Dark Teal, and Cricket Red at reduced opacity
    - Update `.glass`, `.glass-hover`, `.glass-interactive` classes to use warm-toned borders (`rgba(200, 180, 140, 0.15)`) and backgrounds (`rgba(13, 31, 13, 0.72)`)
    - Replace all teal/lime accent references in hover states with Gold (`#c9a227`)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 1.2 Update `GlassCard` component to use warm glassmorphism classes
    - Replace cool-toned border/bg class references with warm glassmorphism CSS custom properties
    - Ensure hover state transitions border color to Gold at 0.45 opacity over 300ms
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 1.3 Update `Navbar.jsx` color references from teal/lime to cricket palette
    - Replace teal and lime accent colors with Gold highlights and warm borders
    - Retain all navigation labels (Home, Experience, Projects, Research, About, Contact) and routing logic
    - _Requirements: 4.1, 6.4_

  - [x] 1.4 Write property test for cricket color palette compliance
    - **Property 6: Cricket color palette compliance**
    - **Validates: Requirements 5.2, 5.4**

  - [x] 1.5 Write property test for WCAG contrast ratio compliance
    - **Property 7: WCAG contrast ratio compliance**
    - **Validates: Requirements 5.6, 9.5**

- [x] 2. Create cricket SVG components and static configuration files
  - [x] 2.1 Create `src/config/shotNavigation.js` with SHOT_TARGETS array
    - Define all 5 shot targets with id, label, subLabel, path, position, bezierControl, and ariaLabel
    - Include Cover Drive → /experience, Pull Shot → /projects, Straight Drive → /research, Flick → /about, Caught at Slip → /contact
    - _Requirements: 3.1, 3.2, 3.5, 9.1_

  - [x] 2.2 Create `src/config/animationPhases.js` with bowling phase and trajectory config
    - Define BOWLING_PHASES (runup 0–0.4, delivery_stride 0.4–0.7, ball_release 0.7–1.0)
    - Define BALL_TRAJECTORY_CONFIG (duration, easing, ball diameter, ball color)
    - Define MOBILE_CONFIG (breakpoint, maxScrollDistance, widgetSize, minTouchTarget)
    - _Requirements: 2.3, 8.2_

  - [x] 2.3 Create `src/components/cricket/CricketGroundSVG.jsx`
    - Render a top-down cricket field as inline SVG with outfield ellipse, boundary rope, 30-yard circle (dashed), pitch rectangle, crease lines
    - Accept props: width, height, className, showCreaseLines, show30YardCircle, compact
    - Include `role="img"` and `aria-label` on root SVG element
    - Scale proportionally from 320px to 2560px viewports
    - _Requirements: 1.1, 1.2, 1.4, 1.5_

  - [x] 2.4 Create `src/components/cricket/SilhouetteBowler.jsx`
    - Render a geometric left-arm bowler SVG silhouette using basic shapes (circles, rectangles, triangles)
    - Accept animated transform props for position/rotation during bowling phases
    - Include `aria-hidden="true"` as the figure is decorative
    - _Requirements: 2.1, 2.5, 9.3_

  - [x] 2.5 Create `src/components/cricket/SilhouetteBatsman.jsx`
    - Render a geometric right-handed batsman SVG silhouette using basic shapes
    - Include `aria-hidden="true"` as the figure is decorative
    - _Requirements: 2.1, 2.5, 9.3_

  - [x] 2.6 Write property test for aria-labels on shot targets
    - **Property 9: Aria-labels contain destination and shot name**
    - **Validates: Requirements 9.1**

- [x] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement CricketNavContext and state management
  - [x] 4.1 Create `src/context/CricketNavContext.jsx` with provider
    - Implement React Context providing: animationProgress, deliveryComplete, visitedSections, isNavigationLocked, markSectionVisited, lockNavigation, unlockNavigation
    - Read/write visitedSections from sessionStorage with try/catch fallback
    - Include 1200ms auto-release timeout on navigation lock for safety
    - _Requirements: 4.3, 4.4, 3.6_

  - [x] 4.2 Wrap App.jsx with `CricketNavProvider`
    - Import and wrap the BrowserRouter content with CricketNavProvider
    - Ensure no routing changes — AnimatePresence with mode="wait" and location.pathname key preserved
    - _Requirements: 10.3, 10.4_

  - [x] 4.3 Write property test for visited sections filtering
    - **Property 5: Visited sections filtering in PlayNextBallWidget**
    - **Validates: Requirements 4.2, 4.3, 4.4**

  - [x] 4.4 Write property test for navigation locking
    - **Property 3: Navigation locking prevents concurrent trajectories**
    - **Validates: Requirements 3.6**

- [x] 5. Implement scroll-linked bowling animation
  - [x] 5.1 Create `src/components/cricket/BowlingAnimation.jsx`
    - Use Framer Motion's `useScroll` and `useTransform` hooks to map scroll progress to three animation phases: bowler run-up (0–0.4), delivery stride (0.4–0.7), ball release (0.7–1.0)
    - Animate SilhouetteBowler position/rotation through phases based on scroll progress
    - Render ball as a red circular SVG element (12–24px diameter, color #8b1a1a)
    - Fire `onDeliveryComplete` callback when scroll progress reaches 1.0
    - Reverse animation when scrolling back up
    - _Requirements: 2.1, 2.2, 2.3, 2.6, 2.7, 8.1, 8.2, 8.3_

  - [x] 5.2 Write property test for scroll progress phase mapping
    - **Property 1: Scroll progress maps to correct animation phase**
    - **Validates: Requirements 2.3, 8.2**

  - [x] 5.3 Write property test for reduced motion behavior
    - **Property 8: Reduced motion disables scroll-triggered animations**
    - **Validates: Requirements 8.6**

- [x] 6. Implement shot navigation and ball trajectory
  - [x] 6.1 Create `src/components/cricket/ShotNavigation.jsx`
    - Render 5 clickable shot targets positioned at field locations relative to batsman origin
    - Accept `visible`, `shots`, `onShotSelect`, `compact` props
    - Implement keyboard Tab navigation and Enter/Space activation
    - Ensure minimum 44x44px touch targets on mobile
    - Display "Caught your attention?" sublabel for Contact shot
    - Include aria-labels with both destination and shot name
    - Show visible focus indicator with 3:1 contrast ratio
    - _Requirements: 3.1, 3.2, 3.5, 3.7, 7.1, 9.1, 9.2_

  - [x] 6.2 Create `src/components/cricket/BallTrajectory.jsx`
    - Animate ball along bezier curve from batsman to selected shot target
    - Use Framer Motion's animate function with cubic-bezier easing
    - Duration between 600–1000ms
    - Fire `onComplete` callback when trajectory animation finishes
    - Use SVG path animation with Framer Motion pathLength or custom motion values
    - _Requirements: 3.3, 3.4, 8.4, 8.5_

  - [x] 6.3 Write property test for keyboard activation parity
    - **Property 4: Keyboard activation produces identical behavior to pointer activation**
    - **Validates: Requirements 3.7**

  - [x] 6.4 Write property test for shot activation navigation and focus
    - **Property 2: Shot activation completes navigation and moves focus**
    - **Validates: Requirements 3.4, 9.6**

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Build CricketGroundHero and integrate into Home page
  - [x] 8.1 Create `src/components/cricket/CricketGroundHero.jsx`
    - Orchestrate full hero section: CricketGroundSVG, personal info overlay (name, photo, description, interests), BowlingAnimation, ShotNavigation, BallTrajectory
    - Use useScroll to track scroll progress within the hero viewport (scroll distance 2–4 viewport heights)
    - Position personal info within the central pitch region as HTML elements (not SVG text) for screen reader accessibility
    - On delivery complete, show ShotNavigation targets
    - On shot select, lock navigation, trigger BallTrajectory, then navigate via React Router
    - Implement prefers-reduced-motion: show ShotNavigation immediately without scroll
    - Wrap cricket components in CricketErrorBoundary for fault isolation
    - _Requirements: 1.1, 1.3, 1.5, 2.1, 2.4, 3.4, 8.6, 9.4_

  - [x] 8.2 Update `src/pages/Home.jsx` to use CricketGroundHero
    - Replace current hero section and hero-portrait-wrap with CricketGroundHero component
    - Retain below-fold sections: Currently, CompanyLogoStrip, ProjectShowcase, SkillMarquee, ExperiencePreview, BeyondCode, CTA
    - Keep all existing data imports from `src/utils/data.js`
    - _Requirements: 1.1, 10.1, 10.5_

  - [x] 8.3 Implement mobile-specific hero behavior for viewports below 768px
    - Show ShotNavigation targets on page load without requiring scroll completion
    - Simplify BowlingAnimation to single-step sequence requiring ≤50vh scroll
    - Ensure all touch targets meet 44x44px minimum
    - _Requirements: 7.1, 7.2, 7.4_

- [x] 9. Implement PlayNextBallWidget on section pages
  - [x] 9.1 Create `src/components/cricket/PlayNextBallWidget.jsx`
    - Render a "Play Next Ball" button fixed at the bottom of content area on section pages
    - On click, show mini cricket ground overlay with 2-second bowling animation followed by shot targets
    - Filter shot targets to show only unvisited sections (from CricketNavContext); show all if all visited
    - On mobile (<768px), render as fixed 64x64px overlay in bottom-right corner with 44x44px min touch target
    - Do not obscure Top_Navbar or ShotNavigation targets
    - Appear within 300ms of button click
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 7.3_

  - [x] 9.2 Add PlayNextBallWidget to all section pages (Experience, Projects, Research, About, Contact)
    - Import and render PlayNextBallWidget at the bottom of each section page component
    - Pass current path for visited section tracking
    - _Requirements: 4.2, 7.3_

- [x] 10. Update remaining section page styles and ensure data layer preservation
  - [x] 10.1 Update section page components to use warm glassmorphism styling
    - Ensure all ProjectCard, PublicationCard, ExperienceCard, and About panels use warm-toned borders and backgrounds
    - Update any remaining hardcoded color values to reference CSS custom properties
    - Maintain section headings with literal names (no cricket metaphors)
    - _Requirements: 6.1, 6.2, 6.4, 10.1, 10.5_

  - [x] 10.2 Verify route preservation and data import integrity
    - Confirm all 7 routes (/, /experience, /projects, /projects/:projectId, /research, /about, /contact) render correctly
    - Confirm AnimatePresence with mode="wait" and location.pathname key is preserved
    - Confirm all data.js named exports are imported without renaming or alteration
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 11. Accessibility, error boundaries, and fallback navigation
  - [x] 11.1 Implement CricketErrorBoundary component
    - Create error boundary that renders null fallback when cricket components throw
    - Ensure Navbar remains outside cricket error boundaries and always renders
    - On Home page, keep personal info visible in a non-SVG container outside the boundary
    - _Requirements: 9.4, 7.5_

  - [x] 11.2 Implement focus management on shot activation navigation
    - After navigation completes, move focus to the destination section's heading element
    - Ensure screen readers announce new context after navigation
    - _Requirements: 9.6_

  - [x] 11.3 Verify prefers-reduced-motion compliance across all animation components
    - When prefers-reduced-motion is enabled, disable scroll-triggered animations
    - Display ShotNavigation targets on page load without scroll interaction
    - Ensure BowlingAnimation does not play
    - _Requirements: 8.6_

  - [x] 11.4 Write unit tests for CricketGroundSVG structure
    - Verify required SVG elements: outfield, boundary, crease lines, 30-yard circle
    - Verify role="img" and aria-label presence
    - _Requirements: 1.2, 1.5_

  - [x] 11.5 Write integration tests for scroll → animation → navigation flow
    - Test full flow: scroll triggers delivery → shot click → trajectory → page navigation
    - Test PlayNextBallWidget lifecycle: button click → widget → shot targets → navigation
    - Test mobile viewport behavior: shot targets visible on load at <768px
    - Test error boundary isolation: cricket failure doesn't break Navbar
    - _Requirements: 2.1, 3.4, 4.2, 7.1, 9.4_

- [x] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document using fast-check
- Unit tests validate specific examples and edge cases
- The existing data layer (src/utils/data.js), routing configuration, and production dependencies remain unchanged
- All CSS color changes flow through CSS custom properties — component internals don't need per-component color updates beyond class references
- The CricketNavContext provider is the single source of truth for animation state, visited sections, and navigation locking

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1", "2.2"] },
    { "id": 1, "tasks": ["1.2", "1.3", "2.3", "2.4", "2.5"] },
    { "id": 2, "tasks": ["1.4", "1.5", "2.6", "4.1"] },
    { "id": 3, "tasks": ["4.2", "4.3", "4.4", "5.1"] },
    { "id": 4, "tasks": ["5.2", "5.3", "6.1", "6.2"] },
    { "id": 5, "tasks": ["6.3", "6.4", "8.1"] },
    { "id": 6, "tasks": ["8.2", "8.3", "9.1"] },
    { "id": 7, "tasks": ["9.2", "10.1", "11.1"] },
    { "id": 8, "tasks": ["10.2", "11.2", "11.3"] },
    { "id": 9, "tasks": ["11.4", "11.5"] }
  ]
}
```
