# Technical Design Document: Portfolio Website

## Overview

This document provides the technical design for Rohit Kumar Birakayala's personal portfolio website—a modern, multi-page Single Page Application (SPA) built with React 18. The portfolio showcases professional experience, technical projects, research publications, education, and contact information using a dark theme with glassmorphism design principles.

### Goals

- Create a visually stunning, responsive portfolio using modern web technologies
- Implement smooth page transitions and micro-interactions with Framer Motion
- Maintain clean separation between content data and UI components
- Achieve high performance (Lighthouse 90+) and accessibility (WCAG 2.1 AA)
- Support all device sizes from mobile (320px) to ultra-wide (2560px)

### Non-Goals

- Server-side rendering (SSR) or static site generation (SSG)
- Backend API integration or database connectivity
- User authentication or content management system
- Blog functionality or dynamic content updates

### Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Framework | React 18 | Component-based UI library |
| Build Tool | Vite | Fast development server and optimized builds |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Routing | react-router-dom v6 | Client-side routing for SPA |
| Animations | Framer Motion | Page transitions and micro-interactions |
| Icons | lucide-react | Modern SVG icon library |

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Browser                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         React Application                              │  │
│  │                                                                        │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │                     App.jsx (Router)                            │  │  │
│  │  │                                                                  │  │  │
│  │  │  ┌────────────────┐  ┌────────────────────────────────────────┐ │  │  │
│  │  │  │    Navbar      │  │      AnimatePresence                   │ │  │  │
│  │  │  │ (Sticky Glass) │  │                                        │ │  │  │
│  │  │  └────────────────┘  │  ┌──────────────────────────────────┐  │ │  │  │
│  │  │                      │  │    PageTransition Wrapper        │  │ │  │  │
│  │  │                      │  │                                   │  │ │  │  │
│  │  │                      │  │  ┌─────────────────────────────┐ │  │ │  │  │
│  │  │                      │  │  │      Page Components        │ │  │ │  │  │
│  │  │                      │  │  │   (Home, Experience, etc.)  │ │  │ │  │  │
│  │  │                      │  │  └─────────────────────────────┘ │  │ │  │  │
│  │  │                      │  └──────────────────────────────────┘  │ │  │  │
│  │  │                      └────────────────────────────────────────┘ │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                        │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │                      Data Layer                                 │  │  │
│  │  │  ┌─────────────────────────────────────────────────────────┐   │  │  │
│  │  │  │  src/utils/data.js (Static JSON Arrays)                 │   │  │  │
│  │  │  │  • experienceData  • projectData  • researchData        │   │  │  │
│  │  │  │  • personalData    • navigationData                     │   │  │  │
│  │  │  └─────────────────────────────────────────────────────────┘   │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Routing Architecture

```
                          ┌──────────────┐
                          │   BrowserRouter   │
                          └──────┬───────┘
                                 │
                          ┌──────▼───────┐
                          │    Routes    │
                          └──────┬───────┘
                                 │
        ┌────────────┬───────────┼───────────┬────────────┬────────────┐
        │            │           │           │            │            │
   ┌────▼────┐ ┌─────▼─────┐ ┌───▼───┐ ┌─────▼─────┐ ┌────▼────┐ ┌─────▼─────┐
   │   /     │ │/experience│ │/projects│ │/research│ │ /about  │ │ /contact  │
   │  Home   │ │ Experience│ │Projects │ │Research │ │  About  │ │  Contact  │
   └─────────┘ └───────────┘ └─────────┘ └─────────┘ └─────────┘ └───────────┘
```

### Component Hierarchy

```
App
├── Navbar
│   ├── Logo
│   ├── NavLinks (desktop)
│   └── MobileMenu (hamburger)
├── AnimatePresence
│   └── PageTransition
│       └── [Current Page]
│           ├── Home
│           │   └── BentoGrid
│           │       ├── IntroWidget
│           │       ├── FocusWidget
│           │       ├── EducationWidget
│           │       ├── SkillsTicker
│           │       └── LinkWidgets
│           ├── Experience
│           │   ├── Timeline
│           │   │   └── TimelineItem[]
│           │   └── ExperienceCard[]
│           ├── Projects
│           │   └── ProjectCard[]
│           ├── Research
│           │   ├── CategoryFilter
│           │   └── PublicationCard[]
│           ├── About
│           │   ├── TextNarrative
│           │   ├── PhotoCollage
│           │   └── PhotoModal
│           └── Contact
│               └── ContactCard
└── Footer (optional)
```

