import GlassCard from '../ui/GlassCard';
import { experienceData } from '../../utils/data';

/**
 * IntroWidget Component
 * 
 * A prominent bento grid widget (2x2 span) displaying the portfolio owner's
 * name, professional role, and current position. Uses GlassCard with hover
 * animation for visual consistency.
 * 
 * Requirement 2.2: Intro Widget displaying name, role, and current position
 */
function IntroWidget() {
  // Get the current position from experienceData (first entry is most recent)
  const currentPosition = experienceData[0];

  return (
    <GlassCard 
      hover 
      className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 p-6 md:p-8 flex flex-col justify-center"
    >
      {/* Name */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text)] mb-3">
        Rohit Kumar Birakayala
      </h1>
      
      {/* Role */}
      <h2 className="text-xl md:text-2xl font-semibold text-[var(--accent-gold)] mb-4">
        Data Scientist
      </h2>
      
      {/* Current Position */}
      <div className="text-[var(--text-soft)]">
        <p className="text-base md:text-lg">
          Currently{' '}
          <span className="text-[var(--text)] font-medium">
            {currentPosition?.role || 'Data Scientist Intern'}
          </span>
        </p>
        <p className="text-base md:text-lg">
          at{' '}
          <span className="text-[var(--text)] font-medium">
            {currentPosition?.company || 'Gracenote, Nielsen'}
          </span>
        </p>
      </div>
      
      {/* Subtle decorative element */}
      <div className="mt-6 w-16 h-1 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-orange)] rounded-full" />
    </GlassCard>
  );
}

export default IntroWidget;
