export interface Project {
  id: string;
  title: string;
  technology: string;
  image: string;
  backgroundColor: string;
  textColor: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'ui-ux';
}

export interface ContactInfo {
  icon: string;
  label: string;
  value: string;
  backgroundColor: string;
  iconColor: string;
}

export type Section = 'about' | 'resume' | 'project' | 'contact';
export type Theme = 'light' | 'dark';