---

## Components and Interfaces

### Directory Structure

```
src/
├── assets/
│   ├── images/           # Travel photos, headshot, project images
│   └── docs/             # Resume PDF (rohit-kumar-birakayala.pdf)
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── PageTransition.jsx
│   ├── ui/
│   │   ├── GlassCard.jsx
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   └── PhotoModal.jsx
│   └── sections/
│       ├── BentoGrid.jsx
│       ├── IntroWidget.jsx
│       ├── FocusWidget.jsx
│       ├── EducationWidget.jsx
│       ├── SkillsTicker.jsx
│       ├── Timeline.jsx
│       ├── TimelineItem.jsx
│       ├── ExperienceCard.jsx
│       ├── ProjectCard.jsx
│       ├── PublicationCard.jsx
│       ├── CategoryFilter.jsx
│       └── PhotoCollage.jsx
├── pages/
│   ├── Home.jsx
│   ├── Experience.jsx
│   ├── Projects.jsx
│   ├── Research.jsx
│   ├── About.jsx
│   └── Contact.jsx
├── utils/
│   └── data.js           # All content as JSON arrays
├── styles/
│   └── index.css         # Tailwind imports, custom scrollbar
├── App.jsx               # Router and AnimatePresence setup
└── main.jsx              # React entry point
```

### Core UI Components

#### GlassCard Component

The foundational component implementing glassmorphism styling used across all pages.

```typescript
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;           // Enable hover animation
  onClick?: () => void;
  as?: 'div' | 'article' | 'section';
}
```

**Styling Formula:**
```
bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl overflow-hidden
```

**Hover State (when enabled):**
```
hover:bg-slate-800/50 hover:border-white/20 hover:shadow-blue-500/10 transition-all duration-300
```

#### Badge Component

Displays technology stack pills.

```typescript
interface BadgeProps {
  text: string;
  variant?: 'default' | 'accent';  // accent uses blue-400
  size?: 'sm' | 'md';
}
```

#### Button Component

Reusable button with consistent styling.

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;              // For link buttons
  onClick?: () => void;
  disabled?: boolean;
  download?: boolean;         // For download links
}
```

#### PhotoModal Component

Lightbox for displaying enlarged photos.

```typescript
interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
}
```

### Layout Components

#### Navbar Component

Sticky glassmorphism navigation with responsive behavior.

```typescript
interface NavbarProps {
  currentPath: string;
}

interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}
```

**Behavior:**
- Desktop (≥768px): Horizontal link layout with active state highlighting
- Mobile (<768px): Hamburger menu with slide-out navigation drawer
- Always sticky at top with backdrop-blur effect

#### PageTransition Component

Framer Motion wrapper for page animations.

```typescript
interface PageTransitionProps {
  children: React.ReactNode;
}
```

**Animation Configuration:**
```javascript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};
```

### Section Components

#### BentoGrid Component

Responsive CSS grid for Home page widgets.

```typescript
interface BentoGridProps {
  children: React.ReactNode;
}
```

**Grid Configuration:**
```
grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6
```

**Widget Spans:**
| Widget | Mobile | Desktop |
|--------|--------|---------|
| IntroWidget | 1 col | 2x2 (col-span-2 row-span-2) |
| FocusWidget | 1 col | 2x1 (col-span-2) |
| EducationWidget | 1 col | 1x1 |
| SkillsTicker | 1 col | 1x1 |

#### Timeline Component

Vertical interactive timeline for Experience page.

```typescript
interface TimelineProps {
  items: TimelineItemData[];
  activeId: string | null;
  onItemClick: (id: string) => void;
}

interface TimelineItemData {
  id: string;
  company: string;
  date: string;
  isActive: boolean;
}
```

#### CategoryFilter Component

Filter mechanism for Research page publications.

```typescript
interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}
```

---

## Data Models

All content is stored in `src/utils/data.js` as exported JavaScript constants. This enables content updates without modifying UI components.

### Navigation Data

```typescript
interface NavItem {
  id: string;
  label: string;
  path: string;
}

// Example
const navigationData: NavItem[] = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'experience', label: 'Experience', path: '/experience' },
  { id: 'projects', label: 'Projects', path: '/projects' },
  { id: 'research', label: 'Research', path: '/research' },
  { id: 'about', label: 'About', path: '/about' },
  { id: 'contact', label: 'Contact', path: '/contact' }
];
```

### Experience Data

```typescript
interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  date: string;
  bullets: string[];
  techStack: string[];
  metrics?: MetricHighlight[];
}

