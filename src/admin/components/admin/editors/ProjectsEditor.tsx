import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../../lib/supabase';
import { Project } from '../../../types';
import { FileUpload } from '../FileUpload';
import { AIAssistant } from '../AIAssistant';
import { Plus, Save, Trash2, Star, StarOff, ExternalLink, Github, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image_url: z.string().optional(),
  demo_url: z.string().optional(),
  github_url: z.string().optional(),
  technologies: z.array(z.string()),
  is_featured: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export const ProjectsEditor: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [techInput, setTechInput] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      technologies: [],
      is_featured: false,
    },
  });

  const watchedDescription = watch('description');
  const watchedTechnologies = watch('technologies');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index');

    if (data) {
      setProjects(data);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);
    try {
      if (selectedProject) {
        const { error } = await supabase
          .from('projects')
          .update(data)
          .eq('id', selectedProject.id);

        if (error) throw error;
        toast.success('Project updated successfully');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert({
            ...data,
            order_index: projects.length,
          });

        if (error) throw error;
        toast.success('Project created successfully');
      }

      await loadProjects();
      setSelectedProject(null);
      reset();
    } catch (error) {
      toast.error('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Project deleted successfully');
      await loadProjects();
      setSelectedProject(null);
      reset();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const selectProject = (project: Project) => {
    setSelectedProject(project);
    setValue('title', project.title);
    setValue('description', project.description);
    setValue('image_url', project.image_url || '');
    setValue('demo_url', project.demo_url || '');
    setValue('github_url', project.github_url || '');
    setValue('technologies', project.technologies);
    setValue('is_featured', project.is_featured);
  };

  const addTechnology = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      const currentTechs = watchedTechnologies || [];
      if (!currentTechs.includes(techInput.trim())) {
        setValue('technologies', [...currentTechs, techInput.trim()]);
        setTechInput('');
      }
    }
  };

  const removeTechnology = (tech: string) => {
    const currentTechs = watchedTechnologies || [];
    setValue('technologies', currentTechs.filter(t => t !== tech));
  };

  const handleAISuggestion = (field: string, suggestion: string) => {
    setValue('description', suggestion);
    toast.success('AI suggestion applied');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage your portfolio projects and showcase work</p>
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
              setSelectedProject(null);
              reset();
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Projects</h2>
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedProject?.id === project.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => selectProject(project)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                    <div className="flex items-center space-x-2">
                      {project.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject(project.id);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {project.description.substring(0, 60)}...
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {selectedProject ? 'Edit Project' : 'Create New Project'}
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title
                  </label>
                  <input
                    {...register('title')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Project Name"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technologies
                  </label>
                  <input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={addTechnology}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Press Enter to add tech (e.g., React, Node.js)"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watchedTechnologies?.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Describe your project, its features, and your role"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Demo URL
                  </label>
                  <input
                    {...register('demo_url')}
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://project-demo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub URL
                  </label>
                  <input
                    {...register('github_url')}
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Project Image
                </label>
                <FileUpload
                  onUpload={(url) => setValue('image_url', url)}
                  currentImage={watch('image_url')}
                  type="project"
                />
              </div>

              <div className="flex items-center">
                <input
                  {...register('is_featured')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Featured project (display prominently)
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : selectedProject ? 'Update Project' : 'Create Project'}</span>
              </button>
            </form>
          </div>

          {showAI && watchedDescription && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Assistant</h2>
              <AIAssistant
                content={{ description: watchedDescription }}
                onSuggestion={handleAISuggestion}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};