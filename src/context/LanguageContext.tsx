import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'id' | 'en';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  id: {
    // Sidebar
    'sidebar.downloadCV': 'Unduh CV',
    'sidebar.phone': 'Telepon',
    'sidebar.email': 'Email',
    'sidebar.location': 'Lokasi',
    'sidebar.birthday': 'Tanggal Lahir',
    
    // Navigation
    'nav.home': 'Beranda',
    'nav.resume': 'Resume',
    'nav.projects': 'Proyek',
    'nav.contact': 'Kontak',
    'nav.about': 'Tentang',
    
    // Projects
    'projects.title': 'Proyek',
    'projects.all': 'Semua',
    'projects.noProjects': 'Tidak ada proyek dalam kategori ini.',
    'projects.clickDetails': 'Klik untuk detail',
    
    // Resume
    'resume.title': 'Resume',
    'resume.experience': 'Pengalaman',
    'resume.education': 'Pendidikan',
    'resume.workingSkills': 'Keterampilan Kerja',
    'resume.knowledge': 'Pengetahuan',
    'resume.clickDetails': 'Klik untuk detail',
    
    // Contact
    'contact.title': 'Kontak',
    'contact.getInTouch': 'Mari Terhubung',
    'contact.description': 'Jangan ragu untuk menghubungi saya melalui formulir ini atau informasi kontak di samping.',
    'contact.name': 'Nama',
    'contact.email': 'Email',
    'contact.subject': 'Subjek',
    'contact.message': 'Pesan',
    'contact.send': 'Kirim Pesan',
    'contact.sending': 'Mengirim...',
    'contact.success': 'Pesan berhasil dikirim!',
    'contact.error': 'Gagal mengirim pesan.',
    
    // About
    'about.title': 'Tentang',
    'about.whatIDo': 'Apa yang Saya Lakukan',
    'about.clickDetails': 'Klik untuk detail',
    
    // Theme
    'theme.lightMode': 'Mode Terang',
    'theme.darkMode': 'Mode Gelap',
    
    // Admin
    'admin.dashboard': 'Dasbor',
    'admin.projects': 'Proyek',
    'admin.skills': 'Keterampilan',
    'admin.about': 'Tentang',
    'admin.profile': 'Profil',
    'admin.contact': 'Kontak',
    'admin.activity': 'Aktivitas',
    'admin.account': 'Akun',
    'admin.signOut': 'Keluar',
    'admin.manageAccount': 'Kelola Akun',
    'admin.adminPanel': 'Panel Admin',
    'admin.viewProfile': 'Lihat Profil',
  },
  en: {
    // Sidebar
    'sidebar.downloadCV': 'Download CV',
    'sidebar.phone': 'Phone',
    'sidebar.email': 'Email',
    'sidebar.location': 'Location',
    'sidebar.birthday': 'Birthday',
    
    // Navigation
    'nav.home': 'Home',
    'nav.resume': 'Resume',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'nav.about': 'About',
    
    // Projects
    'projects.title': 'Projects',
    'projects.all': 'All',
    'projects.noProjects': 'No projects found in this category.',
    'projects.clickDetails': 'Click for details',
    
    // Resume
    'resume.title': 'Resume',
    'resume.experience': 'Experience',
    'resume.education': 'Education',
    'resume.workingSkills': 'Working Skills',
    'resume.knowledge': 'Knowledge',
    'resume.clickDetails': 'Click for details',
    
    // Contact
    'contact.title': 'Contact',
    'contact.getInTouch': 'Get In Touch',
    'contact.description': "Don't hesitate to contact me through this form or the contact information provided.",
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Message sent successfully!',
    'contact.error': 'Failed to send message.',
    
    // About
    'about.title': 'About',
    'about.whatIDo': 'What I Do',
    'about.clickDetails': 'Click for details',
    
    // Theme
    'theme.lightMode': 'Light Mode',
    'theme.darkMode': 'Dark Mode',
    
    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.projects': 'Projects',
    'admin.skills': 'Skills',
    'admin.about': 'About',
    'admin.profile': 'Profile',
    'admin.contact': 'Contact',
    'admin.activity': 'Activity',
    'admin.account': 'Account',
    'admin.signOut': 'Sign Out',
    'admin.manageAccount': 'Manage Account',
    'admin.adminPanel': 'Admin Panel',
    'admin.viewProfile': 'View Profile',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('id');

  // Initialize language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage') as Language | null;
    if (savedLang && (savedLang === 'id' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