interface MetricHighlight {
  value: string;
  description: string;
}

// Example
const experienceData: Experience[] = [
  {
    id: 'gracenote',
    role: 'Data Scientist Intern',
    company: 'Gracenote, Nielsen',
    location: 'Bengaluru, India',
    date: 'Jan 2026 - Present',
    bullets: [
      'Improved version-match precision from 48% to 87% by engineering a version-aware media matching pipeline using Claude Haiku/Sonnet hosted on Amazon EC2',
      'Performed DSPY prompt optimization with COPRO, MIPRO & InferRules optimizers',
      'Curated indexed parquet datasets from 10k+ production records'
    ],
    techStack: ['Python', 'DSPy', 'Claude', 'Amazon EC2', 'Parquet'],
    metrics: [
      { value: '87%', description: 'precision improvement from 48%' }
    ]
  }
];
```

### Project Data

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  metrics?: string[];
  githubUrl: string;
  featured?: boolean;
  image?: string;
}

// Example
const projectData: Project[] = [
  {
    id: 'multi-agent-job',
    title: 'Multi-Agent Job Application System',
    description: 'Production-scale agentic AI system for automated job applications',
    techStack: ['Python', 'LangChain', 'OpenAI', 'Selenium'],
    metrics: ['Production-scale', 'Fully automated'],
    githubUrl: 'https://github.com/rohk30/multi-agent-job',
    featured: true
  },
  {
    id: 'sickle-cell',
    title: '4 Phase Sickle Cell Prediction',
    description: 'ML pipeline with image segmentation, GMM clustering, and classification',
    techStack: ['Python', 'YOLO', 'GMM', 'scikit-learn'],
    metrics: ['98%+ precision'],
    githubUrl: 'https://github.com/rohk30/sickle-cell-prediction'
  }
];
```

### Research Data

```typescript
interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  date: string;
  abstract: string;
  publicationUrl?: string;
  codeUrl?: string;
  category: 'conference' | 'journal' | 'preprint' | 'technical-report';
  citationCount?: number;
  status: 'published' | 'under-review' | 'preprint';
}

// Example
const researchData: Publication[] = [
  {
    id: 'pub-1',
    title: 'Research Paper Title',
    authors: ['Rohit Kumar Birakayala', 'Co-Author Name'],
    venue: 'Conference/Journal Name',
    date: '2024',
    abstract: 'Brief abstract of the publication...',
    publicationUrl: 'https://doi.org/...',
    codeUrl: 'https://github.com/rohk30/...',
    category: 'conference',
    citationCount: 5,
    status: 'published'
  }
];
```

### Personal Data

```typescript
interface PersonalData {
  education: Education;
  leadership: Leadership;
  hobbies: Hobbies;
}

interface Education {
  institution: string;
  degree: string;
  specialization: string;
  dateRange: string;
  gpa: string;
  futurePlans: string;
}

interface Leadership {
  role: string;
  organization: string;
  impact: string;
}

interface Hobbies {
  narrative: string;
  travelPhotos: TravelPhoto[];
  interests: string[];
}

interface TravelPhoto {
  id: string;
  src: string;
  alt: string;
  location: string;
}

// Example
const personalData: PersonalData = {
  education: {
    institution: 'Vellore Institute of Technology',
    degree: 'B.Tech',
    specialization: 'Computer Science with Data Science',
    dateRange: 'Sept 2022 - Jun 2026',
    gpa: '9.5',
    futurePlans: "Master's degree abroad in Fall 2027"
  },
  leadership: {
    role: 'Vice Chairperson',
    organization: 'Juvenile Care NGO',
    impact: '500+ attendees served'
  },
  hobbies: {
    narrative: 'Beyond code, I love exploring new places and experiencing different cultures.',
    travelPhotos: [
      { id: 'london', src: '/images/london.jpg', alt: 'London trip', location: 'London, UK' },
      { id: 'paris', src: '/images/paris.jpg', alt: 'Paris trip', location: 'Paris, France' },
      { id: 'belgium', src: '/images/belgium.jpg', alt: 'Belgium trip', location: 'Belgium' },
      { id: 'andaman', src: '/images/andaman.jpg', alt: 'Andaman trip', location: 'Andaman Islands' }
    ],
    interests: ['Travel', 'Cricket (RCB)', 'Photography']
  }
};
```

