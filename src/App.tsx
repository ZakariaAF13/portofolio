import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useFirebaseData } from './context/FirebaseDataContext';
import { useTranslation } from 'react-i18next';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import Projects from './components/Projects';
import About from './components/About';
import Resume from './components/Resume';
import Contact from './components/Contact';
import type { Section } from './types';

function AppContent() {
  const [activeSection, setActiveSection] = useState<Section>(() => {
    const saved = localStorage.getItem('activeSection') as Section | null;
    return saved || 'about';
  });
  const { theme } = useTheme();
  const { t } = useTranslation();
  const firebaseData = useFirebaseData();

  // Persist user section selection across visits
  useEffect(() => {
    try {
      localStorage.setItem('activeSection', activeSection);
    } catch {}
  }, [activeSection]);

  // Show loading state while Firebase data is loading
  if (!firebaseData.profile) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return <About theme={theme} />;
      case 'resume':
        return <Resume theme={theme} />;
      case 'project':
        return <Projects theme={theme} />;
      case 'contact':
        return <Contact theme={theme} />;
      default:
        return <Projects theme={theme} />;
    }
  };

  const backgroundImage = theme === 'dark' 
    ? 'url("../backgroundDark.png")' 
    : 'url("../background.png")';

  return (
    <div 
      className={`min-h-screen p-6 transition-all duration-500 bg-cover bg-center bg-fixed ${theme}`}
      style={{ backgroundImage }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-8 xl:gap-12">
          <div className="xl:sticky xl:top-6 xl:self-start">
            <Sidebar />
          </div>
          
          <main className="flex flex-col gap-8 xl:h-[calc(100vh-3rem)]">
            <div className="flex justify-center xl:justify-end items-center gap-4">
              <Navigation 
                activeSection={activeSection} 
                onSectionChange={setActiveSection}
                theme={theme}
              />
            </div>
            <div className="transition-all duration-300 ease-in-out flex-grow overflow-hidden">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;