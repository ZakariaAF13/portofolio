import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { useRef } from 'react';
import ScrollDownHint from './ScrollDownHint';
import { useForm, ValidationError } from '@formspree/react';
import { useFirebaseData } from '../context/FirebaseDataContext';
import { useAnalytics, usePageTracking } from '../hooks/useAnalytics';
import { addContactMessage } from '../utils/firestore';
import type { Theme } from '../types';

interface ContactProps {
  theme: Theme;
}

export default function Contact({ theme }: ContactProps) {
  const { profile } = useFirebaseData();
  const [state, handleSubmit] = useForm("xgvldqev");
  const { trackContactFormSubmit } = useAnalytics();
  const sectionRef = useRef<HTMLElement>(null);
  
  usePageTracking('Contact');

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
    <section ref={sectionRef} className={`${cardClass} relative rounded-2xl p-8 shadow-lg transition-all duration-500 h-full overflow-y-auto`}>
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
          {state.succeeded ? (
            <div className={`p-6 rounded-lg border-2 border-green-500 ${theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700'}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Send size={16} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Message Sent Successfully!</h4>
                  <p className="text-sm opacity-80">Thank you for reaching out. I'll get back to you soon.</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={async (e) => {
              e.preventDefault();
              
              // Get form data
              const formData = new FormData(e.currentTarget);
              const contactData = {
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                subject: formData.get('subject') as string,
                message: formData.get('message') as string
              };
              
              try {
                // Save to Firestore
                await addContactMessage(contactData);
                console.log('Message saved to Firestore');
              } catch (error) {
                console.error('Error saving to Firestore:', error);
              }
              
              // Submit to Formspree
              handleSubmit(e);
              trackContactFormSubmit();
            }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 ${inputClass}`}
                    required
                  />
                  <ValidationError 
                    prefix="Name" 
                    field="name"
                    errors={state.errors}
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 ${inputClass}`}
                    required
                  />
                  <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 ${inputClass}`}
                  required
                />
                <ValidationError 
                  prefix="Subject" 
                  field="subject"
                  errors={state.errors}
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 resize-none ${inputClass}`}
                  required
                ></textarea>
                <ValidationError 
                  prefix="Message" 
                  field="message"
                  errors={state.errors}
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={state.submitting}
                className={`w-full rounded-lg px-6 py-3 flex items-center justify-center gap-2 font-medium transition-colors duration-200 ${
                  state.submitting 
                    ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Send size={16} />
                {state.submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
      <ScrollDownHint targetRef={sectionRef} theme={theme} />
    </section>
  );
}