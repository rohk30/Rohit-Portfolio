import GlassCard from '../ui/GlassCard';
import { Brain, Sparkles } from 'lucide-react';

/**
 * FocusWidget Component
 * 
 * A bento grid widget (2x1 span) highlighting current work focus on Agentic AI systems.
 * Uses GlassCard with hover animation for visual consistency.
 * 
 * @validates Requirements 2.3
 */
function FocusWidget() {
  return (
    <GlassCard 
      hover 
      className="col-span-1 md:col-span-2 p-6 flex flex-col justify-center"
    >
      {/* Header with Icon */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/20">
          <Brain className="w-5 h-5 text-[var(--accent-gold)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--text)]">Current Focus</h3>
      </div>
      
      {/* Main Focus Content */}
      <div className="space-y-3">
        <p className="text-[var(--text-soft)] text-base leading-relaxed">
          Building <span className="text-[var(--accent-gold)] font-medium">Agentic AI Systems</span> that 
          orchestrate complex workflows with multiple specialized agents and human-in-the-loop validation.
        </p>
        
        {/* Focus Areas */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/20 text-[var(--accent-gold)] text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Multi-Agent Systems
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[var(--glass-card-bg)] border border-[var(--glass-border)] text-[var(--text-soft)] text-sm">
            LLM Prompt Optimization
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[var(--glass-card-bg)] border border-[var(--glass-border)] text-[var(--text-soft)] text-sm">
            Production ML Pipelines
          </span>
        </div>
      </div>
    </GlassCard>
  );
}

export default FocusWidget;
