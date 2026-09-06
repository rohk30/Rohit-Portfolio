import nielsenFullLogo from '../assets/images/experiences/Nielsen_full.png';
import ubsFullLogo from '../assets/images/experiences/UBS_full.png';
import talentRecruitFullLogo from '../assets/images/experiences/TR_full.png';
import nielsenSmallLogo from '../assets/images/experiences/Nielsen_logo.png';
import ubsSmallLogo from '../assets/images/experiences/UBS_logo.png';
import talentRecruitSmallLogo from '../assets/images/experiences/TR_logo.png';

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
    id: 'nielsen',
    role: 'Data Scientist Intern',
    company: 'Gracenote, Nielsen',
    companyShort: 'Nielsen',
    location: 'Bengaluru, India',
    date: 'Jan 2026 - Present',
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
  nielsen: { logoUrl: nielsenSmallLogo, fallback: 'N', color: '#00a651' },
  ubs: { logoUrl: ubsSmallLogo, fallback: 'UBS', color: '#e60000' },
  'talent-recruit': { logoUrl: talentRecruitSmallLogo, fallback: 'TR', color: '#20b486' },
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
    githubUrl: null,
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
    githubUrl: null,
    featured: true,
    image: '/images/projects/splitwise.jpeg',
    caseStudy: true,
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
    image: null,
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
    image: null,
    caseStudy: false,
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
    image: null,
    caseStudy: false,
  },
];

export const researchData = [
  {
    id: 'sickle-cell-research',
    title: '4-Phase Sickle Cell Prediction',
    authors: ['Rohit Kumar Birakayala'],
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
    impact: '500+ attendees served',
  },
  hobbies: {
    narrative:
      'Away from code, I like being active, travelling and competing. Cricket, tennis and football are constants, and sport has been a big part of how I approach competition, discipline and teamwork.',
    travelPhotos: [],
    interests: ['Travel', 'Cricket', 'Tennis', 'Football', 'State-level athletics'],
  },
};

export const contactData = {
  email: 'rohitkumar.birakayala@gmail.com',
  linkedIn: 'https://www.linkedin.com/in/rohit-kumar-birakayala-56a743257/',
  github: 'rohk30',
  resumePath: '/docs/rohit-kumar-birakayala.pdf',
};
