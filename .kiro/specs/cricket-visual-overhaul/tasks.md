# Implementation Plan: Cricket Visual Overhaul

## Overview

A comprehensive visual and interaction overhaul of the existing cricket-themed portfolio. The implementation follows a dependency-driven order: theming/colors first, then SVG figures, then animation mode updates, then component refactors, then page restructuring, and finally integration wiring and tests.

## Tasks

- [x] 1. Update color palette and glassmorphism tokens
  - [x] 1.1 Replace CSS custom properties in `src/styles/index.css` with Cricket Color Palette V2
    - Add `--pitch-green: #1a5c2e` and `--floodlight-amber: #e8a020` as named base properties
    - Update `--bg` to reference `--pitch-green`, `--bg-deep` to `#12461f`
    - Add `--sky-purple: #1a1040` and `--sky-pink: #5c2040`
    - Update `--accent-orange` to alias `--floodlight-amber`
    - Define `--sunset-gradient` linear-gradient (to top, 4+ color stops)
    - Replace `#root` background with `var(--sunset-gradient)`
    - Update `::selection` to use `rgba(232, 160, 32, 0.30)`
    - Update `--glass-border` to `rgba(232, 160, 32, 0.15)` (floodlight-amber derived)
    - Update `--glass-bg` to `rgba(26, 92, 46, 0.72)` (pitch-green derived)
    - Update `--glass-card-bg` to `rgba(26, 92, 46, 0.40)` (pitch-green derived)
    - Update `--glass-hover-border` to `rgba(232, 160, 32, 0.45)` (floodlight-amber derived)
    - _Requirements: 1.1, 1.2, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 6.1, 6.2, 6.3, 6.5, 6.7_

  - [x] 1.2 Write property test for color derivation relationships
    - **Property 1: Color Derivation Relationships**
    - **Validates: Requirements 1.2, 1.4**

  - [x] 1.3 Write property test for pitch green text contrast
    - **Property 2: Pitch Green Text Contrast**
    - **Validates: Requirements 1.6**

  - [x] 1.4 Write property test for sunset gradient text contrast
    - **Property 3: Sunset Gradient Text Contrast**
    - **Validates: Requirements 2.8**

  - [x] 1.5 Write property test for glass card composited contrast
    - **Property 8: Glass Card Composited Contrast**
    - **Validates: Requirements 6.6**

- [x] 2. Rewrite SVG figure components with bezier paths
  - [x] 2.1 Rewrite `src/components/cricket/SilhouetteBowler.jsx` with cubic bezier paths
    - Remove all `<circle>`, `<rect>`, `<polygon>` elements
    - Replace with 5-8 `<path>` elements using cubic bezier (C/c) commands
    - Depict fast bowling delivery action: bowling arm extended, front leg braced, back leg trailing, side-on shoulders
    - Include cricket-specific detail: trouser leg shapes, hand at bowling arm terminus, front-arm counterbalance
    - Maintain existing interface: `motion.g` root with x, y, rotate, scale, fill, className props
    - Single solid fill, no gradients; bounding box ≤40×60 units at scale=1 within 200×120 viewBox
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [x] 2.2 Rewrite `src/components/cricket/SilhouetteBatsman.jsx` with cubic bezier paths
    - Remove all `<circle>`, `<rect>` elements
    - Replace with 5+ `<path>` elements using cubic bezier (C/c) commands
    - Depict batting stance: bat at 35°-55° backlift, knees bent (front knee 120°-160°), head over front knee
    - Include cricket equipment outlines: bat blade (10-12% figure height), batting pads, helmet with grille/peak
    - Maintain existing interface: `<g>` root with aria-hidden="true", className, style, spread props
    - Single solid fill, no gradients
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [x] 2.3 Write property test for SVG figure structural integrity
    - **Property 4: SVG Figure Structural Integrity**
    - **Validates: Requirements 3.3, 4.3**

  - [x] 2.4 Write property test for SVG figure interface preservation
    - **Property 5: SVG Figure Interface Preservation**
    - **Validates: Requirements 3.5, 4.5**

- [x] 3. Update CricketGroundSVG colors
  - [x] 3.1 Modify `src/components/cricket/CricketGroundSVG.jsx` fill colors
    - Change outfield fill from `#1a3d1a` to `#2d8a4e` (vibrant grass green, sat >50%, lightness 30-50%)
    - Change pitch strip fill from `#3d6b3d` to `#7ab87a` (lighter, slightly yellowed, +10% lightness over outfield)
    - _Requirements: 1.3, 1.4_

- [x] 4. Checkpoint - Verify theming and SVG changes
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Update BowlingAnimation to support timed mode
  - [x] 5.1 Add `mode` and `timedDuration` props to `src/components/cricket/BowlingAnimation.jsx`
    - Add `mode` prop accepting `'scroll'` | `'timed'` (default: `'scroll'`)
    - Add `timedDuration` prop (default: 2000ms)
    - When `mode='timed'`: create internal MotionValue, animate 0→1 over `timedDuration`ms
    - Use same useTransform mappings for bowler position in timed mode
    - Call `onDeliveryComplete` when timed progress reaches 1.0
    - Preserve existing scroll-linked behavior when `mode='scroll'`
    - _Requirements: 8.7, 8.8, 7.1_

  - [x] 5.2 Write property test for bowler animation phase mapping
    - **Property 9: Bowler Animation Phase Mapping**
    - **Validates: Requirements 7.1**

