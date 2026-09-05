import GlassCard from '../ui/GlassCard';
import { GraduationCap } from 'lucide-react';
import { personalData } from '../../utils/data';

/**
 * EducationWidget Component
 * 
 * A bento grid widget (1x1 span) displaying education details including
 * B.Tech in CS with Data Science and 9.47 GPA.
 * Uses GlassCard with hover animation for visual consistency.
 * 
 * @validates Requirements 2.4
 */
function EducationWidget() {
  const { education } = personalData;

  return (
    <GlassCard 
      hover 
      className="col-span-1 p-6 flex flex-col justify-between"
    >
      {/* Header with Icon */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/20">
          <GraduationCap className="w-5 h-5 text-[var(--accent-gold)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--text)]">Education</h3>
      </div>
      
      {/* Education Content */}
      <div className="space-y-2 flex-1">
        <p className="text-[var(--text)] font-medium text-base">
          {education?.degree || 'B.Tech'}
        </p>
        <p className="text-[var(--text-soft)] text-sm leading-relaxed">
          {education?.specialization || 'Computer Science with Data Science'}
        </p>
        <p className="text-[var(--text-soft)] text-sm">
          {education?.institution || 'Vellore Institute of Technology'}
        </p>
      </div>
      
      {/* GPA Highlight */}
      <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[var(--accent-gold)]">
            {education?.gpa || '47'}
          </span>
          <span className="text-[var(--text-soft)] text-sm">GPA</span>
        </div>
      </div>
    </GlassCard>
  );
}

export default EducationWidget;
