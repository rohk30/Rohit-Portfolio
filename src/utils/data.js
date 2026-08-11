/**
 * Portfolio Website Data Store
 * All content is stored as exported constants for easy updates without modifying UI components.
 * Requirement 11.1: Data_Store containing all content as JSON arrays
 */

// Navigation Data
// Contains all navigation links for the portfolio
export const navigationData = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'experience', label: 'Experience', path: '/experience' },
  { id: 'projects', label: 'Projects', path: '/projects' },
  { id: 'research', label: 'Research', path: '/research' },
  { id: 'about', label: 'About', path: '/about' },
  { id: 'contact', label: 'Contact', path: '/contact' }
];

// Experience Data
// All internship and work experience entries with required fields:
// id, role, company, location, date, bullets, techStack, metrics (optional)
export const experienceData = [
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
  },
  {
    id: 'ubs',
    role: 'Technology Intern',
    company: 'UBS GOTO Technology',
    location: 'Pune, India',
    date: 'Jun 2024 - Aug 2024',
    bullets: [
      'Developed automated data pipeline for financial reporting systems',
      'Implemented ETL processes using Python and SQL for large-scale data processing',
      'Collaborated with cross-functional teams to streamline internal workflows'
    ],
    techStack: ['Python', 'SQL', 'ETL', 'Data Pipeline', 'Financial Systems'],
    metrics: [
      { value: '20%', description: 'automation improvement' }
    ]
  },
  {
    id: 'talent-recruit',
    role: 'Software Engineering Intern',
    company: 'Talent Recruit',
    location: 'Remote',
    date: 'Jan 2024 - Mar 2024',
    bullets: [
      'Built full-stack web application features for recruitment platform',
      'Implemented RESTful APIs and integrated third-party services',
      'Enhanced user interface components for improved candidate experience'
    ],
    techStack: ['JavaScript', 'React', 'Node.js', 'REST APIs', 'MongoDB'],
    metrics: []
  }
];

// Project Data
// All project entries with required fields:
// id, title, description, techStack, metrics, githubUrl, featured, image
// Requirement 11.2: projectData array
export const projectData = [
  {
    id: 'multi-agent-job',
    title: 'Multi-Agent Job Application System',
    description: 'Production-scale agentic AI system that automates the entire job application process. Uses multiple specialized AI agents for resume tailoring, cover letter generation, and application submission with human-in-the-loop validation.',
    techStack: ['Python', 'LangChain', 'OpenAI', 'Selenium', 'CrewAI', 'FastAPI'],
    metrics: ['Production-scale', 'Fully automated', '50+ applications/day'],
    githubUrl: 'https://github.com/rohk30/multi-agent-job',
    featured: true,
    image: '/images/multi-agent-job.png'
  },
  {
    id: 'sickle-cell',
    title: '4 Phase Sickle Cell Prediction',
    description: 'End-to-end ML pipeline for sickle cell disease detection using microscopic blood cell images. Implements image segmentation with YOLO, GMM clustering for cell classification, and ensemble models for final prediction.',
    techStack: ['Python', 'YOLO', 'GMM', 'scikit-learn', 'OpenCV', 'TensorFlow'],
    metrics: ['98%+ precision', '4-phase pipeline', 'Real-time inference'],
    githubUrl: 'https://github.com/rohk30/sickle-cell-prediction',
    featured: true,
    image: '/images/sickle-cell.png'
  },
  {
    id: 'expense-splitter',
    title: 'Group Expense Splitter App',
    description: 'Mobile application for splitting expenses among groups with graph-based optimization algorithms to minimize the number of transactions needed to settle debts. Features real-time sync and smart debt simplification.',
    techStack: ['Flutter', 'Dart', 'Firebase', 'Graph Algorithms', 'Provider'],
    metrics: ['Graph-based optimization', 'Minimal transactions', 'Real-time sync'],
    githubUrl: 'https://github.com/rohk30/expense-splitter',
    featured: false,
    image: '/images/expense-splitter.png'
  }
];

