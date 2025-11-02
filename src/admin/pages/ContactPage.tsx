import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFirebaseData } from '../../context/FirebaseDataContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import { 
  FiSave,
  FiX,
  FiEdit3,
  FiMessageSquare
} from 'react-icons/fi';

interface ContactInfo {
  contactMessage: string;
}

export default function ContactPage() {
  const { profile, updateProfile } = useFirebaseData();
  const { isLightMode } = useAdminTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    contactMessage: profile?.contactMessage || "I'm always interested in new opportunities and exciting projects. Whether you want to hire me, collaborate, or just say hello, feel free to reach out!"
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save only contactMessage (profile may be null initially)
      await updateProfile({ contactMessage: contactInfo.contactMessage });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating contact info:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContactInfo({
      contactMessage: profile?.contactMessage || "I'm always interested in new opportunities and exciting projects. Whether you want to hire me, collaborate, or just say hello, feel free to reach out!"
    });
    setIsEditing(false);
  };

  // (profile can be null initially)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setContactInfo({
      contactMessage: profile?.contactMessage || "I'm always interested in new opportunities and exciting projects. Whether you want to hire me, collaborate, or just say hello, feel free to reach out!"
    });
  }, [profile?.contactMessage]);

  const contactFields = [
    {
      key: 'contactMessage' as keyof ContactInfo,
      label: 'Contact Message',
      icon: FiMessageSquare,
      type: 'textarea',
      placeholder: 'Your contact message...'
    }
  ];

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${isLightMode ? 'bg-gray-50' : 'bg-slate-900'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className={`text-xl sm:text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Contact Information</h1>
              <p className={`mt-0.5 sm:mt-1 text-xs sm:text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Manage your basic contact details
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
                >
                  <FiEdit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Edit Contact Info</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
                  >
                    <FiX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
                  >
                    <FiSave className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={`rounded-xl shadow-sm border overflow-hidden ${isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'}`}>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactFields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.key} className={`space-y-2 ${field.key === 'contactMessage' ? 'md:col-span-2' : ''}`}>
                      <label className={`flex items-center text-sm font-medium ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                        <Icon className="mr-2 w-4 h-4" />
                        {field.label}
                      </label>
                      {isEditing ? (
                        field.type === 'textarea' ? (
                          <textarea
                            value={contactInfo[field.key]}
                            onChange={(e) => setContactInfo(prev => ({
                              ...prev,
                              [field.key]: e.target.value
                            }))}
                            placeholder={field.placeholder}
                            rows={4}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${isLightMode ? 'border-gray-300 bg-white text-gray-900 placeholder-gray-500' : 'border-slate-600 bg-slate-700 text-white placeholder-gray-400'}`}
                          />
                        ) : (
                          <input
                            type={field.type}
                            value={contactInfo[field.key]}
                            onChange={(e) => setContactInfo(prev => ({
                              ...prev,
                              [field.key]: e.target.value
                            }))}
                            placeholder={field.placeholder}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${isLightMode ? 'border-gray-300 bg-white text-gray-900 placeholder-gray-500' : 'border-slate-600 bg-slate-700 text-white placeholder-gray-400'}`}
                          />
                        )
                      ) : (
                        <div className={`px-3 py-2 rounded-lg border ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-slate-700 border-slate-600'}`}>
                          {contactInfo[field.key] ? (
                            <span className={`whitespace-pre-wrap ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                              {contactInfo[field.key]}
                            </span>
                          ) : (
                            <span className={`italic ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              Not set
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Preview removed as requested */}
      </div>
    </div>
  );
}
