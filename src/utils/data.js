import nielsenFullLogo from '../assets/images/experiences/Nielsen_full.png';
import ubsFullLogo from '../assets/images/experiences/UBS_full.png';
import talentRecruitFullLogo from '../assets/images/experiences/TR_full.png';
import nielsenSmallLogo from '../assets/images/experiences/Nielsen_logo.png';
import ubsSmallLogo from '../assets/images/experiences/UBS_logo.png';
import talentRecruitSmallLogo from '../assets/images/experiences/TR_logo.png';
import hobbiesPhoto from '../assets/images/hobbies.png';

/**
 * Portfolio content store.
 * Keep content here so the presentation layer stays reusable and easy to evolve.
 */

export const navigationData = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'experience', label: 'Experience', path: '/experience' },
  { id: 'projects', label: 'Projects', path: '/projects' },
  { id: 'research', label: 'Research', path: '/research' },
  { id: 'about', label: 'About', path: '/about' },
];

export const experienceData = [
  {
    id: 'nielsen-mts',
    role: 'Member of Technical Staff 1',
    company: 'Gracenote, Nielsen',
    companyShort: 'Nielsen',
    location: 'Bengaluru, India',
    date: 'July 2026 - Present',
    bullets: [
      'Built monitoring, alerting, and observability systems for the Data Science team using Grafana, Prometheus, and CloudWatch, reducing detection time for critical system failures to <1 min and internal systems to <5 min',
      'Automated Jira ticket enrichment using webhooks, regex pipelines, and LLM-based extraction to populate Call Letter and ProgServ ID custom fields, eliminating manual processing across 10,000+ annual tickets',
    ],
    techStack: ['Python', 'Claude', 'Grafana', 'AWS CloudWatch', 'Prometheus', 'LLMs'],
    metrics: [
      { value: '<1 min', description: 'detection time for critical systems' },
      { value: '10k+', description: 'eliminated manual processing for tickets' },
    ],
  },
  {
    id: 'nielsen-intern',
    role: 'Data Scientist Intern',
    company: 'Gracenote, Nielsen',
    companyShort: 'Nielsen',
    location: 'Bengaluru, India',
    date: 'Jan 2026 - July 2026',
    bullets: [
      'Improved version-match precision from 48% to 87% by engineering a version-aware media matching pipeline using Claude Haiku/Sonnet hosted on Amazon EC2 with semantic label extraction.',
      'Optimized DSPy prompts with COPRO, MIPRO and InferRules, evaluated on curated GIST-sampled datasets.',
      'Curated indexed Parquet datasets from 10k+ production records and ground-truth Program IDs, enabling scalable retrieval across 10k+ incoming mappables and avoiding infeasible O(n²) search.',
      'Engineered an RCA-driven feedback pipeline for multilingual LLM translations, reducing editor violations by 25%+.',
    ],
    techStack: ['Python', 'Claude', 'DSPy', 'Amazon EC2', 'Parquet', 'LLMs'],
    metrics: [
      { value: '48% → 87%', description: 'version-match precision' },
      { value: '10k+', description: 'production records indexed' },
      { value: '25%+', description: 'editor violation reduction' },
    ],
  },
  {
    id: 'ubs',
    role: 'Software Engineering Intern',
    company: 'UBS – GOTO Technology',
    companyShort: 'UBS',
    location: 'Pune, India',
    date: 'May 2025 - Jul 2025',
    bullets: [
      'Automated classification workflows in ServiceNow using Predictive Intelligence, achieving over 80% precision and recall while applying boosting techniques to mitigate skewed data and class imbalance.',
      'Identified the four highest-impact input features through targeted data analysis, improving automation by 20%.',
      'Integrated JavaScript modules with the ServiceNow UI to retrieve and present predictive insights.',
    ],
    techStack: ['Python', 'JavaScript', 'ServiceNow', 'Predictive Intelligence'],
    metrics: [
      { value: '80%+', description: 'precision & recall' },
      { value: '20%', description: 'automation improvement' },
    ],
  },
  {
    id: 'talent-recruit',
    role: 'Machine Learning Intern',
    company: 'Talent Recruit',
    companyShort: 'TalentRecruit',
    location: 'Bengaluru, India',
    date: 'May 2024 - Jul 2024',
    bullets: [
      'Developed a RAG pipeline for matching top-k resumes with job descriptions using semantic similarity, incorporating MiniLM and BERT embeddings indexed in ChromaDB for efficient vector search.',
      'Built a SpanCat-based parser for skill extraction and improved system accuracy by 15%+ through 2,000+ hard-negative samples generated using similarity thresholds and manual scoring.',
    ],
    techStack: ['Python', 'RAG', 'MiniLM', 'BERT', 'ChromaDB', 'NLP'],
    metrics: [
      { value: '15%+', description: 'accuracy improvement' },
      { value: '2,000+', description: 'hard-negative samples' },
    ],
  },
];

