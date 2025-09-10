import { useState } from 'react';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { Theme } from '../types';

interface ContactProps {
  theme: Theme;
}

export default function Contact({ theme }: ContactProps) {
  const { profile } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const cardClass = theme === 'dark' 
    ? 'bg-slate-800 border border-slate-700' 
    : 'bg-white';

  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const subtitleClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const bodyTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const mutedTextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  const inputClass = theme === 'dark'
    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500';

  return (
    <section className={`${cardClass} rounded-2xl p-8 shadow-lg transition-all duration-500 h-full overflow-y-auto`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <h2 className={`text-3xl font-bold ${textClass}`}>
          Contact
        </h2>
        <div className="h-1 bg-blue-600 rounded-full w-full sm:flex-grow"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div>
          <h3 className={`text-xl font-semibold ${subtitleClass} mb-6`}>
            {profile?.contactTitle || 'Get In Touch'}
          </h3>
          <p className={`${bodyTextClass} leading-relaxed mb-6 whitespace-pre-wrap`}>
            {profile?.contactMessage || "I'm always interested in new opportunities and exciting projects. Whether you want to hire me, collaborate, or just say hello, feel free to reach out!"}
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                theme === 'dark' ? 'bg-slate-700 text-pink-400' : 'bg-pink-50 text-pink-600'
              }`}>
                <Phone size={18} />
              </div>
              <div>
                <div className={`text-sm ${mutedTextClass}`}>Phone</div>
                <div className={`font-medium ${textClass}`}>{profile?.phone || '+62 85219550092'}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                theme === 'dark' ? 'bg-slate-700 text-green-400' : 'bg-green-50 text-green-600'
              }`}>
                <Mail size={18} />
              </div>
              <div>
                <div className={`text-sm ${mutedTextClass}`}>Email</div>
                <div className={`font-medium ${textClass}`}>{profile?.email || 'Akbarflh013@gmail.com'}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                theme === 'dark' ? 'bg-slate-700 text-pink-400' : 'bg-pink-50 text-pink-600'
              }`}>
                <MapPin size={18} />
              </div>
              <div>
                <div className={`text-sm ${mutedTextClass}`}>Location</div>
                <div className={`font-medium ${textClass}`}>{profile?.location || 'Bandung, Indonesia'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h3 className={`text-xl font-semibold ${subtitleClass} mb-6`}>Send Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 ${inputClass}`}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 ${inputClass}`}
                required
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 ${inputClass}`}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 resize-none ${inputClass}`}
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 flex items-center justify-center gap-2 font-medium transition-colors duration-200"
            >
              <Send size={16} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}