### Data Access Patterns

Components import data directly from the data module:

```javascript
// In Experience.jsx
import { experienceData } from '../utils/data';

function Experience() {
  return (
    <div>
      {experienceData.map(exp => (
        <ExperienceCard key={exp.id} data={exp} />
      ))}
    </div>
  );
}
```

**Filtering Example (Research Page):**

```javascript
// Filter by category
const filteredPublications = researchData.filter(
  pub => activeCategory === null || pub.category === activeCategory
);

// Sort by date (most recent first)
const sortedPublications = [...filteredPublications].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

// Group by category
const groupedByCategory = researchData.reduce((acc, pub) => {
  if (!acc[pub.category]) acc[pub.category] = [];
  acc[pub.category].push(pub);
  return acc;
}, {});
```



---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

The following properties are derived from the acceptance criteria and represent testable invariants for the portfolio website's core logic.

### Property 1: Navigation Active State Matches Current Route

*For any* route in the application, the navigation link corresponding to that route SHALL be highlighted as active, and no other navigation link SHALL be highlighted.

**Validates: Requirements 1.4**

### Property 2: Experience Data Rendering Completeness

*For any* experience object in the data store, the Experience page SHALL render a card displaying the role, company, location, date range, all bullet points, and all tech stack badges from that experience object.

**Validates: Requirements 3.2, 3.5**

### Property 3: Timeline Click Scrolls to Correct Card

*For any* timeline item on the Experience page, clicking that item SHALL scroll the viewport to position the corresponding experience card into view and apply highlight styling to that card.

**Validates: Requirements 3.4**

### Property 4: Project Data Rendering Completeness

*For any* project object in the data store, the Projects page SHALL render a card displaying the title, description, all tech stack badges, and all metrics from that project object.

**Validates: Requirements 4.3**

### Property 5: Project Card Click Opens GitHub URL

*For any* project card on the Projects page where the project has a githubUrl, clicking that card SHALL trigger navigation to that exact GitHub URL in a new browser tab.

**Validates: Requirements 4.4**

### Property 6: Publications Sorted by Date Descending

*For any* list of publications displayed on the Research page, the publications SHALL be ordered such that for each adjacent pair (publication[i], publication[i+1]), the date of publication[i] is greater than or equal to the date of publication[i+1].

**Validates: Requirements 5.1**

### Property 7: Publication Data Rendering Completeness

*For any* publication object in the data store, the Research page SHALL render a card displaying the title, all authors, venue, publication date, abstract, citation count, and status. Additionally, *where* a publication has a codeUrl, the rendered card SHALL include a link to that repository.

**Validates: Requirements 5.3, 5.5, 5.7**

### Property 8: Publication Card Click Opens Publication URL

*For any* publication card on the Research page where the publication has a publicationUrl, clicking that card SHALL trigger navigation to that exact publication URL in a new browser tab.

**Validates: Requirements 5.4**

### Property 9: Publication Category Filtering

*For any* category filter selection on the Research page:
- *When* a specific category is selected, only publications with that category SHALL be displayed
- *When* no publications exist in the selected category, that category section SHALL not be rendered
- *When* the filter is cleared (all categories), all publications SHALL be displayed grouped by their respective categories

**Validates: Requirements 5.6, 5.8, 5.9**

### Property 10: Photo Modal Displays Clicked Photo

*For any* photo in the About page photo collage, clicking that photo SHALL open a modal displaying an enlarged view of that exact photo (same src and alt attributes).

**Validates: Requirements 6.6**

### Property 11: All Images Have Alt Text

*For any* `<img>` element rendered in the application, that element SHALL have an `alt` attribute with a non-empty string value.

**Validates: Requirements 10.3**

### Property 12: Interactive Elements Keyboard Accessible

*For any* interactive element (button, link, clickable card) in the application, that element SHALL be focusable via Tab key navigation and activatable via Enter or Space key press.

**Validates: Requirements 10.4**

### Property 13: Data Schema Validation

*For any* object in the data store:
- Experience objects SHALL contain: id (string), role (string), company (string), location (string), date (string), bullets (string array), techStack (string array)
- Project objects SHALL contain: id (string), title (string), description (string), techStack (string array), githubUrl (string)
- Publication objects SHALL contain: id (string), title (string), authors (string array), venue (string), date (string), abstract (string), category (enum), status (enum)
- Personal data SHALL contain: education (object), leadership (object), hobbies (object) with their required nested fields

