import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../../lib/supabase';
import { ContactInfo } from '../../../types';
import { Save, Mail, Phone, MapPin, Linkedin, Github, Twitter, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin_url: z.string().optional(),
  github_url: z.string().optional(),
  twitter_url: z.string().optional(),
  website_url: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactEditor: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    const loadContactInfo = async () => {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .single();

      if (data) {
        setValue('email', data.email);
        setValue('phone', data.phone || '');
        setValue('location', data.location || '');
        setValue('linkedin_url', data.linkedin_url || '');
        setValue('github_url', data.github_url || '');
        setValue('twitter_url', data.twitter_url || '');
        setValue('website_url', data.website_url || '');
      }
    };

    loadContactInfo();
  }, [setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('contact_info')
        .upsert(data);

      if (error) throw error;
      toast.success('Contact information updated successfully');
    } catch (error) {
      toast.error('Failed to update contact information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Information</h1>
        <p className="text-gray-600 mt-2">Manage your contact details and social media links</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Details</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Email Address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-2" />
                  Phone Number
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-2" />
                Location
              </label>
              <input
                {...register('location')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="City, Country"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Linkedin className="inline h-4 w-4 mr-2" />
                  LinkedIn URL
                </label>
                <input
                  {...register('linkedin_url')}
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Github className="inline h-4 w-4 mr-2" />
                  GitHub URL
                </label>
                <input
                  {...register('github_url')}
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Twitter className="inline h-4 w-4 mr-2" />
                  Twitter URL
                </label>
                <input
                  {...register('twitter_url')}
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="inline h-4 w-4 mr-2" />
                  Website URL
                </label>
                <input
                  {...register('website_url')}
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://your-website.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Contact Information'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};