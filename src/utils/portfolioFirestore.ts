import { db } from "../config/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  setDoc,
  getDoc
} from "firebase/firestore";
import type { Project, Skill, Profile, WhatIDoItem, Experience, Education } from '../admin/types';

// Helper: remove keys with undefined values to satisfy Firestore constraints
function stripUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      // Handle arrays - filter out undefined/null elements
      if (Array.isArray(value)) {
        const cleanArray = value.filter(item => item !== undefined && item !== null);
        if (cleanArray.length > 0) {
          result[key] = cleanArray;
        }
      } else {
        result[key] = value;
      }
    }
  }
  
  return result as Partial<T>;
}

// Collections
const COLLECTIONS = {
  PROJECTS: 'portfolio_projects',
  SKILLS: 'portfolio_skills',
  PROFILE: 'portfolio_profile',
  SETTINGS: 'portfolio_settings',
  SECTIONS: 'portfolio_sections',
  WHAT_I_DO: 'portfolio_what_i_do',
  KNOWLEDGE: 'portfolio_knowledge',
  EXPERIENCES: 'portfolio_experiences',
  EDUCATIONS: 'portfolio_educations'
} as const;

// Projects
export async function addProjectToFirestore(project: Omit<Project, 'id'>) {
  try {
    const cleaned = stripUndefined(project);
    const payload = {
      ...cleaned,
      createdAt: new Date().toISOString().split('T')[0]
    } as Omit<Project, 'id'>;
    const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), payload);
    return { id: docRef.id, ...payload } as Project;
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
}

export async function getProjectsFromFirestore(): Promise<Project[]> {
  try {
    const q = query(collection(db, COLLECTIONS.PROJECTS), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    querySnapshot.forEach((docSnap) => {
      projects.push({ ...(docSnap.data() as Omit<Project, 'id'>), id: docSnap.id });
    });
    // Client-side sort: prioritize manual order_index (asc), fallback to createdAt desc
    projects.sort((a, b) => {
      const ai = (a as any).order_index ?? Number.POSITIVE_INFINITY;
      const bi = (b as any).order_index ?? Number.POSITIVE_INFINITY;
      if (ai !== bi) return ai - bi;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
    return projects;
  } catch (error) {
    console.error("Error getting projects:", error);
    return [];
  }
}

export async function updateProjectInFirestore(id: string, project: Partial<Project>) {
  try {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error(`Invalid project ID provided: ${id}`);
    }

    const projectRef = doc(db, COLLECTIONS.PROJECTS, id);
    const cleaned = stripUndefined(project as Record<string, any>);
    
    // Log the cleaned data for debugging
    console.log('Updating project with cleaned data:', cleaned);
    
    // Validate that we have at least some data to update
    if (Object.keys(cleaned).length === 0) {
      throw new Error('No valid data provided for update');
    }
    
    await updateDoc(projectRef, cleaned);
  } catch (error) {
    console.error("Error updating project:", error);
    console.error("Project ID:", id);
    console.error("Original project data:", project);
    throw error;
  }
}

export async function deleteProjectFromFirestore(id: string) {
  try {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error(`Invalid project ID provided: ${id}`);
    }
    
    const projectRef = doc(db, COLLECTIONS.PROJECTS, id);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

// Skills
export async function addSkillToFirestore(skill: Omit<Skill, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.SKILLS), {
      ...skill,
      createdAt: new Date().toISOString().split('T')[0]
    });
    return { id: docRef.id, ...skill } as Skill;
  } catch (error) {
    console.error("Error adding skill:", error);
    throw error;
  }
}

export async function getSkillsFromFirestore(): Promise<Skill[]> {
  try {
    const q = query(collection(db, COLLECTIONS.SKILLS), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const skills: Skill[] = [];
    querySnapshot.forEach((docSnap) => {
      skills.push({ ...(docSnap.data() as Omit<Skill, 'id'>), id: docSnap.id });
    });
    return skills;
  } catch (error) {
    console.error("Error getting skills:", error);
    return [];
  }
}

export async function updateSkillInFirestore(id: string, skill: Partial<Skill>) {
  try {
    const skillRef = doc(db, COLLECTIONS.SKILLS, id);
    await updateDoc(skillRef, skill);
  } catch (error) {
    console.error("Error updating skill:", error);
    throw error;
  }
}

export async function deleteSkillFromFirestore(id: string) {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid skill ID provided');
    }
    const skillRef = doc(db, COLLECTIONS.SKILLS, id);
    await deleteDoc(skillRef);
  } catch (error) {
    console.error("Error deleting skill:", error);
    throw error;
  }
}

