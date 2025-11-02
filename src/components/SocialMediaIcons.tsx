import React from 'react';
import { 
  FiGlobe,
  FiMail,
  FiExternalLink
} from 'react-icons/fi';
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaDiscord,
  FaWhatsapp,
  FaTelegram,
  FaTwitch,
  FaSpotify,
  FaSoundcloud,
  FaPodcast,
  FaVimeo,
  FaBehance
} from 'react-icons/fa';
import { useFirebaseData } from '../context/FirebaseDataContext';
import { useTheme } from '../context/ThemeContext';

interface SocialMediaIconsProps {
  className?: string;
  iconSize?: string;
  showLabels?: boolean;
  variant?: 'default' | 'minimal' | 'colored' | 'brandHover';
}

const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({ 
  className = '', 
  iconSize = 'w-5 h-5',
  showLabels = false,
  variant = 'default'
}) => {
  const { profile } = useFirebaseData();
  const { theme } = useTheme();

  // Icon mapping for dynamic social media fields
  const iconMap: Record<string, React.ComponentType<any>> = {
    linkedin: FaLinkedin,
    github: FaGithub,
    twitter: FaTwitter,
    facebook: FaFacebook,
    instagram: FaInstagram,
    youtube: FaYoutube,
    telegram: FaTelegram,
    whatsapp: FaWhatsapp,
    website: FiGlobe,
    email: FiMail,
    other: FiExternalLink,
    tiktok: FaTiktok,
    discord: FaDiscord,
    twitch: FaTwitch,
    spotify: FaSpotify,
    soundcloud: FaSoundcloud,
    podcast: FaPodcast,
    vimeo: FaVimeo,
    behance: FaBehance
  };

  // Color mapping for different platforms
  const getColorClasses = (iconName: string) => {
    const colorMap: Record<string, { color: string; bgColor: string; coloredBg: string; baseText: string; hoverSolidBg: string } > = {
      linkedin: { color: 'hover:text-blue-600', bgColor: 'hover:bg-blue-50', coloredBg: 'bg-blue-600 hover:bg-blue-700', baseText: 'text-blue-600', hoverSolidBg: 'hover:bg-blue-600' },
      github: theme === 'dark'
        ? { color: 'hover:text-white', bgColor: 'hover:bg-gray-800', coloredBg: 'bg-gray-900 hover:bg-gray-800', baseText: 'text-white', hoverSolidBg: 'hover:bg-gray-900' }
        : { color: 'hover:text-gray-900', bgColor: 'hover:bg-gray-50', coloredBg: 'bg-gray-900 hover:bg-gray-800', baseText: 'text-gray-900', hoverSolidBg: 'hover:bg-gray-900' },
      twitter: { color: 'hover:text-blue-400', bgColor: 'hover:bg-blue-50', coloredBg: 'bg-blue-400 hover:bg-blue-500', baseText: 'text-blue-400', hoverSolidBg: 'hover:bg-blue-400' },
      facebook: { color: 'hover:text-blue-800', bgColor: 'hover:bg-blue-50', coloredBg: 'bg-blue-800 hover:bg-blue-900', baseText: 'text-blue-800', hoverSolidBg: 'hover:bg-blue-800' },
      instagram: { color: 'hover:text-pink-600', bgColor: 'hover:bg-pink-50', coloredBg: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600', baseText: 'text-pink-600', hoverSolidBg: 'hover:bg-pink-600' },
      youtube: { color: 'hover:text-red-600', bgColor: 'hover:bg-red-50', coloredBg: 'bg-red-600 hover:bg-red-700', baseText: 'text-red-600', hoverSolidBg: 'hover:bg-red-600' },
      whatsapp: { color: 'hover:text-green-600', bgColor: 'hover:bg-green-50', coloredBg: 'bg-green-600 hover:bg-green-700', baseText: 'text-green-600', hoverSolidBg: 'hover:bg-green-600' },
      discord: { color: 'hover:text-indigo-600', bgColor: 'hover:bg-indigo-50', coloredBg: 'bg-indigo-600 hover:bg-indigo-700', baseText: 'text-indigo-600', hoverSolidBg: 'hover:bg-indigo-600' },
      telegram: { color: 'hover:text-sky-500', bgColor: 'hover:bg-sky-50', coloredBg: 'bg-sky-500 hover:bg-sky-600', baseText: 'text-sky-500', hoverSolidBg: 'hover:bg-sky-500' },
      tiktok: theme === 'dark'
        ? { color: 'hover:text-white', bgColor: 'hover:bg-gray-800', coloredBg: 'bg-black hover:bg-gray-900', baseText: 'text-white', hoverSolidBg: 'hover:bg-black' }
        : { color: 'hover:text-black', bgColor: 'hover:bg-gray-50', coloredBg: 'bg-black hover:bg-gray-900', baseText: 'text-black', hoverSolidBg: 'hover:bg-black' },
      twitch: { color: 'hover:text-purple-600', bgColor: 'hover:bg-purple-50', coloredBg: 'bg-purple-600 hover:bg-purple-700', baseText: 'text-purple-600', hoverSolidBg: 'hover:bg-purple-600' },
      spotify: { color: 'hover:text-green-500', bgColor: 'hover:bg-green-50', coloredBg: 'bg-green-500 hover:bg-green-600', baseText: 'text-green-500', hoverSolidBg: 'hover:bg-green-500' },
      soundcloud: { color: 'hover:text-orange-500', bgColor: 'hover:bg-orange-50', coloredBg: 'bg-orange-500 hover:bg-orange-600', baseText: 'text-orange-500', hoverSolidBg: 'hover:bg-orange-500' },
      podcast: { color: 'hover:text-pink-500', bgColor: 'hover:bg-pink-50', coloredBg: 'bg-pink-500 hover:bg-pink-600', baseText: 'text-pink-500', hoverSolidBg: 'hover:bg-pink-500' },
      vimeo: { color: 'hover:text-sky-600', bgColor: 'hover:bg-sky-50', coloredBg: 'bg-sky-600 hover:bg-sky-700', baseText: 'text-sky-600', hoverSolidBg: 'hover:bg-sky-600' },
      behance: { color: 'hover:text-blue-600', bgColor: 'hover:bg-blue-50', coloredBg: 'bg-blue-600 hover:bg-blue-700', baseText: 'text-blue-600', hoverSolidBg: 'hover:bg-blue-600' },
      website: { color: 'hover:text-emerald-600', bgColor: 'hover:bg-emerald-50', coloredBg: 'bg-emerald-600 hover:bg-emerald-700', baseText: 'text-emerald-600', hoverSolidBg: 'hover:bg-emerald-600' },
      email: { color: 'hover:text-gray-600', bgColor: 'hover:bg-gray-50', coloredBg: 'bg-gray-600 hover:bg-gray-700', baseText: 'text-gray-600', hoverSolidBg: 'hover:bg-gray-600' },
      default: { color: 'hover:text-blue-600', bgColor: 'hover:bg-blue-50', coloredBg: 'bg-blue-600 hover:bg-blue-700', baseText: 'text-blue-600', hoverSolidBg: 'hover:bg-blue-600' }
    };
    return colorMap[iconName] || colorMap.default;
  };

  // Convert dynamic social media fields to the expected format
  const socialLinks = (profile?.socialMediaFields || [])
    .filter(field => field.url)
    .map(field => {
      const IconComponent = iconMap[field.icon] || FiExternalLink;
      const colors = getColorClasses(field.icon);
      
      return {
        name: field.platform,
        url: field.url,
        icon: IconComponent,
        color: colors.color,
        bgColor: colors.bgColor,
        coloredBg: colors.coloredBg,
        coloredText: 'text-white',
        baseText: colors.baseText,
        hoverSolidBg: colors.hoverSolidBg,
        isPhone: field.icon === 'whatsapp' || field.icon === 'telegram',
        isUsername: field.icon === 'discord'
      };
    });

  const availableLinks = socialLinks.filter(link => link.url && link.url.trim() !== '');

  if (availableLinks.length === 0) {
    return null;
  }

  const getHref = (link: any) => {
    if (link.isPhone) {
      return `https://wa.me/${link.url.replace(/[^0-9]/g, '')}`;
    }
    if (link.isUsername) {
      return `#`; // Discord usernames don't have direct links
    }
    return link.url;
  };

  const getTarget = (link: any) => {
    if (link.isUsername) {
      return undefined;
    }
    return '_blank';
  };

  const getOnClick = (link: any) => {
    if (link.isUsername) {
      return (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(link.url);
        // You could add a toast notification here
      };
    }
    return undefined;
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {availableLinks.map((link) => {
        const Icon = link.icon;
        
        if (variant === 'minimal') {
          return (
            <a
              key={link.name}
              href={getHref(link)}
              target={getTarget(link)}
              rel="noopener noreferrer"
              onClick={getOnClick(link)}
              className={`text-gray-600 dark:text-gray-400 ${link.color} transition-colors duration-200`}
              title={link.name}
            >
              <Icon className={iconSize} />
            </a>
          );
        }

        if (variant === 'colored') {
          return (
            <a
              key={link.name}
              href={getHref(link)}
              target={getTarget(link)}
              rel="noopener noreferrer"
              onClick={getOnClick(link)}
              className={`p-2 rounded-lg ${link.coloredBg} ${link.coloredText} transition-all duration-200 transform hover:scale-105`}
              title={link.name}
            >
              <Icon className={iconSize} />
            </a>
          );
        }

        if (variant === 'brandHover') {
          const [isHovered, setIsHovered] = React.useState(false);
          const baseTextClass = link.baseText as string;
          const getBrandColor = (baseTextClass: string) => {
            if (baseTextClass.includes('black')) return '#000000';
            if (baseTextClass.includes('blue')) return '#2563eb';
            if (baseTextClass.includes('green')) return '#16a34a';
            if (baseTextClass.includes('pink')) return '#db2777';
            if (baseTextClass.includes('red')) return '#dc2626';
            if (baseTextClass.includes('sky')) return '#0088cc'; 
            if (baseTextClass.includes('indigo')) return '#4f46e5';
            if (baseTextClass.includes('purple')) return '#9333ea';
            if (baseTextClass.includes('orange')) return '#ea580c';
            if (baseTextClass.includes('emerald')) return '#059669';
            if (baseTextClass.includes('gray')) return '#4b5563';
            return '#2563eb'; 
          };
          
          const brandColor = getBrandColor(baseTextClass);
          return (
            <a
              key={link.name}
              href={getHref(link)}
              target={getTarget(link)}
              rel="noopener noreferrer"
              onClick={getOnClick(link)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`group p-2 rounded-lg transition-all duration-200 transform hover:scale-105`}
              style={{ 
                backgroundColor: isHovered 
                  ? brandColor
                  : theme === 'dark' ? '#334155' : '#f3f4f6'
              }}
              title={link.name}
            >
              <Icon className={`${iconSize} transition-colors duration-200`} 
                    style={{ color: isHovered ? '#ffffff' : brandColor }} />
            </a>
          );
        }

        // Default variant
        return (
          <a
            key={link.name}
            href={getHref(link)}
            target={getTarget(link)}
            rel="noopener noreferrer"
            onClick={getOnClick(link)}
            className={`p-2 rounded-lg text-gray-600 dark:text-gray-400 ${link.color} ${link.bgColor} dark:hover:bg-slate-700 transition-all duration-200 transform hover:scale-105`}
            title={link.name}
          >
            <Icon className={iconSize} />
            {showLabels && (
              <span className="ml-2 text-sm font-medium">{link.name}</span>
            )}
          </a>
        );
      })}
    </div>
  );
};

export default SocialMediaIcons;
