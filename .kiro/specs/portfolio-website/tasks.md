# Implementation Plan: Portfolio Website

## Overview

This implementation plan creates Rohit Kumar Birakayala's personal portfolio website—a modern, multi-page React SPA with dark theme glassmorphism design. The plan follows an incremental approach: first establishing project structure and core components, then building each page with its unique features, and finally ensuring quality through testing and accessibility validation.

## Tasks

- [x] 1. Project Setup and Configuration
  - [x] 1.1 Initialize Vite React project with TypeScript/JavaScript configuration
    - Run `npm create vite@latest . -- --template react` in the project root
    - Configure Vite for optimal development experience
    - Set up absolute imports with path aliases
    - _Requirements: 8.1_

  - [x] 1.2 Install and configure dependencies'
    - Install core dependencies: `react-router-dom`, `framer-motion`, `lucide-react`
    - Install Tailwind CSS and configure with dark mode
    - Install dev dependencies: `vitest`, `@testing-library/react`, `fast-check`, `jsdom`
    - _Requirements: 8.1, 10.1_

  - [x] 1.3 Set up Tailwind CSS with custom design tokens
    - Configure tailwind.config.js with custom colors (#0a0a0a background, blue-400 accent)
    - Add glassmorphism utility classes
    - Create src/styles/index.css with Tailwind imports and custom scrollbar styling
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 1.4 Create directory structure
    - Create src/assets/images/ and src/assets/docs/ directories
    - Create src/components/layout/, src/components/ui/, src/components/sections/ directories
    - Create src/pages/, src/utils/, src/__tests__/ directories
    - _Requirements: 11.1_

- [x] 2. Core UI Components
  - [x] 2.1 Implement GlassCard component
    - Create src/components/ui/GlassCard.jsx with glassmorphism styling
    - Support props: children, className, hover, onClick, as (element type)
    - Apply base classes: bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl
    - Add hover state animation when enabled
    - _Requirements: 8.2, 8.5_

  - [x] 2.2 Write property test for GlassCard rendering
    - **Property 13 (partial): Data Schema Validation**
    - Verify GlassCard renders children correctly for any valid input
    - **Validates: Requirements 8.2, 8.5**

  - [x] 2.3 Implement Badge component
    - Create src/components/ui/Badge.jsx for tech stack pills
    - Support variants: default (gray), accent (blue-400)
    - Support sizes: sm, md
    - _Requirements: 3.5, 4.3_

  - [x] 2.4 Implement Button component
    - Create src/components/ui/Button.jsx with consistent styling
    - Support variants: primary, secondary, ghost
    - Support href for link buttons and download attribute
    - Handle disabled state
    - _Requirements: 7.4, 7.5_

  - [x] 2.5 Implement PhotoModal component
    - Create src/components/ui/PhotoModal.jsx for lightbox functionality
    - Use Framer Motion for open/close animations
    - Handle click-outside and Escape key to close
    - Ensure keyboard accessibility (focus trap)
    - _Requirements: 6.6, 10.4_

  - [x] 2.6 Write property test for PhotoModal
    - **Property 10: Photo Modal Displays Clicked Photo**
    - Verify modal displays the exact photo (same src, alt) that was clicked
    - **Validates: Requirements 6.6**

- [x] 3. Layout Components
  - [x] 3.1 Implement PageTransition component
    - Create src/components/layout/PageTransition.jsx with Framer Motion
    - Configure animation: fade-and-slide (opacity 0→1, y 20→0)
    - Set transition duration to 0.4s with anticipate easing
    - Support prefers-reduced-motion media query
    - _Requirements: 1.3, 10.6_

  - [x] 3.2 Implement Navbar component
    - Create src/components/layout/Navbar.jsx with glassmorphism styling
    - Display links: Home, Experience, Projects, Research, About, Contact
    - Make navbar sticky with backdrop-blur effect
    - Highlight active page link using data-active attribute
    - _Requirements: 1.1, 1.2, 1.4_

  - [x] 3.3 Implement responsive mobile navigation
    - Add hamburger menu icon for viewport < 768px
    - Create slide-out navigation drawer with Framer Motion
    - Ensure touch-friendly tap targets (44x44px minimum)
    - _Requirements: 1.5, 9.3, 9.4_

  - [x] 3.4 Write property test for navigation active state
    - **Property 1: Navigation Active State Matches Current Route**
    - For any route, verify the corresponding nav link is highlighted and no others
    - **Validates: Requirements 1.4**

  - [x] 3.5 Implement Footer component (optional)
    - Create src/components/layout/Footer.jsx with minimal styling
    - Include copyright and social links
    - _Requirements: 8.5_

- [x] 4. Checkpoint - Core Components Complete
  - Ensure all core UI and layout components render correctly
  - Ensure all tests pass, ask the user if questions arise

- [x] 5. Data Layer Implementation
  - [x] 5.1 Create data store with all content types
    - Create src/utils/data.js with exported constants
    - Implement navigationData array with id, label, path fields
    - Implement experienceData array with all required fields (id, role, company, location, date, bullets, techStack, metrics)
    - _Requirements: 11.1_

  - [x] 5.2 Add project and research data
    - Implement projectData array with id, title, description, techStack, metrics, githubUrl, featured, image fields
    - Implement researchData array with id, title, authors, venue, date, abstract, publicationUrl, codeUrl, category, citationCount, status fields
    - _Requirements: 11.2, 11.3_

  - [x] 5.3 Add personal and contact data
    - Implement personalData object with education, leadership, hobbies sub-objects
    - Include travelPhotos array with id, src, alt, location fields
    - Implement contactData with email, linkedIn, github, resumePath fields
    - _Requirements: 11.4_

  - [x] 5.4 Write property tests for data schema validation
    - **Property 13: Data Schema Validation**
    - Verify all experience objects contain required fields
    - Verify all project objects contain required fields
    - Verify all publication objects contain required fields
    - Verify personalData contains required nested structures
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4**

- [x] 6. App Router and Entry Point
  - [x] 6.1 Configure React Router in App.jsx
    - Set up BrowserRouter with Routes for all pages
    - Wrap routes in AnimatePresence with mode="wait"
    - Include Navbar outside AnimatePresence for persistence
    - _Requirements: 1.1, 1.3_

  - [x] 6.2 Set up main.jsx entry point
    - Configure React 18 createRoot
    - Import global styles from src/styles/index.css
    - Wrap App in StrictMode
    - _Requirements: 8.1_

- [x] 7. Home Page Implementation
  - [x] 7.1 Implement BentoGrid component
    - Create src/components/sections/BentoGrid.jsx with responsive CSS Grid
    - Configure grid: grid-cols-1 md:grid-cols-4 gap-4 md:gap-6
    - Handle widget spans for desktop layout
    - _Requirements: 2.1, 2.8_

  - [x] 7.2 Implement IntroWidget component
    - Create src/components/sections/IntroWidget.jsx (2x2 span)
    - Display name, role as Data Scientist, current position at Gracenote, Nielsen
    - Apply GlassCard with hover animation
    - _Requirements: 2.2_

  - [x] 7.3 Implement FocusWidget and EducationWidget
    - Create src/components/sections/FocusWidget.jsx (2x1 span) highlighting Agentic AI work
    - Create src/components/sections/EducationWidget.jsx (1x1 span) with B.Tech, 9.5 GPA
    - _Requirements: 2.3, 2.4_

  - [x] 7.4 Implement SkillsTicker widget
    - Create src/components/sections/SkillsTicker.jsx (1x1 span)
    - Implement auto-scrolling animation for technology tags
    - Include: Python, Java, C++, Dart, DSPy, etc.
    - _Requirements: 2.5_

  - [x] 7.5 Create Home page with all widgets
    - Create src/pages/Home.jsx combining all widgets
    - Add clickable link widgets to Experience and Projects pages
    - Implement hover animation with arrow indicator
    - _Requirements: 2.6, 2.7_

- [x] 8. Checkpoint - Home Page Complete
  - Verify Home page renders all widgets correctly
  - Test responsive behavior at mobile breakpoint
  - Ensure all tests pass, ask the user if questions arise

- [x] 9. Experience Page Implementation
  - [x] 9.1 Implement Timeline component
    - Create src/components/sections/Timeline.jsx with vertical layout
    - Accept items prop with TimelineItemData structure
    - Support activeId state for highlighting selected item
    - _Requirements: 3.1_

  - [x] 9.2 Implement TimelineItem component
    - Create src/components/sections/TimelineItem.jsx
    - Display company name and date range
    - Handle click events to trigger scroll and highlight
    - _Requirements: 3.4_

  - [x] 9.3 Implement ExperienceCard component
    - Create src/components/sections/ExperienceCard.jsx
    - Display role, company, location, date range
    - Render all bullet points and tech stack badges
    - Highlight metrics with blue accent color
    - _Requirements: 3.2, 3.5, 3.7_

  - [x] 9.4 Write property test for experience data rendering
    - **Property 2: Experience Data Rendering Completeness**
    - For any experience object, verify card renders all required fields
    - **Validates: Requirements 3.2, 3.5**

  - [x] 9.5 Write property test for timeline click behavior
    - **Property 3: Timeline Click Scrolls to Correct Card**
    - Verify clicking timeline item scrolls to and highlights corresponding card
    - **Validates: Requirements 3.4**

  - [x] 9.6 Create Experience page
    - Create src/pages/Experience.jsx with split layout
    - Position Timeline on left, ExperienceCards on right
    - Load data from experienceData in data store
    - Include entries for Gracenote, UBS, Talent Recruit
    - _Requirements: 3.1, 3.3, 3.6_

- [x] 10. Projects Page Implementation
  - [x] 10.1 Implement ProjectCard component
    - Create src/components/sections/ProjectCard.jsx
    - Display title, description, tech stack badges, metrics
    - Handle click to open GitHub URL in new tab
    - Add featured styling variant for prominent projects
    - _Requirements: 4.3, 4.4_

  - [x] 10.2 Write property test for project data rendering
    - **Property 4: Project Data Rendering Completeness**
    - For any project object, verify card renders all required fields
    - **Validates: Requirements 4.3**

  - [x] 10.3 Write property test for project card click behavior
    - **Property 5: Project Card Click Opens GitHub URL**
    - Verify clicking project card opens exact GitHub URL in new tab
    - **Validates: Requirements 4.4**

  - [x] 10.4 Create Projects page
    - Create src/pages/Projects.jsx with responsive grid layout
    - Configure grid: grid-cols-1 md:grid-cols-2
    - Load data from projectData in data store
    - Feature multi-agent job application system prominently
    - Include Sickle Cell Prediction and Expense Splitter projects
    - _Requirements: 4.1, 4.2, 4.5, 4.6, 4.7_

- [x] 11. Research Page Implementation
  - [x] 11.1 Implement CategoryFilter component
    - Create src/components/sections/CategoryFilter.jsx
    - Display filter buttons for: Conference, Journal, Preprint, Technical Report
    - Support activeCategory state and onCategoryChange callback
    - Include "All" option to clear filter
    - _Requirements: 5.6, 5.8_

  - [x] 11.2 Implement PublicationCard component
    - Create src/components/sections/PublicationCard.jsx
    - Display title, authors, venue, date, abstract
    - Display citation count and publication status badge
    - Show code/dataset repository links where available
    - Handle click to open publication URL in new tab
    - _Requirements: 5.3, 5.4, 5.5, 5.7_

  - [x] 11.3 Write property test for publication data rendering
    - **Property 7: Publication Data Rendering Completeness**
    - For any publication object, verify card renders all required fields
    - Verify cards with codeUrl include repository link
    - **Validates: Requirements 5.3, 5.5, 5.7**

  - [x] 11.4 Write property test for publication card click
    - **Property 8: Publication Card Click Opens Publication URL**
    - Verify clicking publication card opens exact URL in new tab
    - **Validates: Requirements 5.4**

  - [x] 11.5 Implement publication sorting and filtering logic
    - Create utility functions for sorting by date (most recent first)
    - Create utility function for filtering by category
    - Create utility for grouping publications by category
    - _Requirements: 5.1, 5.6_

  - [x] 11.6 Write property test for publication sorting
    - **Property 6: Publications Sorted by Date Descending**
    - Verify sorted publications maintain date order (i.date >= i+1.date)
    - **Validates: Requirements 5.1**

  - [x] 11.7 Write property test for category filtering
    - **Property 9: Publication Category Filtering**
    - Verify filtering returns only publications matching selected category
    - Verify clearing filter shows all publications
    - Verify empty categories are not rendered
    - **Validates: Requirements 5.6, 5.8, 5.9**

  - [x] 11.8 Create Research page
    - Create src/pages/Research.jsx with filter and publication list
    - Display publications grouped by category
    - Sort publications by date within each category
    - Hide empty category sections
    - _Requirements: 5.1, 5.2, 5.9_

- [x] 12. Checkpoint - Core Pages Complete
  - Verify Experience, Projects, and Research pages render correctly
  - Test data loading from data store
  - Ensure all tests pass, ask the user if questions arise

- [x] 13. About Page Implementation
  - [x] 13.1 Implement PhotoCollage component
    - Create src/components/sections/PhotoCollage.jsx
    - Display travel photos in an interactive grid layout
    - Handle photo click to open PhotoModal
    - _Requirements: 6.4_

  - [x] 13.2 Create About page with split layout
    - Create src/pages/About.jsx with text narrative on left, collage on right
    - Display education: VIT (Sept 2022 - Jun 2026), 9.5 GPA, Master's plans Fall 2027
    - Display leadership: Vice Chairperson, Juvenile Care NGO, 500+ attendees
    - Include "Beyond the Code" section with travel photos
    - Load data from personalData in data store
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 14. Contact Page Implementation
  - [x] 14.1 Create Contact page
    - Create src/pages/Contact.jsx with centered GlassCard
    - Add clickable email link (mailto:rohitkumar.birakayala@gmail.com)
    - Add LinkedIn and GitHub (rohk30) profile links
    - Add styled resume download button with download attribute
    - Place resume PDF in src/assets/docs/
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 15. Accessibility and Polish
  - [x] 15.1 Add alt text to all images
    - Audit all img elements across components
    - Ensure meaningful alt text is provided for each image
    - Use empty alt="" only for decorative images
    - _Requirements: 10.3_

  - [x] 15.2 Write property test for image alt text
    - **Property 11: All Images Have Alt Text**
    - Verify all img elements have non-empty alt attribute
    - **Validates: Requirements 10.3**

  - [x] 15.3 Implement keyboard navigation
    - Ensure all interactive elements are focusable via Tab
    - Ensure all interactive elements activatable via Enter/Space
    - Add focus-visible styles for keyboard users
    - _Requirements: 10.4_

  - [x] 15.4 Write property test for keyboard accessibility
    - **Property 12: Interactive Elements Keyboard Accessible**
    - Verify all buttons, links, and clickable cards are focusable and activatable
    - **Validates: Requirements 10.4**

  - [x] 15.5 Verify color contrast and WCAG compliance
    - Check text-white on bg-slate-950 meets 4.5:1 ratio
    - Check blue-400 accent color meets contrast requirements
    - Verify large text (24px+) meets 3:1 ratio
    - _Requirements: 10.5_

  - [x] 15.6 Add prefers-reduced-motion support
    - Wrap Framer Motion animations with motion preference check
    - Disable or reduce animations when user prefers reduced motion
    - _Requirements: 10.6_

- [x] 16. Error Handling and Boundaries
  - [x] 16.1 Implement ErrorBoundary component
    - Create src/components/ErrorBoundary.jsx with React Error Boundary
    - Display friendly error message with refresh button
    - Log errors to console for debugging
    - _Requirements: 10.1_

  - [x] 16.2 Add graceful degradation for data
    - Add default values for optional fields in components
    - Handle empty data arrays with "No items found" message
    - Add image fallback placeholders for failed loads
    - _Requirements: 11.5_

- [x] 17. Final Testing and Validation
  - [x] 17.1 Run all property-based tests
    - Execute npm test to run all property tests
    - Verify minimum 100 iterations per property
    - Fix any failing property tests

  - [x] 17.2 Run accessibility tests
    - Integrate axe-core with test suite
    - Run accessibility audit on all pages
    - Fix any accessibility violations

  - [x] 17.3 Verify responsive design across breakpoints
    - Test at 320px (mobile), 768px (tablet), 1024px (desktop), 2560px (ultra-wide)
    - Verify single-column layouts on mobile
    - Verify no horizontal scrolling at any breakpoint
    - _Requirements: 9.1, 9.2, 9.5_

- [x] 18. Final Checkpoint - All Tests Pass
  - Run full test suite with coverage
  - Verify Lighthouse Performance score ≥ 90
  - Verify Lighthouse Accessibility score ≥ 90
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional property-based tests that can be skipped for faster MVP
- Each task references specific requirements for full traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate the 13 correctness properties from the design document
- The data layer (Task 5) can be developed in parallel with UI components
- All components use the shared GlassCard base for visual consistency

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1", "5.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.4", "2.5", "5.2", "5.3"] },
    { "id": 4, "tasks": ["2.6", "3.1", "3.2", "5.4"] },
    { "id": 5, "tasks": ["3.3", "3.4", "3.5", "6.1", "6.2"] },
    { "id": 6, "tasks": ["7.1", "7.2", "7.3", "7.4"] },
    { "id": 7, "tasks": ["7.5", "9.1", "9.2", "9.3", "10.1", "11.1", "11.2"] },
    { "id": 8, "tasks": ["9.4", "9.5", "9.6", "10.2", "10.3", "10.4", "11.3", "11.4", "11.5"] },
    { "id": 9, "tasks": ["11.6", "11.7", "11.8", "13.1"] },
    { "id": 10, "tasks": ["13.2", "14.1"] },
    { "id": 11, "tasks": ["15.1", "15.3", "15.5", "15.6", "16.1", "16.2"] },
    { "id": 12, "tasks": ["15.2", "15.4"] },
    { "id": 13, "tasks": ["17.1", "17.2", "17.3"] }
  ]
}
```
