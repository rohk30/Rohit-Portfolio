import React from 'react';

/**
 * BentoGrid Component
 * 
 * A responsive CSS Grid container for the Home page widgets.
 * - Mobile: Single column layout
 * - Desktop (md+): 4-column grid with gap-6
 * 
 * Widget spans are handled by child components using Tailwind classes:
 * - IntroWidget: col-span-2 row-span-2
 * - FocusWidget: col-span-2
 * - EducationWidget: 1x1 (default)
 * - SkillsTicker: 1x1 (default)
 * 
 * @validates Requirements 2.1, 2.8
 */
const BentoGrid = ({ children, className = '' }) => {
  return (
    <div
      className={`
        grid
        grid-cols-1
        md:grid-cols-4
        gap-4
        md:gap-6
        w-full
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </div>
  );
};

export default BentoGrid;
