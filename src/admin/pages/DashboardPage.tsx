import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import { useFirebaseData } from '../../context/FirebaseDataContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import { 
  FiFileText, 
  FiTrendingUp, 
  FiAward, 
  FiUser, 
  FiImage, 
  FiSettings, 
  FiDownload, 
  FiPlus, 
  FiClock,
  FiActivity
} from 'react-icons/fi';
import { motion } from 'framer-motion';

type StatItem = {
  name: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  link: string;
  color: 'blue' | 'emerald' | 'purple' | 'amber';
};

type QuickAction = {
  name: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  buttonText: string;
  color: 'blue' | 'emerald' | 'purple' | 'amber';
};

type ActivityItem = {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  status: 'completed' | 'uploaded' | 'updated';
};

const quickActions: QuickAction[] = [
  { 
    name: 'Add New Project', 
    description: 'Create a new portfolio project',
    icon: <FiPlus className="h-5 w-5 text-blue-500" />,
    link: '/admin/projects/new',
    buttonText: 'Create',
    color: 'blue'
  },
  { 
    name: 'Update Profile', 
    description: 'Edit your personal information',
    icon: <FiUser className="h-5 w-5 text-emerald-500" />,
    link: '/admin/about',
    buttonText: 'Edit',
    color: 'emerald'
  },
  { 
    name: 'Manage Skills', 
    description: 'Add or update your skills',
    icon: <FiAward className="h-5 w-5 text-purple-500" />,
    link: '/admin/skills',
    buttonText: 'Manage',
    color: 'purple'
  },
  { 
    name: 'Edit Contact', 
    description: 'Update contact information and social links',
    icon: <FiUser className="h-5 w-5 text-emerald-500" />,
    link: '/admin/contact',
    buttonText: 'Edit',
    color: 'emerald'
  },
  { 
    name: 'Download Settings', 
    description: 'Manage CV download link and file',
    icon: <FiDownload className="h-5 w-5 text-blue-500" />,
    link: '/admin/downloads',
    buttonText: 'Configure',
    color: 'blue'
  },
];

const recentActivity: ActivityItem[] = [
  { 
    id: 1, 
    type: 'project', 
    title: 'E-commerce Platform', 
    description: 'Project updated successfully', 
    time: '2h ago',
    icon: <FiFileText className="h-5 w-5 text-blue-500" />,
    status: 'completed'
  },
  { 
    id: 2, 
    type: 'media', 
    title: 'Project Screenshot', 
    description: 'New image uploaded to gallery', 
    time: '4h ago',
    icon: <FiImage className="h-5 w-5 text-emerald-500" />,
    status: 'uploaded'
  },

];

