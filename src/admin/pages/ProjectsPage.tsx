import { useState, useRef } from 'react';
import { FiPlus, FiEdit, FiTrash, FiSearch, FiX, FiUpload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebaseData } from '../../context/FirebaseDataContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import type { Project } from '../types';

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
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setPreviewImage(imageUrl);
        setFormData(prev => ({ ...prev, imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData: Project = {
      id: editingProject?.id || Date.now(),
      title: formData.title,
      category: formData.category === 'Other' ? formData.customCategory : formData.category,
      status: formData.status,
      description: formData.description,
      technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean),
      imageUrl: formData.imageUrl,
      tiktokUrl: formData.tiktokUrl,
      createdAt: editingProject?.createdAt || new Date().toISOString().split('T')[0],
    };

    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }
    
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
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
                          onClick={() => handleDelete(project.id)}
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

        {/* Modal */}
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
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewImage(null);
                                setFormData(prev => ({ ...prev, imageUrl: '' }));
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <FiX size={14} />
                            </button>
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
      </div>
    </div>
  );
}
