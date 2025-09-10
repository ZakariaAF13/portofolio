import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../../lib/supabase';
import { FileUpload } from '../FileUpload';
import { AIAssistant } from '../AIAssistant';
import { Sparkles, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const heroSchema = z.object({
  hero_title: z.string().min(1, 'Title is required'),
  hero_subtitle: z.string().min(1, 'Subtitle is required'),
  hero_image_url: z.string().optional(),
  profile_image_url: z.string().optional(),
});

type HeroFormData = z.infer<typeof heroSchema>;

export const HeroEditor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
  });

  const watchedTitle = watch('hero_title');
  const watchedSubtitle = watch('hero_subtitle');

  useEffect(() => {
    const loadSettings = async () => {
      const { data, error } = await supabase
        .from('portfolio_settings')
        .select('*')
        .single();

      if (data) {
        setValue('hero_title', data.hero_title);
        setValue('hero_subtitle', data.hero_subtitle);
        setValue('hero_image_url', data.hero_image_url || '');
        setValue('profile_image_url', data.profile_image_url || '');
      }
    };

    loadSettings();
  }, [setValue]);

  const onSubmit = async (data: HeroFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('portfolio_settings')
        .upsert(data);

      if (error) throw error;
      toast.success('Hero section updated successfully');
    } catch (error) {
      toast.error('Failed to update hero section');
    } finally {
      setLoading(false);
    }
  };

  const handleAISuggestion = (field: string, suggestion: string) => {
    setValue(field as keyof HeroFormData, suggestion);
    toast.success('AI suggestion applied');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Section</h1>
          <p className="text-gray-600 mt-2">Manage your portfolio's main landing content</p>
        </div>
        <button
          onClick={() => setShowAI(!showAI)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
        >
          <Sparkles className="h-4 w-4" />
          <span>AI Assistant</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Content Settings</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Title
                </label>
                <input
                  {...register('hero_title')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your Name or Main Title"
                />
                {errors.hero_title && (
                  <p className="mt-1 text-sm text-red-600">{errors.hero_title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle/Tagline
                </label>
                <textarea
                  {...register('hero_subtitle')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Brief description of what you do"
                />
                {errors.hero_subtitle && (
                  <p className="mt-1 text-sm text-red-600">{errors.hero_subtitle.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Image Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Profile Image
                </label>
                <FileUpload
                  onUpload={(url) => setValue('profile_image_url', url)}
                  currentImage={watch('profile_image_url')}
                  type="profile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Hero Background Image
                </label>
                <FileUpload
                  onUpload={(url) => setValue('hero_image_url', url)}
                  currentImage={watch('hero_image_url')}
                  type="hero"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {showAI && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Assistant</h2>
              <AIAssistant
                content={{
                  title: watchedTitle,
                  subtitle: watchedSubtitle,
                }}
                onSuggestion={handleAISuggestion}
              />
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Preview</h2>
            <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
              <div className="text-center">
                {watch('profile_image_url') && (
                  <img
                    src={watch('profile_image_url')}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                )}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {watchedTitle || 'Your Name'}
                </h1>
                <p className="text-gray-600">
                  {watchedSubtitle || 'Your tagline here'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};