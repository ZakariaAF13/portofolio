import React from 'react';
import { ExternalLink } from 'lucide-react';

export const PreviewButton: React.FC = () => {
  const handlePreview = () => {
    window.open('/preview', '_blank');
  };

  return (
    <button
      onClick={handlePreview}
      className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
    >
      <ExternalLink className="h-4 w-4" />
      <span>Preview Portfolio</span>
    </button>
  );
};