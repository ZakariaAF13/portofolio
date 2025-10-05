import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Project } from '../../../types';
import { FileUpload } from '../FileUpload';
import { Plus, Save, Trash2, Star } from 'lucide-react';
import { useFirebaseData } from '../../../../context/FirebaseDataContext';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image_url: z.string().optional(),
  demo_url: z.string().optional(),
  github_url: z.string().optional(),
  instagram_reels_url: z.string().optional(),
  tiktok_url: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['Published', 'Draft']).optional(),
  technologies: z.array(z.string()),
  is_featured: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export const ProjectsEditor: React.FC = () => {
  const { projects: fbProjects, addProject, updateProject, deleteProject: deleteProjectCtx } = useFirebaseData();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [message, setMessage] = useState<string | null>(null);

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
      category: 'General',
      status: 'Published',
    },
  });

  const watchedTechnologies = watch('technologies');

  useEffect(() => {
    setProjects(fbProjects);
  }, [fbProjects]);

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);
    try {
      if (selectedProject) {
        // Map schema to Firebase Project shape
        const payload: Partial<Project> = {
          title: data.title,
          description: data.description,
          imageUrl: data.image_url || undefined,
          liveUrl: (data as any).demo_url || undefined,
          githubUrl: (data as any).github_url || undefined,
          instagramReelsUrl: (data as any).instagram_reels_url || undefined,
          tiktokUrl: (data as any).tiktok_url || undefined,
          category: (data as any).category || 'General',
          status: (data as any).status || 'Published',
          technologies: data.technologies,
        };
        await updateProject(selectedProject.id, payload);
        setMessage('Project updated successfully');
      } else {
        const newProject: Omit<Project, 'id'> = {
          title: data.title,
          description: data.description,
          imageUrl: data.image_url || undefined,
          liveUrl: (data as any).demo_url || undefined,
          githubUrl: (data as any).github_url || undefined,
          instagramReelsUrl: (data as any).instagram_reels_url || undefined,
          tiktokUrl: (data as any).tiktok_url || undefined,
          technologies: data.technologies,
          category: (data as any).category || 'General',
          status: (data as any).status || 'Published',
          createdAt: new Date().toISOString().split('T')[0],
        } as Omit<Project, 'id'>;
        await addProject(newProject);
        setMessage('Project created successfully');
      }
      // projects state will refresh from context listener
      setSelectedProject(null);
      reset();
    } catch (error) {
      setMessage('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteProjectCtx(id);
      setMessage('Project deleted successfully');
      setSelectedProject(null);
      reset();
    } catch (error) {
      setMessage('Failed to delete project');
    }
  };

  const selectProject = (project: Project) => {
    setSelectedProject(project);
    setValue('title', project.title);
    setValue('description', project.description || '');
    // Map Firebase fields back to form fields
    setValue('image_url', (project as any).image_url || project.imageUrl || '');
    setValue('demo_url', (project as any).demo_url || (project as any).liveUrl || '');
    setValue('github_url', (project as any).github_url || project.githubUrl || '');
    setValue('instagram_reels_url', (project as any).instagram_reels_url || (project as any).instagramReelsUrl || '');
    setValue('tiktok_url', (project as any).tiktok_url || (project as any).tiktokUrl || '');
    setValue('category', (project as any).category || 'General');
    setValue('status', (project as any).status || 'Published');
    setValue('technologies', project.technologies || []);
    setValue('is_featured', (project as any).is_featured || false);
  };

  const addTechnology = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      const currentTechs: string[] = (watchedTechnologies as string[]) || [];
      const value = techInput.trim();
      if (!currentTechs.includes(value)) {
        setValue('technologies', [...currentTechs, value]);
        setTechInput('');
      }
    }
  };

  const removeTechnology = (tech: string) => {
    const currentTechs: string[] = (watchedTechnologies as string[]) || [];
    setValue('technologies', currentTechs.filter((t: string) => t !== tech));
  };

  // AI Assistant removed

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage your portfolio projects and showcase work</p>
        </div>
        <div className="flex space-x-3">
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
                      {(project as any).is_featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
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
                    {(project.description || '').substring(0, 60)}...
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(project.technologies || []).slice(0, 3).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {(project.technologies || []).length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        +{(project.technologies || []).length - 3}
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
            {message && (
              <div className="mb-4 text-sm text-gray-700">{message}</div>
            )}
            
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
                    Project URL (Live)
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram Reels URL
                  </label>
                  <input
                    {...register('instagram_reels_url')}
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://www.instagram.com/reel/SHORTCODE/"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TikTok URL
                  </label>
                  <input
                    {...register('tiktok_url')}
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://www.tiktok.com/@username/video/1234567890"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="General">General</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Fullstack">Fullstack</option>
                    <option value="UI/UX">UI/UX</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
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

          {/* AI Assistant removed */}
        </div>
      </div>
    </div>
  );
};