# Requirements Document

## Introduction

This document defines the requirements for Rohit Kumar Birakayala's personal portfolio website. The portfolio showcases professional experience as a Data Scientist, technical projects, education, leadership activities, and research publications. Built with React 18, Vite, Tailwind CSS, and Framer Motion, the website follows a dark theme with glassmorphism design principles, organized as a multi-page Single Page Application (SPA).

## Glossary

- **Portfolio_Website**: The complete React-based web application showcasing Rohit's professional profile
- **Navigation_System**: The sticky glassmorphism navbar component enabling page routing
- **Home_Page**: The landing page featuring a Bento Box grid layout with interactive widgets
- **Experience_Page**: The timeline-based page displaying internship and work history
- **Projects_Page**: The masonry grid page showcasing technical projects and products
- **About_Page**: The personal page displaying education, leadership, and hobbies
- **Contact_Page**: The minimalist page with contact information and resume download
- **Research_Page**: The page displaying research work, publications, and academic contributions
- **GlassCard**: The reusable UI component implementing glassmorphism styling (bg-slate-900/40, backdrop-blur-md, border-white/10)
- **Page_Transition**: The Framer Motion animation wrapper providing fade-and-slide transitions between pages
- **Bento_Grid**: The responsive CSS grid layout (grid-cols-1 md:grid-cols-4) used on the Home page
- **Timeline_Component**: The vertical interactive timeline displaying work experience chronologically
- **Data_Store**: The src/utils/data.js file containing all content as JSON arrays
- **Visitor**: Any person viewing the portfolio website

## Requirements

### Requirement 1: Application Shell and Navigation

**User Story:** As a Visitor, I want a consistent navigation experience across all pages, so that I can easily explore different sections of the portfolio.

#### Acceptance Criteria

1. THE Navigation_System SHALL display links to Home, Experience, Projects, Research, About, and Contact pages
2. WHILE the Visitor is on any page, THE Navigation_System SHALL remain visible as a sticky header with glassmorphism styling
3. WHEN a Visitor clicks a navigation link, THE Page_Transition SHALL animate the page change with a fade-and-slide effect
4. THE Navigation_System SHALL highlight the currently active page link
5. WHEN the viewport width is less than 768px, THE Navigation_System SHALL collapse into a hamburger menu

### Requirement 2: Home Page Bento Grid

**User Story:** As a Visitor, I want to see a high-level snapshot of Rohit's profile on the landing page, so that I can quickly understand his expertise and navigate to areas of interest.

#### Acceptance Criteria

1. THE Home_Page SHALL display a responsive Bento_Grid layout using CSS Grid
2. THE Home_Page SHALL include an Intro Widget (2x2 span) displaying name, role, and current position at Gracenote, Nielsen
3. THE Home_Page SHALL include a Focus Widget (2x1 span) highlighting current work on Agentic AI systems
4. THE Home_Page SHALL include an Education Widget (1x1 span) showing B.Tech in CS with Data Science and 9.5 GPA
5. THE Home_Page SHALL include a Skills Ticker Widget (1x1 span) with auto-scrolling technology tags
6. THE Home_Page SHALL include clickable widgets linking to Experience and Projects pages
7. WHEN a Visitor hovers over a widget, THE GlassCard SHALL display a hover animation with an arrow indicator
8. WHEN the viewport width is less than 768px, THE Bento_Grid SHALL display as a single-column layout

### Requirement 3: Experience Page Timeline

**User Story:** As a Visitor, I want to explore Rohit's work history in detail, so that I can understand his professional growth and technical contributions.

#### Acceptance Criteria

1. THE Experience_Page SHALL display a vertical Timeline_Component on the left side
2. THE Experience_Page SHALL display detailed GlassCard components on the right side for each experience
3. THE Experience_Page SHALL load experience data from the Data_Store
4. WHEN a Visitor clicks a timeline item, THE Experience_Page SHALL scroll to and highlight the corresponding experience card
5. THE Experience_Page SHALL display role, company, location, date range, bullet points, and tech stack badges for each experience
6. THE Experience_Page SHALL include entries for Gracenote Nielsen, UBS GOTO Technology, and Talent Recruit
7. THE Experience_Page SHALL highlight key metrics (87% precision improvement, 20% automation improvement) using accent color styling

### Requirement 4: Projects Gallery

**User Story:** As a Visitor, I want to browse Rohit's technical projects, so that I can evaluate his practical skills and project complexity.

#### Acceptance Criteria

1. THE Projects_Page SHALL display projects in a responsive masonry or grid layout (grid-cols-1 md:grid-cols-2)
2. THE Projects_Page SHALL load project data from the Data_Store
3. THE Projects_Page SHALL display project title, description, tech stack badges, and key metrics for each project
4. WHEN a Visitor clicks a project card, THE Projects_Page SHALL open the corresponding GitHub repository in a new tab
5. THE Projects_Page SHALL feature the multi-agent job application system prominently as a production-scale product
6. THE Projects_Page SHALL include the 4 Phase Sickle Cell Prediction project with 98%+ precision metric
7. THE Projects_Page SHALL include the Group Expense Splitter App highlighting Flutter/Dart and graph-based optimization

### Requirement 5: Research and Publications Section

**User Story:** As a Visitor, I want to view Rohit's research work and publications, so that I can understand his academic contributions and research expertise.

#### Acceptance Criteria

