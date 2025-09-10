import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGlobe,
  FiMail,
  FiExternalLink,
  FiX
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

export interface IconOption {
  name: string;
  icon: React.ComponentType<any>;
  label: string;
  placeholder: string;
}

const socialMediaIcons: IconOption[] = [
  { name: 'linkedin', icon: FaLinkedin, label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourprofile' },
  { name: 'github', icon: FaGithub, label: 'GitHub', placeholder: 'https://github.com/yourusername' },
  { name: 'twitter', icon: FaTwitter, label: 'Twitter', placeholder: 'https://twitter.com/yourusername' },
  { name: 'facebook', icon: FaFacebook, label: 'Facebook', placeholder: 'https://facebook.com/yourprofile' },
  { name: 'instagram', icon: FaInstagram, label: 'Instagram', placeholder: 'https://instagram.com/yourusername' },
  { name: 'youtube', icon: FaYoutube, label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel' },
  { name: 'whatsapp', icon: FaWhatsapp, label: 'WhatsApp', placeholder: 'https://wa.me/yourphonenumber' },
  { name: 'discord', icon: FaDiscord, label: 'Discord', placeholder: 'yourusername#1234' },
  { name: 'tiktok', icon: FaTiktok, label: 'TikTok', placeholder: 'https://tiktok.com/@yourusername' },
  { name: 'telegram', icon: FaTelegram, label: 'Telegram', placeholder: 'https://t.me/yourusername' },
  { name: 'website', icon: FiGlobe, label: 'Website', placeholder: 'https://yourwebsite.com' },
  { name: 'email', icon: FiMail, label: 'Email', placeholder: 'your.email@example.com' },
  { name: 'twitch', icon: FaTwitch, label: 'Twitch', placeholder: 'https://twitch.tv/yourusername' },
  { name: 'spotify', icon: FaSpotify, label: 'Spotify', placeholder: 'https://open.spotify.com/user/yourusername' },
  { name: 'soundcloud', icon: FaSoundcloud, label: 'SoundCloud', placeholder: 'https://soundcloud.com/yourusername' },
  { name: 'podcast', icon: FaPodcast, label: 'Podcast', placeholder: 'https://yourpodcast.com' },
  { name: 'vimeo', icon: FaVimeo, label: 'Vimeo', placeholder: 'https://vimeo.com/yourusername' },
  { name: 'behance', icon: FaBehance, label: 'Behance', placeholder: 'https://behance.net/yourusername' },
  { name: 'other', icon: FiExternalLink, label: 'Other', placeholder: 'https://yourlink.com' }
];

interface IconPickerProps {
  selectedIcon: string;
  onIconSelect: (iconName: string, iconData: IconOption) => void;
  onClose: () => void;
}

export default function IconPicker({ selectedIcon, onIconSelect, onClose }: IconPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = socialMediaIcons.filter(icon =>
    icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-600">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Social Media Platform
              </h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            {/* Search */}
            <div className="mt-3">
              <input
                type="text"
                placeholder="Search platforms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Icon Grid */}
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {filteredIcons.map((iconOption) => {
                const IconComponent = iconOption.icon;
                const isSelected = selectedIcon === iconOption.name;
                
                return (
                  <button
                    key={iconOption.name}
                    onClick={() => onIconSelect(iconOption.name, iconOption)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-slate-600'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${
                      isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                    }`}>
                      {iconOption.label}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {filteredIcons.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No platforms found</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export { socialMediaIcons };