export const companyData = [
  {
    id: 'nielsen',
    name: 'Nielsen',
    role: 'Data Scientist Intern',
    logoUrl: nielsenFullLogo,
    fallback: 'N',
    color: '#00a651',
  },
  {
    id: 'ubs',
    name: 'UBS',
    role: 'Software Engineering Intern',
    logoUrl: ubsFullLogo,
    fallback: 'UBS',
    color: '#e60000',
  },
  {
    id: 'talent-recruit',
    name: 'TalentRecruit',
    role: 'Machine Learning Intern',
    logoUrl: talentRecruitFullLogo,
    fallback: 'TR',
    color: '#20b486',
  },
];

export const experienceBrandData = {
  'nielsen-mts': { logoUrl: nielsenSmallLogo, fallback: 'N', color: '#00a651', name: 'Nielsen' },
  'nielsen-intern': { logoUrl: nielsenSmallLogo, fallback: 'N', color: '#00a651', name: 'Nielsen' },
  nielsen: { logoUrl: nielsenSmallLogo, fallback: 'N', color: '#00a651', name: 'Nielsen' },
  ubs: { logoUrl: ubsSmallLogo, fallback: 'UBS', color: '#e60000', name: 'UBS' },
  'talent-recruit': { logoUrl: talentRecruitSmallLogo, fallback: 'TR', color: '#20b486', name: 'TalentRecruit' },
};

