import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminThemeContextType {
  isLightMode: boolean;
  toggleToLightMode: () => void;
  toggleToDarkMode: () => void;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export const AdminThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isLightMode, setIsLightMode] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedLightMode = localStorage.getItem('adminLightMode') === 'true';
    setIsLightMode(savedLightMode);
  }, []);

  const toggleToLightMode = () => {
    setIsLightMode(true);
    localStorage.setItem('adminLightMode', 'true');
  };

  const toggleToDarkMode = () => {
    setIsLightMode(false);
    localStorage.setItem('adminLightMode', 'false');
  };

  const toggleTheme = () => {
    const newLightMode = !isLightMode;
    setIsLightMode(newLightMode);
    localStorage.setItem('adminLightMode', newLightMode.toString());
  };

  return (
    <AdminThemeContext.Provider value={{ 
      isLightMode, 
      toggleToLightMode, 
      toggleToDarkMode, 
      toggleTheme 
    }}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = (): AdminThemeContextType => {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
};