// Profile
export async function updateProfileInFirestore(profile: Partial<Profile>) {
  try {
    const profileRef = doc(db, COLLECTIONS.PROFILE, 'main');
    await setDoc(profileRef, profile, { merge: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

export async function getProfileFromFirestore(): Promise<Profile | null> {
  try {
    const profileRef = doc(db, COLLECTIONS.PROFILE, 'main');
    const docSnap = await getDoc(profileRef);
    if (docSnap.exists()) {
      return { id: 'main', ...(docSnap.data() as Omit<Profile, 'id'>) };
    }
    return null;
  } catch (error) {
    console.error("Error getting profile:", error);
    return null;
  }
}

// What I Do Items
export async function addWhatIDoItemToFirestore(item: Omit<WhatIDoItem, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.WHAT_I_DO), {
      ...item,
      createdAt: new Date().toISOString().split('T')[0]
    });
    return { id: docRef.id, ...item } as WhatIDoItem;
  } catch (error) {
    console.error("Error adding what I do item:", error);
    throw error;
  }
}

export async function getWhatIDoItemsFromFirestore(): Promise<WhatIDoItem[]> {
  try {
    const q = query(collection(db, COLLECTIONS.WHAT_I_DO), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const items: WhatIDoItem[] = [];
    querySnapshot.forEach((docSnap) => {
      items.push({ ...(docSnap.data() as Omit<WhatIDoItem, 'id'>), id: docSnap.id });
    });
    return items;
  } catch (error) {
    console.error("Error getting what I do items:", error);
    return [];
  }
}

export async function updateWhatIDoItemInFirestore(id: string, item: Partial<WhatIDoItem>) {
  try {
    const itemRef = doc(db, COLLECTIONS.WHAT_I_DO, id);
    await updateDoc(itemRef, item);
  } catch (error) {
    console.error("Error updating what I do item:", error);
    throw error;
  }
}

export async function deleteWhatIDoItemFromFirestore(id: string) {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid what I do item ID provided');
    }
    const itemRef = doc(db, COLLECTIONS.WHAT_I_DO, id);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error("Error deleting what I do item:", error);
    throw error;
  }
}

// Knowledge
export async function updateKnowledgeInFirestore(knowledge: string[]) {
  try {
    const knowledgeRef = doc(db, COLLECTIONS.KNOWLEDGE, 'main');
    await setDoc(knowledgeRef, { items: knowledge });
  } catch (error) {
    console.error("Error updating knowledge:", error);
    throw error;
  }
}

export async function getKnowledgeFromFirestore(): Promise<string[]> {
  try {
    const knowledgeRef = doc(db, COLLECTIONS.KNOWLEDGE, 'main');
    const docSnap = await getDoc(knowledgeRef);
    if (docSnap.exists()) {
      return docSnap.data().items || [];
    }
    return [];
  } catch (error) {
    console.error("Error getting knowledge:", error);
    return [];
  }
}

// Experiences
export async function addExperienceToFirestore(experience: Omit<Experience, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.EXPERIENCES), {
      ...experience,
      createdAt: new Date().toISOString().split('T')[0]
    });
    return { id: docRef.id, ...experience } as Experience;
  } catch (error) {
    console.error("Error adding experience:", error);
    throw error;
  }
}

export async function getExperiencesFromFirestore(): Promise<Experience[]> {
  try {
    const q = query(collection(db, COLLECTIONS.EXPERIENCES), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const experiences: Experience[] = [];
    querySnapshot.forEach((docSnap) => {
      experiences.push({ ...(docSnap.data() as Omit<Experience, 'id'>), id: docSnap.id });
    });
    return experiences;
  } catch (error) {
    console.error("Error getting experiences:", error);
    return [];
  }
}

export async function updateExperienceInFirestore(id: string, experience: Partial<Experience>) {
  try {
    const experienceRef = doc(db, COLLECTIONS.EXPERIENCES, id);
    await updateDoc(experienceRef, experience);
  } catch (error) {
    console.error("Error updating experience:", error);
    throw error;
  }
}

export async function deleteExperienceFromFirestore(id: string) {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid experience ID provided');
    }
    const experienceRef = doc(db, COLLECTIONS.EXPERIENCES, id);
    await deleteDoc(experienceRef);
  } catch (error) {
    console.error("Error deleting experience:", error);
    throw error;
  }
}

