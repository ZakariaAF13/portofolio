import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../../lib/supabase';
import { Section } from '../../../types';
import { AIAssistant } from '../AIAssistant';
import { Plus, Save, Trash2, Eye, EyeOff, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const sectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  is_visible: z.boolean(),
});

type SectionFormData = z.infer<typeof sectionSchema>;

export const SectionEditor: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
  });

  const watchedContent = watch('content');

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .order('order_index');

    if (data) {
      setSections(data);
    }
  };

  const onSubmit = async (data: SectionFormData) => {
    setLoading(true);
    try {
      if (selectedSection) {
        // Update existing section
        const { error } = await supabase
          .from('sections')
          .update(data)
          .eq('id', selectedSection.id);

        if (error) throw error;
        toast.success('Section updated successfully');
      } else {
        // Create new section
        const { error } = await supabase
          .from('sections')
          .insert({
            ...data,
            key: data.title.toLowerCase().replace(/\s+/g, '_'),
            order_index: sections.length,
          });

        if (error) throw error;
        toast.success('Section created successfully');
      }

      await loadSections();
      setSelectedSection(null);
      reset();
    } catch (error) {
      toast.error('Failed to save section');
    } finally {
      setLoading(false);
    }
  };

  const deleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Section deleted successfully');
      await loadSections();
      setSelectedSection(null);
      reset();
    } catch (error) {
      toast.error('Failed to delete section');
    }
  };

  const selectSection = (section: Section) => {
    setSelectedSection(section);
    setValue('title', section.title);
    setValue('content', section.content);
    setValue('is_visible', section.is_visible);
  };

  const handleAISuggestion = (field: string, suggestion: string) => {
    setValue('content', suggestion);
    toast.success('AI suggestion applied');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Sections</h1>
          <p className="text-gray-600 mt-2">Manage About, Services, and other content sections</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAI(!showAI)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Assistant</span>
          </button>
          <button
            onClick={() => {
              setSelectedSection(null);
              reset();
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>New Section</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Sections</h2>
            <div className="space-y-3">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedSection?.id === section.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => selectSection(section)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{section.title}</h3>
                    <div className="flex items-center space-x-2">
                      {section.is_visible ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(section.id);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {section.content.substring(0, 50)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {selectedSection ? 'Edit Section' : 'Create New Section'}
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  {...register('title')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., About Me, Services, Experience"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  {...register('content')}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Write your section content here..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  {...register('is_visible')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Visible on website
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : selectedSection ? 'Update Section' : 'Create Section'}</span>
              </button>
            </form>
          </div>

          {showAI && watchedContent && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Assistant</h2>
              <AIAssistant
                content={{ content: watchedContent }}
                onSuggestion={handleAISuggestion}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};