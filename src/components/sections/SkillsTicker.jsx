import GlassCard from '../ui/GlassCard';
import { 
  SiPython, 
  SiJavascript, 
  SiReact, 
  SiTensorflow, 
  SiPytorch,
  SiDocker,
  SiGit,
  SiPandas,
  SiScikitlearn,
  SiCplusplus,
  SiDart,
  SiLangchain,
  SiMysql
} from 'react-icons/si';
import { FaJava, FaAws } from 'react-icons/fa';
import { TbBrain } from 'react-icons/tb';

/**
 * SkillsTicker Component
 * 
 * A 1x1 bento grid widget displaying an auto-scrolling horizontal ticker
 * of technology skill icons. Uses the 'ticker' animation defined in 
 * tailwind.config.js for smooth infinite scrolling.
 * 
 * Features:
 * - Auto-scrolling animation with 20s duration
 * - Respects prefers-reduced-motion for accessibility
 * - GlassCard wrapper with hover effect
 * - Duplicated content for seamless infinite loop
 * - Programming language icons instead of text
 * 
 * @validates Requirements 2.5
 */
function SkillsTicker() {
  // Technology skills to display in the ticker with their icons and colors
  const skills = [
    { name: 'Python', icon: SiPython, color: '#3776AB' },
    { name: 'Java', icon: FaJava, color: '#ED8B00' },
    { name: 'C++', icon: SiCplusplus, color: '#00599C' },
    { name: 'Dart', icon: SiDart, color: '#0175C2' },
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
    { name: 'React', icon: SiReact, color: '#61DAFB' },
    { name: 'DSPy', icon: TbBrain, color: '#8B5CF6' },
    { name: 'TensorFlow', icon: SiTensorflow, color: '#FF6F00' },
    { name: 'PyTorch', icon: SiPytorch, color: '#EE4C2C' },
    { name: 'LangChain', icon: SiLangchain, color: '#1C3C3C' },
    { name: 'SQL', icon: SiMysql, color: '#4479A1' },
    { name: 'AWS', icon: FaAws, color: '#FF9900' },
    { name: 'Docker', icon: SiDocker, color: '#2496ED' },
    { name: 'Git', icon: SiGit, color: '#F05032' },
    { name: 'Pandas', icon: SiPandas, color: '#150458' },
    { name: 'scikit-learn', icon: SiScikitlearn, color: '#F7931E' },
  ];

  // Duplicate skills array for seamless infinite scroll effect
  // The animation translates -50%, so we need 2x the content
  const duplicatedSkills = [...skills, ...skills];

  // Create aria label from skill names
  const skillNames = skills.map(s => s.name).join(', ');

  return (
    <GlassCard 
      hover 
      className="col-span-1 p-4 md:p-5 overflow-hidden"
    >
      {/* Section label */}
      <h3 className="text-sm font-semibold text-[var(--text-soft)] uppercase tracking-wider mb-3">
        Tech Stack
      </h3>
      
      {/* Ticker container with overflow hidden */}
      <div className="relative overflow-hidden">
        {/* Gradient fade edges for visual polish */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--bg)]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--bg)]/80 to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling ticker track */}
        <div 
          className="flex gap-4 animate-ticker motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center"
          aria-label={`Technology skills: ${skillNames}`}
        >
          {duplicatedSkills.map((skill, index) => {
            const IconComponent = skill.icon;
            return (
              <div
                key={`${skill.name}-${index}`}
                className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-[var(--glass-card-bg)] rounded-xl border border-[var(--glass-border)] transition-all duration-300 hover:scale-110 hover:border-[var(--glass-hover-border)] group"
                title={skill.name}
              >
                <IconComponent 
                  className="w-6 h-6 transition-colors duration-300"
                  style={{ color: skill.color }}
                  aria-hidden="true"
                />
                <span className="sr-only">{skill.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}

export default SkillsTicker;
