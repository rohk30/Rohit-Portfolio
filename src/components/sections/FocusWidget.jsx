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
        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <Brain className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Current Focus</h3>
      </div>
      
      {/* Main Focus Content */}
      <div className="space-y-3">
        <p className="text-gray-300 text-base leading-relaxed">
          Building <span className="text-blue-400 font-medium">Agentic AI Systems</span> that 
          orchestrate complex workflows with multiple specialized agents and human-in-the-loop validation.
        </p>
        
        {/* Focus Areas */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Multi-Agent Systems
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/50 border border-white/10 text-gray-300 text-sm">
            LLM Prompt Optimization
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/50 border border-white/10 text-gray-300 text-sm">
            Production ML Pipelines
          </span>
        </div>
      </div>
    </GlassCard>
  );
}

export default FocusWidget;