- [x] 6. Refactor CricketGroundHero for scroll-locked home page
  - [x] 6.1 Modify `src/components/cricket/CricketGroundHero.jsx` to remove scroll-linking
    - Remove `useScroll` / scrollYProgress tracking
    - Remove 300vh/150vh height — set to exactly `100vh`
    - Add `animationState` state: `'idle'` | `'playing'` | `'complete'`
    - Add a "Play" button that triggers BowlingAnimation in `mode='timed'`
    - After timed animation completes, set state to `'complete'` and show ShotNavigation (including 6th target)
    - When `prefers-reduced-motion` is enabled: show all targets immediately, no play button needed
    - Remove personal info overlay that assumed scroll context
    - Set `overflow: hidden; height: 100vh` on the section container
    - _Requirements: 8.1, 8.7, 8.8, 8.10_

- [x] 7. Add 6th shot target and restructure Home page
  - [x] 7.1 Add Overview shot target to `src/config/shotNavigation.js`
    - Add 6th target: id `'defensive-block'`, label `'Defence'`, subLabel `'The full picture'`, path `/overview`
    - Position at `{ x: 50, y: 78 }`, bezierControl `{ cx1: 50, cy1: 60, cx2: 50, cy2: 72 }`
    - ariaLabel: `'Navigate to Overview section via Defensive block'`
    - _Requirements: 8.3, 8.4, 8.6_

  - [x] 7.2 Modify `src/pages/Home.jsx` to remove below-fold sections
    - Remove Currently, CompanyLogoStrip, ProjectShowcase, SkillMarquee, ExperiencePreview, BeyondCode, CTA sections
    - Remove `<div className="home-container">` wrapper
    - Add `overflow: hidden; height: 100vh` to the page container
    - Only render `<CricketGroundHero />`
    - _Requirements: 8.1, 8.2_

  - [x] 7.3 Create `src/pages/Overview.jsx` with relocated below-fold content
    - Move all removed Home sections here: Currently, CompanyLogoStrip, ProjectShowcase, SkillMarquee, ExperiencePreview, BeyondCode, CTA
    - Wrap in `PageTransition` for AnimatePresence compatibility
    - Use same data imports (experienceData, personalData, contactData, skillIcons)
    - Include `PlayNextBallWidget` for continued navigation
    - _Requirements: 8.2, 8.5_

  - [x] 7.4 Add `/overview` route to `src/App.jsx`
    - Import Overview page component
    - Add `<Route path="/overview" element={<Overview />} />` inside AnimatedRoutes
    - Navbar does NOT get an "Overview" entry
    - _Requirements: 8.5, 8.9, 7.8_

- [x] 8. Checkpoint - Verify page restructure and routing
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Upgrade PlayNextBallWidget to full-screen takeover
  - [x] 9.1 Modify `src/components/cricket/PlayNextBallWidget.jsx` for full-screen overlay
    - Change overlay from 280-320px fixed-position box to `100vw × 100vh` fixed overlay
    - Set `aria-modal="true"` and `role="dialog"` with proper `aria-label`
    - Apply body scroll lock (`document.body.style.overflow = 'hidden'`) with cleanup in useEffect
    - Add semi-transparent backdrop (opacity 0.85-0.95)
    - Display CricketGroundSVG at full viewport scale with both bowler and batsman figures
    - Close button: top-right, minimum 44×44px, 3:1 contrast
    - Entry animation: fade-in 300-500ms → bowler run-up 1.5-2.5s → targets appear
    - Mobile: scale proportionally, maintain 44px touch targets
    - `prefers-reduced-motion`: skip bowling/batting, show targets after fade-in
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.10_

  - [x] 9.2 Implement focus trap in PlayNextBallWidget full-screen overlay
    - On open: focus close button
    - Tab order: close → shot targets (in DOM order), cycling
    - On dismiss: restore focus to "Play Next Ball" button
    - _Requirements: 5.9, 7.4, 7.6_

  - [x] 9.3 Write property test for shot target selection triggers navigation
    - **Property 6: Shot Target Selection Triggers Navigation**
    - **Validates: Requirements 5.6, 8.6**

  - [x] 9.4 Write property test for focus trap containment
    - **Property 7: Focus Trap Containment**
    - **Validates: Requirements 5.9, 7.4**

- [x] 10. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The existing CricketNavContext, BallTrajectory, ShotNavigation, and AnimatePresence infrastructure remain unchanged
- All glassmorphism tokens include `var()` fallback values for resilience
- The Overview page is only accessible via the cricket field shot target, not the navbar

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1", "2.2"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4", "1.5", "2.3", "2.4", "3.1"] },
    { "id": 2, "tasks": ["5.1"] },
    { "id": 3, "tasks": ["5.2", "6.1", "7.1"] },
    { "id": 4, "tasks": ["7.2", "7.3"] },
    { "id": 5, "tasks": ["7.4"] },
    { "id": 6, "tasks": ["9.1"] },
    { "id": 7, "tasks": ["9.2", "9.3", "9.4"] }
  ]
}
```