// Educations
export async function addEducationToFirestore(education: Omit<Education, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.EDUCATIONS), {
      ...education,
      createdAt: new Date().toISOString().split('T')[0]
    });
    return { id: docRef.id, ...education } as Education;
  } catch (error) {
    console.error("Error adding education:", error);
    throw error;
  }
}

export async function getEducationsFromFirestore(): Promise<Education[]> {
  try {
    const q = query(collection(db, COLLECTIONS.EDUCATIONS), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const educations: Education[] = [];
    querySnapshot.forEach((docSnap) => {
      educations.push({ ...(docSnap.data() as Omit<Education, 'id'>), id: docSnap.id });
    });
    return educations;
  } catch (error) {
    console.error("Error getting educations:", error);
    return [];
  }
}

export async function updateEducationInFirestore(id: string, education: Partial<Education>) {
  try {
    const educationRef = doc(db, COLLECTIONS.EDUCATIONS, id);
    await updateDoc(educationRef, education);
  } catch (error) {
    console.error("Error updating education:", error);
    throw error;
  }
}

export async function deleteEducationFromFirestore(id: string) {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid education ID provided');
    }
    const educationRef = doc(db, COLLECTIONS.EDUCATIONS, id);
    await deleteDoc(educationRef);
  } catch (error) {
    console.error("Error deleting education:", error);
    throw error;
  }
}

// Portfolio Settings (single document: 'main')
export type PortfolioSettings = {
  hero_title: string;
  hero_subtitle: string;
  hero_image_url?: string;
  profile_image_url?: string;
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  updated_at?: string;
  // Optional contact & socials for preview/admin
  email?: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
  website_url?: string;
  // Admin: custom category order for Projects page (optional)
  categories_order?: string[];
};

export async function getPortfolioSettingsFromFirestore(): Promise<PortfolioSettings | null> {
  try {
    const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'main');
    const snap = await getDoc(settingsRef);
    if (snap.exists()) {
      return snap.data() as PortfolioSettings;
    }
    return null;
  } catch (error) {
    console.error('Error getting portfolio settings:', error);
    return null;
  }
}

export async function updatePortfolioSettingsInFirestore(data: Partial<PortfolioSettings>) {
  try {
    const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'main');
    await setDoc(settingsRef, { ...data, updated_at: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error('Error updating portfolio settings:', error);
    throw error;
  }
}

// Sections
export type PortfolioSection = {
  id: string;
  title: string;
  content: string;
  is_visible: boolean;
  key: string;
  order_index: number;
};

export async function getSectionsFromFirestore(): Promise<PortfolioSection[]> {
  try {
    const q = query(collection(db, COLLECTIONS.SECTIONS));
    const snap = await getDocs(q);
    const items: PortfolioSection[] = [];
    snap.forEach((docSnap) => {
      items.push({ ...(docSnap.data() as Omit<PortfolioSection, 'id'>), id: docSnap.id });
    });
    // sort by order_index asc
    items.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
    return items;
  } catch (error) {
    console.error('Error getting sections:', error);
    return [];
  }
}

export async function addSectionToFirestore(data: Omit<PortfolioSection, 'id'>): Promise<PortfolioSection> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.SECTIONS), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error adding section:', error);
    throw error;
  }
}

export async function updateSectionInFirestore(id: string, data: Partial<PortfolioSection>) {
  try {
    const refDoc = doc(db, COLLECTIONS.SECTIONS, id);
    await updateDoc(refDoc, data);
  } catch (error) {
    console.error('Error updating section:', error);
    throw error;
  }
}

export async function deleteSectionFromFirestore(id: string) {
  try {
    const refDoc = doc(db, COLLECTIONS.SECTIONS, id);
    await deleteDoc(refDoc);
  } catch (error) {
    console.error('Error deleting section:', error);
    throw error;
  }
}