**Validates: Requirements 11.1, 11.2, 11.3, 11.4**

---

## Error Handling

### Data Loading Errors

| Scenario | Behavior |
|----------|----------|
| Missing data.js file | Build fails at import time (Vite error) |
| Malformed JSON structure | Build fails with JavaScript syntax error |
| Empty data arrays | Pages render with "No items found" message |
| Missing optional fields | Components use default values or conditionally hide elements |

### Navigation Errors

| Scenario | Behavior |
|----------|----------|
| Invalid route accessed | React Router's default behavior (404 or redirect to home) |
| Missing route parameter | Component renders empty state or redirects |

### Asset Loading Errors

| Scenario | Behavior |
|----------|----------|
| Image fails to load | Show fallback placeholder image |
| Resume PDF missing | Download button disabled with tooltip |
| External URL unreachable | User's browser handles externally (new tab failure) |

### User Input Errors

Since this is a read-only portfolio with no forms, user input errors are limited to:

| Scenario | Behavior |
|----------|----------|
| Invalid filter selection | Filter resets to "all" |
| Rapid clicking | Debounce navigation and modal actions |

### Graceful Degradation Strategy

```javascript
// Example: Safe data access with fallbacks
const ExperienceCard = ({ data }) => {
  const {
    role = 'Unknown Role',
    company = 'Unknown Company',
    bullets = [],
    techStack = []
  } = data ?? {};

  return (
    <GlassCard>
      <h3>{role}</h3>
      <p>{company}</p>
      {bullets.length > 0 && (
        <ul>
          {bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}
        </ul>
      )}
      {/* ... */}
    </GlassCard>
  );
};
```

### Error Boundaries

Implement React Error Boundaries to catch rendering errors:

