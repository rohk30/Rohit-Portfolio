# Portfolio Architecture & Design Document
**Developer:** Rohit Kumar Birakayala
**Version:** 1.0.0
**Design Paradigm:** Dark Theme, Glassmorphism, Multi-page SPA (Single Page Application)

---

## 1. Tech Stack & Infrastructure

To achieve a top-notch, highly responsive, and visually appealing portfolio with smooth page transitions, the following stack is selected:

*   **Framework:** React 18
*   **Build Tool:** Vite (Chosen for instant server starts and lightning-fast HMR)
*   **Styling:** Tailwind CSS (Utility-first for rapid UI development and easy dark mode handling)
*   **Routing:** `react-router-dom` v6 (For multi-page architecture)
*   **Animations:** Framer Motion (Crucial for the glass widget hover effects and seamless page transitions)
*   **Icons:** `lucide-react` or `react-icons` (Clean, modern SVG icons)

---

## 2. UI/UX Design System

The visual identity relies on a premium, modern aesthetic suitable for a Data Scientist and Software Engineer.

### 2.1. Color Palette
*   **Background:** Deep Dark (`#0a0a0a` or Tailwind `bg-slate-950`) to make the glass widgets pop.
*   **Glass Panels:** `bg-slate-900/40` with `backdrop-blur-md` and a subtle `border-white/10`.
*   **Accent Colors:** Electric Blue (`text-blue-400` or `text-blue-500`) to highlight key metrics (e.g., 9.5 GPA, 87% precision).
*   **Typography:** Primary text in pure white (`text-white`), secondary text in soft gray (`text-gray-400`).

### 2.2. The Glassmorphism Formula (Core UI Component)
Every widget, card, and interactive element will inherit this base Tailwind configuration to maintain strict visual consistency:
```javascript
className="bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl overflow-hidden"


3. Information Architecture (Routing)
The portfolio is structured as a collection of smaller, highly descriptive webpages to avoid cognitive overload and allow for deep dives into technical experiences. All route changes will be wrapped in Framer Motion's <AnimatePresence mode="wait"> for fade-and-slide transitions.

/ (Home): The Bento Box dashboard providing a high-level snapshot.

/experience: A timeline-based deep dive into internships.

/projects: A gallery view of technical projects and products.

/about: The personal aspect (education, leadership, hobbies).

/contact: Links and resume download.

4. Page-by-Page Layout Details
4.1. Home Page (/) - The Bento Box Grid
A responsive CSS Grid (grid-cols-1 md:grid-cols-4) featuring interactive glass widgets.

Intro Widget (2x2 span): Large greeting, identifying as a Data Scientist Intern at Gracenote, Nielsen.


PDF
Focus Widget (2x1 span): Highlighting current work building production-scale Agentic AI systems.

Education Widget (1x1 span): Quick stats highlighting B.Tech in CS with Data Science at Vellore Institute of Technology.


PDF
Skills Ticker (1x1 span): Auto-scrolling tags (Python, Java, C++, Dart, DSPy).


PDF
Experience & Projects Links (Various spans): Clickable widgets routing to /experience and /projects with hover-triggered arrows.

4.2. Experience Page (/experience)
Layout: A vertical interactive timeline on the left, with detailed glass cards on the right.

Gracenote, Nielsen (Jan 2026 - Present): Highlight the DSPy prompt optimization and the engineering of a version-aware media matching pipeline utilizing Claude Haiku/Sonnet. Emphasize the improvement from 48% to 87% precision.


PDF+ 1
UBS GOTO Technology (May 2025 - Jul 2025): Focus on the automated classification workflows in ServiceNow using Predictive Intelligence and the 20% automation improvement.


PDF
Talent Recruit (May 2024 - Jul 2024): Detail the RAG pipeline using MiniLM/BERT embeddings indexed in ChromaDB.


PDF
4.3. Projects Page (/projects)
Layout: A masonry or standard grid (grid-cols-1 md:grid-cols-2) of project cards. Each card expands or links to a GitHub repo.

Featured Product: The multi-agent job application system (highlighting that this is a production-scale product, not just a college project).

4 Phase Sickle Cell Prediction: Detail the pipeline (image segmentation, GMM clustering, classification) and the 98%+ precision metric.


PDF
Group Expense Splitter App: Highlight the Flutter/Dart and Firebase tech stack, specifically mentioning the graph-based settlement optimization. Note: Focus on the application functionality rather than just the code.


PDF
4.4. About & Leadership Page (/about)
Layout: Split screen. Text narrative on the left, an interactive photo collage on the right.

Education: B.Tech at VIT (Sept 2022 - Jun 2026) with a 9.5 GPA[cite: 2]. Note upcoming plans for a Master's degree abroad in Fall 2027.

Leadership: Vice Chairperson for the Juvenile Care NGO, serving 500+ attendees[cite: 2].

Beyond the Code: A dedicated section for hobbies, featuring a gallery of travels (London, Paris, Belgium, Andaman) and a nod to following cricket (RCB).

4.5. Contact Page (/contact)
Layout: Centered, minimalist glass card.

Direct mailto link (rohitkumar.birakayala@gmail.com)[cite: 2].

Social links (LinkedIn, GitHub: rohk30)[cite: 1].

A prominent, styled button to download the latest PDF resume.

5. Component Architecture (Directory Structure)
Strict separation of concerns to ensure the codebase remains maintainable and scalable.

Plaintext

src/
├── assets/
│   ├── images/          (Travel photos, headshot, architecture diagrams)
│   └── docs/            (rohit-kumar-birakayala-6.pdf)
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx   (Sticky top navigation with glassmorphism)
│   │   ├── Footer.jsx
│   │   └── PageTransition.jsx (Framer Motion wrapper)
│   ├── ui/
│   │   ├── GlassCard.jsx (The core reusable container)
│   │   ├── Badge.jsx    (For rendering tech stack pills like 'PostgreSQL' or 'YOLO')
│   │   └── Button.jsx
│   └── sections/
│       ├── BentoGrid.jsx
│       ├── TimelineItem.jsx
│       └── ProjectCard.jsx
├── pages/
│   ├── Home.jsx
│   ├── Experience.jsx
│   ├── Projects.jsx
│   ├── About.jsx
│   └── Contact.jsx
├── styles/
│   └── index.css        (Tailwind imports and custom scrollbar styling)
├── utils/
│   └── data.js          (Contains all JSON arrays for experiences, projects, and skills)
├── App.jsx              (Router definition and AnimatePresence setup)
└── main.jsx
6. Data Management Strategy
To keep JSX files clean, all textual content from the resume will be stored in src/utils/data.js.

Example Data Structure:

JavaScript

export const experienceData = [
  {
    id: 1,
    role: "Data Scientist Intern",
    company: "Gracenote, Nielsen",
    location: "Bengaluru, India",
    date: "Jan 2026 - Present",
    bullets: [
      "Improved version-match precision from 48% to 87% by engineering a version-aware media matching pipeline using Claude Haiku/ Sonnet hosted on Amazon EC2...",
      "Performed DSPY prompt optimization with COPRO, MIPRO & InferRules optimizers...",
      "Curated indexed parquet datasets from 10k+ production records..."
    ],
    techStack: ["Python", "DSPy", "Claude", "Amazon EC2", "Parquet"]
  },
  // ... UBS and Talent Recruit objects follow
];
This architecture ensures that updating the portfolio in the future (e.g., adding a new project or updating a role) requires zero changes to the UI components, only a simple update to the data.js file.

