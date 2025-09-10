import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  Home, 
  FileText, 
  FolderOpen, 
  Mail, 
  Search, 
  Image, 
  LogOut,
  User
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, signOut } = useAuth();

  const navigation = [
    { id: 'hero', name: 'Hero Section', icon: Home },
    { id: 'sections', name: 'Content Sections', icon: FileText },
    { id: 'projects', name: 'Projects', icon: FolderOpen },
    { id: 'contact', name: 'Contact Info', icon: Mail },
    { id: 'seo', name: 'SEO Settings', icon: Search },
    { id: 'media', name: 'Media Manager', icon: Image },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:block hidden">
      <div className="flex flex-col h-full">
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Portfolio CMS</h1>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 px-4 py-4">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};