export const projectData = [
  {
    id: 'sickle-cell',
    title: '4-Phase Sickle Cell Prediction',
    eyebrow: 'Medical Imaging · Machine Learning',
    description:
      'A four-stage medical imaging pipeline combining cell segmentation, morphological feature extraction, PCA/GMM clustering and image-level classification.',
    techStack: ['Python', 'Mask R-CNN', 'PyRadiomics', 'PCA', 'GMM', 'Logistic Regression'],
    metrics: ['98%+ precision & recall', '4-stage pipeline', '30 morphological features'],
    githubUrl: null,
    featured: true,
    image: '/images/projects/sickle-cell.png',
    caseStudy: true,
    deepDive: 'This project tackles sickle cell disease detection from microscopy images using a four-phase pipeline. Phase 1 segments individual red blood cells from stained blood smear images using Mask R-CNN. Phase 2 extracts 30 morphological and texture features per cell using PyRadiomics — capturing shape irregularities that distinguish sickled cells. Phase 3 applies PCA for dimensionality reduction followed by Gaussian Mixture Model clustering to group cells by morphology. Phase 4 aggregates cell-level predictions into an image-level classification using logistic regression, achieving 98%+ precision and recall. The pipeline is designed for clinical screening workflows where rapid, automated analysis of blood smears can assist pathologists.',
  },
  {
    id: 'signsentry',
    title: 'SignSentry',
    eyebrow: 'Computer Vision · Road Safety · Hackathon',
    description:
      'A road-safety system that detects important road signs with YOLO and communicates detected information through text-to-speech to support safer navigation.',
    techStack: ['Python', 'YOLO', 'PyTorch', 'RoboFlow', 'Kaggle', 'pyttsx3'],
    metrics: ['36-hour hackathon', 'Final Shark Tank round', 'SDG: Innovation & Infrastructure'],
    githubUrl: 'https://github.com/rohk30/SignSentry',
    featured: true,
    image: '/images/projects/signsentry.png',
    caseStudy: true,
    deepDive: 'Built in 36 hours at a hackathon, SignSentry is a real-time road sign detection system aimed at improving driver awareness. It uses a YOLO object detection model trained on a custom dataset curated via RoboFlow, covering speed limits, stop signs, yield signs and other critical road markers. When a sign is detected, the system pipes the classification through pyttsx3 for text-to-speech output, alerting the driver audibly without requiring them to look at a screen. The project reached the final Shark Tank round at the hackathon and aligns with the UN Sustainable Development Goal for Innovation and Infrastructure. The use case targets long-distance drivers and accessibility for visually impaired passengers.',
  },
  {
    id: 'splitwise',
    title: 'Group Expense Splitter',
    eyebrow: 'Flutter · Firebase · Algorithms',
    description:
      'A mobile expense-sharing application for group trips, with live balances and graph-based settlement optimization to reduce unnecessary repayment transactions.',
    techStack: ['Flutter', 'Dart', 'Firebase', 'Graph Algorithms'],
    metrics: ['Real-time sync', 'Debt simplification', 'Mobile application'],
    githubUrl: 'https://github.com/rohk30/Own-Splitwise-Copy',
    featured: true,
    image: '/images/projects/splitwise.jpeg',
    caseStudy: true,
    liveUrl: 'https://splitwise-own.web.app',
    deepDive: 'This app solves the common pain of splitting expenses during group trips. Built with Flutter and backed by Firebase for real-time data sync, it lets users log expenses, tag participants, and see live running balances. The core algorithm uses graph-based debt simplification — modeling the group\'s debts as a directed graph and reducing the number of transactions needed to settle up. Instead of everyone paying everyone else back individually, the app computes the minimal set of transfers. It supports multiple groups, expense categories, and works offline with local caching that syncs when connectivity returns.',
  },
  {
    id: 'flashcard-generator',
    title: 'Flashcard Generator from PDF',
    eyebrow: 'Developer Tool · Parsing · Anki',
    description:
      'A personal Streamlit tool that turns GRE vocabulary PDFs into synchronized Anki flashcards through robust parsing, throttled imports and extensible content-extraction hooks.',
    techStack: ['Python', 'Streamlit', 'Anki', 'PDF Parsing'],
    metrics: ['Personal project', 'GRE vocabulary workflow', 'Anki sync'],
    githubUrl: 'https://github.com/rohk30/Flashcard-Generator-from-PDF',
    featured: true,
    image: '/images/projects/flashcard-generator.png',
    caseStudy: true,
    deepDive: 'Born out of GRE prep frustration, this tool automates the tedious process of turning vocabulary PDFs into Anki flashcards. It parses structured PDF content (word, definition, example sentence) using regex-based extraction hooks, handles edge cases like multi-line definitions and special characters, and outputs Anki-compatible decks. The Streamlit interface lets you preview cards before import, adjust extraction rules, and batch-process multiple PDFs. Throttled imports prevent Anki\'s rate limiter from blocking the sync. Built as a personal productivity tool but designed to be extensible for other PDF-to-flashcard workflows beyond GRE vocab.',
  },
  {
    id: 'face-emotions',
    title: 'Face Emotion Classification',
    eyebrow: 'Computer Vision · CNN',
    description:
      'A face-emotion detection model that classifies happy, sad, angry, disgust, surprise, fear and neutral expressions.',
    techStack: ['Python', 'Keras', 'CNN', 'OpenCV'],
    metrics: ['7 emotion classes', 'Keras model', 'Face detection'],
    githubUrl: 'https://github.com/rohk30/FaceEmotionsDetection',
    featured: false,
    image: '/images/projects/face-emotion-classification.jpeg',
    caseStudy: false,
    deepDive: 'A convolutional neural network built with Keras that classifies facial expressions into seven emotion categories: happy, sad, angry, disgust, surprise, fear and neutral. OpenCV handles face detection from webcam or image input, cropping and normalizing the face region before feeding it to the CNN. The model was trained on the FER-2013 dataset and uses data augmentation to handle class imbalance. Useful as a building block for applications like mood-aware interfaces, accessibility tools, or interactive installations that respond to user emotions in real time.',
  },
  {
    id: 'mynotes',
    title: 'MyNotes',
    eyebrow: 'Flutter · Personal Project',
    description:
      'One of my first Flutter projects — a simple notes application that marks the beginning of my mobile-development journey.',
    techStack: ['Flutter', 'Dart'],
    metrics: ['First Flutter project', 'Personal milestone'],
    githubUrl: 'https://github.com/rohk30/Rohit-Notes2',
    featured: false,
    image: '/images/projects/my-notes-app.png',
    caseStudy: false,
    liveUrl: 'rohit-notes.web.app',
    deepDive: 'MyNotes is a clean, minimal note-taking app built with Flutter as a hands-on learning project. It supports creating, editing and deleting notes with a responsive Material Design interface. The app was my entry point into cross-platform mobile development — learning Flutter\'s widget tree, state management patterns, and the Dart language. While simple in scope, it laid the foundation for more complex Flutter projects like the Group Expense Splitter that followed.',
  },
  {
    id: 'tic-tac-toe',
    title: 'Java Tic-Tac-Toe',
    eyebrow: 'Java · Foundations',
    description:
      'A Tic-Tac-Toe game built from scratch in Java with graphics — an early project that captures the beginning of my programming journey.',
    techStack: ['Java'],
    metrics: ['Built from scratch', 'Early project'],
    githubUrl: 'https://github.com/rohk30/Tic-Tac-Toe',
    featured: false,
    image: '/images/projects/tic-tac-toe-logo.jpeg',
    caseStudy: false,
    deepDive: 'A classic Tic-Tac-Toe game implemented in Java with a graphical interface — one of my earliest programming projects. Features a two-player mode with turn tracking, win/draw detection, and a reset mechanism. Built entirely from scratch using Java\'s Swing library for the GUI, it was an exercise in understanding event-driven programming, game state management, and rendering logic. It represents the starting point of my journey into software development.',
  },
];

