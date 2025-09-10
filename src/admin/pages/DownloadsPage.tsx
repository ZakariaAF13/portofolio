import { useState } from 'react';
import { FiDownload, FiUpload, FiSave, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAdminTheme } from '../context/AdminThemeContext';

interface DownloadItem {
  id: string;
  name: string;
  url: string;
  fileName: string;
  description: string;
  isActive: boolean;
}

export default function DownloadsPage() {
  const { isLightMode } = useAdminTheme();
  const [downloads, setDownloads] = useState<DownloadItem[]>([
    {
      id: '1',
      name: 'CV/Resume',
      url: '/resume.pdf',
      fileName: 'CV_Resume.pdf',
      description: 'Main CV/Resume document for download',
      isActive: true
    }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<DownloadItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (item: DownloadItem) => {
    setEditingItem({ ...item });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    setIsSaving(true);
    try {
      setDownloads(prev => 
        prev.map(item => 
          item.id === editingItem.id ? editingItem : item
        )
      );
      setIsEditing(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving download settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingItem(null);
  };

  const handleInputChange = (field: keyof DownloadItem, value: string | boolean) => {
    if (!editingItem) return;
    setEditingItem(prev => prev ? { ...prev, [field]: value } : null);
  };

  const addNewDownload = () => {
    const newItem: DownloadItem = {
      id: Date.now().toString(),
      name: 'New Download',
      url: '',
      fileName: '',
      description: '',
      isActive: false
    };
    setDownloads(prev => [...prev, newItem]);
    handleEdit(newItem);
  };

  const deleteDownload = (id: string) => {
    if (confirm('Are you sure you want to delete this download item?')) {
      setDownloads(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${isLightMode ? 'bg-gray-50' : 'bg-slate-900'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
              Download Settings
            </h1>
            <p className={`mt-1 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Manage downloadable files and links for your portfolio
            </p>
          </div>
          <button
            onClick={addNewDownload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiUpload />
            Add Download
          </button>
        </div>

        <div className="space-y-6">
          {downloads.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl shadow-sm border p-6 ${
                isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'
              }`}
            >
              {isEditing && editingItem?.id === item.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isLightMode ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={editingItem.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          isLightMode 
                            ? 'border-gray-300 bg-white text-gray-900' 
                            : 'border-slate-600 bg-slate-700 text-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isLightMode ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        File Name (for download)
                      </label>
                      <input
                        type="text"
                        value={editingItem.fileName}
                        onChange={(e) => handleInputChange('fileName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          isLightMode 
                            ? 'border-gray-300 bg-white text-gray-900' 
                            : 'border-slate-600 bg-slate-700 text-white'
                        }`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isLightMode ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      File URL/Path
                    </label>
                    <input
                      type="text"
                      value={editingItem.url}
                      onChange={(e) => handleInputChange('url', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        isLightMode 
                          ? 'border-gray-300 bg-white text-gray-900' 
                          : 'border-slate-600 bg-slate-700 text-white'
                      }`}
                      placeholder="/path/to/file.pdf or https://example.com/file.pdf"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isLightMode ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={editingItem.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        isLightMode 
                          ? 'border-gray-300 bg-white text-gray-900' 
                          : 'border-slate-600 bg-slate-700 text-white'
                      }`}
                      placeholder="Brief description of this download..."
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`active-${item.id}`}
                      checked={editingItem.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label 
                      htmlFor={`active-${item.id}`}
                      className={`text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}
                    >
                      Active (show download button)
                    </label>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className={`flex-1 py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        isLightMode 
                          ? 'bg-gray-300 text-gray-700 hover:bg-gray-400' 
                          : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FiDownload className={`${isLightMode ? 'text-blue-600' : 'text-blue-400'}`} />
                      <h3 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                        {item.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          URL:
                        </span>
                        <code className={`text-sm px-2 py-1 rounded ${
                          isLightMode ? 'bg-gray-100 text-gray-800' : 'bg-slate-700 text-gray-300'
                        }`}>
                          {item.url || 'Not set'}
                        </code>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-blue-600 hover:text-blue-700 ${isLightMode ? '' : 'text-blue-400 hover:text-blue-300'}`}
                          >
                            <FiExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Download as:
                        </span>
                        <span className={`text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                          {item.fileName || 'Not set'}
                        </span>
                      </div>
                      
                      {item.description && (
                        <p className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className={`p-2 rounded-lg transition-colors ${
                        isLightMode 
                          ? 'text-blue-600 hover:bg-blue-50' 
                          : 'text-blue-400 hover:bg-blue-900/20'
                      }`}
                    >
                      <FiUpload className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteDownload(item.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isLightMode 
                          ? 'text-red-600 hover:bg-red-50' 
                          : 'text-red-400 hover:bg-red-900/20'
                      }`}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          
          {downloads.length === 0 && (
            <div className="text-center py-12">
              <FiDownload className={`w-12 h-12 mx-auto mb-4 ${
                isLightMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <h3 className={`text-lg font-medium mb-2 ${
                isLightMode ? 'text-gray-900' : 'text-white'
              }`}>
                No downloads configured
              </h3>
              <p className={`${isLightMode ? 'text-gray-500' : 'text-gray-400'} mb-4`}>
                Add your first downloadable file to get started.
              </p>
              <button
                onClick={addNewDownload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiUpload />
                Add Download
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
