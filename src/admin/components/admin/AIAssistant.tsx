import React, { useState } from 'react';
import { Sparkles, RefreshCw, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface AIAssistantProps {
  content: Record<string, string>;
  onSuggestion: (field: string, suggestion: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ content, onSuggestion }) => {
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-suggestions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Failed to generate suggestions');
      
      const data = await response.json();
      setSuggestions(data.suggestions);
      toast.success('AI suggestions generated');
    } catch (error) {
      toast.error('Failed to generate AI suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Content Suggestions</h3>
        <button
          onClick={generateSuggestions}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm rounded-lg transition-colors duration-200"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          <span>{loading ? 'Generating...' : 'Generate'}</span>
        </button>
      </div>

      {Object.keys(suggestions).length > 0 && (
        <div className="space-y-4">
          {Object.entries(suggestions).map(([field, suggestion]) => (
            <div key={field} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 capitalize">{field.replace('_', ' ')}</h4>
                <button
                  onClick={() => onSuggestion(field, suggestion)}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-sm rounded transition-colors duration-200"
                >
                  <Check className="h-3 w-3" />
                  <span>Apply</span>
                </button>
              </div>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                {suggestion}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500 bg-purple-50 p-3 rounded-lg">
        <Sparkles className="inline h-3 w-3 mr-1" />
        AI suggestions are generated based on your current content and industry best practices.
      </div>
    </div>
  );
};