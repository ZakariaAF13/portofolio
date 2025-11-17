import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useFirebaseData } from '../context/FirebaseDataContext';
import { getBilingualText } from '../utils/bilingual';
import type { Theme } from '../types';
import ScrollDownHint from './ScrollDownHint';
import InfoTooltip from './InfoTooltip';
import { getPortfolioSettingsFromFirestore } from '../utils/portfolioFirestore';
import AutoTranslate from './AutoTranslate';

interface ProjectsProps {
  theme: Theme;
}

export default function Projects({ theme }: ProjectsProps) {
  const { projects } = useFirebaseData();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [categoriesOrder, setCategoriesOrder] = useState<string[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const [expandedDesc] = useState<Record<string, boolean>>({});
  const isExpanded = (id: string) => !!expandedDesc[id];
  
  // Handle translation updates
  const handleTranslateProject = useCallback((projectId: string, field: string, translatedText: string) => {
    // This function will be called when translation is complete
    console.log(`Translated ${field} for project ${projectId}:`, translatedText);
  }, []);
  const truncateWords = (text: string, limit = 6) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(' ') + '...';
  };

  // Load TikTok embed script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up script on unmount
      const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // Load categories order from settings
  useEffect(() => {
    (async () => {
      try {
        const settings = await getPortfolioSettingsFromFirestore();
        const ordered = (settings && Array.isArray((settings as any).categories_order)) ? (settings as any).categories_order as string[] : [];
        setCategoriesOrder(ordered);
      } catch {
        setCategoriesOrder([]);
      }
    })();
  }, []);

  // Extract TikTok video ID from URL
  const extractTikTokVideoId = (url: string): string | null => {
    const match = url.match(/\/video\/(\d+)/);
    return match ? match[1] : null;
  };

  // Extract Instagram Reels shortcode from URL
  const extractInstagramReelCode = (url: string): string | null => {
    const match = url.match(/\/reel\/([^/?#]+)/);
    return match ? match[1] : null;
  };

  const allCats = Array.from(new Set(projects.map(p => p.category))).filter(Boolean);
  const orderedCats = [
    ...categoriesOrder.filter(c => allCats.includes(c)),
    ...allCats.filter(c => !categoriesOrder.includes(c))
  ];
  const categories = [
    { id: 'all', label: t('projects.all') },
    ...orderedCats.map(category => ({ id: category, label: category }))
  ];

  const filteredProjects = activeCategory === 'all' 
    ? projects.filter(p => p.status === 'Published')
    : projects.filter(p => p.category === activeCategory && p.status === 'Published');

  // Separate TikTok vs non-TikTok to control layout sizes independently
  const nonTikTokProjects = filteredProjects.filter(p => !(p.category === 'TikTok' && p.tiktokUrl));
  const tikTokProjects = filteredProjects.filter(p => p.category === 'TikTok' && p.tiktokUrl);

  return (
    <section ref={sectionRef} className={`${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white'} relative rounded-2xl p-8 shadow-lg transition-all duration-500 h-full overflow-y-auto`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            {t('projects.title')}
          </h2>
          <InfoTooltip theme={theme} duration={5000} inline />
        </div>
        <div className="h-1 bg-blue-600 rounded-full w-full sm:flex-grow"></div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : theme === 'dark'
                ? 'text-gray-300 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Projects Grid (Non-TikTok) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {nonTikTokProjects.map((project) => {
            const isTikTok = false; // by construction
            const cardClass = `group rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg self-start ${
              theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'
            } ${!isTikTok && project.liveUrl ? 'cursor-pointer' : ''}`;
            const localizedDescription = project.description
              ? getBilingualText(project, 'description', currentLang)
              : undefined;
            const content = (
              <>
                {
                  // Regular Project Display (now supports Instagram Reels and TikTok embed when provided)
                  <>
                    {project.instagramReelsUrl ? (
                      <div className="w-full">
                        <div className="relative aspect-[9/16] w-full max-w-sm mx-auto">
                          <iframe
                            src={`https://www.instagram.com/reel/${extractInstagramReelCode(project.instagramReelsUrl || '')}/embed`}
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          />
                        </div>
                      </div>
                    ) : project.tiktokUrl ? (
                      <div className="w-full">
                        <div className="relative aspect-[9/16] w-full max-w-sm mx-auto">
                          <iframe
                            src={`https://www.tiktok.com/player/v1/${extractTikTokVideoId(project.tiktokUrl || '')}`}
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            frameBorder="0"
                            allow="autoplay; fullscreen"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square flex items-center justify-center p-8 relative">
                        {project.imageUrl ? (
                          <img
                            src={project.imageUrl}
                            alt={getBilingualText(project, 'title', currentLang)}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div
                            className={`w-full h-full rounded-lg flex items-center justify-center text-2xl font-bold ${
                              'bg-blue-600 text-white'
                            }`}
                          >
                            {getBilingualText(project, 'title', currentLang)
                              .split(' ')
                              .map((word: string) => word[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <div
                        className={`text-sm mb-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {project.technologies?.join(', ') || project.category}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        <AutoTranslate 
                          text={getBilingualText(project, 'title', currentLang)} 
                          fieldName={`project-${project.id}-title`}
                          onTranslate={(translated) => handleTranslateProject(project.id, 'title', translated)}
                        />
                      </h3>
                      {localizedDescription && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {isExpanded(project.id) ? (
                            <AutoTranslate 
                              text={getBilingualText(project, 'description', currentLang)}
                              fieldName={`project-${project.id}-description`}
                              onTranslate={(translated) => handleTranslateProject(project.id, 'description', translated)}
                            />
                          ) : (
                            truncateWords(getBilingualText(project, 'description', currentLang))
                          )}
                        </p>
                      )}
                    </div>
                  </>
                }
              </>
            );

            return !isTikTok && project.liveUrl ? (
              <a
                key={project.id}
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
                title={`Open ${getBilingualText(project, 'title', currentLang)}`}
              >
                {content}
              </a>
            ) : (
              <div key={project.id} className={cardClass}>
                {content}
              </div>
            )
          })}
      </div>

      {/* TikTok Projects Grid (separate), only show when there are TikTok items */}
      {tikTokProjects.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {tikTokProjects.map(project => {
            const localizedDescription = project.description
              ? getBilingualText(project, 'description', currentLang)
              : undefined;
            return (
              <div
                key={project.id}
                className={`group rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg self-start ${
                  theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="w-full">
                  <div className="relative aspect-[9/16] w-full max-w-sm mx-auto">
                    <iframe
                      src={`https://www.tiktok.com/player/v1/${extractTikTokVideoId(project.tiktokUrl || '')}`}
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      frameBorder="0"
                      allow="autoplay; fullscreen"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      <AutoTranslate 
                        text={getBilingualText(project, 'title', currentLang)} 
                        fieldName={`project-${project.id}-title`}
                        onTranslate={(translated) => handleTranslateProject(project.id, 'title', translated)}
                      />
                    </h3>
                    {localizedDescription && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {isExpanded(project.id) ? (
                          <AutoTranslate 
                            text={getBilingualText(project, 'description', currentLang)}
                            fieldName={`project-${project.id}-description`}
                            onTranslate={(translated) => handleTranslateProject(project.id, 'description', translated)}
                          />
                        ) : (
                          truncateWords(getBilingualText(project, 'description', currentLang))
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('projects.noProjects')}
          </p>
        </div>
      )}
      <ScrollDownHint targetRef={sectionRef} theme={theme} />
    </section>
  );
}