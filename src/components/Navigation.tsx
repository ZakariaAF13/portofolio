import React from 'react';
import { User, FileText, Briefcase, MessageSquare } from 'lucide-react';
import type { Section, Theme } from '../types';

interface NavigationProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  theme: Theme;
}

const navItems = [
  { id: 'about' as Section, icon: User, label: 'About' },
  { id: 'resume' as Section, icon: FileText, label: 'Resume' },
  { id: 'project' as Section, icon: Briefcase, label: 'Project' },
  { id: 'contact' as Section, icon: MessageSquare, label: 'Contact' }
];

export default function Navigation({ activeSection, onSectionChange, theme }: NavigationProps) {
  const cardClass = theme === 'dark' 
    ? 'bg-slate-800 border border-slate-700' 
    : 'bg-white';

  return (
    <nav className={`${cardClass} rounded-2xl shadow-lg flex gap-2 p-2 w-fit transition-all duration-500`}>
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeSection === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`flex flex-col items-center gap-1 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive 
                ? 'bg-blue-600 text-white shadow-md' 
                : theme === 'dark'
                  ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <IconComponent size={18} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}