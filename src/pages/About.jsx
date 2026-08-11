import { GraduationCap, Users, Calendar, Award, MapPin, Plane } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import PhotoCollage from '../components/sections/PhotoCollage';
import { personalData } from '../utils/data';

/**
 * About Page
 * 
 * Personal narrative with education, leadership, and travel photos.
 * Displays a split-screen layout with text narrative on the left and photo collage on the right.
 * 
 * Requirements: 6.1-6.6
 * @validates Requirements 6.1, 6.2, 6.3, 6.4, 6.5
 */
function About() {
  // Graceful degradation: provide defaults if personalData is missing or incomplete
  const { 
    education = {
      institution: 'Institution not available',
      degree: 'Degree',
      specialization: 'Specialization',
      dateRange: '',
      gpa: 'N/A',
      futurePlans: ''
    }, 
    leadership = {
      role: 'Role not available',
      organization: 'Organization',
      impact: '0 impact'
    }, 
    hobbies = {
      narrative: 'No information available.',
      interests: [],
      travelPhotos: []
    }
  } = personalData ?? {};

  return (
    <PageTransition className="min-h-screen pt-20 md:pt-24">
      <div className="container-portfolio py-8 md:py-12">
        {/* Page Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          About Me
        </h1>
        <p className="text-gray-400 text-lg mb-10 md:mb-12 max-w-2xl">
          Beyond the algorithms and code, here's the story of who I am.
        </p>

        {/* Split Layout: Text Narrative (Left) + Photo Collage (Right) */}
        {/* Requirement 6.1: Split-screen layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left Side: Text Narrative */}
          <div className="space-y-8">
            {/* Education Section */}
            {/* Requirement 6.2: Education details */}
            <GlassCard className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-500/20 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Education</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-white">
                    {education.institution}
                  </h3>
                  <p className="text-blue-400 font-medium mt-1">
                    {education.degree} in {education.specialization}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{education.dateRange}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span>GPA: <span className="text-blue-400 font-semibold">{education.gpa}</span></span>
                  </div>
                </div>

                {/* Future Plans */}
                {education.futurePlans && (
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Plane className="w-4 h-4 text-blue-400" />
                      <span>
                        <span className="text-gray-400">Next:</span>{' '}
                        {education.futurePlans}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Leadership Section */}
            {/* Requirement 6.3: Leadership experience */}
            <GlassCard className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-500/20 rounded-xl">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Leadership</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-white">
                    {leadership.role}
                  </h3>
                  <p className="text-gray-400 mt-1">
                    {leadership.organization}
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-blue-400">
                      {leadership.impact.split(' ')[0]}
                    </span>
                    <span className="text-gray-400">
                      {leadership.impact.split(' ').slice(1).join(' ')}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Interests Section */}
            <GlassCard className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-500/20 rounded-xl">
                  <MapPin className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Interests</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {hobbies.interests && hobbies.interests.length > 0 ? (
                  hobbies.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-slate-800/50 text-gray-300 rounded-full text-sm border border-white/10"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No interests listed</span>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Right Side: Beyond the Code + Photo Collage */}
          {/* Requirement 6.4: "Beyond the Code" section with travel photos */}
          <div className="space-y-6">
            <GlassCard className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Beyond the Code
              </h2>
              <p className="text-gray-400 leading-relaxed">
                {hobbies.narrative}
              </p>
            </GlassCard>

            {/* Photo Collage */}
            {/* Requirement 6.5: Load data from personalData */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-400" />
                Travel Memories
              </h3>
              {hobbies.travelPhotos && hobbies.travelPhotos.length > 0 ? (
                <PhotoCollage photos={hobbies.travelPhotos} />
              ) : (
                <div className="text-gray-400 text-center py-8 bg-slate-900/40 rounded-xl border border-white/10">
                  No travel photos available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default About;
