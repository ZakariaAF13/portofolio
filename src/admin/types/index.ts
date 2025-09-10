export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface PortfolioSettings {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url?: string;
  background_image_url?: string;
  profile_image_url?: string;
  meta_title: string;
  meta_description: string;
  og_image_url?: string;
  updated_at: string;
}

export interface Section {
  id: string;
  key: string;
  title: string;
  content: string;
  order_index: number;
  is_visible: boolean;
  updated_at: string;
}

export interface ContactInfo {
  id: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
  website_url?: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  technologies: string[];
  is_featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface AIsuggestion {
  original: string;
  suggestion: string;
  reasoning: string;
}