export const researchData = [
  {
    id: 'sickle-cell-research',
    title: '4-Phase Sickle Cell Prediction',
    authors: ['Rohit Kumar Birakayala + 2'],
    venue: 'Independent research / Final-year project',
    date: '2025',
    abstract:
      'Research-driven medical imaging pipeline combining cell segmentation, morphological feature extraction, dimensionality reduction, GMM clustering and image-level classification into sickle & non-sickled cells.',
    publicationUrl: null,
    codeUrl: null,
    category: 'preprint',
    citationCount: 0,
    status: 'ongoing',
  },
  {
    id: 'confidence-based-tool-routing',
    title: 'Confidence Based Tool Routing for Agents',
    authors: ['Rohit Kumar Birakayala + 2'],
    venue: 'Independent research ',
    date: '2026',
    abstract:
      "LLM agents often call external tools (search, calculator, code execution) even when they already know the answer, wasting cost and time. This project uses the internal + external confidence as a gate: high confidence means answer directly, low confidence means call a tool. The goal is to find one confidence signal that works across all tool types and measure the cost-accuracy tradeoff using a custom metric (Cost Per Successful Task).",
    publicationUrl: null,
    codeUrl: null,
    category: 'technical-report',
    citationCount: 0,
    status: 'ongoing',
  }
];

export const personalData = {
  education: {
    institution: 'Vellore Institute of Technology',
    degree: 'B.Tech',
    specialization: 'Computer Science with Data Science',
    dateRange: 'Sept 2022 - Jun 2026',
    gpa: '9.47',
    futurePlans: "Master's applications for Fall 2027",
  },
  leadership: {
    role: 'Vice Chairperson',
    organization: 'Juvenile Care NGO, VIT',
    impact: '1000+ attendees served',
  },
  hobbies: {
    narrative:
      'Away from code, I like being active, travelling and competing. Cricket, tennis and football are constants, and sport has been a big part of how I approach competition, discipline and teamwork.',
    travelPhotos: [hobbiesPhoto],
    interests: ['Travel', 'Exploring', 'Cricket', 'Tennis', 'Badminton', 'State-level athletics'],
  },
};

export const contactData = {
  email: 'rohitkumar.birakayala@gmail.com',
  linkedIn: 'https://www.linkedin.com/in/rohit-kumar-birakayala-56a743257/',
  github: 'rohk30',
  resumePath: '/docs/rohit-kumar-birakayala.pdf',
};
