export interface Project {
  id: number;
  title: string;
  category: string;
  status: 'Published' | 'Draft';
  createdAt: string;
  description?: string;
  imageUrl?: string;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  percentage: number;
  createdAt: string;
}

export interface SocialMediaField {
  id: string;
  platform: string;
  icon: string;
  url: string;
  placeholder?: string;
}

export interface Profile {
  id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  birthday: string;
  bio?: string;
  imageUrl?: string;
  address?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  discord?: string;
  whatsapp?: string;
  contactTitle?: string;
  contactMessage?: string;
  cvUrl?: string;
  socialMediaFields?: SocialMediaField[];
}

export interface WhatIDoItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  backgroundColor: string;
  createdAt: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  createdAt: string;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  location: string;
  createdAt: string;
}

