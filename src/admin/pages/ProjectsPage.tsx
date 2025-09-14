import { useState, useRef } from 'react';
import { FiPlus, FiEdit, FiTrash, FiSearch, FiX, FiUpload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebaseData } from '../../context/FirebaseDataContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import type { Project } from '../types';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import SuccessModal from '../components/SuccessModal';
import { ImageCropper } from '../components/ImageCropper';

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useFirebaseData();
  const { isLightMode } = useAdminTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    customCategory: '',
    status: 'Draft' as 'Published' | 'Draft',
    description: '',
    technologies: '',
    imageUrl: '',
    tiktokUrl: '',
    liveUrl: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Image Cropper state
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropSource, setCropSource] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null as string | null,
    name: '',
    isLoading: false
  });

  // Success modal state
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'info' | 'warning'
  });

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        category: project.category,
        customCategory: '',
        status: project.status,
        description: project.description || '',
        technologies: project.technologies?.join(', ') || '',
        imageUrl: project.imageUrl || '',
        tiktokUrl: project.tiktokUrl || '',
        liveUrl: project.liveUrl || '',
      });
      setPreviewImage(project.imageUrl || null);
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        category: '',
        customCategory: '',
        status: 'Draft',
        description: '',
        technologies: '',
        imageUrl: '',
        tiktokUrl: '',
        liveUrl: '',
      });
      setPreviewImage(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      title: '',
      category: '',
      customCategory: '',
      status: 'Draft',
      description: '',
      technologies: '',
      imageUrl: '',
      tiktokUrl: '',
      liveUrl: '',
    });
    setPreviewImage(null);
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
        // Open cropper with selected image
        setCropSource(imageUrl);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (cropped: string) => {
    setPreviewImage(cropped);
    setFormData(prev => ({ ...prev, imageUrl: cropped }));
    setIsCropperOpen(false);
    setCropSource(null);
  };

  const handleCropCancel = () => {
    setIsCropperOpen(false);
    // keep existing previewImage & form data
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Helpers to normalize TikTok URLs
      const tiktokLongRegex = /^https?:\/\/(www\.)?tiktok\.com\/@[^/]+\/video\/(\d+)/i;
      const tiktokShortRegex = /^https?:\/\/vt\.tiktok\.com\/.+/i;
      const resolveTikTokUrl = async (shortUrl: string): Promise<string | null> => {
        try {
          const response = await fetch(shortUrl, { redirect: 'follow' as RequestRedirect });
          return response.url || null;
        } catch (err) {
          console.error('Gagal resolve TikTok short link:', err);
          return null;
        }
      };

      // Prepare normalized TikTok URL if needed
      let normalizedTikTokUrl = formData.tiktokUrl;
      if (formData.category === 'TikTok' && formData.tiktokUrl) {
        if (tiktokShortRegex.test(formData.tiktokUrl)) {
          const resolved = await resolveTikTokUrl(formData.tiktokUrl);
          if (resolved) normalizedTikTokUrl = resolved;
        }
        // Optional: validate final URL shape (long format)
        if (normalizedTikTokUrl && !tiktokLongRegex.test(normalizedTikTokUrl)) {
          console.warn('TikTok URL tidak sesuai format panjang. Tetap disimpan apa adanya.');
        }
      }

      if (editingProject) {
        await updateProject(editingProject.id, {
          title: formData.title,
          category: formData.category === 'Other' ? formData.customCategory : formData.category,
          status: formData.status,
          description: formData.description,
          technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean),
          imageUrl: formData.imageUrl,
          tiktokUrl: normalizedTikTokUrl,
          liveUrl: formData.category === 'TikTok' ? undefined : (formData.liveUrl || undefined),
        });
        showSuccessModal('Project Updated!', `"${formData.title}" has been updated successfully.`);
      } else {
        await addProject({
          title: formData.title,
          category: formData.category === 'Other' ? formData.customCategory : formData.category,
          status: formData.status,
          description: formData.description,
          technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean),
          imageUrl: formData.imageUrl,
          tiktokUrl: normalizedTikTokUrl,
          liveUrl: formData.category === 'TikTok' ? undefined : (formData.liveUrl || undefined),
          createdAt: new Date().toISOString().split('T')[0],
        });
        showSuccessModal('Project Added!', `"${formData.title}" has been added successfully.`);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving project:', error);
      showSuccessModal('Error', 'Failed to save project. Please try again.', 'warning');
    }
  };

  const openDeleteModal = (id: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      id,
      name,
      isLoading: false
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      id: null,
      name: '',
      isLoading: false
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;

    setDeleteModal(prev => ({ ...prev, isLoading: true }));

    try {
      await deleteProject(deleteModal.id);
      showSuccessModal('Project Deleted!', `"${deleteModal.name}" has been deleted successfully.`);
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting project:', error);
      showSuccessModal('Error', 'Failed to delete project. Please try again.', 'warning');
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
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

  const handleDelete = (id: string, name: string) => {
    openDeleteModal(id, name);
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${isLightMode ? 'bg-gray-50' : 'bg-slate-900'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Projects</h1>
            <p className={`mt-1 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>Manage your portfolio projects.</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus />
            <span>Add Project</span>
          </button>
        </div>

        <div className={`rounded-xl shadow-sm ${isLightMode ? 'bg-white' : 'bg-slate-800'}`}>
          <div className={`p-4 border-b ${isLightMode ? 'border-gray-200' : 'border-slate-700'}`}>
            <div className="relative">
              <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-slate-700 border-slate-600'}`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className={`w-full text-sm text-left ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <thead className={`text-xs uppercase ${isLightMode ? 'text-gray-700 bg-gray-50' : 'text-gray-400 bg-slate-700'}`}>
                <tr>
                  <th scope="col" className="px-6 py-3">Title</th>
                  <th scope="col" className="px-6 py-3">Category</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Created At</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map(project => (
                  <tr key={project.id} className={`border-b transition-colors ${isLightMode ? 'bg-white border-gray-200 hover:bg-gray-50' : 'bg-slate-800 border-slate-700 hover:bg-slate-600'}`}>
                    <td className={`px-6 py-4 font-medium whitespace-nowrap ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{project.title}</td>
                    <td className="px-6 py-4">{project.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${project.status === 'Published' ? (isLightMode ? 'bg-green-100 text-green-800' : 'bg-green-900/30 text-green-300') : (isLightMode ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-900/30 text-yellow-300')}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{project.createdAt}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button 
                          onClick={() => openModal(project)}
                          className={`transition-colors ${isLightMode ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'}`}
                        >
                          <FiEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(project.id, project.title)}
                          className={`transition-colors ${isLightMode ? 'text-red-600 hover:text-red-800' : 'text-red-400 hover:text-red-300'}`}
                        >
                          <FiTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {editingProject ? 'Edit Project' : 'Add New Project'}
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="Enter project title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value, customCategory: '' })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select Category</option>
                        {/* Default categories */}
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="Desktop App">Desktop App</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="TikTok">TikTok</option>
                        {/* Dynamic categories from existing projects */}
                        {Array.from(new Set(projects.map(p => p.category)))
                          .filter(category => 
                            category && 
                            !['Web Development', 'Mobile App', 'Desktop App', 'UI/UX Design', 'TikTok'].includes(category)
                          )
                          .sort()
                          .map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))
                        }
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {formData.category === 'Other' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Other Category
                        </label>
                        <input
                          type="text"
                          required={formData.category === 'Other'}
                          value={formData.customCategory}
                          onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                          placeholder="Enter other category name"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Published' | 'Draft' })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="Project description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Technologies
                      </label>
                      <input
                        type="text"
                        value={formData.technologies}
                        onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="React, Node.js, MongoDB (comma separated)"
                      />
                    </div>

                    {formData.category !== 'TikTok' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Project URL (Live)
                          </label>
                          <input
                            type="url"
                            value={formData.liveUrl}
                            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            placeholder="https://your-live-site.com"
                          />
                        </div>


                      </>
                    )}

                    {formData.category === 'TikTok' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          TikTok URL
                        </label>
                        <input
                          type="url"
                          value={formData.tiktokUrl}
                          onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                          placeholder="https://www.tiktok.com/@username/video/1234567890"
                          required={formData.category === 'TikTok'}
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Enter the full TikTok video URL for embedding
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Project Image
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            placeholder="Enter image URL or upload file"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-500 transition-colors flex items-center gap-2"
                          >
                            <FiUpload size={16} />
                            Upload
                          </button>
                        </div>
                        
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        
                        {previewImage && (
                          <div className="relative">
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-slate-600"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  // Open cropper with current preview to re-crop
                                  setCropSource(previewImage);
                                  setIsCropperOpen(true);
                                }}
                                className="bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition-colors"
                                title="Crop/Adjust"
                              >
                                ✂
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewImage(null);
                                  setFormData(prev => ({ ...prev, imageUrl: '' }));
                                }}
                                className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                title="Remove"
                              >
                                <FiX size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingProject ? 'Update Project' : 'Create Project'}
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Delete Project"
          message={`Are you sure you want to delete "${deleteModal.name}"? This action cannot be undone.`}
          isLoading={deleteModal.isLoading}
        />

        {/* Success Modal */}
        <SuccessModal
          isOpen={successModal.isOpen}
          onClose={closeSuccessModal}
          title={successModal.title}
          message={successModal.message}
          type={successModal.type}
        />

        {/* Image Cropper Modal */}
        {isCropperOpen && cropSource && (
          <ImageCropper
            imageSrc={cropSource}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        )}
      </div>
    </div>
  );
}
