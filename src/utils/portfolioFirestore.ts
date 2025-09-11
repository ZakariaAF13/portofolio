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

// Collections
const COLLECTIONS = {
  PROJECTS: 'portfolio_projects',
  SKILLS: 'portfolio_skills',
  PROFILE: 'portfolio_profile',
  WHAT_I_DO: 'portfolio_what_i_do',
  KNOWLEDGE: 'portfolio_knowledge',
  EXPERIENCES: 'portfolio_experiences',
  EDUCATIONS: 'portfolio_educations'
};

// Projects
export async function addProjectToFirestore(project: Omit<Project, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), {
      ...project,
      createdAt: new Date().toISOString().split('T')[0]
    });
    return { id: docRef.id, ...project };
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
    return projects;
  } catch (error) {
    console.error("Error getting projects:", error);
    return [];
  }
}

export async function updateProjectInFirestore(id: string, project: Partial<Project>) {
  try {
    const projectRef = doc(db, COLLECTIONS.PROJECTS, id);
    await updateDoc(projectRef, project);
  } catch (error) {
    console.error("Error updating project:", error);
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
