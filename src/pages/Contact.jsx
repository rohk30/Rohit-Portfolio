import { Mail, Briefcase, GitBranch, FileDown } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import PlayNextBallWidget from '../components/cricket/PlayNextBallWidget';
import { contactData } from '../utils/data';

/**
 * Contact Page
 * 
 * Minimalist contact page with centered GlassCard containing
 * email link, social profile links, and resume download button.
 * 
 * Requirements: 7.1-7.5
 * - 7.1: Display a centered, minimalist GlassCard
 * - 7.2: Include clickable email link (mailto)
 * - 7.3: Include clickable LinkedIn and GitHub profile links
 * - 7.4: Include prominently styled resume download button
 * - 7.5: Download latest resume PDF from src/assets/docs/
 */
function Contact() {
  // Graceful degradation: provide defaults for missing contact data
  const { 
    email = 'contact@example.com', 
    linkedIn = '', 
    github = '', 
    resumePath = '' 
  } = contactData ?? {};

  return (
    <PageTransition className="min-h-screen pt-20 md:pt-24">
      {/* Centered container for the contact card */}
      <div className="container-portfolio py-8 md:py-12 flex items-center justify-center min-h-[calc(100vh-6rem)]">
        <GlassCard className="w-full max-w-lg p-8 md:p-10 text-center">
          {/* Header */}
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-2">
            Get in Touch
          </h1>
          <p className="text-[var(--text-soft)] mb-8">
            Feel free to reach out for collaborations, opportunities, or just to say hello!
          </p>

          {/* Contact Links */}
          <div className="space-y-4 mb-8">
            {/* Email Link */}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center justify-center gap-3 p-4 rounded-xl bg-[var(--glass-card-bg)] border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] hover:border-[var(--glass-hover-border)] transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1f0d]"
                aria-label={`Send email to ${email}`}
              >
                <Mail className="w-5 h-5 text-[var(--accent-gold)] group-hover:text-[var(--accent-gold)] transition-colors" />
                <span className="text-[var(--text)] group-hover:text-[var(--accent-gold)] transition-colors">
                  {email}
                </span>
              </a>
            )}

            {/* LinkedIn Link */}
            {linkedIn && (
              <a
                href={linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 rounded-xl bg-[var(--glass-card-bg)] border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] hover:border-[var(--glass-hover-border)] transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1f0d]"
                aria-label="Visit LinkedIn profile"
              >
                <Briefcase className="w-5 h-5 text-[var(--accent-gold)] group-hover:text-[var(--accent-gold)] transition-colors" />
                <span className="text-[var(--text)] group-hover:text-[var(--accent-gold)] transition-colors">
                  LinkedIn Profile
                </span>
              </a>
            )}

            {/* GitHub Link */}
            {github && (
              <a
                href={`https://github.com/${github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 rounded-xl bg-[var(--glass-card-bg)] border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] hover:border-[var(--glass-hover-border)] transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1f0d]"
                aria-label={`Visit GitHub profile ${github}`}
              >
                <GitBranch className="w-5 h-5 text-[var(--accent-gold)] group-hover:text-[var(--accent-gold)] transition-colors" />
                <span className="text-[var(--text)] group-hover:text-[var(--accent-gold)] transition-colors">
                  github.com/{github}
                </span>
              </a>
            )}
          </div>

          {/* Resume Download Button - only show if resumePath is available */}
          {resumePath ? (
            <Button
              href={resumePath}
              download="rohit-kumar-birakayala-resume.pdf"
              variant="primary"
              size="lg"
              className="w-full"
            >
              <FileDown className="w-5 h-5" />
              Download Resume
            </Button>
          ) : (
            <div className="p-4 rounded-xl bg-[var(--glass-card-bg)] border border-[var(--glass-border)] text-[var(--text-soft)] text-sm">
              Resume currently unavailable
            </div>
          )}
        </GlassCard>
      </div>

      {/* Cricket-themed navigation widget */}
      <PlayNextBallWidget currentPath="/contact" />
    </PageTransition>
  );
}

export default Contact;
