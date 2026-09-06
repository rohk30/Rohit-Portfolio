import { Award, Briefcase, Calendar, Download, FileDown, GitBranch, GraduationCap, Mail, MapPin, Plane, Trophy, Users } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import PlayNextBallWidget from '../components/cricket/PlayNextBallWidget';
import { contactData, personalData } from '../utils/data';

/**
 * About + Contact — Two-column split page
 *
 * Left column:  Scrollable about content (intro, education, leadership, hobbies)
 * Right column: Sticky contact card (always visible as user scrolls)
 *
 * On mobile (<900px) the columns stack vertically: about first, contact below.
 */
function About() {
  const { education, leadership, hobbies } = personalData;
  const {
    email = '',
    linkedIn = '',
    github = '',
    resumePath = '',
  } = contactData ?? {};

  return (
    <PageTransition className="portfolio-page">
      <div className="about-split">

        {/* ── Left column: About (scrolls independently) ── */}
        <div className="about-split__left">
          <div className="section-kicker">ABOUT</div>

          {/* Hero intro */}
          <div className="about-intro">
            <div>
              <h1>Engineer by craft.<br /><span>Curious by nature.</span></h1>
              <p>
                I like building things that sit at the intersection of software, data and intelligent systems.
                My path has moved from early Java and mobile projects into computer vision, RAG systems and production AI/ML work.
              </p>
              <a
                href={resumePath}
                download="rohit-kumar-birakayala-resume.pdf"
                className="button-primary"
              >
                <Download size={16} /> Download resume
              </a>
            </div>
            <div className="about-photo-wrap">
              <img src="/images/rohit-farewell.jpeg" alt="Rohit Kumar" />
            </div>
          </div>

          {/* Info panels */}
          <div className="about-grid">
            <section className="about-panel">
              <div className="about-panel-icon"><GraduationCap /></div>
              <span className="section-kicker">EDUCATION</span>
              <h2>{education.institution}</h2>
              <p className="about-accent">{education.degree} · {education.specialization}</p>
              <div className="about-meta">
                <span><Calendar size={15} /> {education.dateRange}</span>
                <span><Award size={15} /> GPA {education.gpa}</span>
              </div>
              <div className="about-logo-row">
                <img src="/images/branding/vit.png" alt="VIT logo" />
                <span>Vellore Institute of Technology</span>
              </div>
            </section>

            <section className="about-panel">
              <div className="about-panel-icon"><Users /></div>
              <span className="section-kicker">LEADERSHIP</span>
              <h2>{leadership.role}</h2>
              <p className="about-accent">{leadership.organization}</p>
              <div className="about-impact">
                <strong>1000+</strong>
                <span>attendees across 20+ events</span>
              </div>
              <div className="about-logo-row">
                <img src="/images/branding/juvenile-care.png" alt="Juvenile Care NGO logo" />
                <span>Community & volunteer work</span>
              </div>
            </section>

            <section className="about-panel about-panel-wide">
              <div className="about-panel-icon"><Trophy /></div>
              <span className="section-kicker">BEYOND CODE</span>
              <h2>{hobbies.interests.join(' · ')}</h2>
              <div className="about-beyond-split">
                <div>
                  <p>{hobbies.narrative}</p>
                  <div className="about-interest-row">
                    <span><Trophy size={15} /> State-level athletics</span>
                    <span><Plane size={15} /> Travel</span>
                    <span><MapPin size={15} /> Bengaluru</span>
                  </div>
                </div>
                {hobbies.travelPhotos?.[0] && (
                  <div className="about-beyond-photo">
                    <img src={hobbies.travelPhotos[0]} alt="Hobbies and travel" />
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* ── Right column: Contact (sticky) ── */}
        <div className="about-split__right">
          <div className="about-contact-sticky">
            <GlassCard className="about-contact-card">
              <h2 className="about-contact-card__title">Get in Touch</h2>
              <p className="about-contact-card__subtitle">
                Feel free to reach out for collaborations, opportunities, or just to say hello.
              </p>

              <div className="about-contact-card__links">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="about-contact-card__link"
                    aria-label={`Send email to ${email}`}
                  >
                    <Mail size={18} />
                    <span>{email}</span>
                  </a>
                )}

                {linkedIn && (
                  <a
                    href={linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-contact-card__link"
                    aria-label="Visit LinkedIn profile"
                  >
                    <Briefcase size={18} />
                    <span>LinkedIn Profile</span>
                  </a>
                )}

                {github && (
                  <a
                    href={`https://github.com/${github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-contact-card__link"
                    aria-label={`Visit GitHub profile ${github}`}
                  >
                    <GitBranch size={18} />
                    <span>github.com/{github}</span>
                  </a>
                )}
              </div>

              {resumePath && (
                <a
                  href={resumePath}
                  download="rohit-kumar-birakayala-resume.pdf"
                  className="button-primary about-contact-card__resume"
                >
                  <FileDown size={18} />
                  Download Resume
                </a>
              )}
            </GlassCard>
          </div>
        </div>
      </div>

      <PlayNextBallWidget currentPath="/about" />
    </PageTransition>
  );
}

export default About;
