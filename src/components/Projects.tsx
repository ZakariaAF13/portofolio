import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import type { Theme } from '../types';

interface ProjectsProps {
  theme: Theme;
}

export default function Projects({ theme }: ProjectsProps) {
  const { projects } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('all');

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

  // Extract TikTok video ID from URL
  const extractTikTokVideoId = (url: string): string | null => {
    const match = url.match(/\/video\/(\d+)/);
    return match ? match[1] : null;
  };

  const categories = [
    { id: 'all', label: 'All' },
    ...Array.from(new Set(projects.map(p => p.category)))
      .map(category => ({ id: category, label: category }))
  ];

  const filteredProjects = activeCategory === 'all' 
    ? projects.filter(p => p.status === 'Published')
    : projects.filter(p => p.category === activeCategory && p.status === 'Published');

  return (
    <section className={`${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white'} rounded-2xl p-8 shadow-lg transition-all duration-500 h-full overflow-y-auto`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Project
        </h2>
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={`group rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
              theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {project.category === 'TikTok' && project.tiktokUrl ? (
              // TikTok Embed pakai iframe
              <div className="w-full">
                <div className="relative aspect-[9/16] w-full max-w-sm mx-auto">
                <iframe src={`https://www.tiktok.com/player/v1/${extractTikTokVideoId(project.tiktokUrl)}`}className="absolute top-0 left-0 w-full h-full rounded-lg" frameBorder="0"allow="autoplay; fullscreen"></iframe>
               </div>
                <div className="p-4">
                  <h3
                    className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {project.title}
                  </h3>
                  {project.description && (
                    <p
                      className={`text-sm mt-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {project.description}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              // Regular Project Display
              <>
                <div className="aspect-square flex items-center justify-center p-8 relative">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div
                      className={`w-full h-full rounded-lg flex items-center justify-center text-2xl font-bold ${
                        project.id % 3 === 1
                          ? 'bg-blue-500 text-white'
                          : project.id % 3 === 2
                          ? 'bg-purple-500 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {project.title
                        .split(' ')
                        .map((word) => word[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div
                    className={`text-sm mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {project.technologies?.join(', ') || project.category}
                  </div>
                  <h3
                    className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {project.title}
                  </h3>
                  {project.description && (
                    <p
                      className={`text-sm mt-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {project.description}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            No projects found in this category.
          </p>
        </div>
      )}
    </section>
  );
}