import { Download, Phone, Mail, MapPin, Gift, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useFirebaseData } from '../context/FirebaseDataContext';
import SocialMediaIcons from './SocialMediaIcons';
import type { ContactInfo } from '../types';

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const { profile } = useFirebaseData();
  
  const contactInfo: ContactInfo[] = [
    {
      icon: 'phone',
      label: 'Phone',
      value: profile?.phone || '',
      backgroundColor: 'bg-pink-100',
      iconColor: 'text-pink-500'
    },
    {
      icon: 'email',
      label: 'Email', 
      value: profile?.email || '',
      backgroundColor: 'bg-green-100',
      iconColor: 'text-green-500'
    },
    {
      icon: 'location',
      label: 'Location',
      value: profile?.location || '',
      backgroundColor: 'bg-pink-100',
      iconColor: 'text-pink-500'
    },
    {
      icon: 'birthday',
      label: 'Birthday',
      value: profile?.birthday || '',
      backgroundColor: 'bg-blue-100',
      iconColor: 'text-blue-500'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'phone': return Phone;
      case 'email': return Mail;
      case 'location': return MapPin;
      case 'birthday': return Gift;
      default: return undefined;
    }
  };

  const cardClass = theme === 'dark' ? 'bg-slate-800' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const subtitleClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const innerCardClass = theme === 'dark' ? 'bg-slate-900/70' : 'bg-gray-100';
  const contactIconBgClass = theme === 'dark' ? 'bg-slate-800' : 'bg-white';
  
  return (
    <aside className={`relative ${cardClass} rounded-3xl shadow-xl p-6 flex flex-col items-center transition-all duration-500 w-full max-w-sm mx-auto`}>
      <div className="absolute top-5 right-5 z-10">
        <button
          onClick={toggleTheme}
          className="mt-6 p-2 rounded-full hover:bg-gray-500 dark:hover:bg-slate-700 transition-colors"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
      
      <div className="w-28 h-28 rounded-2xl overflow-hidden mb-4 shadow-lg">
        <img 
          src={profile?.imageUrl || ""} 
          alt={`Portrait of ${profile?.name || 'User'}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      <h2 className={`font-bold text-xl text-center ${textClass} w-full`}>{profile?.name || 'Loading...'}</h2>
      <span className={`mt-2 mb-5 border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} px-4 py-1 rounded-full text-sm font-medium ${subtitleClass}`}>
        {profile?.title || 'Loading...'}
      </span>
      
      <div className="mb-6">
        <div className="bg-transparent p-1 rounded-lg">
          <SocialMediaIcons 
            variant="brandHover"
            iconSize="w-5 h-5"
            className="justify-center"
          />
        </div>
      </div>

      <div className={`w-full p-5 rounded-2xl ${innerCardClass}`}>
        {contactInfo.map((item, index) => {
          const Icon = getIcon(item.icon);
          return (
            <div key={index} className={`flex items-start ${index !== contactInfo.length - 1 ? 'mb-4' : ''}`}>
              <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center mr-4 ${contactIconBgClass} shadow-sm`}>
                {Icon && <Icon size={18} className={item.iconColor} />}
              </div>
              <div>
                <p className={`text-xs ${subtitleClass}`}>{item.label}</p>
                <p className={`font-medium text-sm ${textClass}`}>{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <a 
        href={profile?.cvUrl || '#'} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full mt-6 bg-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20"
      >
        <Download size={16} />
        Download CV
      </a>
    </aside>
  );
}