import { useState } from 'react';
import { ExternalLink, GitBranch, ImageOff, Star, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';

function ProjectCard({ project }) {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const {
    id,
    title = 'Untitled Project',
    eyebrow = '',
    description = '',
    techStack = [],
    metrics = [],
    githubUrl,
    featured = false,
    image,
    caseStudy = false,
  } = project ?? {};

  const handleClick = () => {
    if (caseStudy && id) {
      navigate(`/projects/${id}`);
      return;
    }
    if (githubUrl) window.open(githubUrl, '_blank', 'noopener,noreferrer');
  };

  const isInteractive = Boolean(caseStudy || githubUrl);

  return (
    <GlassCard
      as="article"
      hover={isInteractive}
      onClick={isInteractive ? handleClick : undefined}
      className={`project-card-updated p-0 h-full flex flex-col ${featured ? 'project-card-featured' : ''}`}
      aria-label={`Project: ${title}`}
    >
      {image ? (
        <div className="project-card-image">
          {imageError ? (
            <div className="project-placeholder"><ImageOff /><span>Image unavailable</span></div>
          ) : (
            <img src={image} alt={`${title} preview`} loading="lazy" onError={() => setImageError(true)} />
          )}
        </div>
      ) : (
        <div className="project-card-image project-card-image-placeholder">
          <div className="placeholder-grid" />
          <span>Visual coming soon</span>
        </div>
      )}

      <div className="project-card-updated-body">
        {featured && <div className="project-featured-label"><Star size={13} fill="currentColor" /> Featured</div>}
        {eyebrow && <div className="project-card-eyebrow">{eyebrow}</div>}
        <div className="project-title-row">
          <h2>{title}</h2>
          {caseStudy ? <ArrowUpRight size={19} className="project-card-arrow" aria-hidden="true" /> : githubUrl ? <GitBranch size={17} aria-hidden="true" /> : null}
        </div>
        <p>{description}</p>

        {metrics.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {metrics.map((metric) => <Badge key={metric} text={metric} variant="accent" size="sm" />)}
          </div>
        )}

        <div className="project-card-updated-footer">
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => <Badge key={tech} text={tech} variant="default" size="sm" />)}
          </div>
          <span className="project-card-link-label">
            {caseStudy ? 'View case study' : githubUrl ? 'View GitHub' : 'Project'}
            {isInteractive && (caseStudy ? <ArrowUpRight size={14} /> : <ExternalLink size={14} />)}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}

export default ProjectCard;
