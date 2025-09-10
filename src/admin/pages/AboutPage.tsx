import { useState } from 'react';
import { FiSave, FiUser, FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
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
import { useData } from '../../context/DataContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import { motion } from 'framer-motion';
import type { WhatIDoItem } from '../types';

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
  const { profile, updateProfile, whatIDoItems, addWhatIDoItem, updateWhatIDoItem, deleteWhatIDoItem } = useData();
  const { isLightMode } = useAdminTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isWhatIDoModalOpen, setIsWhatIDoModalOpen] = useState(false);
  const [editingWhatIDoItem, setEditingWhatIDoItem] = useState<WhatIDoItem | null>(null);
  const [whatIDoFormData, setWhatIDoFormData] = useState({
    title: '',
    description: '',
    icon: 'Code',
    iconColor: 'text-blue-500',
    backgroundColor: 'bg-blue-50'
  });
  
  const [formData, setFormData] = useState({
    bio: profile.bio || '',
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      bio: profile.bio || '',
    });
    setIsEditing(false);
  };

  const handleWhatIDoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingWhatIDoItem) {
      updateWhatIDoItem(editingWhatIDoItem.id, whatIDoFormData);
    } else {
      addWhatIDoItem({
        ...whatIDoFormData,
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    
    resetWhatIDoForm();
  };

  const resetWhatIDoForm = () => {
    setWhatIDoFormData({
      title: '',
      description: '',
      icon: 'Code',
      iconColor: 'text-blue-500',
      backgroundColor: 'bg-blue-50'
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

  const handleDeleteWhatIDo = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteWhatIDoItem(id);
    }
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>About Section</h1>
              <p className={`mt-1 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Manage your personal information and bio for the About section
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FiUser size={16} />
                Edit About
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
                {/* Bio */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                    About Description
                  </label>
                  <textarea
                    rows={6}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isLightMode ? 'border-gray-300 bg-white text-gray-900' : 'border-slate-600 bg-slate-700 text-white'}`}
                    placeholder="Write a brief description about yourself, your experience, and your passion..."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className={`flex gap-3 pt-4 border-t ${isLightMode ? 'border-gray-200' : 'border-slate-600'}`}>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FiSave size={16} />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${isLightMode ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-slate-600 text-gray-300 hover:bg-slate-500'}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Display View */
            <div className="p-6">

              {/* Bio Section */}
              <div className="mb-8">
                <h3 className={`text-lg font-semibold mb-4 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>About Me</h3>
                <div className={`prose max-w-none ${isLightMode ? 'prose-gray' : 'prose-invert'}`}>
                  <p className={`leading-relaxed ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`}>
                    {profile.bio || 'Add your bio description here. This will appear in the About section of your portfolio.'}
                  </p>
                </div>
              </div>

              {/* What I Do Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>What I Do</h3>
                  <button
                    onClick={() => setIsWhatIDoModalOpen(true)}
                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiPlus className="mr-2" size={14} />
                    Add Item
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {whatIDoItems.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-lg p-4 border ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-slate-700 border-slate-600'}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${item.backgroundColor}`}>
                          <div className={`w-5 h-5 ${item.iconColor}`}>
                            <div className="w-full h-full bg-current opacity-20 rounded"></div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditWhatIDo(item)}
                            className={`p-1.5 text-gray-500 hover:text-blue-600 rounded transition-colors ${isLightMode ? 'hover:bg-blue-50' : 'hover:bg-blue-900/30'}`}
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteWhatIDo(item.id)}
                            className={`p-1.5 text-gray-500 hover:text-red-600 rounded transition-colors ${isLightMode ? 'hover:bg-red-50' : 'hover:bg-red-900/30'}`}
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <h4 className={`font-medium mb-2 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                        {item.title}
                      </h4>
                      <p className={`text-sm leading-relaxed ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`}>
                        {item.description}
                      </p>
                      
                      <div className={`mt-3 flex items-center justify-between text-xs ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <span>Icon: {item.icon}</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {whatIDoItems.length === 0 && (
                  <div className={`text-center py-8 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <p className="mb-4">No "What I Do" items yet.</p>
                    <button
                      onClick={() => setIsWhatIDoModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiPlus className="mr-2" />
                      Add First Item
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
                    {editingWhatIDoItem ? 'Edit Item' : 'Add New Item'}
                  </h2>
                  <button
                    onClick={resetWhatIDoForm}
                    className={`p-2 text-gray-500 rounded-lg transition-colors ${isLightMode ? 'hover:text-gray-700' : 'hover:text-gray-300'}`}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleWhatIDoSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={whatIDoFormData.title}
                      onChange={(e) => setWhatIDoFormData({ ...whatIDoFormData, title: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isLightMode ? 'border-gray-300 bg-white text-gray-900' : 'border-slate-600 bg-slate-700 text-white'}`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                      Description
                    </label>
                    <textarea
                      value={whatIDoFormData.description}
                      onChange={(e) => setWhatIDoFormData({ ...whatIDoFormData, description: e.target.value })}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isLightMode ? 'border-gray-300 bg-white text-gray-900' : 'border-slate-600 bg-slate-700 text-white'}`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-3 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                      Icon
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
                      Selected: {whatIDoFormData.icon}
                    </p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                      Icon Color
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
                      Background Color
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
                      {editingWhatIDoItem ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={resetWhatIDoForm}
                      className={`px-4 py-2 rounded-lg transition-colors ${isLightMode ? 'text-gray-700 bg-gray-100 hover:bg-gray-200' : 'text-gray-300 bg-slate-700 hover:bg-slate-600'}`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
