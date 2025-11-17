import { Calendar, MapPin } from 'lucide-react';
import { useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollDownHint from './ScrollDownHint';
import InfoTooltip from './InfoTooltip';
import { useFirebaseData } from '../context/FirebaseDataContext';
import { getBilingualText } from '../utils/bilingual';
import type { Theme } from '../types';
import AutoTranslate from './AutoTranslate';

interface ResumeProps {
  theme: Theme;
}


export default function Resume({ theme }: ResumeProps) {
  const { skills, knowledge, experiences, educations } = useFirebaseData();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const sectionRef = useRef<HTMLElement>(null);
  
  const cardClass = theme === 'dark' 
    ? 'bg-slate-800 border border-slate-700' 
    : 'bg-white';

  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const subtitleClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const bodyTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const mutedTextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  // Handle translation updates
  const handleTranslate = useCallback((id: string, field: string, translatedText: string) => {
    console.log(`Translated ${field} for item ${id}:`, translatedText);
  }, []);

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
    <section ref={sectionRef} className={`${cardClass} relative rounded-2xl p-8 shadow-lg transition-all duration-500 h-full overflow-y-auto`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <h2 className={`text-3xl font-bold ${textClass}`}>
            {t('resume.title')}
          </h2>
          <InfoTooltip theme={theme} duration={5000} inline />
        </div>
        <div className="h-1 bg-blue-600 rounded-full w-full sm:flex-grow"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Experience */}
        <div>
          <h3 className={`text-xl font-semibold ${subtitleClass} mb-6`}>{t('resume.experience')}</h3>
          <div className="space-y-6">
            {experiences.map((exp, index) => {
              const title = getBilingualText(exp, 'title', currentLang);
              const company = getBilingualText(exp, 'company', currentLang);
              const location = getBilingualText(exp, 'location', currentLang);
              const period = getBilingualText(exp, 'period', currentLang);
              const description = getBilingualText(exp, 'description', currentLang);
              return (
                <div key={exp.id || `exp-${index}`} className="relative pl-6 pb-6 group">
                  {/* Animated vertical line */}
                  <span className="absolute left-0 top-0 w-1.5 h-full bg-blue-600 rounded-full transform origin-top scale-y-75 group-hover:scale-y-100 transition-transform duration-300"></span>

                  {/* Title */}
                  <h4 className={`font-semibold text-lg ${textClass}`}>{title}</h4>
                  {/* Company */}
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <AutoTranslate 
                      text={company}
                      fieldName={`exp-${exp.id}-company`}
                      onTranslate={(translated) => handleTranslate(exp.id, 'company', translated)}
                    />
                  </p>
                  {/* Period then Location (on separate lines) */}
                  <div className={`mt-2 ${mutedTextClass} text-sm`}> 
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {period}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={14} />
                      {location}
                    </div>
                  </div>

                  {/* Description revealed on hover */}
                  <p
                    className={`${bodyTextClass} mt-3 leading-relaxed opacity-0 max-h-0 overflow-hidden translate-y-1 group-hover:opacity-100 group-hover:max-h-40 group-hover:translate-y-0 transition-all duration-300 ease-out`}
                  >
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Education */}
        <div>
          <h3 className={`text-xl font-semibold ${subtitleClass} mb-6`}>{t('resume.education')}</h3>
          <div className="space-y-6">
            {educations.map((edu, index) => {
              const degree = getBilingualText(edu, 'degree', currentLang);
              const institution = getBilingualText(edu, 'institution', currentLang);
              const location = getBilingualText(edu, 'location', currentLang);
              const period = getBilingualText(edu, 'period', currentLang);
              return (
                <div key={edu.id || `edu-${index}`} className="relative pl-6 pb-6 group">
                  {/* Animated vertical line */}
                  <span className="absolute left-0 top-0 w-1.5 h-full bg-green-500 rounded-full transform origin-top scale-y-75 group-hover:scale-y-100 transition-transform duration-300"></span>

                  {/* Degree */}
                  <h4 className={`font-semibold text-lg ${textClass}`}>{degree}</h4>
                  {/* Institution */}
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <AutoTranslate 
                      text={institution}
                      fieldName={`edu-${edu.id}-institution`}
                      onTranslate={(translated) => handleTranslate(edu.id, 'institution', translated)}
                    />
                  </p>
                  {/* Period and Location */}
                  <div className={`mt-2 ${mutedTextClass} text-sm`}>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {period}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={14} />
                      {location}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Skills and Knowledge */}
      <div className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Working Skills */}
          <div>
            <h3 className={`text-xl font-semibold ${subtitleClass} mb-6`}>{t('resume.skills')}</h3>
            <div>
              {skills.map((skill, index) => {
                const skillName = getBilingualText(skill, 'name', currentLang);
                const skillCategory = getBilingualText(skill, 'category', currentLang);
                return (
                  <div key={skill.id || `skill-${index}`} className="mb-5">
                    <h3 className="text-lg font-semibold">
                      <AutoTranslate 
                        text={skillName}
                        fieldName={`skill-${skill.id}-name`}
                        onTranslate={(translated) => handleTranslate(skill.id, 'name', translated)}
                      />
                    </h3>
                    <div className={`flex justify-between text-xs ${mutedTextClass} mb-1 font-normal`}>
                      <span className={textClass}>{skillName}{skillCategory ? ` (${skillCategory})` : ''}</span>
                      <span>{Math.round(skill.percentage ?? 0)}%</span>
                    </div>
                    <div className={`${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'} w-full h-3 rounded-full`}>
                      <div
                        className={`h-3 rounded-full ${getBarColor(skill.category)}`}
                        style={{ width: `${Math.max(0, Math.min(100, skill.percentage ?? 0))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Knowledge */}
          <div>
            <h2 className={`text-xl font-semibold ${subtitleClass} mb-6`}>{t('resume.knowledge')}</h2>
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
      <ScrollDownHint targetRef={sectionRef} theme={theme} />
    </section>
  );
}