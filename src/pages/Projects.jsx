import PageTransition from '../components/layout/PageTransition';
import ProjectCard from '../components/sections/ProjectCard';
import PlayNextBallWidget from '../components/cricket/PlayNextBallWidget';
import { projectData } from '../utils/data';

/**
 * Projects Page
 * 
 * Displays technical projects in a responsive grid layout.
 * Featured projects (multi-agent job application system, sickle-cell) appear first
 * with special styling. Uses responsive grid: 1 col on mobile, 2 cols on desktop.
 * 
 * Requirements: 4.1, 4.2, 4.5, 4.6, 4.7
 * 
 * @example
 * <Projects />
 */
function Projects() {
  // Graceful degradation: ensure data is an array
  const safeProjectData = Array.isArray(projectData) ? projectData : [];

  // Sort projects to show featured projects first
  const sortedProjects = [...safeProjectData].sort((a, b) => {
    // Featured projects come first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  // Get counts for display
  const featuredCount = safeProjectData.filter(p => p.featured).length;

  return (
    <PageTransition className="min-h-screen pt-20 md:pt-24">
      <div className="container-portfolio py-8 md:py-12">
        {/* Page Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
            Projects
          </h1>
          <p className="text-[var(--text-soft)] text-lg max-w-2xl">
            Technical projects showcasing full-stack development, machine learning, 
            and agentic AI systems. Click on any project to view the source code on GitHub.
          </p>
        </header>

        {/* Featured Projects Section Indicator */}
        {featuredCount > 0 && (
          <div className="mb-6">
            <p className="text-sm text-[var(--text-soft)]">
              Showing {sortedProjects.length} selected projects • {featuredCount} featured
            </p>
          </div>
        )}

        {/* Projects Grid */}
        {sortedProjects.length > 0 ? (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            role="list"
            aria-label="Projects list"
          >
            {sortedProjects.map((project) => (
              <div key={project.id || Math.random()} role="listitem">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[var(--glass-card-bg)] rounded-2xl border border-[var(--glass-border)]">
            <p className="text-[var(--text-soft)]">No projects found.</p>
            <p className="text-[var(--text-soft)] text-sm mt-2">Check back later for updates.</p>
          </div>
        )}
      </div>

      {/* Cricket-themed navigation widget */}
      <PlayNextBallWidget currentPath="/projects" />
    </PageTransition>
  );
}

export default Projects;
