import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollDownHint from './ScrollDownHint';
import { useFirebaseData } from '../context/FirebaseDataContext';
import { useAnalytics, usePageTracking } from '../hooks/useAnalytics';
import { getBilingualText } from '../utils/bilingual';
import type { Theme } from '../types';
import { useForm } from '@formspree/react';

interface ContactProps {
  theme: Theme;
}

export default function Contact({ theme }: ContactProps) {
  const { profile } = useFirebaseData();
  const [state, handleSubmit] = useForm("xgvldqev");
  const { trackContactFormSubmit } = useAnalytics();
  const sectionRef = useRef<HTMLElement>(null);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  
  // Get error message for a specific field
  const getErrorMessage = (field: string): string | null => {
    if (!state.errors || !('errors' in state.errors) || !Array.isArray(state.errors.errors)) {
      return null;
    }
    
    // Find the first error for this field
    const error = state.errors.errors.find((err: any) => 
      (err.field === field) || 
      (typeof err.code === 'string' && err.code.includes(field))
    );
    
    return error?.message || null;
  };
  
  // Check if there are any errors
  const hasErrors = state.errors && 'errors' in state.errors && 
                   Array.isArray(state.errors.errors) && 
                   state.errors.errors.length > 0;
  
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
          {t('contact.title')}
        </h2>
        <div className="h-1 bg-blue-600 rounded-full w-full sm:flex-grow"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div>
          <h3 className={`text-xl font-semibold ${subtitleClass} mb-6`}>
            {getBilingualText(profile, 'contactTitle', currentLang) || t('contact.title')}
          </h3>
          <p className={`${bodyTextClass} leading-relaxed mb-6 whitespace-pre-wrap`}>
            {getBilingualText(profile, 'contactMessage', currentLang) || t('contact.subtitle')}
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                theme === 'dark' ? 'bg-slate-700 text-pink-400' : 'bg-pink-50 text-pink-600'
              }`}>
                <Phone size={18} />
              </div>
              <div>
                <div className={`text-sm ${mutedTextClass}`}>{t('sidebar.phone')}</div>
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
                <div className={`text-sm ${mutedTextClass}`}>{t('sidebar.email')}</div>
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
                <div className={`text-sm ${mutedTextClass}`}>{t('sidebar.location')}</div>
                <div className={`font-medium ${textClass}`}>{profile?.location || 'Bandung, Indonesia'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h3 className={`text-xl font-semibold ${subtitleClass} mb-6`}>{t('contact.send')}</h3>
          {state.succeeded ? (
            <div className={`p-6 rounded-lg border-2 border-green-500 ${theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700'}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Send size={16} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">{t('contact.success')}</h4>
                  <p className="text-sm opacity-80">{t('contact.getInTouch')}</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={async (e) => {
              e.preventDefault();
              
              // Submit to Formspree
              handleSubmit(e);
              trackContactFormSubmit();
            }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder={t('contact.name')}
                    className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 ${inputClass}`}
                  />
                  {hasErrors && (
                    <div className="text-red-500 text-sm mt-1">
                      {getErrorMessage('name')}
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder={t('contact.email')}
                    className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 ${inputClass}`}
                    required
                  />
                  {hasErrors && (
                    <div className="text-red-500 text-sm mt-1">
                      {getErrorMessage('email')}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder={t('contact.subject')}
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 ${inputClass}`}
                  required
                />
                {hasErrors && (
                  <div className="text-red-500 text-sm mt-1">
                    {getErrorMessage('subject')}
                  </div>
                )}
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder={t('contact.message')}
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 resize-none ${inputClass}`}
                  required
                ></textarea>
                {hasErrors && (
                  <div className="text-red-500 text-sm mt-1">
                    {getErrorMessage('message')}
                  </div>
                )}
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
                {state.submitting ? t('contact.sending') : t('contact.send')}
              </button>
            </form>
          )}
        </div>
      </div>
      <ScrollDownHint targetRef={sectionRef} theme={theme} />
    </section>
  );
}