import { useState } from 'react';
import { FiPlus, FiEdit, FiTrash, FiSearch, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminTheme } from '../context/AdminThemeContext';
import type { Skill, Experience, Education } from '../types';
import { useFirebaseData } from '../../context/FirebaseDataContext';

export default function ResumePage() {
  const { isLightMode } = useAdminTheme();
  const { skills, addSkill, updateSkill, deleteSkill, knowledge, addKnowledge, updateKnowledge, deleteKnowledge, experiences, addExperience, updateExperience, deleteExperience, educations, addEducation, updateEducation, deleteEducation } = useFirebaseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
    percentage: 0,
  });

  // Knowledge modal state
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false);
  const [editingKnowledgeIndex, setEditingKnowledgeIndex] = useState<number | null>(null);
  const [knowledgeInput, setKnowledgeInput] = useState('');

  // Experience modal state
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [experienceFormData, setExperienceFormData] = useState({
    title: '',
    company: '',
    period: '',
    location: '',
    description: '',
  });

  // Education modal state
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [educationFormData, setEducationFormData] = useState({
    degree: '',
    institution: '',
    period: '',
    location: '',
  });

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        level: skill.level,
        percentage: skill.percentage,
      });
    } else {
      setEditingSkill(null);
      setFormData({
        name: '',
        category: '',
        level: 'Beginner',
        percentage: 0,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setFormData({
      name: '',
      category: '',
      level: 'Beginner',
      percentage: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillPayload = {
      name: formData.name,
      category: formData.category,
      level: formData.level as Skill['level'],
      percentage: formData.percentage,
      createdAt: editingSkill?.createdAt || new Date().toISOString().split('T')[0],
    } as Omit<Skill, 'id'>;

    if (editingSkill) {
      updateSkill(editingSkill.id, skillPayload);
    } else {
      addSkill(skillPayload);
    }

    closeModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      deleteSkill(id);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return isLightMode ? 'bg-green-100 text-green-800' : 'bg-green-900/30 text-green-300';
      case 'Advanced': return isLightMode ? 'bg-blue-100 text-blue-800' : 'bg-blue-900/30 text-blue-300';
      case 'Intermediate': return isLightMode ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-900/30 text-yellow-300';
      default: return isLightMode ? 'bg-gray-100 text-gray-800' : 'bg-gray-900/30 text-gray-300';
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${isLightMode ? 'bg-gray-50' : 'bg-slate-900'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Skills</h1>
            <p className={`mt-1 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>Manage your technical skills and expertise.</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus />
            <span>Add Skill</span>
          </button>
        </div>

        <div className={`rounded-xl shadow-sm ${isLightMode ? 'bg-white' : 'bg-slate-800'}`}>
          <div className={`p-4 border-b ${isLightMode ? 'border-gray-200' : 'border-slate-700'}`}>
            <div className="relative">
              <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search skills..."
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
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Category</th>
                  <th scope="col" className="px-6 py-3">Level</th>
                  <th scope="col" className="px-6 py-3">Proficiency</th>
                  <th scope="col" className="px-6 py-3">Created At</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSkills.map(skill => (
                  <tr key={skill.id} className={`border-b transition-colors ${isLightMode ? 'bg-white border-gray-200 hover:bg-gray-50' : 'bg-slate-800 border-slate-700 hover:bg-slate-600'}`}>
                    <td className={`px-6 py-4 font-medium whitespace-nowrap ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{skill.name}</td>
                    <td className="px-6 py-4">{skill.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex-1 rounded-full h-2 ${isLightMode ? 'bg-gray-200' : 'bg-slate-700'}`}>
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${skill.percentage}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{skill.percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{skill.createdAt}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button 
                          onClick={() => openModal(skill)}
                          className={`transition-colors ${isLightMode ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'}`}
                        >
                          <FiEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(skill.id)}
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

        {/* Knowledge Management */}
        {/* Experience Management */}
        <div className={`mt-8 rounded-xl shadow-sm ${isLightMode ? 'bg-white' : 'bg-slate-800'}`}>
          <div className={`p-4 border-b flex items-center justify-between ${isLightMode ? 'border-gray-200' : 'border-slate-700'}`}>
            <div>
              <h2 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Experience</h2>
              <p className={`${isLightMode ? 'text-gray-500' : 'text-gray-400'} text-sm`}>Manage your work experience entries.</p>
            </div>
            <button
              onClick={() => {
                setEditingExperience(null);
                setExperienceFormData({ title: '', company: '', period: '', location: '', description: '' });
                setIsExperienceModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus />
              <span>Add Experience</span>
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className={`p-4 rounded-lg border ${isLightMode ? 'border-gray-200 bg-gray-50' : 'border-slate-600 bg-slate-700'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{exp.title}</h3>
                      <p className={`text-blue-600 text-sm font-medium`}>{exp.company}</p>
                      <p className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>{exp.period} • {exp.location}</p>
                      <p className={`text-sm mt-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>{exp.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => {
                          setEditingExperience(exp);
                          setExperienceFormData({
                            title: exp.title,
                            company: exp.company,
                            period: exp.period,
                            location: exp.location,
                            description: exp.description,
                          });
                          setIsExperienceModalOpen(true);
                        }}
                        className={`${isLightMode ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'} text-sm`}
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this experience?')) {
                            deleteExperience(exp.id);
                          }
                        }}
                        className={`${isLightMode ? 'text-red-600 hover:text-red-800' : 'text-red-400 hover:text-red-300'} text-sm`}
                      >
                        <FiTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Education Management */}
        <div className={`mt-8 rounded-xl shadow-sm ${isLightMode ? 'bg-white' : 'bg-slate-800'}`}>
          <div className={`p-4 border-b flex items-center justify-between ${isLightMode ? 'border-gray-200' : 'border-slate-700'}`}>
            <div>
              <h2 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Education</h2>
              <p className={`${isLightMode ? 'text-gray-500' : 'text-gray-400'} text-sm`}>Manage your education entries.</p>
            </div>
            <button
              onClick={() => {
                setEditingEducation(null);
                setEducationFormData({ degree: '', institution: '', period: '', location: '' });
                setIsEducationModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiPlus />
              <span>Add Education</span>
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className={`p-4 rounded-lg border ${isLightMode ? 'border-gray-200 bg-gray-50' : 'border-slate-600 bg-slate-700'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{edu.degree}</h3>
                      <p className={`text-green-600 text-sm font-medium`}>{edu.institution}</p>
                      <p className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>{edu.period} • {edu.location}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => {
                          setEditingEducation(edu);
                          setEducationFormData({
                            degree: edu.degree,
                            institution: edu.institution,
                            period: edu.period,
                            location: edu.location,
                          });
                          setIsEducationModalOpen(true);
                        }}
                        className={`${isLightMode ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'} text-sm`}
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this education entry?')) {
                            deleteEducation(edu.id);
                          }
                        }}
                        className={`${isLightMode ? 'text-red-600 hover:text-red-800' : 'text-red-400 hover:text-red-300'} text-sm`}
                      >
                        <FiTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Knowledge Management */}
        <div className={`mt-8 rounded-xl shadow-sm ${isLightMode ? 'bg-white' : 'bg-slate-800'}`}>
          <div className={`p-4 border-b flex items-center justify-between ${isLightMode ? 'border-gray-200' : 'border-slate-700'}`}>
            <div>
              <h2 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Knowledge</h2>
              <p className={`${isLightMode ? 'text-gray-500' : 'text-gray-400'} text-sm`}>Manage your knowledge badges shown on the Resume page.</p>
            </div>
            <button
              onClick={() => { setEditingKnowledgeIndex(null); setKnowledgeInput(''); setIsKnowledgeModalOpen(true); }}
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus />
              <span>Add Knowledge</span>
            </button>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-3">
              {knowledge.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-center gap-2">
                  <span className={`text-xs font-normal rounded-md py-2 px-4 ${isLightMode ? 'bg-gray-100 text-gray-800' : 'bg-slate-700 text-slate-200'}`}>{item}</span>
                  <button
                    onClick={() => { setEditingKnowledgeIndex(index); setKnowledgeInput(item); setIsKnowledgeModalOpen(true); }}
                    className={`${isLightMode ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'} text-sm`}
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => deleteKnowledge(index)}
                    className={`${isLightMode ? 'text-red-600 hover:text-red-800' : 'text-red-400 hover:text-red-300'} text-sm`}
                  >
                    <FiTrash />
                  </button>
                </div>
              ))}
            </div>
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
                      {editingSkill ? 'Edit Skill' : 'Add New Skill'}
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
                        Skill Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="e.g., React, Node.js, Python"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Frontend, Backend, Database"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Level
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Proficiency ({formData.percentage}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.percentage}
                        onChange={(e) => setFormData({ ...formData, percentage: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingSkill ? 'Update Skill' : 'Create Skill'}
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

        {/* Experience Modal */}
        <AnimatePresence>
          {isExperienceModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setIsExperienceModalOpen(false)}
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
                      {editingExperience ? 'Edit Experience' : 'Add Experience'}
                    </h2>
                    <button
                      onClick={() => setIsExperienceModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const payload = {
                        title: experienceFormData.title,
                        company: experienceFormData.company,
                        period: experienceFormData.period,
                        location: experienceFormData.location,
                        description: experienceFormData.description,
                        createdAt: editingExperience?.createdAt || new Date().toISOString().split('T')[0],
                      };
                      if (editingExperience) {
                        updateExperience(editingExperience.id, payload);
                      } else {
                        addExperience(payload);
                      }
                      setIsExperienceModalOpen(false);
                      setEditingExperience(null);
                      setExperienceFormData({ title: '', company: '', period: '', location: '', description: '' });
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        required
                        value={experienceFormData.title}
                        onChange={(e) => setExperienceFormData({ ...experienceFormData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Frontend Developer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        required
                        value={experienceFormData.company}
                        onChange={(e) => setExperienceFormData({ ...experienceFormData, company: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Tech Solutions Inc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Period
                      </label>
                      <input
                        type="text"
                        required
                        value={experienceFormData.period}
                        onChange={(e) => setExperienceFormData({ ...experienceFormData, period: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="e.g., 2023 - Present"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        required
                        value={experienceFormData.location}
                        onChange={(e) => setExperienceFormData({ ...experienceFormData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Semarang, Indonesia"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={experienceFormData.description}
                        onChange={(e) => setExperienceFormData({ ...experienceFormData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="Describe your role and achievements..."
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingExperience ? 'Update' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsExperienceModalOpen(false); setEditingExperience(null); setExperienceFormData({ title: '', company: '', period: '', location: '', description: '' }); }}
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

        {/* Education Modal */}
        <AnimatePresence>
          {isEducationModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setIsEducationModalOpen(false)}
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
                      {editingEducation ? 'Edit Education' : 'Add Education'}
                    </h2>
                    <button
                      onClick={() => setIsEducationModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const payload = {
                        degree: educationFormData.degree,
                        institution: educationFormData.institution,
                        period: educationFormData.period,
                        location: educationFormData.location,
                        createdAt: editingEducation?.createdAt || new Date().toISOString().split('T')[0],
                      };
                      if (editingEducation) {
                        updateEducation(editingEducation.id, payload);
                      } else {
                        addEducation(payload);
                      }
                      setIsEducationModalOpen(false);
                      setEditingEducation(null);
                      setEducationFormData({ degree: '', institution: '', period: '', location: '' });
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Degree
                      </label>
                      <input
                        type="text"
                        required
                        value={educationFormData.degree}
                        onChange={(e) => setEducationFormData({ ...educationFormData, degree: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Bachelor of Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Institution
                      </label>
                      <input
                        type="text"
                        required
                        value={educationFormData.institution}
                        onChange={(e) => setEducationFormData({ ...educationFormData, institution: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="e.g., STMIK MARDIRA INDONESIA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Period
                      </label>
                      <input
                        type="text"
                        required
                        value={educationFormData.period}
                        onChange={(e) => setEducationFormData({ ...educationFormData, period: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="e.g., 2021 - 2025"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        required
                        value={educationFormData.location}
                        onChange={(e) => setEducationFormData({ ...educationFormData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Bandung, Indonesia"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        {editingEducation ? 'Update' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsEducationModalOpen(false); setEditingEducation(null); setEducationFormData({ degree: '', institution: '', period: '', location: '' }); }}
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

        {/* Knowledge Modal */}
        <AnimatePresence>
          {isKnowledgeModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setIsKnowledgeModalOpen(false)}
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
                      {editingKnowledgeIndex !== null ? 'Edit Knowledge' : 'Add Knowledge'}
                    </h2>
                    <button
                      onClick={() => setIsKnowledgeModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const value = knowledgeInput.trim();
                      if (!value) return;
                      if (editingKnowledgeIndex !== null) {
                        updateKnowledge(editingKnowledgeIndex, value);
                      } else {
                        addKnowledge(value);
                      }
                      setIsKnowledgeModalOpen(false);
                      setEditingKnowledgeIndex(null);
                      setKnowledgeInput('');
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Knowledge Name
                      </label>
                      <input
                        type="text"
                        value={knowledgeInput}
                        onChange={(e) => setKnowledgeInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Next.js, Laravel, Figma"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingKnowledgeIndex !== null ? 'Update' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsKnowledgeModalOpen(false); setEditingKnowledgeIndex(null); setKnowledgeInput(''); }}
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
