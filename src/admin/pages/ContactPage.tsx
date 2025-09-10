import { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin,
  FiSave,
  FiX,
  FiEdit3,
  FiMessageSquare
} from 'react-icons/fi';

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  contactTitle: string;
  contactMessage: string;
}

export default function ContactPage() {
  const { profile, updateProfile } = useData();
  const { isLightMode } = useAdminTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: profile.email || '',
    phone: profile.phone || '',
    address: profile.address || '',
    contactTitle: profile.contactTitle || 'Get In Touch',
    contactMessage: profile.contactMessage || "I'm always interested in new opportunities and exciting projects. Whether you want to hire me, collaborate, or just say hello, feel free to reach out!"
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        ...profile,
        ...contactInfo
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating contact info:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContactInfo({
      email: profile.email || '',
      phone: profile.phone || '',
      address: profile.address || '',
      contactTitle: profile.contactTitle || 'Get In Touch',
      contactMessage: profile.contactMessage || "I'm always interested in new opportunities and exciting projects. Whether you want to hire me, collaborate, or just say hello, feel free to reach out!"
    });
    setIsEditing(false);
  };

  const contactFields = [
    {
      key: 'email' as keyof ContactInfo,
      label: 'Email Address',
      icon: FiMail,
      type: 'email',
      placeholder: 'your.email@example.com'
    },
    {
      key: 'phone' as keyof ContactInfo,
      label: 'Phone Number',
      icon: FiPhone,
      type: 'tel',
      placeholder: '+1 (555) 123-4567'
    },
    {
      key: 'address' as keyof ContactInfo,
      label: 'Address',
      icon: FiMapPin,
      type: 'text',
      placeholder: 'City, Country'
    },
    {
      key: 'contactTitle' as keyof ContactInfo,
      label: 'Contact Section Title',
      icon: FiMessageSquare,
      type: 'text',
      placeholder: 'Get In Touch'
    },
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Contact Information</h1>
              <p className={`mt-1 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Manage your basic contact details
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <FiEdit3 className="mr-2 w-4 h-4" />
                  Edit Contact Info
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <FiX className="mr-2 w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <FiSave className="mr-2 w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
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

        {/* Contact Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className={`rounded-xl shadow-sm border overflow-hidden ${isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'}`}>
            <div className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                Contact Preview
              </h3>
              <p className={`text-sm mb-6 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                This is how your contact information will appear to visitors
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contactFields.filter(field => contactInfo[field.key]).map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.key} className={`flex items-center space-x-3 p-3 rounded-lg ${isLightMode ? 'bg-gray-50' : 'bg-slate-700'}`}>
                      <div className="flex-shrink-0">
                        <Icon className={`w-5 h-5 ${isLightMode ? 'text-blue-600' : 'text-blue-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium uppercase tracking-wide ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {field.label}
                        </p>
                        <p className={`text-sm truncate ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                          {contactInfo[field.key]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {Object.values(contactInfo).every(value => !value) && (
                <div className="text-center py-8">
                  <div className={`mb-2 ${isLightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <FiMail className="w-12 h-12 mx-auto" />
                  </div>
                  <p className={`${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    No contact information available. Click "Edit Contact Info" to add your basic contact details.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
