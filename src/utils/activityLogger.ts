import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export type ActivityType = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'reorder'
  | 'upload'
  | 'login'
  | 'logout';

export type ActivityEntity = 
  | 'project' 
  | 'skill' 
  | 'knowledge'
  | 'experience' 
  | 'education'
  | 'about'
  | 'profile'
  | 'contact'
  | 'whatido'
  | 'section'
  | 'settings'
  | 'media'
  | 'user';

export interface ActivityLog {
  type: ActivityType;
  entity: ActivityEntity;
  entityId?: string;
  entityName?: string;
  description: string;
  userEmail: string;
  timestamp: any; // Firestore timestamp
  metadata?: Record<string, any>;
}

/**
 * Log an activity to Firestore
 */
export async function logActivity(
  type: ActivityType,
  entity: ActivityEntity,
  description: string,
  userEmail: string,
  options?: {
    entityId?: string;
    entityName?: string;
    metadata?: Record<string, any>;
  }
): Promise<void> {
  try {
    const activityData: ActivityLog = {
      type,
      entity,
      entityId: options?.entityId,
      entityName: options?.entityName,
      description,
      userEmail,
      timestamp: serverTimestamp(),
      metadata: options?.metadata,
    };

    await addDoc(collection(db, 'activities'), activityData);
    console.log('Activity logged:', description);
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - logging failures shouldn't break the app
  }
}

/**
 * Helper functions for common activities
 */
export const activityHelpers = {
  // Projects
  projectCreated: (name: string, userEmail: string, id?: string) =>
    logActivity('create', 'project', `Created project "${name}"`, userEmail, {
      entityId: id,
      entityName: name,
    }),

  projectUpdated: (name: string, userEmail: string, id?: string) =>
    logActivity('update', 'project', `Updated project "${name}"`, userEmail, {
      entityId: id,
      entityName: name,
    }),

  projectDeleted: (name: string, userEmail: string, id?: string) =>
    logActivity('delete', 'project', `Deleted project "${name}"`, userEmail, {
      entityId: id,
      entityName: name,
    }),

  projectsReordered: (userEmail: string) =>
    logActivity('reorder', 'project', 'Reordered projects', userEmail),

  // Skills
  skillCreated: (name: string, userEmail: string, id?: string) =>
    logActivity('create', 'skill', `Created skill "${name}"`, userEmail, {
      entityId: id,
      entityName: name,
    }),

  skillUpdated: (name: string, userEmail: string, id?: string) =>
    logActivity('update', 'skill', `Updated skill "${name}"`, userEmail, {
      entityId: id,
      entityName: name,
    }),

  skillDeleted: (name: string, userEmail: string, id?: string) =>
    logActivity('delete', 'skill', `Deleted skill "${name}"`, userEmail, {
      entityId: id,
      entityName: name,
    }),

  skillsReordered: (userEmail: string) =>
    logActivity('reorder', 'skill', 'Reordered skills', userEmail),

  // Knowledge
  knowledgeCreated: (name: string, userEmail: string, id?: string) =>
    logActivity('create', 'knowledge', `Created knowledge "${name}"`, userEmail, {
      entityId: id,
      entityName: name,
    }),

  knowledgeUpdated: (name: string, userEmail: string, id?: string) =>
    logActivity('update', 'knowledge', `Updated knowledge "${name}"`, userEmail, {
      entityId: id,
      entityName: name,
    }),

  knowledgeDeleted: (name: string, userEmail: string, id?: string) =>
    logActivity('delete', 'knowledge', `Deleted knowledge "${name}"`, userEmail, {
      entityId: id,
      entityName: name,
    }),

  // Experience
  experienceCreated: (company: string, userEmail: string, id?: string) =>
    logActivity('create', 'experience', `Added experience at "${company}"`, userEmail, {
      entityId: id,
      entityName: company,
    }),

  experienceUpdated: (company: string, userEmail: string, id?: string) =>
    logActivity('update', 'experience', `Updated experience at "${company}"`, userEmail, {
      entityId: id,
      entityName: company,
    }),

  experienceDeleted: (company: string, userEmail: string, id?: string) =>
    logActivity('delete', 'experience', `Deleted experience at "${company}"`, userEmail, {
      entityId: id,
      entityName: company,
    }),

  // Education
  educationCreated: (institution: string, userEmail: string, id?: string) =>
    logActivity('create', 'education', `Added education at "${institution}"`, userEmail, {
      entityId: id,
      entityName: institution,
    }),

  educationUpdated: (institution: string, userEmail: string, id?: string) =>
    logActivity('update', 'education', `Updated education at "${institution}"`, userEmail, {
      entityId: id,
      entityName: institution,
    }),

  educationDeleted: (institution: string, userEmail: string, id?: string) =>
    logActivity('delete', 'education', `Deleted education at "${institution}"`, userEmail, {
      entityId: id,
      entityName: institution,
    }),

  // About
  aboutUpdated: (userEmail: string) =>
    logActivity('update', 'about', 'Updated about section', userEmail),

  whatIDoCreated: (title: string, userEmail: string, id?: string) =>
    logActivity('create', 'whatido', `Added "What I Do" item: "${title}"`, userEmail, {
      entityId: id,
      entityName: title,
    }),

  whatIDoUpdated: (title: string, userEmail: string, id?: string) =>
    logActivity('update', 'whatido', `Updated "What I Do" item: "${title}"`, userEmail, {
      entityId: id,
      entityName: title,
    }),

  whatIDoDeleted: (title: string, userEmail: string, id?: string) =>
    logActivity('delete', 'whatido', `Deleted "What I Do" item: "${title}"`, userEmail, {
      entityId: id,
      entityName: title,
    }),

  whatIDoReordered: (userEmail: string) =>
    logActivity('reorder', 'whatido', 'Reordered "What I Do" items', userEmail),

  // Profile
  profileUpdated: (userEmail: string) =>
    logActivity('update', 'profile', 'Updated profile information', userEmail),

  profileImageUpdated: (userEmail: string) =>
    logActivity('upload', 'profile', 'Updated profile image', userEmail),

  // Contact
  contactUpdated: (userEmail: string) =>
    logActivity('update', 'contact', 'Updated contact information', userEmail),

  // Sections
  sectionUpdated: (sectionName: string, userEmail: string) =>
    logActivity('update', 'section', `Updated ${sectionName} section`, userEmail, {
      entityName: sectionName,
    }),

  // Settings
  settingsUpdated: (userEmail: string) =>
    logActivity('update', 'settings', 'Updated portfolio settings', userEmail),

  // Media
  mediaUploaded: (filename: string, userEmail: string) =>
    logActivity('upload', 'media', `Uploaded media: "${filename}"`, userEmail, {
      entityName: filename,
    }),

  mediaDeleted: (filename: string, userEmail: string) =>
    logActivity('delete', 'media', `Deleted media: "${filename}"`, userEmail, {
      entityName: filename,
    }),

  // User
  userLoggedIn: (userEmail: string) =>
    logActivity('login', 'user', 'Logged in to admin dashboard', userEmail),

  userLoggedOut: (userEmail: string) =>
    logActivity('logout', 'user', 'Logged out from admin dashboard', userEmail),
};
