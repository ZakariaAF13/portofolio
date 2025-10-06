import { useState, useRef } from 'react';
import { FiSave, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiCamera, FiUpload, FiPlus, FiTrash2, FiEdit3, FiDownload, FiMove, FiArrowUp, FiArrowDown, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useFirebaseData } from '../../context/FirebaseDataContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import type { Profile, SocialMediaField } from '../types';
import IconPicker, { socialMediaIcons, type IconOption } from '../components/IconPicker';
import SuccessModal from '../components/SuccessModal';
import { ImageCropper } from '../components/ImageCropper';

export default function ProfilePage() {
  const { profile, updateProfile, refreshData } = useFirebaseData();
  const { isLightMode } = useAdminTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Profile | null>(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [socialMediaFields, setSocialMediaFields] = useState<SocialMediaField[]>(
    profile?.socialMediaFields || []
  );
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  
  // Image cropper states
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);

  // Success modal state
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'info' | 'warning'
  });

  // Move modal state for Social Media Links
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [socialOrder, setSocialOrder] = useState<string[]>([]);

  const openMoveModal = () => {
    const ids = (socialMediaFields || []).map(f => f.id);
    setSocialOrder(ids);
    setIsMoveOpen(true);
  };
  const closeMoveModal = () => setIsMoveOpen(false);

  const moveInArray = <T,>(arr: T[], index: number, direction: 'up' | 'down'): T[] => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return arr;
    const copy = [...arr];
    const tmp = copy[index];
    copy[index] = copy[target];
    copy[target] = tmp;
    return copy;
  };
  const moveSocialItem = (id: string, dir: 'up' | 'down') => {
    const idx = socialOrder.indexOf(id);
    if (idx === -1) return;
    setSocialOrder(prev => moveInArray(prev, idx, dir));
  };

  // Show loading state if profile is not loaded yet
  if (!profile) {
    return (
      <div className={`min-h-screen p-4 sm:p-6 flex items-center justify-center ${isLightMode ? 'bg-gray-50' : 'bg-slate-900'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile);
    setPreviewImage(null);
    setSocialMediaFields(profile?.socialMediaFields || []);
    setIsEditing(false);
  };

  // Social Media Field Management
  const addSocialMediaField = () => {
    const newField: SocialMediaField = {
      id: Date.now().toString(),
      platform: '',
      icon: 'other',
      url: '',
      placeholder: 'https://yourlink.com'
    };
    setSocialMediaFields(prev => [...prev, newField]);
    setEditingFieldId(newField.id);
    setShowIconPicker(true);
  };

  const removeSocialMediaField = (fieldId: string) => {
    setSocialMediaFields(prev => prev.filter(field => field.id !== fieldId));
  };

  const updateSocialMediaField = (fieldId: string, updates: Partial<SocialMediaField>) => {
    setSocialMediaFields(prev => 
      prev.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
  };

  const handleIconSelect = (iconName: string, iconData: IconOption) => {
    if (editingFieldId) {
      updateSocialMediaField(editingFieldId, {
        platform: iconData.label,
        icon: iconName,
        placeholder: iconData.placeholder
      });
    }
    setShowIconPicker(false);
    setEditingFieldId(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setOriginalImageSrc(imageUrl);
        setShowImageCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setPreviewImage(croppedImageUrl);
    setFormData(prev => prev ? { ...prev, imageUrl: croppedImageUrl } : null);
    setShowImageCropper(false);
    setOriginalImageSrc(null);
  };

  const handleCropCancel = () => {
    setShowImageCropper(false);
    setOriginalImageSrc(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // If we have a cropped preview (data URL), store it directly to Firestore
      // Note: ImageCropper outputs a compressed 240x240 JPEG data URL to keep doc size under 1MB
      const imageUrlToSave = previewImage || formData?.imageUrl || '';

      await updateProfile({
        ...formData,
        imageUrl: imageUrlToSave,
        socialMediaFields: socialMediaFields
      });
      // Ensure latest data reflected (in case other listeners rely on Firestore data)
      await refreshData();
      setPreviewImage(null);
      setIsEditing(false);
      showSuccessModal('Profile Updated!', 'Your profile has been updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      showSuccessModal('Error', 'Failed to update profile. Please try again.', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  const showSuccessModal = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setSuccessModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const closeSuccessModal = () => {
    setSuccessModal({
      isOpen: false,
      title: '',
      message: '',
      type: 'success'
    });
  };

  const handleInputChange = (field: keyof Profile, value: string) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${isLightMode ? 'bg-gray-50' : 'bg-slate-900'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Profile Settings</h1>
            <p className={`mt-1 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>Manage your personal information and profile details.</p>
          </div>
          {!isEditing && (
            <button 
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiUser />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <div className={`rounded-xl shadow-sm overflow-hidden border ${
          isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'
        }`}>
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src={previewImage || formData?.imageUrl || profile.imageUrl} 
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-white hover:text-blue-200 transition-colors"
                    >
                      <FiCamera size={20} />
                    </button>
                  </div>
                )}
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-blue-100 text-lg">{profile.title}</p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-6">
            {isEditing ? (
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={(e) => { e.preventDefault(); handleSave(); }} 
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                      <FiUser className="inline mr-2" />
                      Full Name
                    </label>
                    <input
                      id="profile-name"
                      name="name"
                      type="text"
                      required
                      value={formData?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-slate-700 border-slate-600'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                      Professional Title
                    </label>
                    <input
                      id="profile-title"
                      name="title"
                      type="text"
                      required
                      value={formData?.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-slate-700 border-slate-600'}`}
                    />
                  </div>

                  <div>
                  <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                      <FiMail className="inline mr-2" />
                      Email Address
                    </label>
                    <input
                      id="profile-email"
                      name="email"
                      type="email"
                      required
                      value={formData?.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-slate-700 border-slate-600'}`}
                    />
                  </div>

                  <div>
                  <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                      <FiPhone className="inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      id="profile-phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData?.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-slate-700 border-slate-600'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                      <FiMapPin className="inline mr-2" />
                      Location
                    </label>
                    <input
                      id="profile-location"
                      name="location"
                      type="text"
                      required
                      value={formData?.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-slate-700 border-slate-600'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                      <FiCalendar className="inline mr-2" />
                      Birthday
                    </label>
                    <input
                      id="profile-birthday"
                      name="birthday"
                      type="text"
                      required
                      value={formData?.birthday || ''}
                      onChange={(e) => handleInputChange('birthday', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-slate-700 border-slate-600'}`}
                      placeholder="e.g., September 13, 2003"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                      <FiDownload className="inline mr-2" />
                      CV Download URL
                    </label>
                    <input
                      id="profile-cv-url"
                      name="cvUrl"
                      type="url"
                      value={formData?.cvUrl || ''}
                      onChange={(e) => handleInputChange('cvUrl', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-slate-700 border-slate-600'}`}
                      placeholder="https://drive.google.com/file/d/your-cv-file-id/view"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${isLightMode ? 'border-gray-300' : 'border-slate-600'}`}>
                      <img 
                        src={previewImage || formData?.imageUrl || profile.imageUrl} 
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FiUpload />
                        Upload New Photo
                      </button>
                      <p className={`mt-1 text-xs ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        JPG, PNG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                  <input
                    id="profile-image-upload"
                    name="profileImage"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    value={formData?.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isLightMode ? 'border-gray-300 bg-white text-gray-900' : 'border-slate-600 bg-slate-700 text-white'}`}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Dynamic Social Media Links Section */}
                <div className={`border-t pt-6 ${isLightMode ? 'border-gray-200' : 'border-slate-600'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Social Media Links</h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={openMoveModal}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                        title="Reorder Social Media Links"
                      >
                        <FiMove className="w-4 h-4" />
                        Move
                      </button>
                      <button
                        type="button"
                        onClick={addSocialMediaField}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <FiPlus className="w-4 h-4" />
                        Add Platform
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {socialMediaFields.map((field) => {
                      const iconData = socialMediaIcons.find(icon => icon.name === field.icon);
                      const IconComponent = iconData?.icon;
                      
                      return (
                        <div key={field.id} className={`flex items-center gap-3 p-4 border rounded-lg ${isLightMode ? 'border-gray-200 bg-gray-50' : 'border-slate-600 bg-slate-700'}`}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingFieldId(field.id);
                              setShowIconPicker(true);
                            }}
                            className={`flex items-center justify-center w-10 h-10 border rounded-lg transition-colors ${isLightMode ? 'bg-white border-gray-300 hover:bg-gray-50' : 'bg-slate-600 border-slate-500 hover:bg-slate-500'}`}
                          >
                            {IconComponent ? (
                              <IconComponent className={`w-5 h-5 ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`} />
                            ) : (
                              <FiEdit3 className={`w-5 h-5 ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`} />
                            )}
                          </button>
                          
                          <div className="flex-1">
                            <input
                              id={`social-${field.id}`}
                              name={`social-${field.platform}`}
                              type="url"
                              value={field.url}
                              onChange={(e) => updateSocialMediaField(field.id, { url: e.target.value })}
                              placeholder={`${field.platform} URL`}
                              className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-slate-700 border-slate-600'}`}
                            />
                            {field.platform && (
                              <p className={`mt-1 text-xs ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {field.platform}
                              </p>
                            )}
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => removeSocialMediaField(field.id)}
                            className={`flex items-center justify-center w-8 h-8 text-red-600 rounded-lg transition-colors ${isLightMode ? 'hover:bg-red-50' : 'hover:bg-red-900/20'}`}
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                    
                    {socialMediaFields.length === 0 && (
                      <div className={`text-center py-8 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <p>No social media links added yet.</p>
                        <p className="text-sm mt-1">Click "Add Platform" to get started.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
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
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isLightMode ? 'bg-gray-300 text-gray-700 hover:bg-gray-400' : 'bg-slate-600 text-gray-300 hover:bg-slate-500'}`}
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className={`flex items-center gap-3 p-4 rounded-lg border ${isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'}`}>
                      <FiUser className="text-blue-500" />
                      <div>
                        <p className={`text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>Full Name</p>
                        <p className={`font-medium ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{profile?.name}</p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 p-4 rounded-lg border ${isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'}`}>
                      <FiMail className="text-green-500" />
                      <div>
                        <p className={`text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>Email</p>
                        <p className={`font-medium ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{profile?.email}</p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 p-4 rounded-lg border ${isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'}`}>
                      <FiPhone className="text-purple-500" />
                      <div>
                        <p className={`text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>Phone</p>
                        <p className={`font-medium ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{profile?.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className={`flex items-center gap-3 p-4 rounded-lg border ${isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'}`}>
                      <FiMapPin className="text-red-500" />
                      <div>
                        <p className={`text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>Location</p>
                        <p className={`font-medium ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{profile?.location}</p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 p-4 rounded-lg border ${isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'}`}>
                      <FiCalendar className="text-amber-500" />
                      <div>
                        <p className={`text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>Birthday</p>
                        <p className={`font-medium ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{profile?.birthday}</p>
                      </div>
                    </div>

                    <div className={`flex items-start gap-3 p-4 rounded-lg border ${isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${isLightMode ? 'bg-blue-100' : 'bg-blue-900/30'}`}>
                        <span className={`${isLightMode ? 'text-blue-600' : 'text-blue-400'} text-sm font-medium`}>T</span>
                      </div>
                      <div>
                        <p className={`text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>Title</p>
                        <p className={`font-medium ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{profile?.title}</p>
                      </div>
                    </div>

                    <div className={`flex items-start gap-3 p-4 rounded-lg border ${isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'}`}>
                      <FiDownload className="text-green-500 mt-1" />
                      <div className="flex-1">
                        <p className={`text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>CV Download URL</p>
                        {profile?.cvUrl ? (
                          <a 
                            href={profile.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`font-medium hover:underline ${isLightMode ? 'text-blue-600' : 'text-blue-400'}`}
                          >
                            {profile.cvUrl}
                          </a>
                        ) : (
                          <p className={`font-medium ${isLightMode ? 'text-gray-400' : 'text-gray-500'}`}>Not set</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {profile?.bio && (
                  <div className={`p-4 rounded-lg border ${isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'}`}>
                    <p className={`text-sm mb-2 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>Bio</p>
                    <p className={`${isLightMode ? 'text-gray-900' : 'text-white'} leading-relaxed`}>{profile.bio}</p>
                  </div>
                )}

                {/* Dynamic Social Media Links Display */}
                <div className={`border-t pt-6 ${isLightMode ? 'border-gray-200' : 'border-slate-600'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Social Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(profile?.socialMediaFields || []).filter(field => field.url).map((field) => {
                      const iconData = socialMediaIcons.find(icon => icon.name === field.icon);
                      const IconComponent = iconData?.icon;
                      
                      return (
                        <div key={field.id} className={`flex items-center gap-3 p-4 rounded-lg border ${isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'}`}>
                          {IconComponent && (
                            <IconComponent className={`${isLightMode ? 'text-blue-600' : 'text-blue-400'} flex-shrink-0 w-5 h-5`} />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>{field.platform}</p>
                            {field.icon === 'discord' ? (
                              <p className={`font-medium truncate ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{field.url}</p>
                            ) : (
                              <a 
                                href={field.icon === 'whatsapp' ? `https://wa.me/${field.url.replace(/[^0-9]/g, '')}` : field.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`font-medium hover:underline truncate block ${isLightMode ? 'text-blue-600' : 'text-blue-400'}`}
                              >
                                {field.url}
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {!(profile?.socialMediaFields || []).some(field => field.url) && (
                    <div className="text-center py-8">
                      <div className="text-gray-400 dark:text-gray-500 mb-2">
                        <FiPlus className="w-12 h-12 mx-auto" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">
                        No social media links added yet. Click "Edit Profile" to add your social media profiles.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Image Cropper Modal */}
      {showImageCropper && originalImageSrc && (
        <ImageCropper
          imageSrc={originalImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      {/* Icon Picker Modal */}
      {showIconPicker && (
        <IconPicker
          selectedIcon={editingFieldId ? socialMediaFields.find(f => f.id === editingFieldId)?.icon || '' : ''}
          onIconSelect={handleIconSelect}
          onClose={() => {
            setShowIconPicker(false);
            setEditingFieldId(null);
          }}
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={closeSuccessModal}
        title={successModal.title}
        message={successModal.message}
        type={successModal.type}
      />

      {/* Move Social Media Links Modal */}
      {isMoveOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeMoveModal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isLightMode ? 'bg-white' : 'bg-slate-800'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Move Social Media Links</h2>
                <button onClick={closeMoveModal} className={`${isLightMode ? 'text-gray-500 hover:text-gray-700' : 'text-gray-300 hover:text-gray-100'}`}>
                  <FiX size={22} />
                </button>
              </div>

              <div className="overflow-x-auto overflow-y-auto h-[480px]">
                <table className={`w-full text-sm text-left ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`}>
                  <thead className={`${isLightMode ? 'bg-gray-100 text-gray-700' : 'bg-slate-700 text-gray-300'}`}>
                    <tr>
                      <th className="px-4 py-2 w-16">Order</th>
                      <th className="px-4 py-2">Platform</th>
                      <th className="px-4 py-2">URL</th>
                      <th className="px-4 py-2 text-right">Move</th>
                    </tr>
                  </thead>
                  <tbody>
                    {socialOrder.map((id, idx) => {
                      const item = socialMediaFields.find(f => f.id === id);
                      if (!item) return null;
                      return (
                        <tr key={id} className={`h-[3rem] ${isLightMode ? 'bg-white border-b border-gray-200' : 'bg-slate-800 border-b border-slate-700'}`}>
                          <td className="px-4 py-2">{idx + 1}</td>
                          <td className={`${isLightMode ? 'text-gray-900' : 'text-white'} px-4 py-2`}>{item.platform || item.icon}</td>
                          <td className="px-4 py-2 truncate max-w-[320px]">{item.url || '-'}</td>
                          <td className="px-4 py-2">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => moveSocialItem(id, 'up')} disabled={idx === 0} className={`p-2 rounded border ${idx === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-600'} ${isLightMode ? 'border-gray-300' : 'border-slate-600'}`} title="Move Up">
                                <FiArrowUp />
                              </button>
                              <button onClick={() => moveSocialItem(id, 'down')} disabled={idx === socialOrder.length - 1} className={`p-2 rounded border ${idx === socialOrder.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-600'} ${isLightMode ? 'border-gray-300' : 'border-slate-600'}`} title="Move Down">
                                <FiArrowDown />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => {
                    // Apply new order to local state; persist when user saves profile
                    const ordered = socialOrder
                      .map(id => socialMediaFields.find(f => f.id === id))
                      .filter((x): x is SocialMediaField => Boolean(x));
                    setSocialMediaFields(ordered);
                    setIsMoveOpen(false);
                    showSuccessModal('Order Updated', 'Social media links order changed. Click Save Changes to persist.');
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Move
                </button>
                <button onClick={closeMoveModal} className="flex-1 bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 transition-colors">Cancel</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
