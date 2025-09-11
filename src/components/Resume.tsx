import { Calendar, MapPin, Building } from 'lucide-react';
import { useFirebaseData } from '../context/FirebaseDataContext';
import type { Theme } from '../types';

interface ResumeProps {
  theme: Theme;
}


export default function Resume({ theme }: ResumeProps) {
  const { skills, knowledge, experiences, educations } = useFirebaseData();
  
  const cardClass = theme === 'dark' 
    ? 'bg-slate-800 border border-slate-700' 
    : 'bg-white';

  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const subtitleClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const bodyTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const mutedTextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  // Helper: bar color per category (approximate to skill.html colors)
  const getBarColor = (category?: string) => {
    switch (category) {
      case 'Frontend':
        return theme === 'dark' ? 'bg-blue-500' : 'bg-[#0099ff]';
      case 'Backend':
        return theme === 'dark' ? 'bg-yellow-500' : 'bg-[#f5b301]';
      case 'Mobile':
        return theme === 'dark' ? 'bg-emerald-600' : 'bg-[#007a5e]';
      case 'UI/UX':
        return theme === 'dark' ? 'bg-purple-500' : 'bg-[#4b00ff]';
      default:
        return theme === 'dark' ? 'bg-blue-500' : 'bg-blue-500';
    }
  };

  // Knowledge items now come from DataContext (admin editable)

  return (
    <section className={`${cardClass} rounded-2xl p-8 shadow-lg transition-all duration-500 h-full overflow-y-auto`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <h2 className={`text-3xl font-bold ${textClass}`}>
          Resume
        </h2>
        <div className="h-1 bg-blue-600 rounded-full w-full sm:flex-grow"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Experience */}
        <div>
          <h3 className={`text-xl font-semibold ${subtitleClass} mb-6`}>Experience</h3>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={exp.id || `exp-${index}`} className="relative pl-6 pb-6 group">
                {/* Animated vertical line */}
                <span className="absolute left-0 top-0 w-1.5 h-full bg-blue-600 rounded-full transform origin-top scale-y-75 group-hover:scale-y-100 transition-transform duration-300"></span>

                {/* Title */}
                <h4 className={`font-semibold text-lg ${textClass}`}>{exp.title}</h4>
                {/* Company */}
                <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mt-1">
                  <Building size={14} />
                  {exp.company}
                </div>
                {/* Period then Location (on separate lines) */}
                <div className={`mt-2 ${mutedTextClass} text-sm`}> 
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {exp.period}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={14} />
                    {exp.location}
                  </div>
                </div>

                {/* Description revealed on hover */}
                <p
                  className={`${bodyTextClass} mt-3 leading-relaxed opacity-0 max-h-0 overflow-hidden translate-y-1 group-hover:opacity-100 group-hover:max-h-40 group-hover:translate-y-0 transition-all duration-300 ease-out`}
                >
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <h3 className={`text-xl font-semibold ${subtitleClass} mb-6`}>Education</h3>
          <div className="space-y-6">
            {educations.map((edu, index) => (
              <div key={edu.id || `edu-${index}`} className="relative pl-6 pb-6 group">
                {/* Animated vertical line */}
                <span className="absolute left-0 top-0 w-1.5 h-full bg-green-500 rounded-full transform origin-top scale-y-75 group-hover:scale-y-100 transition-transform duration-300"></span>

                {/* Degree */}
                <h4 className={`font-semibold text-lg ${textClass}`}>{edu.degree}</h4>
                {/* Institution */}
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium mt-1">
                  <Building size={14} />
                  {edu.institution}
                </div>
                {/* Period and Location */}
                <div className={`mt-2 ${mutedTextClass} text-sm`}>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {edu.period}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={14} />
                    {edu.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills and Knowledge */}
      <div className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Working Skills */}
          <div>
            <h3 className={`text-xl font-semibold ${subtitleClass} mb-6`}>Working Skills</h3>
            <div>
              {skills.map((skill, index) => (
                <div key={skill.id || `skill-${index}`} className="mb-5">
                  <div className={`flex justify-between text-xs ${mutedTextClass} mb-1 font-normal`}>
                    <span className={textClass}>{skill.name}{skill.category ? ` (${skill.category})` : ''}</span>
                    <span>{Math.round(skill.percentage ?? 0)}%</span>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'} w-full h-3 rounded-full`}>
                    <div
                      className={`h-3 rounded-full ${getBarColor(skill.category)}`}
                      style={{ width: `${Math.max(0, Math.min(100, skill.percentage ?? 0))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge */}
          <div>
            <h2 className={`text-xl font-semibold ${subtitleClass} mb-6`}>Knowledge</h2>
            <div className="flex flex-wrap gap-3">
              {knowledge.map((item, index) => (
                <span
                  key={`knowledge-${index}`}
                  className={`text-xs font-normal rounded-md py-2 px-4 transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      : 'bg-[#d3dbe6] text-[#2c3e50] hover:bg-[#c9d2e0]'
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}