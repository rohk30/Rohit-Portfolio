import { ArrowDown, ArrowRight, Download, GitBranch, Globe, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import CompanyLogoStrip from '../components/sections/CompanyLogoStrip';
import ProjectShowcase from '../components/sections/ProjectShowcase';
import { experienceData, personalData, contactData } from '../utils/data';
import {
  SiPython,
  SiJavascript,
  SiReact,
  SiTensorflow,
  SiPytorch,
  SiDocker,
  SiGit,
  SiFlutter,
  SiDart,
  SiPostgresql,
  SiFirebase,
  SiMongodb,
  SiCplusplus,
  SiFastapi,
} from 'react-icons/si';
import { FaJava, FaAws } from 'react-icons/fa';
import { TbBrain } from 'react-icons/tb';

const skillIcons = [
  { name: 'Python', icon: SiPython, color: '#3776AB' },
  { name: 'Java', icon: FaJava, color: '#ED8B00' },
  { name: 'C++', icon: SiCplusplus, color: '#5C9BD5' },
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'Flutter', icon: SiFlutter, color: '#54C5F8' },
  { name: 'Dart', icon: SiDart, color: '#0175C2' },
  { name: 'TensorFlow', icon: SiTensorflow, color: '#FF6F00' },
  { name: 'PyTorch', icon: SiPytorch, color: '#EE4C2C' },
  { name: 'DSPy', icon: TbBrain, color: '#B8F34A' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
  { name: 'Firebase', icon: SiFirebase, color: '#FFCA28' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
  { name: 'FastAPI', icon: SiFastapi, color: '#00BFA5' },
  { name: 'AWS', icon: FaAws, color: '#FF9900' },
  { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  { name: 'Git', icon: SiGit, color: '#F05032' },
];


function SkillMarquee() {
  const duplicated = [...skillIcons, ...skillIcons];
  return (
    <section className="home-section skill-section" aria-labelledby="skills-heading">
      <div className="section-heading-row skill-heading-row">
        <div>
          <div className="section-kicker">TOOLS OF THE TRADE</div>
          <h2 id="skills-heading" className="section-title compact-title">A toolkit that keeps evolving.</h2>
        </div>
        <span className="skill-note">logos over labels</span>
      </div>
      <div className="skill-marquee-shell">
        <div className="skill-marquee">
          {duplicated.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <div className="skill-logo" key={`${skill.name}-${index}`} title={skill.name} aria-label={skill.name}>
                <div className="skill-logo-inner">
                  <Icon style={{ color: skill.color }} aria-hidden="true" />
                  <span>{skill.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Currently() {
  return (
    <section className="currently-section home-section" aria-labelledby="currently-heading">
      <div className="currently-copy">
        <div className="section-kicker">CURRENTLY</div>
        <h2 id="currently-heading">Software Engineer @ Nielsen</h2>
        <p>Working across AI/ML, intelligent retrieval and production systems.</p>
        <div className="currently-exploring">
          <span>Currently exploring</span>
          <strong>AI × software × systems</strong>
        </div>
      </div>
      <div className="currently-metrics">
        <div className="mini-metric">
          <strong>48 → 87%</strong>
          <span>version-match precision</span>
        </div>
        <div className="mini-metric">
          <strong>10k+</strong>
          <span>production records indexed</span>
        </div>
        <div className="mini-metric">
          <strong>25%+</strong>
          <span>editor violation reduction</span>
        </div>
      </div>
    </section>
  );
}

function ExperiencePreview() {
  return (
    <section className="home-section experience-preview" aria-labelledby="experience-preview-heading">
      <div className="section-heading-row">
        <div>
          <div className="section-kicker">EXPERIENCE</div>
          <h2 id="experience-preview-heading" className="section-title">From ML prototypes to production systems.</h2>
        </div>
        <Link to="/experience" className="section-link">Full experience <ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
      <div className="experience-preview-list">
        {experienceData.map((experience, index) => (
          <Link to="/experience" className="experience-preview-item" key={experience.id}>
            <span className="experience-year">0{index + 1}</span>
            <div className="experience-role">
              <strong>{experience.role}</strong>
              <span>{experience.company}</span>
            </div>
            <span className="experience-date">{experience.date}</span>
            <ArrowRight className="experience-arrow" size={18} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function BeyondCode() {
  return (
    <section className="home-section beyond-code" aria-labelledby="beyond-code-heading">
      <div className="beyond-copy">
        <div className="section-kicker">BEYOND CODE</div>
        <h2 id="beyond-code-heading" className="section-title">Competitive by nature. Curious by choice.</h2>
        <p>{personalData.hobbies.narrative}</p>
        <div className="interest-row">
          {personalData.hobbies.interests.map((interest) => <span key={interest}>{interest}</span>)}
        </div>
      </div>
      <div className="beyond-photo-placeholder">
        <span>Travel / sport photos</span>
        <small>More personal imagery coming soon</small>
      </div>
    </section>
  );
}

function Home() {
  return (
    <PageTransition className="portfolio-page">
      <div className="ambient-field" aria-hidden="true" />
      <div className="home-container">
        <section className="hero-section">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <div className="hero-kicker"><span className="status-dot" /> Software Engineer · AI/ML · Builder</div>
            <h1>Rohit Kumar<span className="hero-period">.</span></h1>
            <p className="hero-role">Software Engineer @ Nielsen</p>
            <p className="hero-description">
              I build serious systems across AI/ML, intelligent retrieval and software engineering — and I like trying things that haven't been built quite the same way before.
            </p>
            <div className="hero-actions">
              <Link to="/projects" className="button-primary">Explore my work <ArrowRight size={17} /></Link>
              <a href={contactData.resumePath} download="rohit-kumar-birakayala-resume.pdf" className="button-secondary"><Download size={16} /> Resume</a>
            </div>
            <div className="hero-meta">
              <span><MapPin size={14} /> Bengaluru, India</span>
              <span>Open to ambitious problems</span>
            </div>
          </motion.div>

          <motion.div
            className="hero-portrait-wrap"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          >
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-portrait-card">
              <img src="/images/rohit-farewell.jpeg" alt="Rohit Kumar" />
              <div className="portrait-caption">
                <span>RKB / 2026</span>
                <span>BUILD · LEARN · SHIP</span>
              </div>
            </div>
            <div className="hero-floating-card hero-floating-top">
              <span className="floating-label">FOCUS</span>
              <strong>AI × Software × Systems</strong>
            </div>
            <div className="hero-floating-card hero-floating-bottom">
              <span className="floating-label">EDUCATION</span>
              <strong>VIT · 9.5 GPA</strong>
            </div>
          </motion.div>
        </section>

        <div className="hero-scroll-hint"><ArrowDown size={15} /> Scroll to explore</div>

        <Currently />
        <CompanyLogoStrip />
        <ProjectShowcase />
        <SkillMarquee />
        <ExperiencePreview />
        <BeyondCode />

        <section className="home-section final-cta" aria-labelledby="home-cta-heading">
          <div>
            <div className="section-kicker">LET'S CONNECT</div>
            <h2 id="home-cta-heading">Have an ambitious idea?</h2>
            <p>I'd love to hear about it.</p>
          </div>
          <div className="final-cta-actions">
            <a href={`mailto:${contactData.email}`} className="button-primary"><Mail size={17} /> Email me</a>
            <a href={contactData.linkedIn} target="_blank" rel="noreferrer" className="button-secondary"><Globe size={17} /> LinkedIn</a>
            <a href={`https://github.com/${contactData.github}`} target="_blank" rel="noreferrer" className="button-secondary"><GitBranch size={17} /> GitHub</a>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

export default Home;
