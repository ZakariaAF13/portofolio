import { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAdminTheme } from '../context/AdminThemeContext';
import { FiActivity, FiPlus, FiEdit, FiTrash, FiMove, FiUpload, FiLogIn, FiLogOut, FiFilter, FiRefreshCw } from 'react-icons/fi';
import type { ActivityLog } from '../../utils/activityLogger';

interface Activity extends Omit<ActivityLog, 'timestamp'> {
  id: string;
  timestamp: Timestamp;
}

export default function ActivityPage() {
  const { isLightMode } = useAdminTheme();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterEntity, setFilterEntity] = useState<string>('all');
  const [limitCount, setLimitCount] = useState<number>(50);

  // Fetch activities from Firestore
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'activities'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Activity[];
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [limitCount]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const typeMatch = filterType === 'all' || activity.type === filterType;
      const entityMatch = filterEntity === 'all' || activity.entity === filterEntity;
      return typeMatch && entityMatch;
    });
  }, [activities, filterType, filterEntity]);

  // Get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create':
        return <FiPlus className="w-4 h-4" />;
      case 'update':
        return <FiEdit className="w-4 h-4" />;
      case 'delete':
        return <FiTrash className="w-4 h-4" />;
      case 'reorder':
        return <FiMove className="w-4 h-4" />;
      case 'upload':
        return <FiUpload className="w-4 h-4" />;
      case 'login':
        return <FiLogIn className="w-4 h-4" />;
      case 'logout':
        return <FiLogOut className="w-4 h-4" />;
      default:
        return <FiActivity className="w-4 h-4" />;
    }
  };

  // Get color for activity type
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'create':
        return isLightMode ? 'bg-green-100 text-green-700' : 'bg-green-900/30 text-green-300';
      case 'update':
        return isLightMode ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-300';
      case 'delete':
        return isLightMode ? 'bg-red-100 text-red-700' : 'bg-red-900/30 text-red-300';
      case 'reorder':
        return isLightMode ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/30 text-purple-300';
      case 'upload':
        return isLightMode ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-900/30 text-indigo-300';
      case 'login':
        return isLightMode ? 'bg-teal-100 text-teal-700' : 'bg-teal-900/30 text-teal-300';
      case 'logout':
        return isLightMode ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300';
      default:
        return isLightMode ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: Timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'Unknown time';
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${isLightMode ? 'bg-gray-50' : 'bg-slate-900'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
              Recent Activity
            </h1>
            <p className={`mt-0.5 sm:mt-1 text-xs sm:text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Track all changes and activities in your portfolio
            </p>
          </div>
          <button
            onClick={fetchActivities}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filters */}
        <div className={`rounded-xl shadow-sm overflow-hidden border mb-6 ${isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'}`}>
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiFilter className={`w-4 h-4 ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-base sm:text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                Filters
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Type Filter */}
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-1 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                  Activity Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isLightMode ? 'border-gray-300 bg-white text-gray-900' : 'border-slate-600 bg-slate-700 text-white'}`}
                >
                  <option value="all">All Types</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                  <option value="reorder">Reorder</option>
                  <option value="upload">Upload</option>
                  <option value="login">Login</option>
                  <option value="logout">Logout</option>
                </select>
              </div>

              {/* Entity Filter */}
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-1 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                  Entity
                </label>
                <select
                  value={filterEntity}
                  onChange={(e) => setFilterEntity(e.target.value)}
                  className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isLightMode ? 'border-gray-300 bg-white text-gray-900' : 'border-slate-600 bg-slate-700 text-white'}`}
                >
                  <option value="all">All Entities</option>
                  <option value="project">Projects</option>
                  <option value="skill">Skills</option>
                  <option value="knowledge">Knowledge</option>
                  <option value="experience">Experience</option>
                  <option value="education">Education</option>
                  <option value="about">About</option>
                  <option value="profile">Profile</option>
                  <option value="contact">Contact</option>
                  <option value="whatido">What I Do</option>
                  <option value="section">Sections</option>
                  <option value="settings">Settings</option>
                  <option value="media">Media</option>
                  <option value="user">User</option>
                </select>
              </div>

              {/* Limit */}
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-1 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                  Show Last
                </label>
                <select
                  value={limitCount}
                  onChange={(e) => setLimitCount(Number(e.target.value))}
                  className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isLightMode ? 'border-gray-300 bg-white text-gray-900' : 'border-slate-600 bg-slate-700 text-white'}`}
                >
                  <option value="25">25 activities</option>
                  <option value="50">50 activities</option>
                  <option value="100">100 activities</option>
                  <option value="200">200 activities</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className={`rounded-xl shadow-sm overflow-hidden border ${isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'}`}>
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className={`mt-4 text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                Loading activities...
              </p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-12 text-center">
              <FiActivity className={`w-12 h-12 mx-auto mb-4 ${isLightMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <p className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                No activities found
              </p>
            </div>
          ) : (
            <div className="divide-y ${isLightMode ? 'divide-gray-200' : 'divide-slate-700'}">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-4 sm:p-6 transition-colors ${isLightMode ? 'hover:bg-gray-50' : 'hover:bg-slate-700/50'}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm sm:text-base font-medium ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                            {activity.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className={`text-xs ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {activity.userEmail}
                            </span>
                            <span className={`text-xs ${isLightMode ? 'text-gray-400' : 'text-gray-500'}`}>•</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getActivityColor(activity.type)}`}>
                              {activity.type}
                            </span>
                            <span className={`text-xs ${isLightMode ? 'text-gray-400' : 'text-gray-500'}`}>•</span>
                            <span className={`text-xs ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {activity.entity}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`text-xs ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {!loading && filteredActivities.length > 0 && (
          <div className="mt-6 text-center">
            <p className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
              Showing {filteredActivities.length} of {activities.length} activities
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
