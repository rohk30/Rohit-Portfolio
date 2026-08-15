import { forwardRef } from 'react';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';
import { experienceBrandData } from '../../utils/data';

/**
 * ExperienceCard Component
 * 
 * Displays a single work experience entry with role, company, location, date,
 * bullet points, tech stack badges, and highlighted metrics.
 * Uses forwardRef to enable scrolling from Timeline component.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.experience - Experience data object
 * @param {string} props.experience.id - Unique identifier
 * @param {string} props.experience.role - Job title/role
 * @param {string} props.experience.company - Company name
 * @param {string} props.experience.location - Work location
 * @param {string} props.experience.date - Date range (e.g., "Jan 2026 - Present")
 * @param {string[]} props.experience.bullets - Array of bullet points describing work
 * @param {string[]} props.experience.techStack - Array of technologies used
 * @param {Array<{value: string, description: string}>} [props.experience.metrics] - Key metrics to highlight
 * @param {boolean} [props.isActive=false] - Whether this card is currently highlighted
 * 
 * Requirements: 3.2, 3.5, 3.7
 * 
 * @example
 * <ExperienceCard 
 *   experience={{
 *     id: 'gracenote',
 *     role: 'Data Scientist Intern',
 *     company: 'Gracenote, Nielsen',
 *     location: 'Bengaluru, India',
 *     date: 'Jan 2026 - Present',
 *     bullets: ['Improved precision...', 'Performed DSPY...'],
 *     techStack: ['Python', 'DSPy', 'Claude'],
 *     metrics: [{ value: '87%', description: 'precision improvement' }]
 *   }}
 *   isActive={true}
 * />
 */
const ExperienceCard = forwardRef(function ExperienceCard(
  { experience, isActive = false },
  ref
) {
  const {
    role = 'Unknown Role',
    company = 'Unknown Company',
    location = '',
    date = '',
    bullets = [],
    techStack = [],
    metrics = []
  } = experience ?? {};

  const companyBrand = experienceBrandData[experience?.id] ?? null;

  // Active state styling - adds blue border and subtle glow
  const activeStyles = isActive
    ? 'border-[var(--accent-teal)]/50 shadow-[rgba(45,212,191,0.12)] ring-1 ring-[var(--accent-teal)]/20'
    : '';

  /**
   * Highlights metric values (percentages, numbers) in blue within bullet text.
   * Metrics are identified from the metrics array or by common patterns.
   * 
   * @param {string} text - Bullet point text
   * @returns {React.ReactNode} Text with highlighted metrics
   */
  const highlightMetrics = (text) => {
    // Collect all metric values to highlight
    const metricValues = metrics.map(m => m.value);
    
    // Pattern to match: percentages, numbers with units, or explicit metric values
    // Examples: "87%", "48%", "10k+", "500+"
    const metricPattern = /(\d+\.?\d*%|\d+k?\+?)/gi;
    
    // Split text by metric patterns and highlight matches
    const parts = text.split(metricPattern);
    
    return parts.map((part, index) => {
      // Check if this part matches a metric pattern or is in our metrics array
      const isMetric = metricPattern.test(part) || metricValues.includes(part);
      // Reset regex lastIndex after test
      metricPattern.lastIndex = 0;
      
      if (isMetric) {
        return (
          <span key={index} className="text-[var(--accent-lime)] font-semibold">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <GlassCard
      ref={ref}
      as="article"
      className={`p-6 transition-all duration-300 ${activeStyles}`}
    >
      {/* Header: Role and Date */}
      <div className="experience-card-heading">
        <div className="experience-company-identity">
          {companyBrand && (
            <div className="experience-company-logo" style={{ '--company-color': companyBrand.color }}>
              {companyBrand.logoUrl ? (
                <img
                  src={companyBrand.logoUrl}
                  alt={`${companyBrand.name} logo`}
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                    event.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <span className={`${companyBrand.logoUrl ? 'hidden ' : ''}company-logo-fallback`}>
                {companyBrand.fallback}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-white">{role}</h2>
            <div className="experience-company-line">
              <span>{company}</span>
              {location && <span>• {location}</span>}
            </div>
          </div>
        </div>
        <span className="text-sm text-gray-400 whitespace-nowrap">{date}</span>
      </div>

      {/* Bullet Points */}
      {bullets.length > 0 && (
        <ul className="space-y-2 mb-5">
          {bullets.map((bullet, index) => (
            <li
              key={index}
              className="text-gray-300 text-sm leading-relaxed flex items-start gap-2"
            >
              <span className="text-blue-400 mt-1.5 flex-shrink-0">•</span>
              <span>{highlightMetrics(bullet)}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Tech Stack Badges */}
      {techStack.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, index) => (
            <Badge key={index} text={tech} variant="default" size="sm" />
          ))}
        </div>
      )}

      {/* Metrics Summary (if metrics exist, show as highlighted badges) */}
      {metrics.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex flex-wrap gap-3">
            {metrics.map((metric, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-[var(--accent-lime)] font-bold text-lg">
                  {metric.value}
                </span>
                <span className="text-gray-400 text-sm">
                  {metric.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
});

export default ExperienceCard;
