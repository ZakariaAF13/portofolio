import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Project, Skill, Profile, WhatIDoItem, Experience, Education } from '../admin/types';
import {
  // Projects
  addProjectToFirestore,
  getProjectsFromFirestore,
  updateProjectInFirestore,
  deleteProjectFromFirestore,
  // Skills
  addSkillToFirestore,
  getSkillsFromFirestore,
  updateSkillInFirestore,
  deleteSkillFromFirestore,
  // Profile
  updateProfileInFirestore,
  getProfileFromFirestore,
  // What I Do
  addWhatIDoItemToFirestore,
  getWhatIDoItemsFromFirestore,
  updateWhatIDoItemInFirestore,
  deleteWhatIDoItemFromFirestore,
  // Knowledge
  updateKnowledgeInFirestore,
  getKnowledgeFromFirestore,
  // Experiences
  addExperienceToFirestore,
  getExperiencesFromFirestore,
  updateExperienceInFirestore,
  deleteExperienceFromFirestore,
  // Educations
  addEducationToFirestore,
  getEducationsFromFirestore,
  updateEducationInFirestore,
  deleteEducationFromFirestore,
} from '../utils/portfolioFirestore';

interface FirebaseDataContextType {
  // Loading states
  loading: boolean;
  
  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  // Skills
  skills: Skill[];
  addSkill: (skill: Omit<Skill, 'id'>) => Promise<void>;
  updateSkill: (id: string, skill: Partial<Skill>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  
  // Profile
  profile: Profile | null;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  
  // What I Do
  whatIDoItems: WhatIDoItem[];
  addWhatIDoItem: (item: Omit<WhatIDoItem, 'id'>) => Promise<void>;
  updateWhatIDoItem: (id: string, item: Partial<WhatIDoItem>) => Promise<void>;
  deleteWhatIDoItem: (id: string) => Promise<void>;

  // Knowledge (badge list)
  knowledge: string[];
  addKnowledge: (item: string) => Promise<void>;
  updateKnowledge: (index: number, item: string) => Promise<void>;
  deleteKnowledge: (index: number) => Promise<void>;

  // Experience
  experiences: Experience[];
  addExperience: (experience: Omit<Experience, 'id'>) => Promise<void>;
  updateExperience: (id: string, experience: Partial<Experience>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;

  // Education
  educations: Education[];
  addEducation: (education: Omit<Education, 'id'>) => Promise<void>;
  updateEducation: (id: string, education: Partial<Education>) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;

  // Utility functions
  refreshData: () => Promise<void>;
}

const FirebaseDataContext = createContext<FirebaseDataContextType | undefined>(undefined);

// Default profile data
const defaultProfile: Profile = {
  id: 'main',
  name: 'Mohammad Zakaria Akbar Falah',
  title: 'Frontend Web Developer',
  email: 'Akbarflh013@gmail.com',
  phone: '+62852 1955 0092',
  location: 'Bandung, Indonesia',
  birthday: 'September 13, 2003',
  bio: 'Passionate frontend developer with expertise in React, TypeScript, and modern web technologies. I love creating beautiful and functional user interfaces.',
  imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
  contactTitle: 'Get In Touch',
  contactMessage: "I'm always interested in new opportunities and exciting projects. Whether you want to hire me, collaborate, or just say hello, feel free to reach out!",
  cvUrl: 'https://drive.google.com/file/d/your-cv-file-id/view',
  socialMediaFields: [
    {
      id: '1',
      platform: 'GitHub',
      icon: 'github',
      url: 'https://github.com/yourusername',
      placeholder: 'https://github.com/yourusername'
    },
    {
      id: '2',
      platform: 'LinkedIn',
      icon: 'linkedin',
      url: 'https://linkedin.com/in/yourprofile',
      placeholder: 'https://linkedin.com/in/yourprofile'
    }
  ]
};

export function FirebaseDataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [whatIDoItems, setWhatIDoItems] = useState<WhatIDoItem[]>([]);
  const [knowledge, setKnowledge] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);