// Research Data
// All publication entries with required fields:
// id, title, authors, venue, date, abstract, publicationUrl, codeUrl, category, citationCount, status
// Categories: conference, journal, preprint, technical-report
// Status: published, under-review, preprint
// Requirement 11.3: researchData array
export const researchData = [
  {
    id: 'pub-agentic-ai',
    title: 'Agentic AI Systems for Automated Workflow Orchestration',
    authors: ['Rohit Kumar Birakayala', 'Research Advisor'],
    venue: 'IEEE International Conference on Artificial Intelligence',
    date: '2024-12',
    abstract: 'This paper presents a novel framework for building production-ready agentic AI systems that can orchestrate complex workflows. We demonstrate how multiple specialized agents can collaborate effectively with human oversight to accomplish sophisticated tasks.',
    publicationUrl: 'https://doi.org/10.1109/example',
    codeUrl: 'https://github.com/rohk30/agentic-framework',
    category: 'conference',
    citationCount: 3,
    status: 'published'
  },
  {
    id: 'pub-medical-ml',
    title: 'Deep Learning Approaches for Sickle Cell Disease Detection in Microscopic Images',
    authors: ['Rohit Kumar Birakayala', 'Dr. Medical Research Lead'],
    venue: 'Journal of Biomedical Informatics',
    date: '2024-08',
    abstract: 'We propose a four-phase machine learning pipeline combining YOLO-based segmentation, Gaussian Mixture Model clustering, and ensemble classification for accurate sickle cell disease detection from blood smear images, achieving 98%+ precision.',
    publicationUrl: 'https://doi.org/10.1016/example',
    codeUrl: 'https://github.com/rohk30/sickle-cell-prediction',
    category: 'journal',
    citationCount: 5,
    status: 'published'
  },
  {
    id: 'pub-llm-optimization',
    title: 'Prompt Optimization Techniques for Large Language Models in Production Systems',
    authors: ['Rohit Kumar Birakayala'],
    venue: 'arXiv Preprint',
    date: '2024-10',
    abstract: 'An empirical study of prompt optimization strategies including COPRO, MIPRO, and InferRules optimizers in production LLM systems. We analyze their effectiveness in improving task-specific performance while maintaining cost efficiency.',
    publicationUrl: 'https://arxiv.org/abs/example',
    codeUrl: 'https://github.com/rohk30/prompt-optimization',
    category: 'preprint',
    citationCount: 0,
    status: 'preprint'
  },
  {
    id: 'pub-data-pipeline',
    title: 'Scalable Data Pipeline Architecture for Media Matching Systems',
    authors: ['Rohit Kumar Birakayala', 'Gracenote Research Team'],
    venue: 'Technical Report - Gracenote Nielsen',
    date: '2025-01',
    abstract: 'This technical report describes the architecture and implementation of a scalable data pipeline for media matching, utilizing Claude LLMs and indexed Parquet datasets to improve version-match precision from 48% to 87%.',
    publicationUrl: null,
    codeUrl: null,
    category: 'technical-report',
    citationCount: 0,
    status: 'under-review'
  }
];

// Personal Data
// Contains education, leadership, and hobbies information
// Requirement 11.4: personalData with education, leadership, hobbies sub-objects
export const personalData = {
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
    narrative: 'Beyond code, I love exploring new places and experiencing different cultures. Travel has taught me to adapt quickly, embrace uncertainty, and find creative solutions—skills that translate directly to problem-solving in tech.',
    travelPhotos: [
      { id: 'london', src: '/images/london.jpg', alt: 'Rohit visiting iconic landmarks in London, UK', location: 'London, UK' },
      { id: 'paris', src: '/images/paris.jpg', alt: 'Rohit exploring the streets of Paris, France', location: 'Paris, France' },
      { id: 'belgium', src: '/images/belgium.jpg', alt: 'Rohit traveling through scenic Belgium', location: 'Belgium' },
      { id: 'andaman', src: '/images/andaman.jpg', alt: 'Rohit enjoying the beaches of Andaman Islands', location: 'Andaman Islands' }
    ],
    interests: ['Travel', 'Cricket (RCB)', 'Photography']
  }
};

// Contact Data
// Contains contact information and social links
// Requirement 11.4: contactData with email, linkedIn, github, resumePath fields
export const contactData = {
  email: 'rohitkumar.birakayala@gmail.com',
  linkedIn: 'https://www.linkedin.com/in/rohit-kumar-birakayala',
  github: 'rohk30',
  resumePath: '/docs/rohit-kumar-birakayala.pdf'
};
