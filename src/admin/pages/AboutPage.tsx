import { useState } from 'react';
import { FiSave, FiUser, FiPlus, FiEdit2, FiTrash2, FiX, FiMove, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { 
  Code, Palette, Database, Smartphone, Monitor, Globe, Zap, Layers,
  Briefcase, Settings, Heart, Star, Target, Award, BookOpen, Coffee,
  Camera, Music, Gamepad2, Headphones, Mic, Video, Edit3, PenTool,
  Figma, Github, GitBranch, Terminal, Server, Cloud, Shield, Lock,
  Wifi, Bluetooth, Battery, Cpu, HardDrive, Smartphone as Phone,
  Tablet, Laptop, Monitor as Pc, Watch, Tv, Radio, Speaker, Volume2,
  MessageCircle, Mail, Send, Phone as PhoneIcon, Users, User,
  MapPin, Calendar, Clock, Timer, Clock as Stopwatch, AlarmClock, Sun,
  Moon, CloudRain, CloudSnow, Thermometer, Wind, Eye, EyeOff,
  Search, Filter, ArrowUpDown, List, Grid, BarChart, PieChart, TrendingUp,
  TrendingDown, Activity, Activity as Pulse, Zap as Lightning, Zap as Flash, Flame,
  Droplet, Leaf, Trees, Flower2, Mountain, Waves, Anchor, Plane,
  Car, Truck, Bus, Bike, Train, Ship, Rocket, Satellite, Compass,
  Map, Navigation, Route, Flag, Home, Building, Store, Factory,
  School, Cross, Church, Landmark, Hotel, UtensilsCrossed,
  ShoppingBag, ShoppingCart, CreditCard, DollarSign, Euro, PoundSterling,
  Bitcoin, Coins, Wallet, Receipt, Calculator, FileText, File,
  Folder, Archive, Download, Upload, Share, Link, Copy, Scissors,
  Clipboard, Save, Trash, RefreshCw, RotateCcw, RotateCw, Maximize, Minimize,
  Plus, Minus, X, Check, CheckCircle, XCircle, AlertCircle, Info,
  HelpCircle, HelpCircle as QuestionMark, AlertTriangle, Bell, BellOff, Volume,
  VolumeX, Play, Pause, Square, SkipBack, SkipForward, Repeat,
  Shuffle, FastForward, Rewind, Circle, StopCircle, PlayCircle
} from 'lucide-react';
import { useFirebaseData } from '../../context/FirebaseDataContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { detectLanguage } from '../../utils/detectLanguage';
import { translateText } from '../../utils/geminiTranslate';
import type { WhatIDoItem } from '../types';
import SuccessModal from '../components/SuccessModal';

const iconOptions = [
  { name: 'Code', icon: Code },
  { name: 'Palette', icon: Palette },
  { name: 'Database', icon: Database },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Monitor', icon: Monitor },
  { name: 'Globe', icon: Globe },
  { name: 'Zap', icon: Zap },
  { name: 'Layers', icon: Layers },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Settings', icon: Settings },
  { name: 'Heart', icon: Heart },
  { name: 'Star', icon: Star },
  { name: 'Target', icon: Target },
  { name: 'Award', icon: Award },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Coffee', icon: Coffee },
  { name: 'Camera', icon: Camera },
  { name: 'Music', icon: Music },
  { name: 'Gamepad2', icon: Gamepad2 },
  { name: 'Headphones', icon: Headphones },
  { name: 'Mic', icon: Mic },
  { name: 'Video', icon: Video },
  { name: 'Edit3', icon: Edit3 },
  { name: 'PenTool', icon: PenTool },
  { name: 'Figma', icon: Figma },
  { name: 'Github', icon: Github },
  { name: 'GitBranch', icon: GitBranch },
  { name: 'Terminal', icon: Terminal },
  { name: 'Server', icon: Server },
  { name: 'Cloud', icon: Cloud },
  { name: 'Shield', icon: Shield },
  { name: 'Lock', icon: Lock },
  { name: 'Wifi', icon: Wifi },
  { name: 'Bluetooth', icon: Bluetooth },
  { name: 'Battery', icon: Battery },
  { name: 'Cpu', icon: Cpu },
  { name: 'HardDrive', icon: HardDrive },
  { name: 'Phone', icon: Phone },
  { name: 'Tablet', icon: Tablet },
  { name: 'Laptop', icon: Laptop },
  { name: 'Pc', icon: Pc },
  { name: 'Watch', icon: Watch },
  { name: 'Tv', icon: Tv },
  { name: 'Radio', icon: Radio },
  { name: 'Speaker', icon: Speaker },
  { name: 'Volume2', icon: Volume2 },
  { name: 'MessageCircle', icon: MessageCircle },
  { name: 'Mail', icon: Mail },
  { name: 'Send', icon: Send },
  { name: 'PhoneIcon', icon: PhoneIcon },
  { name: 'Users', icon: Users },
  { name: 'User', icon: User },
  { name: 'MapPin', icon: MapPin },
  { name: 'Calendar', icon: Calendar },
  { name: 'Clock', icon: Clock },
  { name: 'Timer', icon: Timer },
  { name: 'Stopwatch', icon: Stopwatch },
  { name: 'AlarmClock', icon: AlarmClock },
  { name: 'Sun', icon: Sun },
  { name: 'Moon', icon: Moon },
  { name: 'CloudRain', icon: CloudRain },
  { name: 'CloudSnow', icon: CloudSnow },
  { name: 'Thermometer', icon: Thermometer },
  { name: 'Wind', icon: Wind },
  { name: 'Eye', icon: Eye },
  { name: 'EyeOff', icon: EyeOff },
  { name: 'Search', icon: Search },
  { name: 'Filter', icon: Filter },
  { name: 'ArrowUpDown', icon: ArrowUpDown },
  { name: 'List', icon: List },
  { name: 'Grid', icon: Grid },
  { name: 'BarChart', icon: BarChart },
  { name: 'PieChart', icon: PieChart },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'TrendingDown', icon: TrendingDown },
  { name: 'Activity', icon: Activity },
  { name: 'Pulse', icon: Pulse },
  { name: 'Lightning', icon: Lightning },
  { name: 'Flash', icon: Flash },
  { name: 'Flame', icon: Flame },
  { name: 'Droplet', icon: Droplet },
  { name: 'Leaf', icon: Leaf },
  { name: 'Trees', icon: Trees },
  { name: 'Flower2', icon: Flower2 },
  { name: 'Mountain', icon: Mountain },
  { name: 'Waves', icon: Waves },
  { name: 'Anchor', icon: Anchor },
  { name: 'Plane', icon: Plane },
  { name: 'Car', icon: Car },
  { name: 'Truck', icon: Truck },
  { name: 'Bus', icon: Bus },
  { name: 'Bike', icon: Bike },
  { name: 'Train', icon: Train },
  { name: 'Ship', icon: Ship },
  { name: 'Rocket', icon: Rocket },
  { name: 'Satellite', icon: Satellite },
  { name: 'Compass', icon: Compass },
  { name: 'Map', icon: Map },
  { name: 'Navigation', icon: Navigation },
  { name: 'Route', icon: Route },
  { name: 'Flag', icon: Flag },
  { name: 'Home', icon: Home },
  { name: 'Building', icon: Building },
  { name: 'Store', icon: Store },
  { name: 'Factory', icon: Factory },
  { name: 'School', icon: School },
  { name: 'Cross', icon: Cross },
  { name: 'Church', icon: Church },
  { name: 'Landmark', icon: Landmark },
  { name: 'Hotel', icon: Hotel },
  { name: 'UtensilsCrossed', icon: UtensilsCrossed },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'CreditCard', icon: CreditCard },
  { name: 'DollarSign', icon: DollarSign },
  { name: 'Euro', icon: Euro },
  { name: 'PoundSterling', icon: PoundSterling },
  { name: 'Bitcoin', icon: Bitcoin },
  { name: 'Coins', icon: Coins },
  { name: 'Wallet', icon: Wallet },
  { name: 'Receipt', icon: Receipt },
  { name: 'Calculator', icon: Calculator },
  { name: 'FileText', icon: FileText },
  { name: 'File', icon: File },
  { name: 'Folder', icon: Folder },
  { name: 'Archive', icon: Archive },
  { name: 'Download', icon: Download },
  { name: 'Upload', icon: Upload },
  { name: 'Share', icon: Share },
  { name: 'Link', icon: Link },
  { name: 'Copy', icon: Copy },
  { name: 'Scissors', icon: Scissors },
  { name: 'Clipboard', icon: Clipboard },
  { name: 'Save', icon: Save },
  { name: 'Trash', icon: Trash },
  { name: 'RefreshCw', icon: RefreshCw },
  { name: 'RotateCcw', icon: RotateCcw },
  { name: 'RotateCw', icon: RotateCw },
  { name: 'Maximize', icon: Maximize },
  { name: 'Minimize', icon: Minimize },
  { name: 'Plus', icon: Plus },
  { name: 'Minus', icon: Minus },
  { name: 'X', icon: X },
  { name: 'Check', icon: Check },
  { name: 'CheckCircle', icon: CheckCircle },
  { name: 'XCircle', icon: XCircle },
  { name: 'AlertCircle', icon: AlertCircle },
  { name: 'Info', icon: Info },
  { name: 'HelpCircle', icon: HelpCircle },
  { name: 'QuestionMark', icon: QuestionMark },
  { name: 'AlertTriangle', icon: AlertTriangle },
  { name: 'Bell', icon: Bell },
  { name: 'BellOff', icon: BellOff },
  { name: 'Volume', icon: Volume },
  { name: 'VolumeX', icon: VolumeX },
  { name: 'Play', icon: Play },
  { name: 'Pause', icon: Pause },
  { name: 'Square', icon: Square },
  { name: 'SkipBack', icon: SkipBack },
  { name: 'SkipForward', icon: SkipForward },
  { name: 'Repeat', icon: Repeat },
  { name: 'Shuffle', icon: Shuffle },
  { name: 'FastForward', icon: FastForward },
  { name: 'Rewind', icon: Rewind },
  { name: 'Circle', icon: Circle },
  { name: 'StopCircle', icon: StopCircle },
  { name: 'PlayCircle', icon: PlayCircle }
];

