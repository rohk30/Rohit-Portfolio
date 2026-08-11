import { useNavigate } from 'react-router-dom';
import { Briefcase, FolderCode, ArrowRight } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import BentoGrid from '../components/sections/BentoGrid';
import IntroWidget from '../components/sections/IntroWidget';
import FocusWidget from '../components/sections/FocusWidget';
import EducationWidget from '../components/sections/EducationWidget';
import SkillsTicker from '../components/sections/SkillsTicker';
import GlassCard from '../components/ui/GlassCard';

/**
 * LinkWidget Component
 * 
 * A clickable widget that navigates to another page with hover arrow animation.
 * Used for Experience and Projects navigation on the Home page.
 * 
 * @param {Object} props
 * @param {string} props.to - The route path to navigate to
 * @param {string} props.title - The widget title
 * @param {string} props.description - Brief description text
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} [props.className] - Optional additional classes
 * 
 * @validates Requirements 2.6, 2.7
 */
function LinkWidget({ to, title, description, icon: Icon, className = '' }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <GlassCard
      hover
      onClick={handleClick}
      className={`col-span-1 p-5 group ${className}`}
      aria-label={`Navigate to ${title}`}
    >
      <div className="flex flex-col h-full justify-between">
        {/* Header with icon */}
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        
        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 flex-1">
          {description}
        </p>
        
        {/* Arrow indicator with hover animation */}
        <div className="flex items-center justify-end">
          <span className="text-blue-400 text-sm font-medium mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Explore
          </span>
          <ArrowRight 
            className="w-5 h-5 text-blue-400 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300" 
            aria-hidden="true"
          />
        </div>
      </div>
    </GlassCard>
  );
}

/**
 * Home Page
 * 
 * Landing page with BentoGrid layout showcasing intro, focus, education, skills,
 * and navigation links to Experience and Projects pages.
 * 
 * Layout (Desktop - 4 columns):
 * ┌─────────────┬─────────────┬───────────────┐
 * │             │             │  Education    │
 * │   Intro     │   Focus     ├───────────────┤
 * │   (2x2)     │   (2x1)     │  Skills       │
 * │             │             │  Ticker       │
 * ├─────────────┼─────────────┼───────────────┤
 * │             │  Experience │   Projects    │
 * │             │   Link      │    Link       │
 * └─────────────┴─────────────┴───────────────┘
 * 
 * Layout (Mobile - single column):
 * All widgets stack vertically
 * 
 * @validates Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8
 */
function Home() {
  return (
    <PageTransition className="min-h-screen pt-20 md:pt-24">
      <div className="container-portfolio py-8 md:py-12">
        <BentoGrid>
          {/* Intro Widget - 2x2 span on desktop */}
          <IntroWidget />
          
          {/* Focus Widget - 2x1 span on desktop */}
          <FocusWidget />
          
          {/* Education Widget - 1x1 */}
          <EducationWidget />
          
          {/* Skills Ticker Widget - 1x1 */}
          <SkillsTicker />
          
          {/* Experience Link Widget - 1x1 */}
          <LinkWidget
            to="/experience"
            title="Experience"
            description="Explore my professional journey and technical contributions."
            icon={Briefcase}
          />
          
          {/* Projects Link Widget - 1x1 */}
          <LinkWidget
            to="/projects"
            title="Projects"
            description="Browse my technical projects and products."
            icon={FolderCode}
          />
        </BentoGrid>
      </div>
    </PageTransition>
  );
}

export default Home;
