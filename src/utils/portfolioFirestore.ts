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
  limit,
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
    querySnapshot.forEach((doc) => {
      projects.push({ id: parseInt(doc.id), ...doc.data() } as Project);
    });
    return projects;
  } catch (error) {
    console.error("Error getting projects:", error);
    return [];
  }
}

export async function updateProjectInFirestore(id: number, project: Partial<Project>) {
  try {
    const projectRef = doc(db, COLLECTIONS.PROJECTS, id.toString());
    await updateDoc(projectRef, project);
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

export async function deleteProjectFromFirestore(id: number) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id.toString()));
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
    return { id: docRef.id, ...skill };
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
    querySnapshot.forEach((doc) => {
      skills.push({ id: parseInt(doc.id), ...doc.data() } as Skill);
    });
    return skills;
  } catch (error) {
    console.error("Error getting skills:", error);
    return [];
  }
}

export async function updateSkillInFirestore(id: number, skill: Partial<Skill>) {
  try {
    const skillRef = doc(db, COLLECTIONS.SKILLS, id.toString());
    await updateDoc(skillRef, skill);
  } catch (error) {
    console.error("Error updating skill:", error);
    throw error;
  }
}

export async function deleteSkillFromFirestore(id: number) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.SKILLS, id.toString()));
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
      return { id: 1, ...docSnap.data() } as Profile;
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
    return { id: docRef.id, ...item };
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
    querySnapshot.forEach((doc) => {
      items.push({ id: parseInt(doc.id), ...doc.data() } as WhatIDoItem);
    });
    return items;
  } catch (error) {
    console.error("Error getting what I do items:", error);
    return [];
  }
}

export async function updateWhatIDoItemInFirestore(id: number, item: Partial<WhatIDoItem>) {
  try {
    const itemRef = doc(db, COLLECTIONS.WHAT_I_DO, id.toString());
    await updateDoc(itemRef, item);
  } catch (error) {
    console.error("Error updating what I do item:", error);
    throw error;
  }
}

export async function deleteWhatIDoItemFromFirestore(id: number) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.WHAT_I_DO, id.toString()));
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
    return { id: docRef.id, ...experience };
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
    querySnapshot.forEach((doc) => {
      experiences.push({ id: parseInt(doc.id), ...doc.data() } as Experience);
    });
    return experiences;
  } catch (error) {
    console.error("Error getting experiences:", error);
    return [];
  }
}

export async function updateExperienceInFirestore(id: number, experience: Partial<Experience>) {
  try {
    const experienceRef = doc(db, COLLECTIONS.EXPERIENCES, id.toString());
    await updateDoc(experienceRef, experience);
  } catch (error) {
    console.error("Error updating experience:", error);
    throw error;
  }
}

export async function deleteExperienceFromFirestore(id: number) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.EXPERIENCES, id.toString()));
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
    return { id: docRef.id, ...education };
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
    querySnapshot.forEach((doc) => {
      educations.push({ id: parseInt(doc.id), ...doc.data() } as Education);
    });
    return educations;
  } catch (error) {
    console.error("Error getting educations:", error);
    return [];
  }
}

export async function updateEducationInFirestore(id: number, education: Partial<Education>) {
  try {
    const educationRef = doc(db, COLLECTIONS.EDUCATIONS, id.toString());
    await updateDoc(educationRef, education);
  } catch (error) {
    console.error("Error updating education:", error);
    throw error;
  }
}

export async function deleteEducationFromFirestore(id: number) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.EDUCATIONS, id.toString()));
  } catch (error) {
    console.error("Error deleting education:", error);
    throw error;
  }
}
