import { ArrowRight, GitBranch, Globe, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import CompanyLogoStrip from '../components/sections/CompanyLogoStrip';
import ProjectShowcase from '../components/sections/ProjectShowcase';
import PlayNextBallWidget from '../components/cricket/PlayNextBallWidget';
import { experienceData, personalData, contactData } from '../utils/data';
import overviewPhoto from '../assets/images/rohit-graduation-overview.jpeg';
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
        {/* <span className="skill-note">logos over labels</span> */}
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
        <p>Working across AI/ML, intelligent retrieval and production systems.</p>
        <div className="currently-exploring">
          <span>Currently exploring</span>
          <strong>AI × software × systems</strong>
        </div>
      </div>
      <div className="currently-photo">
        <img src={overviewPhoto} alt="Rohit Kumar at graduation" />
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
        {experienceData.map((experience, index) => {
          const nextExp = experienceData[index + 1];
          const isPromotionSource = nextExp && nextExp.companyShort === experience.companyShort;
          const prevExp = experienceData[index - 1];
          const isPromotionTarget = prevExp && prevExp.companyShort === experience.companyShort;

          return (
            <div key={`${experience.id}-${index}`} className="experience-preview-group">
              {isPromotionTarget && (
                <div className="experience-promotion-connector" aria-hidden="true">
                  <div className="experience-promotion-line" />
                  <span className="experience-promotion-badge">
                    <ArrowRight size={13} style={{ transform: 'rotate(-90deg)' }} />
                    <span style={{ fontSize: '1.15rem' }}>CONVERTED</span>
                  </span>
                  <div className="experience-promotion-line" />
                </div>
              )}
              <Link to="/experience" state={{ scrollTo: experience.id }} className={`experience-preview-item ${isPromotionSource || isPromotionTarget ? 'experience-preview-item--connected' : ''}`}>
                <span className="experience-year">0{index + 1}</span>
                <div className="experience-role">
                  <strong style={{ fontSize: '1.25rem' }}>{experience.role}</strong>
                  <span style={{ fontSize: '1.15rem' }}>{experience.company}</span>
                </div>
                <span className="experience-date">{experience.date}</span>
                <ArrowRight className="experience-arrow" size={18} aria-hidden="true" />
              </Link>
            </div>
          );
        })}
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
      <div className="beyond-photo">
        {personalData.hobbies.travelPhotos?.[0] && (
          <img src={personalData.hobbies.travelPhotos[0]} alt="Hobbies and travel" />
        )}
      </div>
    </section>
  );
}

function Overview() {
  return (
    <PageTransition className="portfolio-page">
      <div className="home-container">
        <Currently />
        <CompanyLogoStrip />
        <SkillMarquee />
        <ProjectShowcase />
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
      <PlayNextBallWidget currentPath="/overview" />
    </PageTransition>
  );
}

export default Overview;
