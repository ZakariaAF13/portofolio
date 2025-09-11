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
import { useFirebaseData } from '../context/FirebaseDataContext';
import type { Theme } from '../types';

interface AboutProps {
  theme: Theme;
}

// Icon mapping for dynamic icons
const iconMap = {
  Code, Palette, Database, Smartphone, Monitor, Globe, Zap, Layers,
  Briefcase, Settings, Heart, Star, Target, Award, BookOpen, Coffee,
  Camera, Music, Gamepad2, Headphones, Mic, Video, Edit3, PenTool,
  Figma, Github, GitBranch, Terminal, Server, Cloud, Shield, Lock,
  Wifi, Bluetooth, Battery, Cpu, HardDrive, Phone, Tablet, Laptop,
  Pc, Watch, Tv, Radio, Speaker, Volume2, MessageCircle, Mail, Send,
  PhoneIcon, Users, User, MapPin, Calendar, Clock, Timer, Stopwatch,
  AlarmClock, Sun, Moon, CloudRain, CloudSnow, Thermometer, Wind,
  Eye, EyeOff, Search, Filter, ArrowUpDown, List, Grid, BarChart,
  PieChart, TrendingUp, TrendingDown, Activity, Pulse, Lightning,
  Flash, Flame, Droplet, Leaf, Trees, Flower2, Mountain, Waves,
  Anchor, Plane, Car, Truck, Bus, Bike, Train, Ship, Rocket,
  Satellite, Compass, Map, Navigation, Route, Flag, Home, Building,
  Store, Factory, School, Cross, Church, Landmark, Hotel,
  UtensilsCrossed, ShoppingBag, ShoppingCart, CreditCard, DollarSign,
  Euro, PoundSterling, Bitcoin, Coins, Wallet, Receipt, Calculator,
  FileText, File, Folder, Archive, Download, Upload, Share, Link,
  Copy, Scissors, Clipboard, Save, Trash, RefreshCw, RotateCcw,
  RotateCw, Maximize, Minimize, Plus, Minus, X, Check, CheckCircle,
  XCircle, AlertCircle, Info, HelpCircle, QuestionMark, AlertTriangle,
  Bell, BellOff, Volume, VolumeX, Play, Pause, Square, SkipBack,
  SkipForward, Repeat, Shuffle, FastForward, Rewind, Circle,
  StopCircle, PlayCircle
};

export default function About({ theme }: AboutProps) {
  const { profile, whatIDoItems } = useFirebaseData();
  
  const cardClass = theme === 'dark' 
    ? 'bg-slate-800 border border-slate-700' 
    : 'bg-white';

  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const subtitleClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const bodyTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  return (
    <section className={`${cardClass} rounded-2xl p-8 shadow-lg transition-all duration-500 h-full overflow-y-auto`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <h2 className={`text-3xl font-bold ${textClass}`}>
          About
        </h2>
        <div className="h-1 bg-blue-600 rounded-full w-full sm:flex-grow"></div>
      </div>
      
      <div className="space-y-6 mb-10">
        {profile?.bio ? (
          <div className={`${bodyTextClass} leading-relaxed text-base max-w-4xl`}>
            {profile.bio.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <>
            <p className={`${bodyTextClass} leading-relaxed text-base max-w-4xl`}>
            Fullstack Web Developer passionate about building end-to-end web applications. Skilled in both frontend and backend development using frameworks and technologies such as React.js, Next.js, Express.js, Laravel, Tailwind, and Bootstrap. Experienced in designing responsive user interfaces, developing robust server-side logic and APIs, as well as editing photos, videos, and logos. Adept at combining technological innovation with administrative efficiency to deliver scalable, user-friendly, and creative digital solutions.
            </p>
          </>
        )}
      </div>

      <h3 className={`text-xl font-semibold ${subtitleClass} mb-6`}>What I Do!</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
        {whatIDoItems.map((item) => {
          const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Code;
          const skillCardClass = theme === 'dark' 
            ? 'bg-slate-700 hover:bg-slate-600' 
            : `${item.backgroundColor} hover:shadow-md`;

          return (
            <div
              key={item.id}
              className={`${skillCardClass} rounded-xl p-6 transition-all duration-200`}
            >
              <div className={`flex items-center mb-3 ${
                theme === 'dark' ? 'text-blue-400' : item.iconColor
              }`}>
                <IconComponent size={24} />
              </div>
              <h4 className={`font-semibold mb-2 text-base ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {item.title}
              </h4>
              <p className={`text-sm leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      </section>
  );
}