import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Project, Skill, Profile, WhatIDoItem, Experience, Education } from '../admin/types';

interface DataContextType {
  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: number, project: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  
  // Skills
  skills: Skill[];
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: number, skill: Partial<Skill>) => void;
  deleteSkill: (id: number) => void;
  
  // Profile
  profile: Profile;
  updateProfile: (profile: Partial<Profile>) => void;
  
  // What I Do
  whatIDoItems: WhatIDoItem[];
  addWhatIDoItem: (item: Omit<WhatIDoItem, 'id'>) => void;
  updateWhatIDoItem: (id: number, item: Partial<WhatIDoItem>) => void;
  deleteWhatIDoItem: (id: number) => void;

  // Knowledge (badge list)
  knowledge: string[];
  addKnowledge: (item: string) => void;
  updateKnowledge: (index: number, item: string) => void;
  deleteKnowledge: (index: number) => void;

  // Experience
  experiences: Experience[];
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (id: number, experience: Partial<Experience>) => void;
  deleteExperience: (id: number) => void;

  // Education
  educations: Education[];
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (id: number, education: Partial<Education>) => void;
  deleteEducation: (id: number) => void;

}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialProjects: Project[] = [
  {
    id: 1,
    title: 'E-commerce Platform',
    category: 'Web Development',
    status: 'Published',
    createdAt: '2023-01-15',
    description: 'A full-stack e-commerce platform with React and Node.js',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
  },
  {
    id: 2,
    title: 'Mobile Banking App',
    category: 'Mobile App',
    status: 'Published',
    createdAt: '2023-02-20',
    description: 'Secure mobile banking application with biometric authentication',
    technologies: ['React Native', 'Firebase', 'TypeScript'],
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
  },
  {
    id: 3,
    title: 'Data Analytics Dashboard',
    category: 'Data Science',
    status: 'Published',
    createdAt: '2023-03-10',
    description: 'Interactive dashboard for data visualization and analytics',
    technologies: ['Python', 'Django', 'Chart.js', 'PostgreSQL'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
  },
];

const initialSkills: Skill[] = [
  {
    id: 1,
    name: 'React',
    category: 'Frontend',
    level: 'Expert',
    percentage: 95,
    createdAt: '2023-01-15',
  },
  {
    id: 2,
    name: 'Node.js',
    category: 'Backend',
    level: 'Advanced',
    percentage: 85,
    createdAt: '2023-01-20',
  },
  {
    id: 3,
    name: 'TypeScript',
    category: 'Programming Language',
    level: 'Advanced',
    percentage: 90,
    createdAt: '2023-02-01',
  },
  {
    id: 4,
    name: 'MongoDB',
    category: 'Database',
    level: 'Intermediate',
    percentage: 75,
    createdAt: '2023-02-15',
  },
  {
    id: 5,
    name: 'Python',
    category: 'Programming Language',
    level: 'Advanced',
    percentage: 88,
    createdAt: '2023-03-01',
  },
  {
    id: 6,
    name: 'CSS/Tailwind',
    category: 'Frontend',
    level: 'Expert',
    percentage: 92,
    createdAt: '2023-03-15',
  },
];

const initialKnowledge: string[] = [
  'Javascript',
  'PHP',
  'Dart',
  'Next.js',
  'React.js',
  'Express.js',
  'Laravel',
  'Flutter',
  'Figma',
  'Photoshop',
];

const initialProfile: Profile = {
  id: 1,
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

const initialWhatIDoItems: WhatIDoItem[] = [
  {
    id: 1,
    title: 'Web Development',
    description: 'Creating responsive websites using various available technologies',
    icon: 'Code',
    iconColor: 'text-blue-500',
    backgroundColor: 'bg-red-50',
    createdAt: '2023-01-15',
  },
  {
    id: 2,
    title: 'UI/UX Design',
    description: 'Designing interfaces for web and mobile applications',
    icon: 'Palette',
    iconColor: 'text-red-500',
    backgroundColor: 'bg-blue-50',
    createdAt: '2023-01-20',
  },
  {
    id: 3,
    title: 'Backend Development',
    description: 'Creating RESTful APIs to be accessed by frontend teams',
    icon: 'Database',
    iconColor: 'text-red-500',
    backgroundColor: 'bg-blue-50',
    createdAt: '2023-02-01',
  },
  {
    id: 4,
    title: 'Mobile Development',
    description: 'Creating mobile apps using Flutter technology and Dart language',
    icon: 'Smartphone',
    iconColor: 'text-blue-500',
    backgroundColor: 'bg-red-50',
    createdAt: '2023-02-15',
  },
];

const initialExperiences: Experience[] = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Tech Solutions Inc.',
    period: '2023 - Present',
    location: 'Semarang, Indonesia',
    description: 'Developing responsive web applications using React.js and modern frontend technologies.',
    createdAt: '2023-01-15',
  },
  {
    id: 2,
    title: 'Junior Web Developer',
    company: 'Digital Creative Studio',
    period: '2022 - 2023',
    location: 'Bandung, Indonesia',
    description: 'Built interactive websites and collaborated with design teams to create engaging user experiences using HTML, CSS, and JavaScript.',
    createdAt: '2022-01-15',
  }
];

