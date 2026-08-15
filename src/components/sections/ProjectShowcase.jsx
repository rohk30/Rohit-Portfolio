import { ArrowUpRight, GitBranch, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectData } from '../../utils/data';

function ProjectVisual({ project }) {
  if (project.image) {
    return (
      <div className="project-visual">
        <img src={project.image} alt={`${project.title} preview`} loading="lazy" />
        <div className="project-visual-shine" />
      </div>
    );
  }

  return (
    <div className="project-visual project-placeholder">
      <div className="placeholder-grid" />
      <Sparkles aria-hidden="true" />
      <span>Visual coming soon</span>
    </div>
  );
}

export default function ProjectShowcase() {
  const featured = projectData.filter((project) => project.featured);

  return (
    <section className="home-section" aria-labelledby="selected-work-heading">
      <div className="section-heading-row">
        <div>
          <div className="section-kicker">SELECTED WORK</div>
          <h2 id="selected-work-heading" className="section-title">
            Things I've built, explored & shipped.
          </h2>
        </div>
        <Link to="/projects" className="section-link">
          Explore all projects <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>

      <div className="project-showcase-grid">
        {featured.map((project, index) => (
          <article
            className={`project-showcase-card ${index === 0 ? 'project-showcase-card-large' : ''}`}
            key={project.id}
          >
            <ProjectVisual project={project} />
            <div className="project-card-body">
              <div className="project-card-topline">
                <span>{project.eyebrow}</span>
                <span className="project-index">0{index + 1}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-card-actions">
                {project.caseStudy ? (
                  <Link to={`/projects/${project.id}`} className="project-action">
                    Case study <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                ) : null}
                {project.githubUrl ? (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-action project-action-muted">
                    <GitBranch size={15} aria-hidden="true" /> GitHub
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
