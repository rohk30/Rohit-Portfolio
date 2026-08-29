# Requirements Document

## Introduction

A complete visual and interaction redesign of an existing React + Vite portfolio website, replacing the current dark glassmorphism theme with an immersive cricket-themed experience. The redesign introduces an SVG cricket ground as the hero section with scroll-triggered bowling animations and shot-based navigation, while maintaining professional content structure and full accessibility. The existing data layer, routing, and tech stack (React 19, Vite, Tailwind CSS 4, Framer Motion, React Router) remain unchanged.

## Glossary

- **Cricket_Ground_SVG**: A full-viewport, top-down aerial view SVG illustration of a cricket field including the oval boundary, 30-yard circle, pitch area, crease lines, and boundary rope
- **Hero_Section**: The landing viewport of the Home page containing the Cricket_Ground_SVG and user personal information
- **Bowling_Animation**: A scroll-triggered Framer Motion animation sequence depicting a left-arm bowler running in and delivering the ball to a right-handed batsman
- **Shot_Navigation**: Clickable navigation targets displayed around the cricket field after ball delivery, styled as cricket shot directions that navigate to portfolio sections
- **Ball_Trajectory**: A bezier-curve animated path the cricket ball follows from batsman to the selected shot target before page navigation occurs
- **Play_Next_Ball_Widget**: A mini cricket ground overlay with bowling animation and shot options that appears at the bottom of section pages as an alternative navigation method
- **Warm_Glassmorphism**: Updated glassmorphism card styling using cream/gold border tones (rgba(200, 180, 140, 0.15)) instead of the existing cool blue/teal borders
- **Cricket_Color_Palette**: The evening match color scheme consisting of Deep Green (#0d1f0d), Dark Teal (#0a2e2a), Warm Orange (#e8760a), Cricket Red (#8b1a1a), Gold (#c9a227), Cream (#f5f0e8), and Sage (#a8b5a0)
- **Silhouette_Figures**: Minimal, geometric silhouette-style SVG illustrations of the bowler and batsman, resembling board game pieces
- **Top_Navbar**: The persistent horizontal navigation bar with professional section labels visible on all pages
- **Section_Page**: Any portfolio page other than Home (Experience, Projects, Research, About, Contact)

## Requirements

### Requirement 1: SVG Cricket Ground Hero Section

**User Story:** As a visitor, I want to see a visually striking full-viewport cricket ground when I land on the portfolio, so that I am immediately engaged by the unique theme.

#### Acceptance Criteria

1. WHEN the Home page loads, THE Hero_Section SHALL render a full-viewport Cricket_Ground_SVG with a top-down aerial view occupying 100% viewport width and 100% viewport height, and the SVG SHALL scale proportionally on viewports from 320px to 2560px wide while maintaining the full-viewport height
2. THE Cricket_Ground_SVG SHALL display the following distinguishable SVG elements: white crease lines (popping crease and bowling crease), a green oval outfield, a boundary rope encircling the outfield edge, and a 30-yard circle rendered as a visible dashed or solid ring inside the boundary
3. THE Hero_Section SHALL display the user's name, photo, one-liner description, and main interests positioned within the central rectangular pitch region (the strip between the two sets of stumps) of the Cricket_Ground_SVG, and each text element SHALL maintain a minimum contrast ratio of 4.5:1 against the pitch background
4. THE Cricket_Ground_SVG SHALL be implemented as inline SVG elements for rendering performance and animation control
5. THE Cricket_Ground_SVG SHALL include a role="img" attribute and an accessible aria-label describing the illustration, and all overlaid personal information text SHALL be rendered as HTML elements (not SVG text) to ensure screen reader accessibility

### Requirement 2: Scroll-Triggered Bowling Animation

**User Story:** As a visitor, I want to see a bowling animation triggered by scrolling, so that I experience an interactive transition from the hero section to navigation options.

#### Acceptance Criteria

1. WHEN the visitor scrolls down from the initial Hero_Section viewport, THE Bowling_Animation SHALL animate a left-arm Silhouette_Figure bowler running in and delivering the ball to a right-handed Silhouette_Figure batsman, with the animation progress mapped to a scroll distance of 2 to 4 viewport heights (200vh–400vh) from the Hero_Section top
2. THE Bowling_Animation SHALL use Framer Motion's useScroll hook to track scroll progress within the Hero_Section viewport, where scroll progress is measured as a normalized value from 0 (top of Hero_Section) to 1 (bottom of Hero_Section)
3. THE Bowling_Animation SHALL use Framer Motion's useTransform hook to map scroll progress values to three sequential animation phases: bowler run-up (scroll progress 0 to 0.4), delivery stride (scroll progress 0.4 to 0.7), and ball release (scroll progress 0.7 to 1.0)
4. WHEN the Bowling_Animation reaches the ball delivery point (100% scroll progress), THE Hero_Section SHALL display Shot_Navigation targets as clickable elements positioned at field positions around a cricket ground layout
5. THE Silhouette_Figures SHALL use geometric SVG shapes styled as board-game-piece silhouettes, composed of basic forms (circles, rectangles, triangles) without photographic detail
6. THE Bowling_Animation SHALL render the ball as a red circular SVG element with a diameter between 12px and 24px
7. IF the visitor scrolls back up before the animation reaches the ball delivery point, THEN THE Bowling_Animation SHALL reverse its progress to match the current scroll position, and the Shot_Navigation targets SHALL remain hidden until the delivery point is reached again

### Requirement 3: Shot-Based Navigation System

**User Story:** As a visitor, I want to click on cricket shot directions to navigate to portfolio sections, so that I can explore the portfolio through the cricket theme.

#### Acceptance Criteria

1. WHEN Shot_Navigation targets are displayed, THE Hero_Section SHALL show five clickable shot options: Cover drive mapped to Experience (/experience), Pull shot mapped to Projects (/projects), Straight drive mapped to Research (/research), Flick mapped to About (/about), and Caught at slip mapped to Contact (/contact)
2. THE Shot_Navigation targets SHALL be positioned at field locations corresponding to each shot direction (off-side for Cover drive, square leg for Pull, down the ground for Straight drive, fine leg for Flick, slip region for Caught at slip) relative to a batsman origin point within the Hero_Section
3. WHEN a visitor clicks a Shot_Navigation target, THE Ball_Trajectory SHALL animate the ball along a bezier curve path from the batsman toward the selected field position over a duration between 600 and 1000 milliseconds
4. WHEN the Ball_Trajectory animation completes, THE system SHALL navigate to the corresponding Section_Page using React Router
5. THE Shot_Navigation target for Contact SHALL display the label "Caught your attention?" alongside the shot name
6. IF a visitor clicks a Shot_Navigation target while a Ball_Trajectory animation is already in progress, THEN THE system SHALL ignore the new click until the current animation completes and navigation occurs
7. THE Shot_Navigation targets SHALL be focusable via keyboard Tab navigation and activatable via Enter or Space key press, triggering the same Ball_Trajectory animation and navigation as a mouse click

### Requirement 4: Dual-Mode Navigation

**User Story:** As a visitor, I want both a professional navbar and cricket-themed navigation available at all times, so that I can navigate the portfolio using my preferred method.

#### Acceptance Criteria

1. THE Top_Navbar SHALL remain visible on all pages with professional labels: Home, Experience, Projects, Research, About, Contact
2. WHEN a visitor is on any page other than Home, THE page SHALL display a "Play Next Ball" button fixed at the bottom of the content area, below all section content
3. WHEN a visitor clicks the "Play Next Ball" button, THE Play_Next_Ball_Widget SHALL appear within 300 milliseconds showing a mini cricket ground with a bowling animation lasting no more than 2 seconds, followed by Shot_Navigation targets pointing to each section the visitor has not yet navigated to during the current browser session
4. IF the visitor has already navigated to all sections during the current browser session, THEN THE Play_Next_Ball_Widget SHALL display Shot_Navigation targets pointing to all sections
5. THE Top_Navbar and Play_Next_Ball_Widget SHALL both trigger React Router navigation without full page reloads

### Requirement 5: Cricket Color Palette Application

**User Story:** As a visitor, I want the entire portfolio to use a consistent cricket evening match color palette, so that the theme feels cohesive across all pages.

#### Acceptance Criteria

1. THE system SHALL define the Cricket_Color_Palette as CSS custom properties on the :root element with the following mappings: --bg (Deep Green #0d1f0d), --bg-deep (Dark Teal #0a2e2a), --accent-orange (Warm Orange #e8760a), --accent-red (Cricket Red #8b1a1a), --accent-gold (Gold #c9a227), --text (Cream #f5f0e8), --text-soft (Sage #a8b5a0)
2. THE system SHALL reference only the Cricket_Color_Palette CSS custom properties for all color values across all pages (Home, Experience, Projects, Research, About, and Contact), with no inline or hardcoded color values outside the defined palette
3. THE system SHALL apply Warm_Glassmorphism to all glass-effect containers using rgba(200, 180, 140, 0.15) border color, rgba(13, 31, 13, 0.72) background, and backdrop-blur of 12px, replacing all existing cool-toned border values
4. THE system SHALL use Gold (#c9a227) for all interactive highlights, hover states, and accent emphasis elements, replacing the existing teal and lime accent colors
5. THE system SHALL apply a background gradient on the #root element using only colors from the Cricket_Color_Palette (Deep Green, Dark Teal, and Cricket Red at reduced opacity), replacing the existing blue, teal, maroon, and lime radial gradients
6. THE system SHALL maintain a minimum WCAG 2.1 AA contrast ratio of 4.5:1 between the primary text color (Cream #f5f0e8) and the primary background (Deep Green #0d1f0d), and between the secondary text color (Sage #a8b5a0) and the primary background

### Requirement 6: Warm Glassmorphism Cards and Panels

**User Story:** As a visitor, I want cards and panels to use warm-toned glassmorphism styling, so that the cricket evening atmosphere is maintained in content areas.

#### Acceptance Criteria

1. THE system SHALL style all card and panel components (GlassCard, ProjectCard, PublicationCard, ExperienceCard, and About panels) with Warm_Glassmorphism using cream/gold-tinted borders set to rgba(200, 180, 140, 0.15)
2. THE system SHALL apply a backdrop-filter blur of 18px to card and panel backgrounds with a warm-toned semi-transparent fill of rgba(30, 25, 18, 0.40)
3. WHEN a visitor hovers over an interactive card, THE card SHALL transition its border color to Gold (#c9a227) at 0.45 opacity over a duration of 300ms
4. THE system SHALL maintain section headings (Experience, Projects, Research, About, Contact) using their literal names without cricket metaphors in header text

### Requirement 7: Mobile Responsive Cricket Interaction

**User Story:** As a mobile visitor, I want the cricket navigation to work through tap interactions, so that I can use the themed navigation on smaller screens.

#### Acceptance Criteria

1. WHILE the viewport width is below 768px, THE Hero_Section SHALL display the Shot_Navigation targets as tappable buttons with a minimum touch target size of 44x44px, visible and interactive on page load without requiring scroll-triggered animation completion
2. WHILE the viewport width is below 768px, THE Bowling_Animation SHALL play a single-step animation sequence requiring no more than 50vh of scroll distance to complete, omitting intermediate keyframes used on desktop
3. WHILE the viewport width is below 768px, THE Play_Next_Ball_Widget SHALL render as a fixed-position overlay no larger than 64x64px, placed in the bottom-right corner with a minimum tap target of 44x44px, and SHALL NOT obscure the Top_Navbar or Shot_Navigation targets
4. THE Top_Navbar SHALL remain visible, respond to tap and keyboard interactions, and provide navigation to all portfolio pages on all viewport sizes from 320px to 2560px, serving as the primary navigation fallback
5. IF the Shot_Navigation or Play_Next_Ball_Widget fails to render, THEN THE Top_Navbar SHALL remain the sole navigation mechanism without displaying broken or empty cricket UI elements

### Requirement 8: Animation Technical Implementation

**User Story:** As a developer, I want the animations to use the existing Framer Motion library with scroll-linked transforms, so that the implementation stays within the current tech stack.

#### Acceptance Criteria

1. THE Bowling_Animation SHALL use Framer Motion's useScroll hook to track scroll progress within the Hero_Section viewport, where scroll progress is measured as a normalized value from 0 (top of Hero_Section) to 1 (bottom of Hero_Section)
2. THE Bowling_Animation SHALL use Framer Motion's useTransform hook to map scroll progress values to three sequential animation phases: bowler run-up (scroll progress 0 to 0.4), delivery stride (scroll progress 0.4 to 0.7), and ball release (scroll progress 0.7 to 1.0)
3. WHEN the user scrolls back up within the Hero_Section, THE Bowling_Animation SHALL reverse smoothly through the same animation phases in reverse order, returning to the idle state at scroll progress 0
4. THE Ball_Trajectory SHALL use Framer Motion's animate function with cubic bezier easing for each shot direction path, completing the trajectory animation within 600 to 1000 milliseconds before triggering page navigation
5. THE system SHALL implement SVG path animations for Ball_Trajectory using Framer Motion's pathLength or custom motion values
6. WHILE the user has enabled prefers-reduced-motion, THE system SHALL disable scroll-triggered animations and display Shot_Navigation targets on page load without requiring any scroll interaction
7. THE Bowling_Animation and Ball_Trajectory SHALL maintain a frame rate of at least 30 frames per second during animation playback on devices that meet the minimum viewport requirements

### Requirement 9: Accessibility and Fallback Navigation

**User Story:** As a visitor using assistive technology, I want the cricket-themed navigation to be fully accessible, so that I can navigate the portfolio regardless of how I interact with it.

#### Acceptance Criteria

1. THE Shot_Navigation targets SHALL include aria-labels that contain both the destination section name and the associated cricket shot name (e.g., "Navigate to Experience section via Cover drive")
2. THE Shot_Navigation targets SHALL be keyboard-focusable in a left-to-right, top-to-bottom DOM order and activatable using Enter or Space keys, and SHALL display a visible focus indicator with a minimum contrast ratio of 3:1 against adjacent colors
3. THE Bowling_Animation SVG elements SHALL include aria-hidden="true" attributes to hide them from assistive technology since they are purely decorative
4. IF the Cricket_Ground_SVG fails to render or JavaScript is disabled, THEN THE Top_Navbar SHALL remain present in the rendered page as the functional navigation method, providing clickable links to every section with no loss of access
5. THE system SHALL maintain a minimum color contrast ratio of 4.5:1 between text at or below 18px (or 14px bold) and its background color, and a minimum of 3:1 for text larger than 18px (or 14px bold) within the Cricket_Color_Palette
6. WHEN a user activates a Shot_Navigation target via keyboard or pointer, THE system SHALL navigate to the corresponding section and move focus to that section's heading so that screen readers announce the new context

### Requirement 10: Data Layer and Routing Preservation

**User Story:** As a developer, I want the existing data layer and routing configuration to remain unchanged, so that the redesign is purely visual and interactive without breaking existing content.

#### Acceptance Criteria

1. THE system SHALL import and use all existing data.js named exports (navigationData, experienceData, companyData, experienceBrandData, projectData, researchData, personalData, contactData) without renaming, removing, or altering their object structure or property names
2. THE system SHALL maintain all existing React Router routes: /, /experience, /projects, /projects/:projectId, /research, /about, /contact, each rendering its corresponding page component
3. THE system SHALL preserve AnimatePresence wrapping around Routes with mode="wait" and location.pathname as the route key to maintain page transition behavior between routes
4. THE system SHALL retain all current production dependencies in package.json at their existing major versions: React 19, Vite, Tailwind CSS 4, Framer Motion, React Router, react-icons, lucide-react
5. IF a component is refactored or replaced during the redesign, THEN THE system SHALL continue importing data from src/utils/data.js rather than duplicating or inlining content data
