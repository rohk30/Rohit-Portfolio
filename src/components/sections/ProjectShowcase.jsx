import { ArrowUpRight, GitBranch, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const featured = projectData.filter((project) => project.featured);

  const handleCardClick = (e, project) => {
    // If the user clicked the GitHub link specifically, let it handle itself
    if (e.target.closest('a[href]')) return;
    navigate(`/projects/${project.id}`);
  };

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
            className="project-showcase-card"
            key={project.id}
            onClick={(e) => handleCardClick(e, project)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(`/projects/${project.id}`);
              }
            }}
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
                <span className="project-action">
                  View project <ArrowUpRight size={15} aria-hidden="true" />
                </span>
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="project-action project-action-muted"
                    onClick={(e) => e.stopPropagation()}
                  >
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
