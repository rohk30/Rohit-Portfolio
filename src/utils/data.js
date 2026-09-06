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
    liveUrl: 'https://splitwise-own.web.app'
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
