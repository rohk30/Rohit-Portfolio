import { ExternalLink, Code, BookOpen, FileText, Users, Calendar, Quote } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';

/**
 * PublicationCard Component
 * 
 * Displays a research publication with title, authors, venue, date, abstract,
 * citation count, publication status badge, and repository links.
 * Clicking the card opens the publication URL in a new tab.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.publication - Publication data object
 * @param {string} props.publication.id - Unique identifier
 * @param {string} props.publication.title - Publication title
 * @param {string[]} props.publication.authors - Array of author names
 * @param {string} props.publication.venue - Journal/Conference name
 * @param {string} props.publication.date - Publication date (YYYY-MM or YYYY)
 * @param {string} props.publication.abstract - Publication abstract
 * @param {string} [props.publication.publicationUrl] - URL to publication (DOI, ArXiv, etc.)
 * @param {string} [props.publication.codeUrl] - URL to code/dataset repository
 * @param {string} props.publication.category - Publication category (conference, journal, preprint, technical-report)
 * @param {number} [props.publication.citationCount] - Number of citations
 * @param {string} props.publication.status - Publication status (published, under-review, preprint)
 * 
 * **Validates: Requirements 5.3, 5.4, 5.5, 5.7**
 * 
 * @example
 * <PublicationCard publication={{
 *   id: 'pub-1',
 *   title: 'Research Paper Title',
 *   authors: ['Author One', 'Author Two'],
 *   venue: 'Conference Name',
 *   date: '2024-12',
 *   abstract: 'Brief abstract...',
 *   publicationUrl: 'https://doi.org/...',
 *   codeUrl: 'https://github.com/...',
 *   category: 'conference',
 *   citationCount: 5,
 *   status: 'published'
 * }} />
 */
function PublicationCard({ publication }) {
  const {
    title = 'Untitled Publication',
    authors = [],
    venue = '',
    date = '',
    abstract = '',
    publicationUrl,
    codeUrl,
    category = 'preprint',
    citationCount = 0,
    status = 'preprint',
  } = publication ?? {};

  /**
   * Format date string to readable format
   * Handles YYYY-MM and YYYY formats
   * @param {string} dateStr - Date string
   * @returns {string} - Formatted date
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    
    // Handle YYYY-MM format
    if (dateStr.includes('-')) {
      const [year, month] = dateStr.split('-');
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthIndex = parseInt(month, 10) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${monthNames[monthIndex]} ${year}`;
      }
      return year;
    }
    
    return dateStr;
  };

  /**
   * Get status badge configuration
   * @param {string} pubStatus - Publication status
   * @returns {Object} - Badge configuration with text and styles
   */
  const getStatusConfig = (pubStatus) => {
    const configs = {
      published: {
        text: 'Published',
        className: 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border-[var(--accent-gold)]/30',
      },
      'under-review': {
        text: 'Under Review',
        className: 'bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] border-[var(--accent-orange)]/30',
      },
      preprint: {
        text: 'Preprint',
        className: 'bg-[var(--text-soft)]/20 text-[var(--text-soft)] border-[var(--text-soft)]/30',
      },
    };
    return configs[pubStatus] || configs.preprint;
  };

  /**
   * Get category icon
   * @param {string} pubCategory - Publication category
   * @returns {JSX.Element} - Category icon component
   */
  const getCategoryIcon = (pubCategory) => {
    const icons = {
      conference: <BookOpen className="w-4 h-4" aria-hidden="true" />,
      journal: <FileText className="w-4 h-4" aria-hidden="true" />,
      preprint: <FileText className="w-4 h-4" aria-hidden="true" />,
      'technical-report': <FileText className="w-4 h-4" aria-hidden="true" />,
    };
    return icons[pubCategory] || icons.preprint;
  };

  /**
   * Format category name for display
   * @param {string} cat - Category string
   * @returns {string} - Formatted category name
   */
  const formatCategory = (cat) => {
    const categoryNames = {
      conference: 'Conference Paper',
      journal: 'Journal Article',
      preprint: 'Preprint',
      'technical-report': 'Technical Report',
    };
    return categoryNames[cat] || cat;
  };

  /**
   * Format authors list for display
   * @param {string[]} authorList - Array of author names
   * @returns {string} - Formatted author string
   */
  const formatAuthors = (authorList) => {
    if (!authorList || authorList.length === 0) return '';
    if (authorList.length === 1) return authorList[0];
    if (authorList.length === 2) return authorList.join(' and ');
    return `${authorList.slice(0, -1).join(', ')}, and ${authorList[authorList.length - 1]}`;
  };

  const statusConfig = getStatusConfig(status);
  const formattedDate = formatDate(date);
  const formattedAuthors = formatAuthors(authors);

  return (
    <GlassCard
      as="article"
      hover
      className="p-6 h-full flex flex-col"
    >
      {/* Header: Category icon, category name, and status badge */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-[var(--text-soft)] text-xs">
          {getCategoryIcon(category)}
          <span>{formatCategory(category)}</span>
        </div>
        
        {/* Publication status badge */}
        <span 
          className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusConfig.className}`}
        >
          {statusConfig.text}
        </span>
      </div>

      {/* Title with external link indicator */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="text-lg font-semibold text-[var(--text)] leading-tight">
          {publicationUrl ? (
            <a 
              href={publicationUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[var(--accent-gold)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1f0d] rounded"
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h2>
        {publicationUrl && (
          <ExternalLink 
            className="w-4 h-4 text-[var(--text-soft)] flex-shrink-0 mt-1" 
            aria-hidden="true" 
          />
        )}
      </div>

      {/* Authors */}
      {formattedAuthors && (
        <div className="flex items-start gap-2 mb-2 text-sm text-[var(--text-soft)]">
          <Users className="w-4 h-4 text-[var(--text-soft)] flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span>{formattedAuthors}</span>
        </div>
      )}

      {/* Venue and Date */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-sm text-[var(--text-soft)]">
        {venue && (
          <span className="italic">{venue}</span>
        )}
        {formattedDate && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{formattedDate}</span>
          </div>
        )}
      </div>

      {/* Abstract */}
      {abstract && (
        <div className="mb-4 flex-grow">
          <div className="flex items-start gap-2">
            <Quote className="w-4 h-4 text-[var(--text-soft)] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[var(--text-soft)] text-sm leading-relaxed line-clamp-4">
              {abstract}
            </p>
          </div>
        </div>
      )}

      {/* Citation count and code/dataset link */}
      <div className="mt-auto">
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-[var(--glass-border)]">
          {/* Citation count */}
          <div className="flex items-center gap-4">
            <Badge 
              text={`${citationCount} citation${citationCount !== 1 ? 's' : ''}`}
              variant="default"
              size="sm"
            />
          </div>

          {/* Code/Dataset repository link - Property 7: Show code/dataset links where available */}
          {codeUrl && (
            <a
              href={codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--accent-gold)] bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 rounded-full hover:bg-[var(--accent-gold)]/20 hover:text-[var(--text)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1f0d]"
              aria-label={`View code repository for ${title}`}
            >
              <Code className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Code</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {/* Visual click hint for clickable cards */}
      {publicationUrl && (
        <div className="mt-4 pt-4 border-t border-[var(--glass-border)] flex items-center justify-between text-[var(--text-soft)] text-xs">
          <a 
            href={publicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full hover:text-[var(--accent-gold)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1f0d] rounded"
          >
            <span>View Publication</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      )}
    </GlassCard>
  );
}

export default PublicationCard;