1. THE Research_Page SHALL display research publications in a chronological order with most recent first
2. THE Research_Page SHALL load research data from the Data_Store
3. THE Research_Page SHALL display publication title, authors, venue/journal, publication date, and abstract for each publication
4. WHEN a Visitor clicks a publication card, THE Research_Page SHALL open the publication link (DOI, ArXiv, or conference page) in a new tab
5. WHERE a publication has associated code or datasets, THE Research_Page SHALL display links to the relevant repositories
6. THE Research_Page SHALL categorize publications by type (Conference Papers, Journal Articles, Preprints, Technical Reports)
7. THE Research_Page SHALL display citation count and publication status (Published, Under Review, Preprint) for each entry
8. THE Research_Page SHALL include a filter mechanism to view publications by category or research area
9. WHEN no publications exist in a category, THE Research_Page SHALL hide that category section

### Requirement 6: About Page Personal Profile

**User Story:** As a Visitor, I want to learn about Rohit's education, leadership, and personal interests, so that I can understand him beyond his technical skills.

#### Acceptance Criteria

1. THE About_Page SHALL display a split-screen layout with text narrative on the left and photo collage on the right
2. THE About_Page SHALL display education details including VIT (Sept 2022 - Jun 2026), 9.5 GPA, and Master's degree plans for Fall 2027
3. THE About_Page SHALL display leadership experience as Vice Chairperson for Juvenile Care NGO serving 500+ attendees
4. THE About_Page SHALL include a "Beyond the Code" section featuring travel photos (London, Paris, Belgium, Andaman)
5. THE About_Page SHALL load personal data from the Data_Store
6. WHEN a Visitor clicks a photo in the collage, THE About_Page SHALL display an enlarged view in a modal

### Requirement 7: Contact Page

**User Story:** As a Visitor, I want to easily contact Rohit or download his resume, so that I can initiate professional communication.

#### Acceptance Criteria

1. THE Contact_Page SHALL display a centered, minimalist GlassCard
2. THE Contact_Page SHALL include a clickable email link (mailto:rohitkumar.birakayala@gmail.com)
3. THE Contact_Page SHALL include clickable links to LinkedIn and GitHub (rohk30) profiles
4. THE Contact_Page SHALL include a prominently styled button to download the PDF resume
5. WHEN a Visitor clicks the resume download button, THE Contact_Page SHALL initiate download of the latest resume PDF from src/assets/docs/

### Requirement 8: Visual Design System

**User Story:** As a Visitor, I want a consistent, premium visual experience, so that the portfolio feels professional and modern.

#### Acceptance Criteria

1. THE Portfolio_Website SHALL use a deep dark background color (#0a0a0a or bg-slate-950)
2. THE GlassCard SHALL apply glassmorphism styling (bg-slate-900/40, backdrop-blur-md, border-white/10, shadow-2xl, rounded-2xl)
3. THE Portfolio_Website SHALL use electric blue (text-blue-400 or text-blue-500) as the accent color for metrics and highlights
4. THE Portfolio_Website SHALL use pure white (text-white) for primary text and soft gray (text-gray-400) for secondary text
5. THE Portfolio_Website SHALL maintain visual consistency across all pages using the GlassCard component

### Requirement 9: Responsive Design

**User Story:** As a Visitor, I want the portfolio to work well on any device, so that I can view it on desktop, tablet, or mobile.

#### Acceptance Criteria

1. THE Portfolio_Website SHALL render correctly on viewport widths from 320px to 2560px
2. WHEN the viewport width is less than 768px, THE Portfolio_Website SHALL adjust grid layouts to single-column
3. WHEN the viewport width is less than 768px, THE Portfolio_Website SHALL display a mobile-friendly navigation menu
4. THE Portfolio_Website SHALL maintain touch-friendly tap targets (minimum 44x44px) on mobile devices
5. THE Portfolio_Website SHALL load and function without horizontal scrolling on any supported viewport

### Requirement 10: Performance and Accessibility

**User Story:** As a Visitor, I want the portfolio to load quickly and be accessible, so that I have a smooth browsing experience regardless of my abilities.

#### Acceptance Criteria

1. THE Portfolio_Website SHALL achieve a Lighthouse Performance score of 90 or higher
2. THE Portfolio_Website SHALL achieve a Lighthouse Accessibility score of 90 or higher
3. THE Portfolio_Website SHALL provide alt text for all images
4. THE Portfolio_Website SHALL support keyboard navigation for all interactive elements
5. THE Portfolio_Website SHALL maintain sufficient color contrast ratios (4.5:1 for normal text, 3:1 for large text) per WCAG 2.1 AA
6. WHEN Framer Motion animations are running, THE Portfolio_Website SHALL respect user's prefers-reduced-motion setting

### Requirement 11: Data Management

**User Story:** As a Developer, I want all content stored separately from UI components, so that I can update the portfolio without modifying component code.

#### Acceptance Criteria

1. THE Data_Store SHALL contain all experience data as a JSON array with id, role, company, location, date, bullets, and techStack fields
2. THE Data_Store SHALL contain all project data as a JSON array with id, title, description, techStack, metrics, and githubUrl fields
3. THE Data_Store SHALL contain all research data as a JSON array with id, title, authors, venue, date, abstract, publicationUrl, codeUrl, category, citationCount, and status fields
4. THE Data_Store SHALL contain all personal data (education, leadership, hobbies) as structured JSON objects
5. THE Portfolio_Website SHALL render all content by reading from the Data_Store