const StatCard = ({ name, value, icon, change, color }: StatItem) => {
  const { isLightMode } = useAdminTheme();
  const colorVariants = {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    amber: 'from-amber-500 to-amber-600'
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg ${
        isLightMode ? 'bg-white' : 'bg-slate-800'
      }`}
    >
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>{name}</p>
            <p className={`mt-1 text-2xl font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{value}</p>
            <p className={`mt-1 text-xs font-medium flex items-center ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <FiTrendingUp className="mr-1" />
              {change}
            </p>
          </div>
          <div className={`p-3 rounded-lg bg-gradient-to-br ${colorVariants[color]} text-white`}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const QuickActionCard = ({ name, description, icon, link, buttonText, color }: QuickAction) => {
  const { isLightMode } = useAdminTheme();
  const colorVariants = {
    blue: isLightMode ? 'hover:bg-blue-50 text-blue-600' : 'hover:bg-blue-900/30 text-blue-400',
    emerald: isLightMode ? 'hover:bg-emerald-50 text-emerald-600' : 'hover:bg-emerald-900/30 text-emerald-400',
    purple: isLightMode ? 'hover:bg-purple-50 text-purple-600' : 'hover:bg-purple-900/30 text-purple-400',
    amber: isLightMode ? 'hover:bg-amber-50 text-amber-600' : 'hover:bg-amber-900/30 text-amber-400'
  };

  return (
    <motion.div 
      whileHover={{ y: -3 }}
      className={`p-4 rounded-xl border transition-all duration-300 ${
        isLightMode ? 'border-gray-200' : 'border-slate-700'
      } ${colorVariants[color]}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="ml-4">
          <h3 className={`font-medium ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{name}</h3>
          <p className={`mt-1 text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>{description}</p>
          <Link 
            to={link}
            className={`mt-3 inline-flex items-center text-sm font-medium transition-colors ${
              isLightMode 
                ? 'text-blue-600 hover:text-blue-800' 
                : 'text-blue-400 hover:text-blue-300'
            }`}
          >
            {buttonText}
            <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const ActivityItemComponent = ({ title, description, time, icon, status }: Omit<ActivityItem, 'id' | 'type'>) => {
  const { isLightMode } = useAdminTheme();
  const statusColors = {
    completed: isLightMode ? 'bg-green-100 text-green-800' : 'bg-green-900/30 text-green-300',
    uploaded: isLightMode ? 'bg-blue-100 text-blue-800' : 'bg-blue-900/30 text-blue-300',
    updated: isLightMode ? 'bg-amber-100 text-amber-800' : 'bg-amber-900/30 text-amber-300'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start pb-4 last:pb-0"
    >
      <div className="flex-shrink-0 mt-0.5">
        <div className={`p-2 rounded-lg ${isLightMode ? 'bg-gray-100' : 'bg-slate-700'}`}>
          {icon}
        </div>
      </div>
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className={`text-sm font-medium ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{title}</h4>
          <span className={`text-xs ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>{time}</span>
        </div>
        <p className={`mt-1 text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`}>{description}</p>
        {status && (
          <span className={`mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColors[status] || (isLightMode ? 'bg-gray-100 text-gray-800' : 'bg-gray-700 text-gray-200')}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default function DashboardPage() {
  const { user } = useFirebaseAuth();
  const { projects, skills } = useFirebaseData();
  const { isLightMode } = useAdminTheme();
  const [isLoading, setIsLoading] = useState(true);

  const stats: StatItem[] = [
    { 
      name: 'Projects', 
      value: projects.length.toString(), 
      change: `${projects.filter(p => p.status === 'Published').length} published`,
      icon: <FiFileText className="h-6 w-6 text-blue-500" />,
      link: '/admin/projects',
      color: 'blue'
    },
    { 
      name: 'Skills', 
      value: skills.length.toString(), 
      change: `${skills.filter(s => s.percentage >= 80).length} expert`,
      icon: <FiAward className="h-6 w-6 text-purple-500" />,
      link: '/admin/skills',
      color: 'purple'
    },
    { 
      name: 'Categories', 
      value: new Set(projects.map(p => p.category)).size.toString(), 
      change: 'diverse portfolio',
      icon: <FiSettings className="h-6 w-6 text-emerald-500" />,
      link: '/admin/projects',
      color: 'emerald'
    },
    { 
      name: 'Profile', 
      value: '1', 
      change: 'updated',
      icon: <FiUser className="h-6 w-6 text-amber-500" />,
      link: '/admin/profile',
      color: 'amber'
    },
  ];

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${isLightMode ? 'bg-gray-50' : 'bg-slate-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Dashboard</h1>
              <p className={`mt-1 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Welcome back, <span className={`font-medium ${isLightMode ? 'text-blue-600' : 'text-blue-400'}`}>{user?.email || 'Admin'}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center ${
                isLightMode 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-blue-900/30 text-blue-300'
              }`}>
                <FiActivity className="mr-1.5" />
                Last updated: Just now
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat: StatItem, index: number) => (
            <Link to={stat.link} key={index} className="block">
              <StatCard {...stat} />
            </Link>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className={`rounded-xl shadow-sm overflow-hidden border ${
              isLightMode 
                ? 'bg-white border-gray-100' 
                : 'bg-slate-800 border-slate-700'
            }`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Quick Actions</h2>
                    <p className={`mt-1 text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>Common tasks to manage your portfolio</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    isLightMode 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-blue-900/30 text-blue-300'
                  }`}>
                    {quickActions.length} actions
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action: QuickAction, index: number) => (
                    <QuickActionCard key={index} {...action} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className={`rounded-xl shadow-sm overflow-hidden border h-full ${
              isLightMode 
                ? 'bg-white border-gray-100' 
                : 'bg-slate-800 border-slate-700'
            }`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Recent Activity</h2>
                    <p className={`mt-1 text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>Latest updates on your portfolio</p>
                  </div>
                  <Link 
                    to="/admin/activity"
                    className={`text-sm font-medium transition-colors flex items-center ${
                      isLightMode 
                        ? 'text-blue-600 hover:text-blue-800' 
                        : 'text-blue-400 hover:text-blue-300'
                    }`}
                  >
                    View all
                    <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
                <div className="space-y-6">
                  {recentActivity.map((activity: ActivityItem) => (
                    <ActivityItemComponent key={activity.id} {...activity} />
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link 
                    to="/admin/activity"
                    className={`inline-flex items-center text-sm font-medium transition-colors ${
                      isLightMode 
                        ? 'text-blue-600 hover:text-blue-800' 
                        : 'text-blue-400 hover:text-blue-300'
                    }`}
                  >
                    <FiClock className="mr-1.5" />
                    View activity history
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
