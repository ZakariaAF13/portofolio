import { useEffect } from 'react';
import { analytics } from '../config/firebase';
import { logEvent, setCurrentScreen } from 'firebase/analytics';

export const useAnalytics = () => {
  const trackPageView = (pageName: string) => {
    if (analytics) {
      setCurrentScreen(analytics, pageName);
      logEvent(analytics, 'page_view', {
        page_title: pageName,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
  };

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (analytics) {
      logEvent(analytics, eventName, parameters);
    }
  };

  const trackContactFormSubmit = () => {
    trackEvent('contact_form_submit', {
      form_type: 'contact',
      timestamp: new Date().toISOString()
    });
  };

  const trackProjectView = (projectName: string) => {
    trackEvent('project_view', {
      project_name: projectName,
      timestamp: new Date().toISOString()
    });
  };

  const trackDownloadResume = () => {
    trackEvent('download_resume', {
      timestamp: new Date().toISOString()
    });
  };

  return {
    trackPageView,
    trackEvent,
    trackContactFormSubmit,
    trackProjectView,
    trackDownloadResume
  };
};

// Hook to automatically track page views
export const usePageTracking = (pageName: string) => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(pageName);
  }, [pageName, trackPageView]);
};
