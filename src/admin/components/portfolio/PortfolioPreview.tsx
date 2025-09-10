import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { PortfolioSettings, Section, Project, ContactInfo } from '../../types';
import { Github, ExternalLink, Mail, Phone, MapPin, Linkedin, Twitter, Globe, ArrowLeft } from 'lucide-react';

export const PortfolioPreview: React.FC = () => {
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      const [settingsData, sectionsData, projectsData, contactData] = await Promise.all([
        supabase.from('portfolio_settings').select('*').single(),
        supabase.from('sections').select('*').eq('is_visible', true).order('order_index'),
        supabase.from('projects').select('*').order('order_index'),
        supabase.from('contact_info').select('*').single(),
      ]);

      if (settingsData.data) {
        setSettings(settingsData.data);
        // Update meta tags
        document.title = settingsData.data.meta_title;
        updateMetaTag('description', settingsData.data.meta_description);
        if (settingsData.data.og_image_url) {
          updateMetaTag('og:image', settingsData.data.og_image_url);
        }
      }
      if (sectionsData.data) setSections(sectionsData.data);
      if (projectsData.data) setProjects(projectsData.data);
      if (contactData.data) setContact(contactData.data);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMetaTag = (name: string, content: string) => {
    let tag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      if (name.startsWith('og:')) {
        tag.setAttribute('property', name);
      } else {
        tag.setAttribute('name', name);
      }
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const featuredProjects = projects.filter(p => p.is_featured);
  const otherProjects = projects.filter(p => !p.is_featured);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Admin</span>
              </Link>
            </div>
            <div className="flex space-x-6">
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">About</a>
              <a href="#projects" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Projects</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: settings?.hero_image_url ? `url(${settings.hero_image_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {settings?.hero_image_url && (
          <div className="absolute inset-0 bg-black/30"></div>
        )}
        <div className={`text-center z-10 px-4 ${settings?.hero_image_url ? 'text-white' : 'text-gray-900'}`}>
          {settings?.profile_image_url && (
            <div className="mb-8">
              <img
                src={settings.profile_image_url}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
              />
            </div>
          )}
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            {settings?.hero_title || 'Your Name'}
          </h1>
          <p className="text-xl lg:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
            {settings?.hero_subtitle || 'Your Professional Title'}
          </p>
          <div className="mt-8">
            <a
              href="#projects"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              View My Work
            </a>
          </div>
        </div>
      </section>

      {/* Sections */}
      {sections.map((section) => (
        <section key={section.id} id={section.key} className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{section.title}</h2>
              <div className="prose prose-lg mx-auto text-gray-700">
                {section.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Featured Projects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A selection of my recent work showcasing various technologies and design approaches
            </p>
          </div>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredProjects.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {project.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{project.title}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex space-x-4">
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>Live Demo</span>
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors duration-200"
                          >
                            <Github className="h-4 w-4" />
                            <span>GitHub</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Projects */}
          {otherProjects.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">More Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherProjects.map((project) => (
                  <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {project.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors duration-200"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Demo</span>
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm rounded transition-colors duration-200"
                          >
                            <Github className="h-3 w-3" />
                            <span>Code</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Get In Touch</h2>
          <p className="text-xl text-gray-600 mb-12">
            Let's discuss your next project or collaboration opportunity
          </p>

          {contact && (
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900">{contact.email}</span>
                  </a>
                )}
                
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900">{contact.phone}</span>
                  </a>
                )}

                {contact.location && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900">{contact.location}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-6">
                {contact.linkedin_url && (
                  <a
                    href={contact.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors duration-200"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                
                {contact.github_url && (
                  <a
                    href={contact.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors duration-200"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}

                {contact.twitter_url && (
                  <a
                    href={contact.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-400 rounded-full transition-colors duration-200"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}

                {contact.website_url && (
                  <a
                    href={contact.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-green-100 hover:bg-green-200 text-green-600 rounded-full transition-colors duration-200"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 {settings?.hero_title || 'Portfolio'}. Built with React and Supabase.
          </p>
        </div>
      </footer>
    </div>
  );
};