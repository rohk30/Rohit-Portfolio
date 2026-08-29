import { Award, Calendar, Download, GraduationCap, MapPin, Plane, Trophy, Users } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import PlayNextBallWidget from '../components/cricket/PlayNextBallWidget';
import { contactData, personalData } from '../utils/data';

function About() {
  const { education, leadership, hobbies } = personalData;

  return (
    <PageTransition className="portfolio-page">
      <div className="detail-container about-page">
        <div className="section-kicker">ABOUT</div>
        <div className="about-intro">
          <div>
            <h1>Engineer by craft.<br /><span>Curious by nature.</span></h1>
            <p>
              I like building things that sit at the intersection of software, data and intelligent systems. My path has moved from early Java and mobile projects into computer vision, RAG systems and production AI/ML work.
            </p>
            <a href={contactData.resumePath} download="rohit-kumar-birakayala-resume.pdf" className="button-primary"><Download size={16} /> Download resume</a>
          </div>
          <div className="about-photo-wrap">
            <img src="/images/rohit-farewell.jpeg" alt="Rohit Kumar" />
          </div>
        </div>

        <div className="about-grid">
          <section className="about-panel">
            <div className="about-panel-icon"><GraduationCap /></div>
            <span className="section-kicker">EDUCATION</span>
            <h2>{education.institution}</h2>
            <p className="about-accent">{education.degree} · {education.specialization}</p>
            <div className="about-meta"><span><Calendar size={15} /> {education.dateRange}</span><span><Award size={15} /> GPA {education.gpa}</span></div>
            <div className="about-logo-row"><img src="/images/branding/vit.png" alt="VIT logo" /><span>Vellore Institute of Technology</span></div>
          </section>

          <section className="about-panel">
            <div className="about-panel-icon"><Users /></div>
            <span className="section-kicker">LEADERSHIP</span>
            <h2>{leadership.role}</h2>
            <p className="about-accent">{leadership.organization}</p>
            <div className="about-impact"><strong>500+</strong><span>attendees across 10+ events</span></div>
            <div className="about-logo-row"><img src="/images/branding/juvenile-care.png" alt="Juvenile Care NGO logo" /><span>Community & volunteer work</span></div>
          </section>

          <section className="about-panel about-panel-wide">
            <div className="about-panel-icon"><Trophy /></div>
            <span className="section-kicker">BEYOND CODE</span>
            <h2>{hobbies.interests.join(' · ')}</h2>
            <p>{hobbies.narrative}</p>
            <div className="about-interest-row">
              <span><Trophy size={15} /> State-level athlete</span>
              <span><Plane size={15} /> Travel</span>
              <span><MapPin size={15} /> Bengaluru</span>
            </div>
          </section>
        </div>
      </div>

      {/* Cricket-themed navigation widget */}
      <PlayNextBallWidget currentPath="/about" />
    </PageTransition>
  );
}

export default About;
