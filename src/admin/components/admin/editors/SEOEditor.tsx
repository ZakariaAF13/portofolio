import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileUpload } from '../FileUpload';
import { Search, Save, Eye } from 'lucide-react';
import { getPortfolioSettingsFromFirestore, updatePortfolioSettingsInFirestore } from '../../../../utils/portfolioFirestore';

const seoSchema = z.object({
  meta_title: z.string().min(1, 'Meta title is required').max(60, 'Title should be under 60 characters'),
  meta_description: z.string().min(1, 'Meta description is required').max(160, 'Description should be under 160 characters'),
  og_image_url: z.string().optional(),
});

type SEOFormData = z.infer<typeof seoSchema>;

export const SEOEditor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SEOFormData>({
    resolver: zodResolver(seoSchema),
  });

  const watchedTitle = watch('meta_title');
  const watchedDescription = watch('meta_description');
  const watchedOGImage = watch('og_image_url');

  useEffect(() => {
    const loadSEOSettings = async () => {
      const data = await getPortfolioSettingsFromFirestore();
      if (data) {
        setValue('meta_title', data.meta_title || '');
        setValue('meta_description', data.meta_description || '');
        setValue('og_image_url', data.og_image_url || '');
      }
    };

    loadSEOSettings();
  }, [setValue]);

  const onSubmit = async (data: SEOFormData) => {
    setLoading(true);
    try {
      await updatePortfolioSettingsInFirestore(data);
      setMessage('SEO settings updated successfully');
      
      // Update document meta tags immediately
      updateMetaTags(data);
    } catch (error) {
      setMessage('Failed to update SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const updateMetaTags = (data: SEOFormData) => {
    // Update title
    document.title = data.meta_title;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', data.meta_description);

    // Update OG tags
    const updateOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOGTag('og:title', data.meta_title);
    updateOGTag('og:description', data.meta_description);
    if (data.og_image_url) {
      updateOGTag('og:image', data.og_image_url);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SEO Settings</h1>
        <p className="text-gray-600 mt-2">Optimize your portfolio for search engines and social sharing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-6">
              <Search className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Meta Information</h2>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  {...register('meta_title')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your Name - Professional Title"
                />
                <div className="mt-1 flex justify-between text-xs">
                  {errors.meta_title ? (
                    <p className="text-red-600">{errors.meta_title.message}</p>
                  ) : (
                    <p className="text-gray-500">Recommended: 50-60 characters</p>
                  )}
                  <p className={`${(watchedTitle?.length || 0) > 60 ? 'text-red-600' : 'text-gray-500'}`}>
                    {watchedTitle?.length || 0}/60
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  {...register('meta_description')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Brief description that appears in search results"
                />
                <div className="mt-1 flex justify-between text-xs">
                  {errors.meta_description ? (
                    <p className="text-red-600">{errors.meta_description.message}</p>
                  ) : (
                    <p className="text-gray-500">Recommended: 150-160 characters</p>
                  )}
                  <p className={`${(watchedDescription?.length || 0) > 160 ? 'text-red-600' : 'text-gray-500'}`}>
                    {watchedDescription?.length || 0}/160
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Open Graph Image
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Image that appears when your portfolio is shared on social media (recommended: 1200x630px)
                </p>
                <FileUpload
                  onUpload={(url) => setValue('og_image_url', url)}
                  currentImage={watchedOGImage}
                  type="og"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save SEO Settings'}</span>
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-6">
              <Eye className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Search Preview</h2>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="text-sm text-green-700 mb-1">yourportfolio.com</div>
              <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer mb-1">
                {watchedTitle || 'Your Meta Title'}
              </div>
              <div className="text-gray-700 text-sm">
                {watchedDescription || 'Your meta description will appear here...'}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Social Media Preview</h2>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {watchedOGImage && (
                <img
                  src={watchedOGImage}
                  alt="Open Graph preview"
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 bg-gray-50">
                <div className="text-sm text-gray-600 mb-1">YOURPORTFOLIO.COM</div>
                <div className="text-gray-900 font-medium mb-1">
                  {watchedTitle || 'Your Meta Title'}
                </div>
                <div className="text-gray-700 text-sm">
                  {watchedDescription || 'Your meta description will appear here...'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};