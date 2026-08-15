import { ArrowLeft, GitBranch, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { projectData } from '../utils/data';

function ProjectDetails() {
  const { projectId } = useParams();
  const project = projectData.find((item) => item.id === projectId);

  if (!project) {
    return (
      <PageTransition className="portfolio-page">
        <div className="detail-container empty-detail">
          <p className="section-kicker">PROJECT NOT FOUND</p>
          <h1>That project isn't in the portfolio yet.</h1>
          <Link to="/projects" className="button-primary"><ArrowLeft size={16} /> Back to projects</Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="portfolio-page">
      <div className="detail-container">
        <Link to="/projects" className="back-link"><ArrowLeft size={16} /> All projects</Link>
        <div className="detail-kicker">{project.eyebrow}</div>
        <div className="detail-header-grid">
          <div>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <div className="detail-actions">
              {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="button-primary"><GitBranch size={16} /> GitHub</a>}
              <span className="detail-status"><Sparkles size={15} /> Case study foundation</span>
            </div>
          </div>
          <div className="detail-visual">
            {project.id === 'signsentry' ? (
              <video className="detail-video" controls muted playsInline preload="metadata" poster={project.image || undefined}>
                <source src="/videos/signsentry-demo.mp4" type="video/mp4" />
              </video>
            ) : project.image ? (
              <img src={project.image} alt={`${project.title} preview`} />
            ) : (
              <div className="project-placeholder"><Sparkles /><span>Project visual coming soon</span></div>
            )}
          </div>
        </div>

        <div className="detail-content-grid">
          <section className="detail-panel">
            <span className="section-kicker">TECHNOLOGY</span>
            <div className="detail-tech-list">
              {project.techStack.map((tech) => <span key={tech}>{tech}</span>)}
            </div>
          </section>
          <section className="detail-panel">
            <span className="section-kicker">HIGHLIGHTS</span>
            <div className="detail-highlight-list">
              {project.metrics.map((metric) => <div key={metric}>{metric}</div>)}
            </div>
          </section>
        </div>

        <section className="detail-story-placeholder">
          <div className="section-kicker">DEEP DIVE</div>
          <h2>The detailed story comes next.</h2>
          <p>
            This route is intentionally established now so major projects can grow into full case studies with architecture diagrams, experiments, decisions, results and media without changing the portfolio's routing model.
          </p>
          <div className="detail-placeholder-grid">
            <div><span>01</span> Problem & context</div>
            <div><span>02</span> Architecture & approach</div>
            <div><span>03</span> Experiments & results</div>
            <div><span>04</span> What I learned</div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

export default ProjectDetails;
