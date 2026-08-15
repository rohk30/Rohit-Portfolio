import { GitBranch, Briefcase, Heart } from 'lucide-react';
import { contactData } from '../../utils/data';

/**
 * Footer Component
 * 
 * Minimal footer with glassmorphism styling, copyright notice, and social links.
 * Uses contactData from the data store for GitHub and LinkedIn URLs.
 * 
 * Requirements: 8.5
 */
function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Construct full GitHub URL from username
  const githubUrl = `https://github.com/${contactData.github}`;
  
  return (
    <footer 
      className="portfolio-footer mt-auto"
      role="contentinfo"
    >
      <div className="container-portfolio py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright Notice */}
          <p className="text-gray-400 text-sm flex items-center gap-1">
            <span>© {currentYear} Rohit Kumar Birakayala.</span>
            <span className="hidden sm:inline">Made with</span>
            <Heart 
              className="w-4 h-4 text-[var(--accent-lime)] hidden sm:inline-block" 
              fill="currentColor"
              aria-hidden="true"
            />
            <span className="hidden sm:inline">in India</span>
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm rounded-lg px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              aria-label="Visit GitHub profile"
            >
              <GitBranch className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            
            <a
              href={contactData.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm rounded-lg px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              aria-label="Visit LinkedIn profile"
            >
              <Briefcase className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
