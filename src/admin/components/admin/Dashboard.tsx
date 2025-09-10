import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { HeroEditor } from './editors/HeroEditor';
import { SectionEditor } from './editors/SectionEditor';
import { ProjectsEditor } from './editors/ProjectsEditor';
import { ContactEditor } from './editors/ContactEditor';
import { SEOEditor } from './editors/SEOEditor';
import { MediaManager } from './MediaManager';
import { PreviewButton } from './PreviewButton';

type ActiveTab = 'hero' | 'sections' | 'projects' | 'contact' | 'seo' | 'media';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('hero');

  const renderActiveEditor = () => {
    switch (activeTab) {
      case 'hero':
        return <HeroEditor />;
      case 'sections':
        return <SectionEditor />;
      case 'projects':
        return <ProjectsEditor />;
      case 'contact':
        return <ContactEditor />;
      case 'seo':
        return <SEOEditor />;
      case 'media':
        return <MediaManager />;
      default:
        return <HeroEditor />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 lg:pl-64">
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveEditor()}
          </div>
        </main>
      </div>
      <PreviewButton />
    </div>
  );
};