```javascript
// src/components/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <GlassCard>
            <h2>Something went wrong</h2>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </GlassCard>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

## Testing Strategy

### Overview

The portfolio website uses a dual testing approach combining example-based unit tests for specific UI behaviors with property-based tests for data-driven logic and invariants.

### Testing Stack

| Tool | Purpose |
|------|---------|
| Vitest | Test runner (Vite-native, fast) |
| React Testing Library | Component testing |
| fast-check | Property-based testing |
| @testing-library/user-event | User interaction simulation |
| axe-core / jest-axe | Accessibility testing |

### Test Categories

#### 1. Unit Tests (Example-Based)

**Component Rendering Tests:**
- Navbar displays all navigation links
- GlassCard applies correct Tailwind classes
- Badge renders text with correct styling
- Button handles click events and disabled state

**Page Presence Tests:**
- Home page includes all required widgets (Intro, Focus, Education, Skills)
- Contact page includes email link, social links, resume button
- About page includes education and leadership sections

**Responsive Behavior Tests:**
- Navigation collapses at 768px breakpoint
- Bento grid converts to single column on mobile

**Accessibility Tests:**
- All images have alt text (integration with axe-core)
- Interactive elements are focusable
- Color contrast meets WCAG 2.1 AA

#### 2. Property-Based Tests

Property-based tests use fast-check to generate random data and verify invariants hold across all inputs.

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with property reference

**Data Schema Validation (Property 13):**
```javascript
// Tag: Feature: portfolio-website, Property 13: Data Schema Validation
test.prop([experienceArbitrary])('experience schema is valid', (exp) => {
  expect(exp).toHaveProperty('id');
  expect(exp).toHaveProperty('role');
  expect(exp).toHaveProperty('company');
  expect(exp).toHaveProperty('bullets');
  expect(Array.isArray(exp.bullets)).toBe(true);
  // ... additional schema checks
});
```

**Publication Sorting (Property 6):**
```javascript
// Tag: Feature: portfolio-website, Property 6: Publications sorted descending
test.prop([fc.array(publicationArbitrary)])('publications sorted by date desc', (pubs) => {
  const sorted = sortPublicationsByDate(pubs);
  for (let i = 0; i < sorted.length - 1; i++) {
    expect(new Date(sorted[i].date) >= new Date(sorted[i + 1].date)).toBe(true);
  }
});
```

**Category Filtering (Property 9):**
```javascript
// Tag: Feature: portfolio-website, Property 9: Publication category filtering
test.prop([
  fc.array(publicationArbitrary),
  fc.constantFrom('conference', 'journal', 'preprint', 'technical-report')
])('filtering returns only matching category', (pubs, category) => {
  const filtered = filterByCategory(pubs, category);
  filtered.forEach(pub => {
    expect(pub.category).toBe(category);
  });
});
```

**Rendering Completeness (Properties 2, 4, 7):**
```javascript
// Tag: Feature: portfolio-website, Property 2: Experience rendering completeness
test.prop([experienceArbitrary])('experience card renders all required fields', (exp) => {
  const { getByText, getAllByText } = render(<ExperienceCard data={exp} />);
  
  expect(getByText(exp.role)).toBeInTheDocument();
  expect(getByText(exp.company)).toBeInTheDocument();
  expect(getByText(exp.date)).toBeInTheDocument();
  exp.bullets.forEach(bullet => {
    expect(getByText(bullet)).toBeInTheDocument();
  });
  exp.techStack.forEach(tech => {
    expect(getByText(tech)).toBeInTheDocument();
  });
});
```

**Navigation Active State (Property 1):**
```javascript
// Tag: Feature: portfolio-website, Property 1: Navigation active state
test.prop([fc.constantFrom('/', '/experience', '/projects', '/research', '/about', '/contact')])
('active nav link matches route', (route) => {
  const { container } = render(
    <MemoryRouter initialEntries={[route]}>
      <Navbar />
    </MemoryRouter>
  );
  
  const activeLink = container.querySelector('[data-active="true"]');
  expect(activeLink.getAttribute('href')).toBe(route);
});
```

#### 3. Integration Tests

**Lighthouse CI (automated):**
- Performance score ≥ 90
- Accessibility score ≥ 90
- Run in CI pipeline on build

**Visual Regression (optional):**
- Snapshot tests for key components
- Responsive breakpoint screenshots

### Test File Organization

```
src/
├── __tests__/
│   ├── components/
│   │   ├── GlassCard.test.jsx
│   │   ├── Badge.test.jsx
│   │   ├── Button.test.jsx
│   │   └── Navbar.test.jsx
│   ├── pages/
│   │   ├── Home.test.jsx
│   │   ├── Experience.test.jsx
│   │   ├── Projects.test.jsx
│   │   ├── Research.test.jsx
│   │   ├── About.test.jsx
│   │   └── Contact.test.jsx
│   ├── properties/
│   │   ├── data-schema.property.test.js
│   │   ├── publication-sorting.property.test.js
│   │   ├── category-filtering.property.test.js
│   │   ├── rendering-completeness.property.test.js
│   │   └── navigation-active.property.test.js
│   └── utils/
│       └── data.test.js
├── test-utils/
│   ├── arbitraries.js         # fast-check generators
│   └── render-helpers.js      # Custom render with providers
```

### Arbitraries (Test Data Generators)

```javascript
// src/test-utils/arbitraries.js
import * as fc from 'fast-check';

export const experienceArbitrary = fc.record({
  id: fc.uuid(),
  role: fc.string({ minLength: 1, maxLength: 100 }),
  company: fc.string({ minLength: 1, maxLength: 100 }),
  location: fc.string({ minLength: 1, maxLength: 100 }),
  date: fc.string({ minLength: 5, maxLength: 50 }),
  bullets: fc.array(fc.string({ minLength: 10, maxLength: 500 }), { minLength: 1, maxLength: 10 }),
  techStack: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 15 })
});

export const projectArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 10, maxLength: 500 }),
  techStack: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 10 }),
  metrics: fc.array(fc.string({ minLength: 1, maxLength: 50 })),
  githubUrl: fc.webUrl()
});

export const publicationArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 200 }),
  authors: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 10 }),
  venue: fc.string({ minLength: 1, maxLength: 100 }),
  date: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
    .map(d => d.toISOString().split('T')[0]),
  abstract: fc.string({ minLength: 50, maxLength: 1000 }),
  category: fc.constantFrom('conference', 'journal', 'preprint', 'technical-report'),
  status: fc.constantFrom('published', 'under-review', 'preprint'),
  citationCount: fc.nat({ max: 1000 }),
  publicationUrl: fc.option(fc.webUrl()),
  codeUrl: fc.option(fc.webUrl())
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run property tests only
npm test -- --testPathPattern=property

# Run specific property test
npm test -- data-schema.property.test.js

# Watch mode (development)
npm test -- --watch
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test -- --coverage
      - run: npx lighthouse-ci --performance=90 --accessibility=90
```
