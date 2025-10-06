import { useState } from 'react';
import { FiPlus, FiEdit, FiTrash, FiSearch, FiX, FiMove, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminTheme } from '../context/AdminThemeContext';
import type { Skill, Experience, Education } from '../types';
import { useFirebaseData } from '../../context/FirebaseDataContext';
import { updateKnowledgeInFirestore } from '../../utils/portfolioFirestore';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import SuccessModal from '../components/SuccessModal';

export default function ResumePage() {
  const { isLightMode } = useAdminTheme();
  const { skills, addSkill, updateSkill, deleteSkill, knowledge, addKnowledge, updateKnowledge, deleteKnowledge, experiences, addExperience, updateExperience, deleteExperience, educations, addEducation, updateEducation, deleteEducation, refreshData } = useFirebaseData();
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

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: '' as 'skill' | 'knowledge' | 'experience' | 'education' | '',
    id: null as string | number | null,
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

  // Move modal state
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [activeMoveSection, setActiveMoveSection] = useState<'skills' | 'experiences' | 'educations' | 'knowledge'>('skills');
  const [skillsOrder, setSkillsOrder] = useState<string[]>([]);
  const [experiencesOrder, setExperiencesOrder] = useState<string[]>([]);
  const [educationsOrder, setEducationsOrder] = useState<string[]>([]);
  const [knowledgeOrder, setKnowledgeOrder] = useState<string[]>([]);

  const openMoveModal = () => {
    // Build initial order arrays: sort by order_index asc then createdAt desc
    const skillSorted = [...skills].sort((a, b) => {
      const ai = (a as any).order_index ?? Number.POSITIVE_INFINITY;
      const bi = (b as any).order_index ?? Number.POSITIVE_INFINITY;
      if (ai !== bi) return ai - bi;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
    const expSorted = [...experiences].sort((a, b) => {
      const ai = (a as any).order_index ?? Number.POSITIVE_INFINITY;
      const bi = (b as any).order_index ?? Number.POSITIVE_INFINITY;
      if (ai !== bi) return ai - bi;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
    const eduSorted = [...educations].sort((a, b) => {
      const ai = (a as any).order_index ?? Number.POSITIVE_INFINITY;
      const bi = (b as any).order_index ?? Number.POSITIVE_INFINITY;
      if (ai !== bi) return ai - bi;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
    setSkillsOrder(skillSorted.map(s => s.id));
    setExperiencesOrder(expSorted.map(e => e.id));
    setEducationsOrder(eduSorted.map(e => e.id));
    setKnowledgeOrder([...knowledge]);
    setActiveMoveSection('skills');
    setIsMoveOpen(true);
  };

  const closeMoveModal = () => {
    setIsMoveOpen(false);
  };

  const moveInArray = <T,>(arr: T[], index: number, direction: 'up' | 'down'): T[] => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return arr;
    const copy = [...arr];
    const tmp = copy[index];
    copy[index] = copy[target];
    copy[target] = tmp;
    return copy;
  };

  const moveSkill = (id: string, dir: 'up' | 'down') => {
    const idx = skillsOrder.indexOf(id);
    if (idx === -1) return;
    setSkillsOrder(prev => moveInArray(prev, idx, dir));
  };
  const moveExperience = (id: string, dir: 'up' | 'down') => {
    const idx = experiencesOrder.indexOf(id);
    if (idx === -1) return;
    setExperiencesOrder(prev => moveInArray(prev, idx, dir));
  };
  const moveEducation = (id: string, dir: 'up' | 'down') => {
    const idx = educationsOrder.indexOf(id);
    if (idx === -1) return;
    setEducationsOrder(prev => moveInArray(prev, idx, dir));
  };
  const moveKnowledge = (index: number, dir: 'up' | 'down') => {
    setKnowledgeOrder(prev => moveInArray(prev, index, dir));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillPayload = {
      name: formData.name,
      category: formData.category,
      level: formData.level as Skill['level'],
      percentage: formData.percentage,
      createdAt: editingSkill?.createdAt || new Date().toISOString().split('T')[0],
    } as Omit<Skill, 'id'>;

    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, skillPayload);
        showSuccessModal('Skill Updated!', `"${formData.name}" has been updated successfully.`);
      } else {
        await addSkill(skillPayload);
        showSuccessModal('Skill Added!', `"${formData.name}" has been added successfully.`);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving skill:', error);
      showSuccessModal('Error', 'Failed to save skill. Please try again.', 'warning');
    }
  };

  const openDeleteModal = (type: 'skill' | 'knowledge' | 'experience' | 'education', id: string | number, name: string) => {
    setDeleteModal({
      isOpen: true,
      type,
      id,
      name,
      isLoading: false
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      type: '',
      id: null,
      name: '',
      isLoading: false
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;

    setDeleteModal(prev => ({ ...prev, isLoading: true }));

    try {
      switch (deleteModal.type) {
        case 'skill':
          await deleteSkill(deleteModal.id as string);
          showSuccessModal('Skill Deleted!', `"${deleteModal.name}" has been deleted successfully.`);
          break;
        case 'knowledge':
          await deleteKnowledge(deleteModal.id as number);
          showSuccessModal('Knowledge Deleted!', `"${deleteModal.name}" has been deleted successfully.`);
          break;
        case 'experience':
          await deleteExperience(deleteModal.id as string);
          showSuccessModal('Experience Deleted!', `"${deleteModal.name}" has been deleted successfully.`);
          break;
        case 'education':
          await deleteEducation(deleteModal.id as string);
          showSuccessModal('Education Deleted!', `"${deleteModal.name}" has been deleted successfully.`);
          break;
      }
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting item:', error);
      showSuccessModal('Error', 'Failed to delete item. Please try again.', 'warning');
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDelete = (id: string | number, name: string, type: 'skill' | 'knowledge' | 'experience' | 'education') => {
    openDeleteModal(type, id, name);
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
            <h1 className={`text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Resume</h1>
            <p className={`mt-1 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>Manage your technical skills, expertise, experiences, and education.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={openMoveModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              title="Reorder Skills, Experience, Education, Knowledge"
            >
              <FiMove />
              <span>Move</span>
            </button>
            <button 
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus />
              <span>Add Skill</span>
            </button>
          </div>
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
                {filteredSkills.map((skill, index) => (
                  <tr key={skill.id || `skill-${index}`} className={`border-b transition-colors ${isLightMode ? 'bg-white border-gray-200 hover:bg-gray-50' : 'bg-slate-800 border-slate-700 hover:bg-slate-600'}`}>
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
                          onClick={() => handleDelete(skill.id, skill.name, 'skill')}
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
              {experiences.map((exp, index) => (
                <div key={exp.id || `exp-${index}`} className={`p-4 rounded-lg border ${isLightMode ? 'border-gray-200 bg-gray-50' : 'border-slate-600 bg-slate-700'}`}>
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
                        onClick={() => handleDelete(exp.id, exp.title, 'experience')}
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
              {educations.map((edu, index) => (
                <div key={edu.id || `edu-${index}`} className={`p-4 rounded-lg border ${isLightMode ? 'border-gray-200 bg-gray-50' : 'border-slate-600 bg-slate-700'}`}>
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
                        onClick={() => handleDelete(edu.id, edu.degree, 'education')}
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
                    onClick={() => handleDelete(index, item, 'knowledge')}
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

        {/* Move/Reorder Modal */}
        <AnimatePresence>
          {isMoveOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={closeMoveModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={`rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto ${isLightMode ? 'bg-white' : 'bg-slate-800'}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Move Resume Items</h2>
                    <button onClick={closeMoveModal} className={`${isLightMode ? 'text-gray-500 hover:text-gray-700' : 'text-gray-300 hover:text-gray-100'}`}>
                      <FiX size={22} />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-2 mb-6 flex-wrap">
                    {(['skills','experiences','educations','knowledge'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveMoveSection(tab)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${activeMoveSection === tab ? 'bg-blue-600 text-white border-blue-600' : (isLightMode ? 'text-gray-700 border-gray-300' : 'text-gray-300 border-slate-600')}`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Lists */}
                  {activeMoveSection === 'skills' && (
                    <div className="overflow-x-auto overflow-y-auto h-[480px]">
                      <table className={`w-full text-sm text-left ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`}>
                        <thead className={`${isLightMode ? 'bg-gray-100 text-gray-700' : 'bg-slate-700 text-gray-300'}`}>
                          <tr>
                            <th className="px-4 py-2 w-16">Order</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Category</th>
                            <th className="px-4 py-2 text-right">Move</th>
                          </tr>
                        </thead>
                        <tbody>
                          {skillsOrder.map((id, idx) => {
                            const s = skills.find(x => x.id === id);
                            if (!s) return null;
                            return (
                              <tr key={id} className={`h-[3rem] ${isLightMode ? 'bg-white border-b border-gray-200' : 'bg-slate-800 border-b border-slate-700'}`}>
                                <td className="px-4 py-2">{idx + 1}</td>
                                <td className={`${isLightMode ? 'text-gray-900' : 'text-white'} px-4 py-2`}>{s.name}</td>
                                <td className="px-4 py-2">{s.category}</td>
                                <td className="px-4 py-2">
                                  <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => moveSkill(id, 'up')} disabled={idx === 0} className={`p-2 rounded border ${idx === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-600'} ${isLightMode ? 'border-gray-300' : 'border-slate-600'}`} title="Move Up">
                                      <FiArrowUp />
                                    </button>
                                    <button onClick={() => moveSkill(id, 'down')} disabled={idx === skillsOrder.length - 1} className={`p-2 rounded border ${idx === skillsOrder.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-600'} ${isLightMode ? 'border-gray-300' : 'border-slate-600'}`} title="Move Down">
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
                  )}

                  {activeMoveSection === 'experiences' && (
                    <div className="overflow-x-auto overflow-y-auto h-[480px]">
                      <table className={`w-full text-sm text-left ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`}>
                        <thead className={`${isLightMode ? 'bg-gray-100 text-gray-700' : 'bg-slate-700 text-gray-300'}`}>
                          <tr>
                            <th className="px-4 py-2 w-16">Order</th>
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2">Company</th>
                            <th className="px-4 py-2 text-right">Move</th>
                          </tr>
                        </thead>
                        <tbody>
                          {experiencesOrder.map((id, idx) => {
                            const e = experiences.find(x => x.id === id);
                            if (!e) return null;
                            return (
                              <tr key={id} className={`h-[3rem] ${isLightMode ? 'bg-white border-b border-gray-200' : 'bg-slate-800 border-b border-slate-700'}`}>
                                <td className="px-4 py-2">{idx + 1}</td>
                                <td className={`${isLightMode ? 'text-gray-900' : 'text-white'} px-4 py-2`}>{e.title}</td>
                                <td className="px-4 py-2">{e.company}</td>
                                <td className="px-4 py-2">
                                  <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => moveExperience(id, 'up')} disabled={idx === 0} className={`p-2 rounded border ${idx === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-600'} ${isLightMode ? 'border-gray-300' : 'border-slate-600'}`} title="Move Up">
                                      <FiArrowUp />
                                    </button>
                                    <button onClick={() => moveExperience(id, 'down')} disabled={idx === experiencesOrder.length - 1} className={`p-2 rounded border ${idx === experiencesOrder.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-600'} ${isLightMode ? 'border-gray-300' : 'border-slate-600'}`} title="Move Down">
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
                  )}

                  {activeMoveSection === 'educations' && (
                    <div className="overflow-x-auto overflow-y-auto h-[480px]">
                      <table className={`w-full text-sm text-left ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`}>
                        <thead className={`${isLightMode ? 'bg-gray-100 text-gray-700' : 'bg-slate-700 text-gray-300'}`}>
                          <tr>
                            <th className="px-4 py-2 w-16">Order</th>
                            <th className="px-4 py-2">Degree</th>
                            <th className="px-4 py-2">Institution</th>
                            <th className="px-4 py-2 text-right">Move</th>
                          </tr>
                        </thead>
                        <tbody>
                          {educationsOrder.map((id, idx) => {
                            const e = educations.find(x => x.id === id);
                            if (!e) return null;
                            return (
                              <tr key={id} className={`h-[3rem] ${isLightMode ? 'bg-white border-b border-gray-200' : 'bg-slate-800 border-b border-slate-700'}`}>
                                <td className="px-4 py-2">{idx + 1}</td>
                                <td className={`${isLightMode ? 'text-gray-900' : 'text-white'} px-4 py-2`}>{e.degree}</td>
                                <td className="px-4 py-2">{e.institution}</td>
                                <td className="px-4 py-2">
                                  <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => moveEducation(id, 'up')} disabled={idx === 0} className={`p-2 rounded border ${idx === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-600'} ${isLightMode ? 'border-gray-300' : 'border-slate-600'}`} title="Move Up">
                                      <FiArrowUp />
                                    </button>
                                    <button onClick={() => moveEducation(id, 'down')} disabled={idx === educationsOrder.length - 1} className={`p-2 rounded border ${idx === educationsOrder.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-600'} ${isLightMode ? 'border-gray-300' : 'border-slate-600'}`} title="Move Down">
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
                  )}

                  {activeMoveSection === 'knowledge' && (
                    <div className="overflow-x-auto overflow-y-auto h-[480px]">
                      <table className={`w-full text-sm text-left ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`}>
                        <thead className={`${isLightMode ? 'bg-gray-100 text-gray-700' : 'bg-slate-700 text-gray-300'}`}>
                          <tr>
                            <th className="px-4 py-2 w-16">Order</th>
                            <th className="px-4 py-2">Label</th>
                            <th className="px-4 py-2 text-right">Move</th>
                          </tr>
                        </thead>
                        <tbody>
                          {knowledgeOrder.map((label, idx) => (
                            <tr key={`${label}-${idx}`} className={`h-[3rem] ${isLightMode ? 'bg-white border-b border-gray-200' : 'bg-slate-800 border-b border-slate-700'}`}>
                              <td className="px-4 py-2">{idx + 1}</td>
                              <td className={`${isLightMode ? 'text-gray-900' : 'text-white'} px-4 py-2`}>{label}</td>
                              <td className="px-4 py-2">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => moveKnowledge(idx, 'up')} disabled={idx === 0} className={`p-2 rounded border ${idx === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-600'} ${isLightMode ? 'border-gray-300' : 'border-slate-600'}`} title="Move Up">
                                    <FiArrowUp />
                                  </button>
                                  <button onClick={() => moveKnowledge(idx, 'down')} disabled={idx === knowledgeOrder.length - 1} className={`p-2 rounded border ${idx === knowledgeOrder.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-600'} ${isLightMode ? 'border-gray-300' : 'border-slate-600'}`} title="Move Down">
                                    <FiArrowDown />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-6">
                    <button
                      onClick={async () => {
                        try {
                          // Persist order indexes sequentially
                          for (let i = 0; i < skillsOrder.length; i++) {
                            await updateSkill(skillsOrder[i], { order_index: i });
                          }
                          for (let i = 0; i < experiencesOrder.length; i++) {
                            await updateExperience(experiencesOrder[i], { order_index: i });
                          }
                          for (let i = 0; i < educationsOrder.length; i++) {
                            await updateEducation(educationsOrder[i], { order_index: i });
                          }
                          // Knowledge as array order
                          await updateKnowledgeInFirestore(knowledgeOrder);
                          // Also update local state via context helper to keep in sync
                          // Using context's setter through updateKnowledge of provider API by replacing list
                          // But provider exposes updateKnowledge(index, item). We'll call firestore directly above and then refreshData.
                          await refreshData();
                          showSuccessModal('Move Saved', 'Resume item positions have been updated.');
                          closeMoveModal();
                        } catch (err) {
                          console.error('Error saving resume order:', err);
                          showSuccessModal('Error', 'Failed to save new positions. Please try again.', 'warning');
                        }
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Move
                    </button>
                    <button
                      onClick={closeMoveModal}
                      className="flex-1 bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
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
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const payload = {
                        title: experienceFormData.title,
                        company: experienceFormData.company,
                        period: experienceFormData.period,
                        location: experienceFormData.location,
                        description: experienceFormData.description,
                        createdAt: editingExperience?.createdAt || new Date().toISOString().split('T')[0],
                      };
                      try {
                        if (editingExperience) {
                          await updateExperience(editingExperience.id, payload);
                          showSuccessModal('Experience Updated!', `"${experienceFormData.title}" has been updated successfully.`);
                        } else {
                          await addExperience(payload);
                          showSuccessModal('Experience Added!', `"${experienceFormData.title}" has been added successfully.`);
                        }
                        setIsExperienceModalOpen(false);
                        setEditingExperience(null);
                        setExperienceFormData({ title: '', company: '', period: '', location: '', description: '' });
                      } catch (error) {
                        console.error('Error saving experience:', error);
                        showSuccessModal('Error', 'Failed to save experience. Please try again.', 'warning');
                      }
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
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const payload = {
                        degree: educationFormData.degree,
                        institution: educationFormData.institution,
                        period: educationFormData.period,
                        location: educationFormData.location,
                        createdAt: editingEducation?.createdAt || new Date().toISOString().split('T')[0],
                      };
                      try {
                        if (editingEducation) {
                          await updateEducation(editingEducation.id, payload);
                          showSuccessModal('Education Updated!', `"${educationFormData.degree}" has been updated successfully.`);
                        } else {
                          await addEducation(payload);
                          showSuccessModal('Education Added!', `"${educationFormData.degree}" has been added successfully.`);
                        }
                        setIsEducationModalOpen(false);
                        setEditingEducation(null);
                        setEducationFormData({ degree: '', institution: '', period: '', location: '' });
                      } catch (error) {
                        console.error('Error saving education:', error);
                        showSuccessModal('Error', 'Failed to save education. Please try again.', 'warning');
                      }
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
                        placeholder="e.g., University"
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

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          title={`Delete ${deleteModal.type ? deleteModal.type.charAt(0).toUpperCase() + deleteModal.type.slice(1) : 'Item'}`}
          message={`Are you sure you want to delete this ${deleteModal.type}? This action cannot be undone.`}
          itemName={deleteModal.name}
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
      </div>
    </div>
  );
}