  // Load all data from Firestore
  const loadData = async () => {
    try {
      setLoading(true);
      
      const [
        projectsData,
        skillsData,
        profileData,
        whatIDoData,
        knowledgeData,
        experiencesData,
        educationsData
      ] = await Promise.all([
        getProjectsFromFirestore(),
        getSkillsFromFirestore(),
        getProfileFromFirestore(),
        getWhatIDoItemsFromFirestore(),
        getKnowledgeFromFirestore(),
        getExperiencesFromFirestore(),
        getEducationsFromFirestore()
      ]);

      setProjects(projectsData);
      setSkills(skillsData);
      setProfile(profileData || defaultProfile);
      setWhatIDoItems(whatIDoData);
      setKnowledge(knowledgeData);
      setExperiences(experiencesData);
      setEducations(educationsData);
    } catch (error) {
      console.error('Error loading data from Firestore:', error);
      // Set default profile if loading fails
      setProfile(defaultProfile);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Project methods
  const addProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      const newProject = await addProjectToFirestore(projectData);
      setProjects(prev => [newProject, ...prev]);
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      await updateProjectInFirestore(id, projectData);
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...projectData } : p));
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteProjectFromFirestore(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  // Skill methods
  const addSkill = async (skillData: Omit<Skill, 'id'>) => {
    try {
      const newSkill = await addSkillToFirestore(skillData);
      setSkills(prev => [newSkill, ...prev]);
    } catch (error) {
      console.error('Error adding skill:', error);
      throw error;
    }
  };

  const updateSkill = async (id: string, skillData: Partial<Skill>) => {
    try {
      await updateSkillInFirestore(id, skillData);
      setSkills(prev => prev.map(s => s.id === id ? { ...s, ...skillData } : s));
    } catch (error) {
      console.error('Error updating skill:', error);
      throw error;
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      await deleteSkillFromFirestore(id);
      setSkills(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  };

  // Profile methods
  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      await updateProfileInFirestore(profileData);
      setProfile(prev => prev ? { ...prev, ...profileData } : { ...defaultProfile, ...profileData });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // What I Do methods
  const addWhatIDoItem = async (itemData: Omit<WhatIDoItem, 'id'>) => {
    try {
      const newItem = await addWhatIDoItemToFirestore(itemData);
      setWhatIDoItems(prev => [newItem, ...prev]);
    } catch (error) {
      console.error('Error adding what I do item:', error);
      throw error;
    }
  };

  const updateWhatIDoItem = async (id: string, itemData: Partial<WhatIDoItem>) => {
    try {
      await updateWhatIDoItemInFirestore(id, itemData);
      setWhatIDoItems(prev => prev.map(item => item.id === id ? { ...item, ...itemData } : item));
    } catch (error) {
      console.error('Error updating what I do item:', error);
      throw error;
    }
  };

  const deleteWhatIDoItem = async (id: string) => {
    try {
      await deleteWhatIDoItemFromFirestore(id);
      setWhatIDoItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting what I do item:', error);
      throw error;
    }
  };

  // Knowledge methods
  const addKnowledge = async (item: string) => {
    try {
      const newKnowledge = [...knowledge, item];
      await updateKnowledgeInFirestore(newKnowledge);
      setKnowledge(newKnowledge);
    } catch (error) {
      console.error('Error adding knowledge:', error);
      throw error;
    }
  };

  const updateKnowledge = async (index: number, item: string) => {
    try {
      const newKnowledge = knowledge.map((v, i) => (i === index ? item : v));
      await updateKnowledgeInFirestore(newKnowledge);
      setKnowledge(newKnowledge);
    } catch (error) {
      console.error('Error updating knowledge:', error);
      throw error;
    }
  };

  const deleteKnowledge = async (index: number) => {
    try {
      const newKnowledge = knowledge.filter((_, i) => i !== index);
      await updateKnowledgeInFirestore(newKnowledge);
      setKnowledge(newKnowledge);
    } catch (error) {
      console.error('Error deleting knowledge:', error);
      throw error;
    }
  };

  // Experience methods
  const addExperience = async (experienceData: Omit<Experience, 'id'>) => {
    try {
      const newExperience = await addExperienceToFirestore(experienceData);
      setExperiences(prev => [newExperience, ...prev]);
    } catch (error) {
      console.error('Error adding experience:', error);
      throw error;
    }
  };

  const updateExperience = async (id: string, experienceData: Partial<Experience>) => {
    try {
      await updateExperienceInFirestore(id, experienceData);
      setExperiences(prev => prev.map(exp => exp.id === id ? { ...exp, ...experienceData } : exp));
    } catch (error) {
      console.error('Error updating experience:', error);
      throw error;
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      await deleteExperienceFromFirestore(id);
      setExperiences(prev => prev.filter(exp => exp.id !== id));
    } catch (error) {
      console.error('Error deleting experience:', error);
      throw error;
    }
  };

  // Education methods
  const addEducation = async (educationData: Omit<Education, 'id'>) => {
    try {
      const newEducation = await addEducationToFirestore(educationData);
      setEducations(prev => [newEducation, ...prev]);
    } catch (error) {
      console.error('Error adding education:', error);
      throw error;
    }
  };

  const updateEducation = async (id: string, educationData: Partial<Education>) => {
    try {
      await updateEducationInFirestore(id, educationData);
      setEducations(prev => prev.map(edu => edu.id === id ? { ...edu, ...educationData } : edu));
    } catch (error) {
      console.error('Error updating education:', error);
      throw error;
    }
  };

  const deleteEducation = async (id: string) => {
    try {
      await deleteEducationFromFirestore(id);
      setEducations(prev => prev.filter(edu => edu.id !== id));
    } catch (error) {
      console.error('Error deleting education:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const value: FirebaseDataContextType = {
    loading,
    projects,
    addProject,
    updateProject,
    deleteProject,
    skills,
    addSkill,
    updateSkill,
    deleteSkill,
    profile,
    updateProfile,
    whatIDoItems,
    addWhatIDoItem,
    updateWhatIDoItem,
    deleteWhatIDoItem,
    knowledge,
    addKnowledge,
    updateKnowledge,
    deleteKnowledge,
    experiences,
    addExperience,
    updateExperience,
    deleteExperience,
    educations,
    addEducation,
    updateEducation,
    deleteEducation,
    refreshData,
  };

  return (
    <FirebaseDataContext.Provider value={value}>
      {children}
    </FirebaseDataContext.Provider>
  );
}

export function useFirebaseData() {
  const context = useContext(FirebaseDataContext);
  if (context === undefined) {
    throw new Error('useFirebaseData must be used within a FirebaseDataProvider');
  }
  return context;
}