const colorOptions = [
  { value: 'text-blue-500', label: 'Blue' },
  { value: 'text-red-500', label: 'Red' },
  { value: 'text-green-500', label: 'Green' },
  { value: 'text-purple-500', label: 'Purple' },
  { value: 'text-yellow-500', label: 'Yellow' },
  { value: 'text-pink-500', label: 'Pink' },
  { value: 'text-indigo-500', label: 'Indigo' },
  { value: 'text-gray-500', label: 'Gray' }
];

const backgroundOptions = [
  { value: 'bg-red-50', label: 'Light Red' },
  { value: 'bg-blue-50', label: 'Light Blue' },
  { value: 'bg-green-50', label: 'Light Green' },
  { value: 'bg-purple-50', label: 'Light Purple' },
  { value: 'bg-yellow-50', label: 'Light Yellow' },
  { value: 'bg-pink-50', label: 'Light Pink' },
  { value: 'bg-indigo-50', label: 'Light Indigo' },
  { value: 'bg-gray-50', label: 'Light Gray' }
];

export default function AboutPage() {
  const { profile, updateProfile, whatIDoItems, addWhatIDoItem, updateWhatIDoItem, deleteWhatIDoItem, refreshData } = useFirebaseData();
  const { isLightMode } = useAdminTheme();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isWhatIDoModalOpen, setIsWhatIDoModalOpen] = useState(false);
  const [editingWhatIDoItem, setEditingWhatIDoItem] = useState<WhatIDoItem | null>(null);
  const [whatIDoFormData, setWhatIDoFormData] = useState({
    title: '',
    description: '',
    icon: 'Code',
    iconColor: '#3B82F6',
    backgroundColor: '#EFF6FF'
  });
  const [isWhatIDoTranslating, setIsWhatIDoTranslating] = useState(false);

  // Success modal state
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'info' | 'warning'
  });

  // Move modal state for What I Do
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [whatIDoOrder, setWhatIDoOrder] = useState<string[]>([]);

  const openMoveModal = () => {
    // Initialize order based on current sorting: order_index asc, then createdAt desc
    const sorted = [...whatIDoItems].sort((a, b) => {
      const ai = (a as any).order_index ?? Number.POSITIVE_INFINITY;
      const bi = (b as any).order_index ?? Number.POSITIVE_INFINITY;
      if (ai !== bi) return ai - bi;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
    setWhatIDoOrder(sorted.map(i => i.id));
    setIsMoveOpen(true);
  };

  // Single-field workflow: language auto-detected on save

  const closeMoveModal = () => setIsMoveOpen(false);

  const moveInArray = <T,>(arr: T[], index: number, direction: 'up' | 'down'): T[] => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return arr;
    const copy = [...arr];
    const tmp = copy[index];
    copy[index] = copy[target];
    copy[target] = tmp;
    return copy;
  };

  const moveWhatIDo = (id: string, dir: 'up' | 'down') => {
    const idx = whatIDoOrder.indexOf(id);
    if (idx === -1) return;
    setWhatIDoOrder(prev => moveInArray(prev, idx, dir));
  };

  const [formData, setFormData] = useState({
    bio: profile?.bio || '',
  });
  const [isTranslating, setIsTranslating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTranslating(true);
    try {
      // Auto-detect language and translate with Gemini
      const detectedLang = detectLanguage(formData.bio);
      const targetLang = detectedLang === 'id' ? 'en' : 'id';
      
      // Translate to other language
      const translated = await translateText(formData.bio, detectedLang, targetLang);
      
      // Save both languages
      const bioId = detectedLang === 'id' ? formData.bio : translated;
      const bioEn = detectedLang === 'en' ? formData.bio : translated;
      
      await updateProfile({
        bio: formData.bio,
        bioId,
        bioEn
      });
      
      setIsEditing(false);
      setIsTranslating(false);
      showSuccessModal(t('aboutUpdatedTitle'), t('aboutUpdatedDesc'));
    } catch (error) {
      console.error('Error updating about:', error);
      setIsTranslating(false);
      showSuccessModal(t('errorTitle'), t('aboutUpdateFailed'), 'warning');
    }
  };

  const handleCancel = () => {
    setFormData({
      bio: profile?.bio || '',
    });
    setIsEditing(false);
  };

  const handleWhatIDoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsWhatIDoTranslating(true);
    
    try {
      // Auto-detect and translate with Gemini
      const titleLang = detectLanguage(whatIDoFormData.title);
      const descLang = detectLanguage(whatIDoFormData.description);
      
      const titleTargetLang = titleLang === 'id' ? 'en' : 'id';
      const descTargetLang = descLang === 'id' ? 'en' : 'id';
      
      const translatedTitle = await translateText(whatIDoFormData.title, titleLang, titleTargetLang);
      const translatedDesc = await translateText(whatIDoFormData.description, descLang, descTargetLang);
      
      const payload = {
        title: whatIDoFormData.title,
        titleId: titleLang === 'id' ? whatIDoFormData.title : translatedTitle,
        titleEn: titleLang === 'en' ? whatIDoFormData.title : translatedTitle,
        description: whatIDoFormData.description,
        descriptionId: descLang === 'id' ? whatIDoFormData.description : translatedDesc,
        descriptionEn: descLang === 'en' ? whatIDoFormData.description : translatedDesc,
        icon: whatIDoFormData.icon,
        iconColor: whatIDoFormData.iconColor,
        backgroundColor: whatIDoFormData.backgroundColor,
      };

      if (editingWhatIDoItem) {
        await updateWhatIDoItem(editingWhatIDoItem.id, payload);
        showSuccessModal(t('itemUpdatedTitle'), `"${whatIDoFormData.title}" ${t('itemUpdatedMsg')}`);
      } else {
        await addWhatIDoItem({
          ...payload,
          createdAt: new Date().toISOString().split('T')[0]
        });
        showSuccessModal(t('itemAddedTitle'), `"${whatIDoFormData.title}" ${t('itemAddedMsg')}`);
      }
      
      setIsWhatIDoModalOpen(false);
      setEditingWhatIDoItem(null);
      setIsWhatIDoTranslating(false);
      setWhatIDoFormData({ 
        title: '', 
        description: '', 
        icon: 'Code', 
        iconColor: '#3B82F6', 
        backgroundColor: '#EFF6FF' 
      });
    } catch (error) {
      console.error('Error saving what I do item:', error);
      setIsWhatIDoTranslating(false);
      showSuccessModal(t('errorTitle'), t('itemSaveFailed'), 'warning');
    }
  };

  const resetWhatIDoForm = () => {
    setWhatIDoFormData({
      title: '',
      description: '',
      icon: 'Code',
      iconColor: '#3B82F6',
      backgroundColor: '#EFF6FF'
    });
    setEditingWhatIDoItem(null);
    setIsWhatIDoModalOpen(false);
  };

  const handleEditWhatIDo = (item: WhatIDoItem) => {
    setWhatIDoFormData({
      title: item.title,
      description: item.description,
      icon: item.icon,
      iconColor: item.iconColor,
      backgroundColor: item.backgroundColor
    });
    setEditingWhatIDoItem(item);
    setIsWhatIDoModalOpen(true);
  };

  const handleDeleteWhatIDo = async (id: string, title: string) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await deleteWhatIDoItem(id);
        showSuccessModal(t('itemDeletedTitle'), `"${title}" ${t('itemDeletedMsg')}`);
      } catch (error) {
        console.error('Error deleting what I do item:', error);
        showSuccessModal(t('errorTitle'), t('itemDeleteFailed'), 'warning');
      }
    }
  };

  const showSuccessModal = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setSuccessModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const closeSuccessModal = () => {
    setSuccessModal({
      isOpen: false,
      title: '',
      message: '',
      type: 'success'
    });
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${isLightMode ? 'bg-gray-50' : 'bg-slate-900'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className={`text-xl sm:text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{t('aboutSection')}</h1>
              <p className={`mt-0.5 sm:mt-1 text-xs sm:text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {t('aboutSectionDesc')}
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <FiUser className="w-4 h-4" />
                <span>{t('editAbout')}</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl shadow-sm border ${isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'}`}
        >
          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-6">
                {/* Bio - Single Input (Auto-translate with Gemini) */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                    {t('bio')}
                  </label>
                  <textarea
                    rows={8}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isLightMode ? 'border-gray-300 bg-white text-gray-900' : 'border-slate-600 bg-slate-700 text-white'}`}
                    placeholder={t('bioPlaceholder') || "Write your bio in Indonesian or English..."}
                    required
                  />
                  <p className={`mt-2 text-xs ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    🤖 <strong>Auto-translate dengan Gemini:</strong> Tulis dalam bahasa apapun (ID/EN), akan otomatis diterjemahkan saat disimpan. Unlimited characters!
                  </p>
                  {isTranslating && (
                    <p className="mt-2 text-sm text-blue-600 flex items-center gap-2">
                      <span className="animate-spin">⚙️</span>
                      Translating with Gemini AI...
                    </p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className={`flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t ${isLightMode ? 'border-gray-200' : 'border-slate-600'}`}>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 px-4 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <FiSave className="w-4 h-4" />
                  <span>{t('saveChanges')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`flex-1 py-2.5 px-4 text-sm sm:text-base rounded-lg transition-colors font-medium ${isLightMode ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-slate-600 text-gray-300 hover:bg-slate-500'}`}
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          ) : (
            /* Display View */
            <div className="p-6">

              {/* Bio Section */}
              <div className="mb-8">
                <h3 className={`text-lg font-semibold mb-4 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{t('bio')}</h3>
                <div className={`prose max-w-none ${isLightMode ? 'prose-gray' : 'prose-invert'}`}>
                  <div className={`leading-relaxed space-y-4 ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`}>
                    {/* Indonesian Version */}
                    {(profile as any)?.bioId && (
                      <div className={`p-4 rounded-lg ${isLightMode ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
                        <p className={`text-xs font-semibold mb-2 flex items-center gap-2 ${isLightMode ? 'text-blue-700' : 'text-blue-400'}`}>
                          🇮🇩 Bahasa Indonesia
                        </p>
                        <p className={`${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>{(profile as any).bioId}</p>
                      </div>
                    )}
                    
                    {/* English Version */}
                    {(profile as any)?.bioEn && (
                      <div className={`p-4 rounded-lg ${isLightMode ? 'bg-green-50' : 'bg-green-900/20'}`}>
                        <p className={`text-xs font-semibold mb-2 flex items-center gap-2 ${isLightMode ? 'text-green-700' : 'text-green-400'}`}>
                          🇬🇧 English
                        </p>
                        <p className={`${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>{(profile as any).bioEn}</p>
                      </div>
                    )}

                    {/* Fallback if no bilingual data */}
                    {!(profile as any)?.bioId && !(profile as any)?.bioEn && profile?.bio && (
                      <p>{profile.bio}</p>
                    )}

                    {/* Empty state */}
                    {!(profile as any)?.bioId && !(profile as any)?.bioEn && !profile?.bio && (
                      <p className={`italic ${isLightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Belum ada bio. Klik tombol Edit untuk menambahkan.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* What I Do Section */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                  <h3 className={`text-base sm:text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{t('whatIDo')}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={openMoveModal}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-purple-600 text-white text-xs sm:text-sm rounded-lg hover:bg-purple-700 transition-colors"
                      title={t('reorderItems')}
                    >
                      <FiMove className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{t('reorderItems')}</span>
                    </button>
                    <button
                      onClick={() => setIsWhatIDoModalOpen(true)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{t('addNewItem')}</span>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {whatIDoItems.map((item) => {
                    // find matching icon component; support legacy names like 'FiCode' by stripping 'Fi'
                    const normalizeIconName = (name: string) => name?.replace(/^Fi/, '') || 'Code';
                    const normalized = normalizeIconName(item.icon as any);
                    const IconComp = (iconOptions.find(opt => opt.name === normalized)?.icon) || Code;

                    return (
                      <div
                        key={item.id}
                        className={`rounded-lg p-4 border ${item.backgroundColor} ${isLightMode ? 'border-gray-200' : 'border-slate-600'}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 rounded-lg inline-flex items-center justify-center bg-white/40`}>
                            <IconComp className={`w-5 h-5 ${item.iconColor}`} />
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEditWhatIDo(item)}
                              className={`p-1.5 text-gray-500 hover:text-blue-600 rounded transition-colors ${isLightMode ? 'hover:bg-blue-50' : 'hover:bg-blue-900/30'}`}
                            >
                              <FiEdit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteWhatIDo(item.id, item.title)}
                              className={`p-1.5 text-gray-500 hover:text-red-600 rounded transition-colors ${isLightMode ? 'hover:bg-red-50' : 'hover:bg-red-900/30'}`}
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                        
                        <h4 className={`font-medium mb-2 text-black`}>
                          {item.title}
                        </h4>
                        <p className={`text-sm leading-relaxed text-black`}>
                          {item.description}
                        </p>

                        <div className={`mt-3 flex items-center justify-between text-xs text-black/80`}>
                          <span>Icon: {normalized}</span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {whatIDoItems.length === 0 && (
                  <div className={`text-center py-8 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <p className="mb-4">{t('noItems')}</p>
                    <button
                      onClick={() => setIsWhatIDoModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiPlus className="mr-2" />
                      {t('addNewItem')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* What I Do Modal */}
        {isWhatIDoModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${isLightMode ? 'bg-white' : 'bg-slate-800'}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                    {editingWhatIDoItem ? t('editItem') : t('addNewItem')}
                  </h2>
                  <button
                    onClick={resetWhatIDoForm}
                    className={`p-2 text-gray-500 rounded-lg transition-colors ${isLightMode ? 'hover:text-gray-700' : 'hover:text-gray-300'}`}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleWhatIDoSubmit} className="space-y-4">
                  {/* Title - Single Input (Auto-translate) */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                      {t('title')}
                    </label>
                    <input
                      type="text"
                      value={whatIDoFormData.title}
                      onChange={(e) => setWhatIDoFormData({ ...whatIDoFormData, title: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isLightMode ? 'border-gray-300 bg-white text-gray-900' : 'border-slate-600 bg-slate-700 text-white'}`}
                      placeholder="e.g., UI/UX Design or Desain UI/UX"
                      required
                    />
                  </div>

                  {/* Description - Single Input (Auto-translate) */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                      {t('description')}
                    </label>
                    <textarea
                      value={whatIDoFormData.description}
                      onChange={(e) => setWhatIDoFormData({ ...whatIDoFormData, description: e.target.value })}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isLightMode ? 'border-gray-300 bg-white text-gray-900' : 'border-slate-600 bg-slate-700 text-white'}`}
                      placeholder={t('descriptionPlaceholder') || "Write in Indonesian or English..."}
                      required
                    />
                    <p className={`mt-1.5 text-xs ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      🤖 Auto-translate: Tulis dalam ID/EN, otomatis diterjemahkan dengan Gemini AI
                    </p>
                    {isWhatIDoTranslating && (
                      <p className="mt-2 text-sm text-blue-600 flex items-center gap-2">
                        <span className="animate-spin">⚙️</span>
                        Translating...
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-3 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                      {t('icon')}
                    </label>
                    <div className={`grid grid-cols-6 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3 ${isLightMode ? 'border-gray-300' : 'border-slate-600'}`}>
                      {iconOptions.map((iconOption) => {
                        const IconComponent = iconOption.icon;
                        return (
                          <button
                            key={iconOption.name}
                            type="button"
                            onClick={() => setWhatIDoFormData({ ...whatIDoFormData, icon: iconOption.name })}
                            className={`p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                              whatIDoFormData.icon === iconOption.name
                                ? `border-blue-500 text-blue-600 ${isLightMode ? 'bg-blue-50' : 'bg-blue-900/30 text-blue-400'}`
                                : `${isLightMode ? 'border-gray-200 hover:border-gray-300 text-gray-600' : 'border-slate-600 hover:border-slate-500 text-gray-400'}`
                            }`}
                            title={iconOption.name}
                          >
                            <IconComponent size={20} />
                          </button>
                        );
                      })}
                    </div>
                    <p className={`text-xs mt-2 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {t('selected')}: {whatIDoFormData.icon}
                    </p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                      {t('iconColor')}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setWhatIDoFormData({ ...whatIDoFormData, iconColor: color.value })}
                          className={`h-10 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                            whatIDoFormData.iconColor === color.value
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : `border-gray-300 ${isLightMode ? 'hover:border-gray-400' : 'hover:border-slate-500'}`
                          }`}
                          title={color.label}
                        >
                          <div className={`w-full h-full rounded-md ${color.value.replace('text-', 'bg-')}`}></div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                      {t('backgroundColor')}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {backgroundOptions.map((bg) => (
                        <button
                          key={bg.value}
                          type="button"
                          onClick={() => setWhatIDoFormData({ ...whatIDoFormData, backgroundColor: bg.value })}
                          className={`h-10 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                            whatIDoFormData.backgroundColor === bg.value
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : `border-gray-300 ${isLightMode ? 'hover:border-gray-400' : 'hover:border-slate-500'}`
                          }`}
                          title={bg.label}
                        >
                          <div className={`w-full h-full rounded-md ${bg.value}`}></div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiSave className="mr-2" />
                      {editingWhatIDoItem ? t('update') : t('create')}
                    </button>
                    <button
                      type="button"
                      onClick={resetWhatIDoForm}
                      className={`px-4 py-2 rounded-lg transition-colors ${isLightMode ? 'text-gray-700 bg-gray-100 hover:bg-gray-200' : 'text-gray-300 bg-slate-700 hover:bg-slate-600'}`}
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* Success Modal */}
        <SuccessModal
          isOpen={successModal.isOpen}
          onClose={closeSuccessModal}
          title={successModal.title}
          message={successModal.message}
          type={successModal.type}
        />

        {/* Move What I Do Modal */}
        {isMoveOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeMoveModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ${isLightMode ? 'bg-white' : 'bg-slate-800'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{t('reorderItems')}</h2>
                  <button onClick={closeMoveModal} className={`${isLightMode ? 'text-gray-500 hover:text-gray-700' : 'text-gray-300 hover:text-gray-100'}`}>
                    <FiX size={22} />
                  </button>
                </div>

                <div className="overflow-x-auto overflow-y-auto h-[480px]">
                  <table className={`w-full text-sm text-left ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`}>
                    <thead className={`${isLightMode ? 'bg-gray-100 text-gray-700' : 'bg-slate-700 text-gray-300'}`}>
                      <tr>
                        <th className="px-4 py-2 w-16">Order</th>
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2">Icon</th>
                        <th className="px-4 py-2 text-right">Move</th>
                      </tr>
                    </thead>
                    <tbody>
                      {whatIDoOrder.map((id, idx) => {
                        const item = whatIDoItems.find(x => x.id === id);
                        if (!item) return null;
                        return (
                          <tr key={id} className={`h-[3rem] ${isLightMode ? 'bg-white border-b border-gray-200' : 'bg-slate-800 border-b border-slate-700'}`}>
                            <td className="px-4 py-2">{idx + 1}</td>
                            <td className={`${isLightMode ? 'text-gray-900' : 'text-white'} px-4 py-2`}>{item.title}</td>
                            <td className="px-4 py-2">{item.icon}</td>
                            <td className="px-4 py-2">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => moveWhatIDo(id, 'up')} disabled={idx === 0} className={`p-2 rounded border ${idx === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-600'} ${isLightMode ? 'border-gray-300' : 'border-slate-600'}`} title="Move Up">
                                  <FiArrowUp />
                                </button>
                                <button onClick={() => moveWhatIDo(id, 'down')} disabled={idx === whatIDoOrder.length - 1} className={`p-2 rounded border ${idx === whatIDoOrder.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-600'} ${isLightMode ? 'border-gray-300' : 'border-slate-600'}`} title="Move Down">
                                  <FiArrowDown />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    onClick={async () => {
                      try {
                        for (let i = 0; i < whatIDoOrder.length; i++) {
                          await updateWhatIDoItem(whatIDoOrder[i], { order_index: i });
                        }
                        await refreshData();
                        setIsMoveOpen(false);
                        setWhatIDoOrder([]);
                        showSuccessModal('Move Saved', 'What I Do order has been updated.');
                      } catch (err) {
                        console.error('Error saving What I Do order:', err);
                        showSuccessModal('Error', 'Failed to save order. Please try again.', 'warning');
                      }
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Move
                  </button>
                  <button onClick={closeMoveModal} className="flex-1 bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 transition-colors">Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
