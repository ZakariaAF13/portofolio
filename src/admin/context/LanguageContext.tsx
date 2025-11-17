import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object with nested structure support
const translations: Record<string, any> = {
  // Theme
  theme: {
    lightMode: { id: 'Mode Terang', en: 'Light Mode' },
    darkMode: { id: 'Mode Gelap', en: 'Dark Mode' },
  },
  
  // Admin Navigation
  admin: {
    dashboard: { id: 'Dasbor', en: 'Dashboard' },
    projects: { id: 'Proyek', en: 'Projects' },
    skills: { id: 'Keterampilan', en: 'Skills' },
    about: { id: 'Tentang', en: 'About' },
    profile: { id: 'Profil', en: 'Profile' },
    contact: { id: 'Kontak', en: 'Contact' },
    activity: { id: 'Aktivitas', en: 'Activity' },
    account: { id: 'Akun', en: 'Account' },
    signOut: { id: 'Keluar', en: 'Sign Out' },
    manageAccount: { id: 'Kelola Akun', en: 'Manage Account' },
    adminPanel: { id: 'Panel Admin', en: 'Admin Panel' },
  },
  
  // Common
  save: { id: 'Simpan', en: 'Save' },
  cancel: { id: 'Batal', en: 'Cancel' },
  edit: { id: 'Edit', en: 'Edit' },
  delete: { id: 'Hapus', en: 'Delete' },
  add: { id: 'Tambah', en: 'Add' },
  create: { id: 'Buat', en: 'Create' },
  update: { id: 'Perbarui', en: 'Update' },
  search: { id: 'Cari', en: 'Search' },
  close: { id: 'Tutup', en: 'Close' },
  loading: { id: 'Memuat...', en: 'Loading...' },
  saving: { id: 'Menyimpan...', en: 'Saving...' },
  success: { id: 'Berhasil', en: 'Success' },
  error: { id: 'Error', en: 'Error' },
  confirmDelete: { id: 'Apakah Anda yakin ingin menghapus?', en: 'Are you sure you want to delete?' },
  selected: { id: 'Dipilih', en: 'Selected' },
  noItems: { id: 'Belum ada item', en: 'No items yet' },
  
  // About Page
  aboutSection: { id: 'Bagian Tentang Saya', en: 'About Section' },
  aboutSectionDesc: { id: 'Kelola informasi pribadi dan bio Anda', en: 'Manage your personal information and bio' },
  editAbout: { id: 'Edit Tentang', en: 'Edit About' },
  saveChanges: { id: 'Simpan Perubahan', en: 'Save Changes' },
  bio: { id: 'Bio', en: 'Bio' },
  bioPlaceholder: { id: 'Ceritakan tentang diri Anda...', en: 'Tell us about yourself...' },
  whatIDo: { id: 'Apa yang Saya Lakukan', en: 'What I Do' },
  whatIDoDesc: { id: 'Kelola item layanan atau keahlian Anda', en: 'Manage your services or skills items' },
  addNewItem: { id: 'Tambah Item Baru', en: 'Add New Item' },
  editItem: { id: 'Edit Item', en: 'Edit Item' },
  title: { id: 'Judul', en: 'Title' },
  titlePlaceholder: { id: 'Masukkan judul...', en: 'Enter title...' },
  description: { id: 'Deskripsi', en: 'Description' },
  descriptionPlaceholder: { id: 'Masukkan deskripsi...', en: 'Enter description...' },
  icon: { id: 'Ikon', en: 'Icon' },
  iconColor: { id: 'Warna Ikon', en: 'Icon Color' },
  backgroundColor: { id: 'Warna Latar', en: 'Background Color' },
  aboutUpdated: { id: 'Informasi tentang berhasil diperbarui', en: 'About information updated successfully' },
  itemAdded: { id: 'Item berhasil ditambahkan', en: 'Item added successfully' },
  itemUpdated: { id: 'Item berhasil diperbarui', en: 'Item updated successfully' },
  itemDeleted: { id: 'Item berhasil dihapus', en: 'Item deleted successfully' },
  reorderItems: { id: 'Atur Ulang Item', en: 'Reorder Items' },
  moveUp: { id: 'Naik', en: 'Move Up' },
  moveDown: { id: 'Turun', en: 'Move Down' },
  
  // Projects Page
  projects: { id: 'Proyek', en: 'Projects' },
  projectsDesc: { id: 'Kelola proyek portfolio Anda', en: 'Manage your portfolio projects' },
  addProject: { id: 'Tambah Proyek', en: 'Add Project' },
  editProject: { id: 'Edit Proyek', en: 'Edit Project' },
  projectTitle: { id: 'Judul Proyek', en: 'Project Title' },
  projectTitlePlaceholder: { id: 'Masukkan judul proyek', en: 'Enter project title' },
  category: { id: 'Kategori', en: 'Category' },
  selectCategory: { id: 'Pilih Kategori', en: 'Select Category' },
  status: { id: 'Status', en: 'Status' },
  draft: { id: 'Draft', en: 'Draft' },
  published: { id: 'Dipublikasikan', en: 'Published' },
  projectDescription: { id: 'Deskripsi Proyek', en: 'Project Description' },
  projectDescPlaceholder: { id: 'Deskripsi proyek...', en: 'Project description...' },
  technologies: { id: 'Teknologi', en: 'Technologies' },
  technologiesPlaceholder: { id: 'React, Node.js, MongoDB (pisahkan dengan koma)', en: 'React, Node.js, MongoDB (comma separated)' },
  projectImage: { id: 'Gambar Proyek', en: 'Project Image' },
  uploadImage: { id: 'Upload Gambar', en: 'Upload Image' },
  projectUrl: { id: 'URL Proyek (Live)', en: 'Project URL (Live)' },
  projectUrlPlaceholder: { id: 'https://situs-anda.com', en: 'https://your-site.com' },
  tiktokUrl: { id: 'URL TikTok', en: 'TikTok URL' },
  instagramReelsUrl: { id: 'URL Instagram Reels', en: 'Instagram Reels URL' },
  projectAdded: { id: 'Proyek berhasil ditambahkan', en: 'Project added successfully' },
  projectUpdated: { id: 'Proyek berhasil diperbarui', en: 'Project updated successfully' },
  projectDeleted: { id: 'Proyek berhasil dihapus', en: 'Project deleted successfully' },
  searchProjects: { id: 'Cari proyek...', en: 'Search projects...' },
  noProjects: { id: 'Belum ada proyek', en: 'No projects yet' },
  
  // Contact Page
  contactInfo: { id: 'Informasi Kontak', en: 'Contact Information' },
  contactInfoDesc: { id: 'Kelola detail kontak Anda', en: 'Manage your contact details' },
  editContactInfo: { id: 'Edit Informasi Kontak', en: 'Edit Contact Info' },
  contactTitle: { id: 'Judul Kontak', en: 'Contact Title' },
  contactTitlePlaceholder: { id: 'Contoh: Hubungi Saya', en: 'e.g., Get in touch' },
  contactMessage: { id: 'Pesan Kontak', en: 'Contact Message' },
  contactMessagePlaceholder: { id: 'Pesan kontak Anda...', en: 'Your contact message...' },
  contactUpdated: { id: 'Informasi kontak berhasil diperbarui', en: 'Contact information updated successfully' },
  
  // Resume Page
  resume: { id: 'Resume', en: 'Resume' },
  resumeDesc: { id: 'Kelola keahlian dan pengalaman Anda', en: 'Manage your skills and experience' },
  skills: { id: 'Keahlian', en: 'Skills' },
  addSkill: { id: 'Tambah Keahlian', en: 'Add Skill' },
  skillName: { id: 'Nama Keahlian', en: 'Skill Name' },
  skillCategory: { id: 'Kategori Keahlian', en: 'Skill Category' },
  level: { id: 'Tingkat', en: 'Level' },
  experience: { id: 'Pengalaman', en: 'Experience' },
  education: { id: 'Pendidikan', en: 'Education' },
  
  // Profile Page
  profile: { id: 'Profil', en: 'Profile' },
  profileDesc: { id: 'Kelola informasi profil Anda', en: 'Manage your profile information' },
  fullName: { id: 'Nama Lengkap', en: 'Full Name' },
  email: { id: 'Email', en: 'Email' },
  phone: { id: 'Telepon', en: 'Phone' },
  location: { id: 'Lokasi', en: 'Location' },
  
  // Account Page
  account: { id: 'Akun', en: 'Account' },
  accountDesc: { id: 'Kelola pengaturan akun Anda', en: 'Manage your account settings' },
  changePassword: { id: 'Ubah Password', en: 'Change Password' },
  currentPassword: { id: 'Password Saat Ini', en: 'Current Password' },
  newPassword: { id: 'Password Baru', en: 'New Password' },
  confirmPassword: { id: 'Konfirmasi Password', en: 'Confirm Password' },
  
  // Navigation
  dashboard: { id: 'Dashboard', en: 'Dashboard' },
  logout: { id: 'Keluar', en: 'Logout' },
  manageAccount: { id: 'Kelola Akun', en: 'Manage Account' },
  signOut: { id: 'Keluar', en: 'Sign Out' },
  
  // Success/Error Messages
  saveSuccess: { id: 'Perubahan berhasil disimpan', en: 'Changes saved successfully' },
  saveFailed: { id: 'Gagal menyimpan. Silakan coba lagi.', en: 'Failed to save. Please try again.' },
  deleteSuccess: { id: 'Berhasil dihapus', en: 'Deleted successfully' },
  deleteFailed: { id: 'Gagal menghapus. Silakan coba lagi.', en: 'Failed to delete. Please try again.' },
  errorTitle: { id: 'Error', en: 'Error' },
  
  // About Messages (enhanced)
  aboutUpdatedTitle: { id: 'Tentang Diperbarui!', en: 'About Updated!' },
  aboutUpdatedDesc: { id: 'Informasi tentang berhasil diperbarui', en: 'Your about information has been updated successfully' },
  aboutUpdateFailed: { id: 'Gagal memperbarui informasi tentang. Silakan coba lagi.', en: 'Failed to update about information. Please try again.' },
  
  // What I Do Messages (enhanced)
  itemAddedTitle: { id: 'Item Ditambahkan!', en: 'Item Added!' },
  itemAddedMsg: { id: 'telah ditambahkan dengan sukses', en: 'has been added successfully' },
  itemUpdatedTitle: { id: 'Item Diperbarui!', en: 'Item Updated!' },
  itemUpdatedMsg: { id: 'telah diperbarui dengan sukses', en: 'has been updated successfully' },
  itemDeletedTitle: { id: 'Item Dihapus!', en: 'Item Deleted!' },
  itemDeletedMsg: { id: 'telah dihapus dengan sukses', en: 'has been deleted successfully' },
  itemSaveFailed: { id: 'Gagal menyimpan item. Silakan coba lagi.', en: 'Failed to save item. Please try again.' },
  itemDeleteFailed: { id: 'Gagal menghapus item. Silakan coba lagi.', en: 'Failed to delete item. Please try again.' },
  
  // Project Messages (enhanced)
  projectAddedTitle: { id: 'Proyek Ditambahkan!', en: 'Project Added!' },
  projectAddedMsg: { id: 'telah ditambahkan dengan sukses', en: 'has been added successfully' },
  projectUpdatedTitle: { id: 'Proyek Diperbarui!', en: 'Project Updated!' },
  projectUpdatedMsg: { id: 'telah diperbarui dengan sukses', en: 'has been updated successfully' },
  projectDeletedTitle: { id: 'Proyek Dihapus!', en: 'Project Deleted!' },
  projectDeletedMsg: { id: 'telah dihapus dengan sukses', en: 'has been deleted successfully' },
  projectSaveFailed: { id: 'Gagal menyimpan proyek. Silakan coba lagi.', en: 'Failed to save project. Please try again.' },
  projectDeleteFailed: { id: 'Gagal menghapus proyek. Silakan coba lagi.', en: 'Failed to delete project. Please try again.' },
  
  // Profile Messages
  profileUpdatedTitle: { id: 'Profil Diperbarui!', en: 'Profile Updated!' },
  profileUpdatedDesc: { id: 'Profil Anda telah diperbarui dengan sukses', en: 'Your profile has been updated successfully' },
  profileUpdateFailed: { id: 'Gagal memperbarui profil. Silakan coba lagi.', en: 'Failed to update profile. Please try again.' },
  
  // Contact Messages (enhanced)
  contactUpdatedTitle: { id: 'Kontak Diperbarui!', en: 'Contact Updated!' },
  contactUpdatedDesc: { id: 'Informasi kontak telah diperbarui dengan sukses', en: 'Contact information has been updated successfully' },
  
  // Skill Messages
  skillAdded: { id: 'Keahlian Ditambahkan!', en: 'Skill Added!' },
  skillAddedDesc: { id: 'telah ditambahkan dengan sukses', en: 'has been added successfully' },
  skillUpdated: { id: 'Keahlian Diperbarui!', en: 'Skill Updated!' },
  skillUpdatedDesc: { id: 'telah diperbarui dengan sukses', en: 'has been updated successfully' },
  skillDeleted: { id: 'Keahlian Dihapus!', en: 'Skill Deleted!' },
  skillDeletedDesc: { id: 'telah dihapus dengan sukses', en: 'has been deleted successfully' },
  skillSaveFailed: { id: 'Gagal menyimpan keahlian. Silakan coba lagi.', en: 'Failed to save skill. Please try again.' },
  
  // Experience Messages
  experienceAdded: { id: 'Pengalaman Ditambahkan!', en: 'Experience Added!' },
  experienceAddedDesc: { id: 'telah ditambahkan dengan sukses', en: 'has been added successfully' },
  experienceUpdated: { id: 'Pengalaman Diperbarui!', en: 'Experience Updated!' },
  experienceUpdatedDesc: { id: 'telah diperbarui dengan sukses', en: 'has been updated successfully' },
  experienceDeleted: { id: 'Pengalaman Dihapus!', en: 'Experience Deleted!' },
  experienceDeletedDesc: { id: 'telah dihapus dengan sukses', en: 'has been deleted successfully' },
  experienceSaveFailed: { id: 'Gagal menyimpan pengalaman. Silakan coba lagi.', en: 'Failed to save experience. Please try again.' },
  
  // Education Messages
  educationAdded: { id: 'Pendidikan Ditambahkan!', en: 'Education Added!' },
  educationAddedDesc: { id: 'telah ditambahkan dengan sukses', en: 'has been added successfully' },
  educationUpdated: { id: 'Pendidikan Diperbarui!', en: 'Education Updated!' },
  educationUpdatedDesc: { id: 'telah diperbarui dengan sukses', en: 'has been updated successfully' },
  educationDeleted: { id: 'Pendidikan Dihapus!', en: 'Education Deleted!' },
  educationDeletedDesc: { id: 'telah dihapus dengan sukses', en: 'has been deleted successfully' },
  educationSaveFailed: { id: 'Gagal menyimpan pendidikan. Silakan coba lagi.', en: 'Failed to save education. Please try again.' },
  
  // Knowledge Messages
  knowledgeDeleted: { id: 'Pengetahuan Dihapus!', en: 'Knowledge Deleted!' },
  knowledgeDeletedDesc: { id: 'telah dihapus dengan sukses', en: 'has been deleted successfully' },
  
  // Move/Reorder Messages
  moveSaved: { id: 'Posisi Disimpan', en: 'Move Saved' },
  moveSavedDesc: { id: 'Posisi item telah diperbarui', en: 'Item positions have been updated' },
  moveSaveFailed: { id: 'Gagal menyimpan posisi baru. Silakan coba lagi.', en: 'Failed to save new positions. Please try again.' },
  projectMoveSavedDesc: { id: 'Posisi proyek dan kategori telah diperbarui', en: 'Project and category positions have been updated' },
  resumeMoveSavedDesc: { id: 'Posisi item resume telah diperbarui', en: 'Resume item positions have been updated' },
  
  // Other categories
  other: { id: 'Lainnya', en: 'Other' },
  otherCategory: { id: 'Kategori Lainnya', en: 'Other Category' },
  enterOtherCategory: { id: 'Masukkan nama kategori lainnya', en: 'Enter other category name' },
  
  // Web Development categories
  webDevelopment: { id: 'Pengembangan Web', en: 'Web Development' },
  mobileApp: { id: 'Aplikasi Mobile', en: 'Mobile App' },
  desktopApp: { id: 'Aplikasi Desktop', en: 'Desktop App' },
  uiuxDesign: { id: 'Desain UI/UX', en: 'UI/UX Design' },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id'); // Default Bahasa Indonesia

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }
    
    if (value && typeof value === 'object' && language in value) {
      return value[language];
    }
    
    return key; // Fallback to key if translation not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