const initialEducations: Education[] = [
  {
    id: 1,
    degree: 'Bachelor of Computer Science',
    institution: 'STMIK MARDIRA INDONESIA',
    period: '2021 - 2025',
    location: 'Bandung, Indonesia',
    createdAt: '2021-09-01',
  },
  {
    id: 2,
    degree: 'Web Development Bootcamp',
    institution: 'Coding Academy Indonesia',
    period: '2021',
    location: 'Jakarta, Indonesia',
    createdAt: '2021-03-01',
  }
];


export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('portfolio_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('portfolio_skills');
    return saved ? JSON.parse(saved) : initialSkills;
  });

  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('portfolio_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [whatIDoItems, setWhatIDoItems] = useState<WhatIDoItem[]>(() => {
    const saved = localStorage.getItem('portfolio_whatido');
    return saved ? JSON.parse(saved) : initialWhatIDoItems;
  });

  const [knowledge, setKnowledge] = useState<string[]>(() => {
    const saved = localStorage.getItem('portfolio_knowledge');
    return saved ? JSON.parse(saved) : initialKnowledge;
  });

  const [experiences, setExperiences] = useState<Experience[]>(() => {
    const saved = localStorage.getItem('portfolio_experiences');
    return saved ? JSON.parse(saved) : initialExperiences;
  });

  const [educations, setEducations] = useState<Education[]>(() => {
    const saved = localStorage.getItem('portfolio_educations');
    return saved ? JSON.parse(saved) : initialEducations;
  });


  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('portfolio_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('portfolio_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('portfolio_whatido', JSON.stringify(whatIDoItems));
  }, [whatIDoItems]);

  useEffect(() => {
    localStorage.setItem('portfolio_knowledge', JSON.stringify(knowledge));
  }, [knowledge]);

  useEffect(() => {
    localStorage.setItem('portfolio_experiences', JSON.stringify(experiences));
  }, [experiences]);

  useEffect(() => {
    localStorage.setItem('portfolio_educations', JSON.stringify(educations));
  }, [educations]);


  // Project methods
  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: number, projectData: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...projectData } : p));
  };

  const deleteProject = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Skill methods
  const addSkill = (skillData: Omit<Skill, 'id'>) => {
    const newSkill: Skill = {
      ...skillData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setSkills(prev => [...prev, newSkill]);
  };

  const updateSkill = (id: number, skillData: Partial<Skill>) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, ...skillData } : s));
  };

  const deleteSkill = (id: number) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  // Profile methods
  const updateProfile = (profileData: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...profileData }));
  };

  // What I Do methods
  const addWhatIDoItem = (itemData: Omit<WhatIDoItem, 'id'>) => {
    const newItem: WhatIDoItem = {
      ...itemData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setWhatIDoItems(prev => [...prev, newItem]);
  };

  const updateWhatIDoItem = (id: number, itemData: Partial<WhatIDoItem>) => {
    setWhatIDoItems(prev => prev.map(item => item.id === id ? { ...item, ...itemData } : item));
  };

  const deleteWhatIDoItem = (id: number) => {
    setWhatIDoItems(prev => prev.filter(item => item.id !== id));
  };

  // Knowledge methods
  const addKnowledge = (item: string) => {
    setKnowledge(prev => [...prev, item]);
  };

  const updateKnowledge = (index: number, item: string) => {
    setKnowledge(prev => prev.map((v, i) => (i === index ? item : v)));
  };

  const deleteKnowledge = (index: number) => {
    setKnowledge(prev => prev.filter((_, i) => i !== index));
  };

  // Experience methods
  const addExperience = (experienceData: Omit<Experience, 'id'>) => {
    const newExperience: Experience = {
      ...experienceData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setExperiences(prev => [...prev, newExperience]);
  };

  const updateExperience = (id: number, experienceData: Partial<Experience>) => {
    setExperiences(prev => prev.map(exp => exp.id === id ? { ...exp, ...experienceData } : exp));
  };

  const deleteExperience = (id: number) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  // Education methods
  const addEducation = (educationData: Omit<Education, 'id'>) => {
    const newEducation: Education = {
      ...educationData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEducations(prev => [...prev, newEducation]);
  };

  const updateEducation = (id: number, educationData: Partial<Education>) => {
    setEducations(prev => prev.map(edu => edu.id === id ? { ...edu, ...educationData } : edu));
  };

  const deleteEducation = (id: number) => {
    setEducations(prev => prev.filter(edu => edu.id !== id));
  };


  const value: DataContextType = {
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
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
