import React from 'react';

interface AIAssistantProps {
  content: Record<string, unknown>;
  onSuggestion: (field: string, suggestion: string) => void;
}

// Minimal placeholder AI Assistant component
// Provides a simple auto-suggestion to improve text fields
export const AIAssistant: React.FC<AIAssistantProps> = ({ content, onSuggestion }) => {
  const suggestFor = (field: string) => {
    const raw = String((content as any)[field] ?? '');
    const suggestion = raw
      ? `${raw} — delivering impactful results with modern tools.`
      : 'Passionate developer delivering impactful results with modern tools.';
    onSuggestion(field, suggestion);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Simple AI placeholder is active. Click a button to apply a suggestion.</p>
      <div className="flex flex-wrap gap-2">
        {Object.keys(content || {}).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => suggestFor(key)}
            className="px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded"
          >
            Suggest for "{key}"
          </button>
        ))}
      </div>
    </div>
  );
};
