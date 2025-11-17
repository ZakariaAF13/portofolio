export interface Project {
  id: string;
  title: string;
  titleId?: string;
  titleEn?: string;
  category: string;
  status: 'Published' | 'Draft';
  createdAt: string;
  // Optional manual sort index (lower comes first). When absent, fallback to createdAt desc.
  order_index?: number;
  description?: string;
  descriptionId?: string;
  descriptionEn?: string;
  imageUrl?: string;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  tiktokUrl?: string;
  instagramReelsUrl?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  percentage: number;
  createdAt: string;
  // Optional manual sort index (lower comes first)
  order_index?: number;
}

export interface SocialMediaField {
  id: string;
  platform: string;
  icon: string;
  url: string;
  placeholder?: string;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  titleId?: string;
  titleEn?: string;
  email: string;
  phone: string;
  location: string;
  birthday: string;
  bio?: string;
  bioId?: string;
  bioEn?: string;
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
  contactTitleId?: string;
  contactTitleEn?: string;
  contactMessage?: string;
  contactMessageId?: string;
  contactMessageEn?: string;
  cvUrl?: string;
  socialMediaFields?: SocialMediaField[];
}

export interface WhatIDoItem {
  id: string;
  title: string;
  titleId?: string;
  titleEn?: string;
  description: string;
  descriptionId?: string;
  descriptionEn?: string;
  icon: string;
  iconColor: string;
  backgroundColor: string;
  createdAt: string;
  // Optional manual sort index (lower comes first)
  order_index?: number;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  createdAt: string;
  // Optional manual sort index (lower comes first)
  order_index?: number;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  location: string;
  createdAt: string;
  // Optional manual sort index (lower comes first)
  order_index?: number;
}

