import { Fragment, useState } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { activityHelpers } from '../../utils/activityLogger';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  FolderIcon,
  CogIcon,
  DocumentTextIcon,
  UserIcon,
  PhoneIcon,
  ClockIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const navigationItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Projects', href: '/admin/projects', icon: FolderIcon },
  { name: 'Skills', href: '/admin/skills', icon: CogIcon },
  { name: 'About', href: '/admin/about', icon: DocumentTextIcon },
  { name: 'Profile', href: '/admin/profile', icon: UserIcon },
  { name: 'Contact', href: '/admin/contact', icon: PhoneIcon },
  { name: 'Activity', href: '/admin/activity', icon: ClockIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminLayout() {
  const { user, signOut } = useFirebaseAuth();
  const { isLightMode, toggleTheme } = useAdminTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = navigationItems.map(item => ({
    ...item,
    current: location.pathname === item.href
  }));

  const handleSignOut = async () => {
    if (user?.email) {
      await activityHelpers.userLoggedOut(user.email);
    }
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className={`flex h-screen ${isLightMode ? 'bg-gray-100' : 'bg-gray-900'}`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className={`relative flex w-full max-w-xs flex-1 flex-col ${isLightMode ? 'bg-white' : 'bg-gray-800'}`}>
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center justify-between px-4">
                <h1 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{t('admin.adminPanel')}</h1>
                {/* Mobile: Theme toggle and Language toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTheme}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isLightMode 
                        ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                    title={isLightMode ? t('theme.darkMode') : t('theme.lightMode')}
                  >
                    {isLightMode ? (
                      <MoonIcon className="h-5 w-5" />
                    ) : (
                      <SunIcon className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      isLightMode
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    title={language === 'id' ? 'English' : 'Bahasa Indonesia'}
                  >
                    {language === 'id' ? 'ID' : 'EN'}
                  </button>
                </div>
              </div>
              <nav className="mt-5 space-y-1 px-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? isLightMode 
                            ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                            : 'bg-gray-900 text-white'
                          : isLightMode
                            ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.href.endsWith('/dashboard') ? t('admin.dashboard')
                        : item.href.endsWith('/projects') ? t('admin.projects')
                        : item.href.endsWith('/skills') ? t('admin.skills')
                        : item.href.endsWith('/about') ? t('admin.about')
                        : item.href.endsWith('/profile') ? t('admin.profile')
                        : item.href.endsWith('/contact') ? t('admin.contact')
                        : t('admin.activity')}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className={`flex flex-shrink-0 border-t ${isLightMode ? 'border-gray-200' : 'border-gray-700'}`}>
              <div className="w-full p-3">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-3">
                  <UserCircleIcon className={`h-10 w-10 flex-shrink-0 ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{user?.email}</p>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => { setSidebarOpen(false); navigate('/admin/account'); }}
                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isLightMode 
                        ? 'text-blue-700 bg-blue-50 hover:bg-blue-100' 
                        : 'text-blue-300 bg-blue-900/30 hover:bg-blue-900/50'
                    }`}
                  >
                    {t('admin.manageAccount')}
                  </button>
                  <button
                    onClick={handleSignOut}
                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isLightMode 
                        ? 'text-gray-700 bg-gray-100 hover:bg-gray-200' 
                        : 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {t('admin.signOut')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className={`flex flex-1 flex-col min-h-0 ${isLightMode ? 'bg-white' : 'bg-gray-800'}`}>
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center justify-between px-4">
              <h1 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{t('admin.adminPanel')}</h1>
              {/* Desktop: Single theme toggle and language toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    isLightMode 
                      ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                  title={isLightMode ? t('theme.darkMode') : t('theme.lightMode')}
                >
                  {isLightMode ? (
                    <MoonIcon className="h-5 w-5" />
                  ) : (
                    <SunIcon className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isLightMode
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  title={language === 'id' ? 'English' : 'Bahasa Indonesia'}
                >
                  {language === 'id' ? 'ID' : 'EN'}
                </button>
              </div>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? isLightMode 
                          ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                          : 'bg-gray-900 text-white'
                        : isLightMode
                          ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.href.endsWith('/dashboard') ? t('admin.dashboard')
                      : item.href.endsWith('/projects') ? t('admin.projects')
                      : item.href.endsWith('/skills') ? t('admin.skills')
                      : item.href.endsWith('/about') ? t('admin.about')
                      : item.href.endsWith('/profile') ? t('admin.profile')
                      : item.href.endsWith('/contact') ? t('admin.contact')
                      : t('admin.activity')}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className={`flex flex-shrink-0 border-t p-4 ${isLightMode ? 'border-gray-200' : 'border-gray-700'}`}>
            <Menu as="div" className="relative w-full">
              <Menu.Button className={`group block w-full flex-shrink-0 rounded-md p-2 transition-colors ${
                isLightMode ? 'hover:bg-gray-100' : 'hover:bg-gray-700'
              }`}>
                <div className="flex items-center">
                  <UserCircleIcon className={`h-9 w-9 ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  <div className="ml-3 text-left">
                    <p className={`text-sm font-medium ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{user?.email}</p>
                    <p className={`text-xs font-medium ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`}>{t('admin.viewProfile')}</p>
                  </div>
                </div>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className={`absolute bottom-full left-0 z-10 mb-2 w-48 origin-bottom-left rounded-md py-1 shadow-lg ring-1 ring-opacity-5 focus:outline-none ${
                  isLightMode 
                    ? 'bg-white ring-black' 
                    : 'bg-gray-800 ring-gray-600'
                }`}>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate('/admin/account')}
                        className={classNames(
                          active 
                            ? isLightMode ? 'bg-gray-100' : 'bg-gray-700'
                            : '',
                          `block w-full px-4 py-2 text-sm text-left ${
                            isLightMode ? 'text-blue-700' : 'text-blue-300'
                          }`
                        )}
                      >
                        {t('admin.manageAccount')}
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSignOut}
                        className={classNames(
                          active 
                            ? isLightMode ? 'bg-gray-100' : 'bg-gray-700'
                            : '',
                          `block w-full px-4 py-2 text-sm text-left ${
                            isLightMode ? 'text-gray-700' : 'text-gray-200'
                          }`
                        )}
                      >
                        {t('admin.signOut')}
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Mobile header */}
        <div className={`sticky top-0 z-10 border-b lg:hidden ${
          isLightMode 
            ? 'bg-white border-gray-200' 
            : 'bg-gray-800 border-gray-700'
        }`}>
          <div className="flex h-16 items-center justify-between px-4">
            <button
              type="button"
              className={`border-r pr-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden ${
                isLightMode 
                  ? 'border-gray-200 text-gray-500' 
                  : 'border-gray-700 text-gray-400'
              }`}
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{t('admin.adminPanel')}</h1>
            <div className="w-6" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
