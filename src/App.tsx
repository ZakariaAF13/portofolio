import { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import Projects from './components/Projects';
import About from './components/About';
import Resume from './components/Resume';
import Contact from './components/Contact';
import type { Section } from './types';

function AppContent() {
  const [activeSection, setActiveSection] = useState<Section>('project');
  const { theme } = useTheme();

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
    <DataProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </DataProvider>
  );
}

export default App;