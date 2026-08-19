# Requirements Document

## Introduction

A visual and interaction overhaul of the existing cricket-themed portfolio website, addressing three specific user complaints about the current `cricket-theme-redesign` implementation:

1. **Color Palette**: The current dark olive/teal palette (#0d1f0d, #0a2e2a) feels too dark and muted. The user wants vibrant cricket pitch green (well-maintained grass field green) combined with a sunset/evening stadium atmosphere — warm golden hour sky, amber/orange floodlight tones, dusky purple/pink sky gradients. The target atmosphere is a T20 evening match under floodlights.

2. **Animation Quality**: The current bowler/batsman silhouettes use simple geometric shapes (circles, rectangles, triangles) that look like board game pieces. The user wants professional, anatomically proportioned cricket figure illustrations resembling broadcast graphics or editorial sports illustrations.

3. **Full-Screen Play Next Ball**: The current PlayNextBallWidget shows a small 280-320px overlay in the corner. The user wants a full-screen cinematic takeover when "Play Next Ball" is clicked — the entire viewport shows the cricket ground with bowler running in, batsman playing a shot, and then navigation targets appear.

4. **Scroll-Locked Home Page**: The user does not want scrollable below-fold content on the Home page. The Home page should be a single full-viewport cricket ground. The current below-fold sections (Currently, CompanyLogoStrip, ProjectShowcase, SkillMarquee, ExperiencePreview, BeyondCode, CTA) should be accessible via a new shot target on the cricket field — not via scrolling and not via a new navbar heading.

This is a refinement of the existing cricket theme (components already exist at `src/components/cricket/`), NOT a new feature from scratch. The existing component interfaces, routing, data layer, and state management (CricketNavContext) remain unchanged.

## Glossary

- **Pitch_Green**: The vibrant green color of a well-maintained cricket grass field, significantly brighter and more saturated than the current dark olive (#0d1f0d). Target hue range: 120-140° HSL with saturation above 40%
- **Sunset_Sky_Gradient**: A multi-stop background gradient that evokes an evening cricket stadium atmosphere — warm amber at the horizon transitioning through orange, dusky pink, and into deep purple/navy at the top
- **Floodlight_Amber**: A warm golden-amber accent color representing stadium floodlights during evening matches, replacing the current Gold (#c9a227) with a more orange-warm tone
- **Professional_Figure**: An SVG cricket player illustration with proper human proportions, anatomically correct limb positioning, realistic joint articulation, and sport-specific posture detail (bowling action, batting stance) — as opposed to the current geometric board-game-piece style
- **Full_Screen_Takeover**: A viewport-filling (100vw × 100vh) animated overlay that replaces the current 280-320px corner widget, showing the complete cricket ground scene with bowler and batsman at full scale
- **Cinematic_Transition**: A smooth entry/exit animation sequence for the Full_Screen_Takeover that includes a fade or zoom transition, the bowling run-up, ball delivery, batsman shot, and appearance of navigation targets
- **Cricket_Color_Palette_V2**: The revised evening stadium color scheme replacing the current dark olive/teal palette with vibrant pitch greens and sunset sky tones
- **Broadcast_Quality**: A level of SVG illustration detail resembling professional cricket TV broadcast graphics — smooth curves, proper body proportions, realistic clothing silhouettes (pads, gloves, helmet), and sport-specific postures
- **PlayNextBallWidget**: The existing component at `src/components/cricket/PlayNextBallWidget.jsx` that provides inter-section navigation via a cricket metaphor
- **SilhouetteBowler**: The existing SVG component at `src/components/cricket/SilhouetteBowler.jsx` rendering the bowler figure
- **SilhouetteBatsman**: The existing SVG component at `src/components/cricket/SilhouetteBatsman.jsx` rendering the batsman figure
- **CricketGroundHero**: The existing hero section orchestrator at `src/components/cricket/CricketGroundHero.jsx`
- **BowlingAnimation**: The existing scroll-linked animation at `src/components/cricket/BowlingAnimation.jsx`
- **Overview_Shot_Target**: A sixth cricket shot target on the field that navigates to the below-fold home page content (rendered on a new route), distinct from the 5 existing section shot targets
- **Overview_Page**: A new route/page containing the below-fold content currently on the Home page (Currently, CompanyLogoStrip, ProjectShowcase, SkillMarquee, ExperiencePreview, BeyondCode, CTA) — accessible only via the Overview_Shot_Target on the cricket field, not via the Top_Navbar

## Requirements

### Requirement 1: Vibrant Cricket Pitch Green Color Scheme

**User Story:** As a visitor, I want the cricket ground and background to use a vibrant, fresh grass green instead of the current dark olive, so that the portfolio evokes the feel of a real, well-maintained cricket pitch under lights.

#### Acceptance Criteria

1. THE system SHALL replace the CSS custom property `--bg` value from the current dark olive (#0d1f0d) with a vibrant cricket pitch green color that has an HSL hue between 120° and 145°, saturation of at least 40%, and lightness between 15% and 30%
2. THE system SHALL replace the CSS custom property `--bg-deep` value from the current dark teal (#0a2e2a) with a deeper shade of the pitch green that maintains the same hue family (within 10° of `--bg` hue) and has lightness 5-10% lower than `--bg`
3. THE CricketGroundSVG outfield fill SHALL use a vibrant grass green color with HSL saturation above 50% and lightness between 30% and 50%, visually distinct from the page background and evoking a well-maintained cricket grass field
4. THE CricketGroundSVG pitch strip fill SHALL use a lighter, slightly yellowed green (suggesting a dry pitch center wicket area) that contrasts with the outfield green by at least 10% lightness difference
5. THE system SHALL update the `--glass-bg` token to use an rgba value derived from the new pitch green base color (not the old dark olive), maintaining approximately 72% opacity for the glassmorphism blur effect
6. THE system SHALL maintain a minimum WCAG 2.1 AA contrast ratio of 4.5:1 between the primary text color (Cream #f5f0e8) and the new pitch green background, and between the secondary text (Sage #a8b5a0) and the new background

### Requirement 2: Sunset Stadium Sky Atmosphere

**User Story:** As a visitor, I want the page background to evoke a sunset/evening cricket stadium atmosphere with warm golden hour sky tones, so that the portfolio feels like watching a T20 match at dusk.

#### Acceptance Criteria

1. THE system SHALL apply a Sunset_Sky_Gradient as a vertical linear gradient (bottom-to-top direction) to the `#root` element background that transitions from warm amber/golden tones in the lower 0%–30% of the viewport, through dusky orange and pink in the middle 30%–65%, to deep purple/navy in the upper 65%–100% of the viewport
2. THE Sunset_Sky_Gradient SHALL contain at minimum four color stops: a golden-amber tone (hue 30°–50°) positioned at or near 0%, a warm orange (hue 15°–35°) positioned between 25%–35%, a dusky pink/magenta (hue 320°–350°) positioned between 55%–70%, and a deep navy/purple (hue 240°–270°) positioned at or near 100%
3. THE system SHALL replace the `--accent-orange` CSS custom property with a Floodlight_Amber color (hue between 35° and 50°, saturation above 80%, lightness between 45% and 65%) that evokes stadium floodlight warmth
4. THE system SHALL add a CSS custom property `--sky-purple` for the upper sky tone (deep purple/navy, hue 240°–270°, lightness 10%–20%) to be used in ambient background elements
5. THE system SHALL add a CSS custom property `--sky-pink` for the mid-sky transition tone (dusky pink/magenta, hue 320°–350°, lightness 20%–35%) available for subtle accent use
6. THE `#root::before` grid overlay SHALL use warm amber tones (derived from Floodlight_Amber at opacity between 0.02 and 0.06) instead of the current cream-tinted lines, evoking the glow of stadium lights
7. THE `#root::after` ambient glow element SHALL use a radial gradient combining Floodlight_Amber and the `--sky-pink` tone instead of the current gold/teal glow, maintaining the existing blur and sizing properties defined in the base stylesheet
8. THE Sunset_Sky_Gradient SHALL NOT reduce the readability of text content rendered over the background — all normal-size text (below 18pt or below 14pt bold) on gradient combinations SHALL maintain a minimum 4.5:1 contrast ratio, and all large text (18pt and above, or 14pt bold and above) SHALL maintain a minimum 3:1 contrast ratio per WCAG 2.1 AA

### Requirement 3: Professional Bowler Figure Illustration

**User Story:** As a visitor, I want the bowler illustration to look like a professional cricket broadcast graphic with realistic human proportions, so that the animation feels premium rather than childish.

#### Acceptance Criteria

1. THE SilhouetteBowler component SHALL render an SVG figure with realistic human proportions: a head-to-body ratio between 1:6.5 and 1:7.5 (measured as head height divided by total figure height from crown to feet), properly articulated shoulder, elbow, and wrist joints on the bowling arm, and a visible distinction between torso, hips, and legs
2. THE SilhouetteBowler figure SHALL depict a recognizable fast bowling delivery action with the bowling arm extended above the head at the point of release, the front leg braced and planted forward of the torso, the back leg trailing behind, and a side-on shoulder alignment where the front shoulder points toward the batsman's end
3. THE SilhouetteBowler SVG SHALL use cubic bezier curve `<path>` elements (C or c commands in SVG path data) for all body outlines, with zero `<circle>`, `<rect>`, or `<polygon>` elements used for body parts, producing flowing silhouette contours
4. THE SilhouetteBowler figure SHALL include cricket-specific detail visible in the silhouette outline: trouser leg shapes that widen below the knee (distinguishable from skin-tight outlines), the bowling arm fully extended with a visible hand shape at the terminus, and a front-arm counterbalance positioned forward of the chest
5. THE SilhouetteBowler component SHALL maintain the existing animated transform props interface (x, y, rotate, scale, fill, className) so that BowlingAnimation can drive its position and rotation through the scroll-linked phases without code changes to BowlingAnimation
6. THE SilhouetteBowler figure SHALL be rendered as a single-color filled silhouette (using the `fill` prop) without interior line detail, gradient fills, or photographic texture, containing no more than 8 distinct `<path>` elements total
7. THE SilhouetteBowler component SHALL render within the existing SVG viewBox coordinate system (200×120 units) used by BowlingAnimation, with the figure's bounding box not exceeding 40 units wide by 60 units tall at scale=1

### Requirement 4: Professional Batsman Figure Illustration

**User Story:** As a visitor, I want the batsman illustration to look like a professional cricket graphic with realistic batting stance proportions, so that the shot animation feels authentic.

#### Acceptance Criteria

1. THE SilhouetteBatsman component SHALL render an SVG figure with anatomically plausible human proportions: a head-to-body ratio between 1:6.5 and 1:7.5 (measured as head height divided by total figure height), properly articulated arms holding a cricket bat with both hands on the handle, and legs in a balanced batting stance
2. THE SilhouetteBatsman figure SHALL depict a recognizable batting stance with the bat held at an angle between 35° and 55° behind the body (backlift position), knees bent with the front knee angle between 120° and 160°, and the head positioned over the front knee facing the bowler
3. THE SilhouetteBatsman SVG SHALL use `<path>` elements with cubic bezier curve commands (C or c) for body outlines instead of the current basic geometric shapes (`<circle>`, `<rect>`), producing a silhouette with no visible angular joints between body segments
4. THE SilhouetteBatsman figure SHALL include recognizable cricket-specific equipment outlines in the silhouette: a cricket bat with blade width between 10% and 12% of total figure height, batting pads on both legs extending from knee to ankle, and a helmet with a visible grille or peak shape
5. THE SilhouetteBatsman component SHALL maintain the existing component interface (accepting className, style, and spread props as a `<g>` element with aria-hidden="true") so that CricketGroundHero can render the batsman without code changes
6. THE SilhouetteBatsman figure SHALL be rendered as a single-color filled silhouette without interior line detail, gradient fills, or photographic texture, using only solid fill attributes consistent with the SilhouetteBowler component's single-color approach
7. THE SilhouetteBatsman SVG SHALL contain a minimum of 5 distinct `<path>` elements (head, torso, front arm, back arm, front leg, back leg, bat) to ensure the figure is composed of identifiable anatomical segments rather than a single merged blob

### Requirement 5: Full-Screen Play Next Ball Experience

**User Story:** As a visitor navigating between pages, I want clicking "Play Next Ball" to fill the entire screen with the cricket ground, bowler, and batsman, so that the navigation transition feels cinematic and immersive.

#### Acceptance Criteria

1. WHEN a visitor clicks the "Play Next Ball" button on any Section_Page, THE PlayNextBallWidget SHALL render a Full_Screen_Takeover overlay that occupies 100% of the viewport width and 100% of the viewport height (100vw × 100vh), positioned fixed to cover the entire screen, and SHALL prevent scrolling of the underlying page content while the overlay is open
2. THE Full_Screen_Takeover SHALL display the CricketGroundSVG at full viewport scale with the Professional_Figure bowler at the bowling end and the Professional_Figure batsman at the batting crease, both visible simultaneously on screen
3. WHEN the Full_Screen_Takeover opens, THE system SHALL animate a Cinematic_Transition entry sequence: the overlay fades in over 300-500ms, then the bowler figure animates a run-up and delivery action over 1.5-2.5 seconds, followed by the batsman playing a shot motion
4. WHEN the bowling and batting animation sequence completes inside the Full_Screen_Takeover, THE system SHALL reveal the Shot_Navigation targets for unvisited sections (or all sections if all have been visited) positioned at their field locations on the full-screen cricket ground, with each target fading or scaling in over 200-400ms
5. THE Full_Screen_Takeover SHALL include a close/dismiss button with a minimum 44×44px touch target and a 3:1 minimum contrast ratio against its background, positioned in the top-right corner of the overlay, that allows the visitor to exit the overlay and return to the page content without navigating
6. WHEN a visitor selects a Shot_Navigation target within the Full_Screen_Takeover, THE system SHALL animate the Ball_Trajectory at full-screen scale, then navigate to the corresponding Section_Page using React Router (same behavior as the existing shot selection flow)
7. THE Full_Screen_Takeover SHALL apply a semi-transparent backdrop behind the overlay content (opacity between 0.85 and 0.95) to visually separate it from the underlying page content
8. WHILE the viewport width is below 768px, THE Full_Screen_Takeover SHALL still occupy 100vw × 100vh but SHALL scale the cricket ground, bowler, and batsman proportionally to fit the mobile viewport while maintaining minimum 44×44px touch targets on all Shot_Navigation elements
9. WHEN the Full_Screen_Takeover opens, THE system SHALL move keyboard focus to the close button, trap focus within the overlay (Tab cycles through the close button and Shot_Navigation targets only), and restore focus to the "Play Next Ball" button when the overlay is dismissed
10. IF the visitor has prefers-reduced-motion enabled, THEN THE Full_Screen_Takeover SHALL skip the bowling and batting animation sequence and display the Shot_Navigation targets immediately after the overlay fade-in completes

### Requirement 6: Warm Glassmorphism Update for New Palette

**User Story:** As a visitor, I want cards and glass panels to harmonize with the new sunset/pitch green color scheme, so that the entire visual language feels cohesive.

#### Acceptance Criteria

1. THE system SHALL update the `--glass-border` token to use `rgba(R, G, B, A)` where the RGB channels are derived from the Floodlight_Amber hex value and the alpha channel is between 0.12 and 0.18 (inclusive)
2. THE system SHALL update the `--glass-hover-border` token to use `rgba(R, G, B, A)` where the RGB channels are derived from the Floodlight_Amber hex value and the alpha channel is between 0.40 and 0.50 (inclusive), applied on both hover and focus states of interactive cards and buttons
3. THE system SHALL update the `--glass-card-bg` token to use `rgba(R, G, B, A)` where the RGB channels are derived from the pitch green base color hex value (distinct from the previous dark olive `#0d1f0d`) and the alpha channel is between 0.35 and 0.45 (inclusive)
4. WHEN a visitor hovers over or focuses on an interactive card, THE card border SHALL transition from the `--glass-border` value to the `--glass-hover-border` value using a CSS transition with a duration of 300ms and an ease timing function
5. THE body text selection highlight (::selection) SHALL use `rgba(R, G, B, 0.30)` where the RGB channels are derived from the Floodlight_Amber hex value
6. THE system SHALL maintain a minimum WCAG 2.1 AA contrast ratio of 4.5:1 between text rendered on glass card surfaces and the effective card background color (computed as the `--glass-card-bg` composited over the page background)
7. THE system SHALL define the Floodlight_Amber and pitch green base color hex values as named CSS custom properties (e.g., `--floodlight-amber` and `--pitch-green`) in the `:root` scope, so that all derived glass tokens reference these base values

### Requirement 8: Scroll-Locked Home Page with Overview Shot Target

**User Story:** As a visitor, I want the Home page to be a single full-viewport cricket ground experience without scrollable below-fold content, so that I must interact with the cricket field (or use the navbar) to navigate — making the cricket metaphor the primary interaction.

#### Acceptance Criteria

1. THE Home page SHALL NOT scroll beyond a single viewport height (100vh). The page body or container SHALL have `overflow: hidden` or equivalent applied so that the visitor cannot scroll past the cricket ground hero section
2. THE below-fold content currently on the Home page (Currently section, CompanyLogoStrip, ProjectShowcase, SkillMarquee, ExperiencePreview, BeyondCode, and CTA) SHALL be removed from the Home page scrollable flow and instead rendered on a new dedicated route or as an overlay accessible via a cricket field shot target
3. THE CricketGroundHero Shot_Navigation SHALL include a sixth shot target labeled "Overview" (or similar cricket-themed label such as "Sweep" or "Defence") that navigates to the below-fold content, positioned on the cricket field at a distinct location from the existing 5 shot targets
4. THE sixth shot target SHALL NOT appear as a new item in the Top_Navbar — it is only accessible through the cricket field shot navigation and the Full_Screen_Takeover Play Next Ball widget
5. THE below-fold content (Currently, CompanyLogoStrip, ProjectShowcase, SkillMarquee, ExperiencePreview, BeyondCode, CTA) SHALL be rendered on a new page/route (e.g., `/overview` or `/highlights`) that maintains the same visual styling and data imports as the current Home page sections
6. WHEN a visitor activates the Overview shot target on the cricket field, THE Ball_Trajectory SHALL animate toward the target position and then navigate to the new overview page using React Router, following the same pattern as all other shot targets
7. THE Home page CricketGroundHero SHALL occupy exactly 100vh with no scroll-linked bowling animation — the bowler/batsman animation SHALL be triggered by user click (a "Play" button or initial interaction prompt) rather than scroll, since there is no scroll distance available
8. WHEN the visitor clicks the play/start interaction on the Home page, THE bowling animation SHALL play as a timed sequence (1.5-2.5 seconds) rather than scroll-linked, after which Shot_Navigation targets (including the Overview target) SHALL appear
9. THE Top_Navbar SHALL continue to show only the existing navigation labels (Home, Experience, Projects, Research, About, Contact) without adding an "Overview" or "Highlights" entry
10. IF prefers-reduced-motion is enabled, THE Home page SHALL display all Shot_Navigation targets (including Overview) immediately on load without requiring any click interaction

### Requirement 7: Animation Continuity and Accessibility Preservation

**User Story:** As a developer, I want the visual overhaul to preserve the existing animation logic, state management, and accessibility guarantees, so that the upgrade is purely visual without regressions.

#### Acceptance Criteria

1. THE upgraded SilhouetteBowler component SHALL animate through the three existing scroll-linked phases (run-up 0-0.4, delivery stride 0.4-0.7, ball release 0.7-1.0) using the same Framer Motion useTransform mappings without changes to BowlingAnimation timing logic
2. THE upgraded SilhouetteBatsman component SHALL remain positioned and scaled by CricketGroundHero using the same transform/translate approach without requiring changes to the parent orchestrator
3. THE Full_Screen_Takeover in PlayNextBallWidget SHALL continue to use the existing CricketNavContext for visitedSections filtering, navigation locking, and section marking — no changes to state management
4. THE Full_Screen_Takeover SHALL maintain the existing keyboard accessibility: all Shot_Navigation targets remain focusable via Tab and activatable via Enter/Space, with visible focus indicators at 3:1 contrast ratio
5. WHILE the user has enabled prefers-reduced-motion, THE Full_Screen_Takeover SHALL skip the bowling/batting animation sequence and display Shot_Navigation targets immediately after the overlay opens
6. THE Full_Screen_Takeover overlay SHALL include `role="dialog"` and `aria-label` attributes for screen reader users, and trap focus within the overlay while it is open
7. IF the Full_Screen_Takeover animation or overlay fails to render, THEN THE system SHALL fall back gracefully — the Top_Navbar remains functional as the primary navigation method, and no broken UI elements are displayed
8. THE system SHALL preserve all existing React Router routes, AnimatePresence behavior, and data.js imports without modification
