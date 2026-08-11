import { useState } from 'react';
import { ExternalLink, GitBranch, Star, ImageOff } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';

/**
 * ProjectCard Component
 * 
 * Displays a project with title, description, tech stack badges, and metrics.
 * Clicking the card opens the GitHub URL in a new tab.
 * Supports a featured styling variant for prominent projects.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.project - Project data object
 * @param {string} props.project.id - Unique identifier
 * @param {string} props.project.title - Project title
 * @param {string} props.project.description - Project description
 * @param {string[]} props.project.techStack - Array of technology names
 * @param {string[]} [props.project.metrics] - Array of metric strings
 * @param {string} props.project.githubUrl - GitHub repository URL
 * @param {boolean} [props.project.featured] - Whether this is a featured project
 * @param {string} [props.project.image] - Optional project image path
 * 
 * @example
 * <ProjectCard project={{
 *   id: 'my-project',
 *   title: 'My Project',
 *   description: 'A great project',
 *   techStack: ['React', 'Node.js'],
 *   metrics: ['100+ users'],
 *   githubUrl: 'https://github.com/user/repo',
 *   featured: true
 * }} />
 * 
 * Validates: Requirements 4.3, 4.4
 */
function ProjectCard({ project }) {
  const [imageError, setImageError] = useState(false);
  
  const {
    title = 'Untitled Project',
    description = '',
    techStack = [],
    metrics = [],
    githubUrl,
    featured = false,
    image,
  } = project ?? {};

  /**
   * Handle card click to open GitHub URL in new tab
   * Property 5: Project Card Click Opens GitHub URL
   */
  const handleClick = () => {
    if (githubUrl) {
      window.open(githubUrl, '_blank', 'noopener,noreferrer');
    }
  };

  /**
   * Handle image load error - show fallback placeholder
   * Graceful degradation for failed image loads
   */
  const handleImageError = () => {
    setImageError(true);
  };

  // Featured projects get additional styling
  const featuredClasses = featured
    ? 'ring-2 ring-blue-400/30 bg-gradient-to-br from-slate-900/60 to-blue-900/20'
    : '';

  return (
    <GlassCard
      as="article"
      hover
      onClick={githubUrl ? handleClick : undefined}
      className={`p-6 h-full flex flex-col ${featuredClasses}`}
      aria-label={`Project: ${title}. ${githubUrl ? 'Click to open GitHub repository.' : ''}`}
    >
      {/* Featured badge */}
      {featured && (
        <div className="flex items-center gap-1.5 mb-3">
          <Star className="w-4 h-4 text-blue-400 fill-blue-400" aria-hidden="true" />
          <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">
            Featured Project
          </span>
        </div>
      )}

      {/* Project image (if provided) */}
      {image && (
        <div className="mb-4 -mx-6 -mt-6 rounded-t-2xl overflow-hidden">
          {imageError ? (
            /* Image fallback placeholder when load fails */
            <div 
              className="w-full h-40 bg-slate-800/50 flex flex-col items-center justify-center gap-2"
              aria-label="Image unavailable"
            >
              <ImageOff className="w-8 h-8 text-gray-500" aria-hidden="true" />
              <span className="text-xs text-gray-500">Image unavailable</span>
            </div>
          ) : (
            <img
              src={image}
              alt={`${title} project screenshot`}
              className="w-full h-40 object-cover"
              loading="lazy"
              onError={handleImageError}
            />
          )}
        </div>
      )}

      {/* Title with GitHub icon indicator */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="text-lg font-semibold text-white leading-tight">
          {title}
        </h2>
        {githubUrl && (
          <div className="flex items-center gap-1 text-gray-400 flex-shrink-0">
            <GitBranch className="w-4 h-4" aria-hidden="true" />
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-grow">
          {description}
        </p>
      )}

      {/* Metrics */}
      {metrics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {metrics.map((metric, index) => (
            <Badge
              key={`metric-${index}`}
              text={metric}
              variant="accent"
              size="sm"
            />
          ))}
        </div>
      )}

      {/* Tech Stack */}
      {techStack.length > 0 && (
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, index) => (
              <Badge
                key={`tech-${index}`}
                text={tech}
                variant="default"
                size="sm"
              />
            ))}
          </div>
        </div>
      )}

      {/* Visual click hint for clickable cards */}
      {githubUrl && (
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-gray-400 text-xs">
          <span>View on GitHub</span>
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </div>
      )}
    </GlassCard>
  );
}

export default ProjectCard;
