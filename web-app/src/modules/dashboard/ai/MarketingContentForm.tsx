"use client";
import React from 'react';
import { ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { AIFormData } from '@/types';

interface MarketingContentFormProps {
  formData: AIFormData;
  onFormDataChange: (formData: AIFormData) => void;
  onSubmit: (formData: AIFormData) => void;
  loading?: boolean;
  error?: string | null;
  onBack: () => void;
}

const FormField = ({ label, placeholder, field, handleInputChange, loading, value, isTextarea = false }: {
  value: string;
  loading: boolean;
  label: string;
  placeholder: string;
  field: string;
  handleInputChange: any;
  isTextarea?: boolean;
}) => (
  <div className="mb-6">
    <label className="block text-lg font-semibold text-gray-900 mb-3">
      {label}
    </label>
    {isTextarea ? (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        rows={3}
        className="w-full px-4 py-3 border border-[var(--primary-color)6E] shadow-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 resize-vertical"
        disabled={loading}
      />
    ) : (
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full px-4 py-3 border border-[var(--primary-color)6E] shadow-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
        disabled={loading}
      />
    )}
  </div>
);

const MarketingContentForm: React.FC<MarketingContentFormProps> = ({
  formData,
  onFormDataChange,
  onSubmit,
  loading = false,
  error = null,
  onBack
}) => {
  const handleInputChange = (field: keyof AIFormData, value: string | number) => {
    const newFormData = {
      ...formData,
      [field]: value
    };
    onFormDataChange(newFormData);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const ContentTypeSelector = () => {
    const contentTypeOptions = [
      { value: 'short_video', label: 'Short Video' },
      { value: 'explainer', label: 'Explainer' },
      { value: 'webinar', label: 'Webinar' },
      { value: 'speaker_notes', label: 'Speaker Notes' }
    ];
    
    return (
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Content Type:
        </label>
        <div className="grid grid-cols-2 gap-3">
          {contentTypeOptions.map((type) => (
            <label key={type.value} className="flex items-center p-3 border border-[var(--primary-color)6E] rounded-lg cursor-pointer hover:bg-green-50 transition-colors duration-200">
              <input
                type="radio"
                name="contentType"
                value={type.value}
                checked={formData.subContentType === type.value}
                onChange={(e) => handleInputChange('subContentType', e.target.value)}
                className="w-4 h-4 text-[var(--primary-color)] focus:ring-green-500 border-gray-300"
                disabled={loading}
              />
              <span className="ml-2 text-gray-700 font-medium">{type.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const ToneSelector = () => {
    const toneOptions = [
      { value: 'professional', label: 'Professional' },
      { value: 'persuasive', label: 'Persuasive' },
      { value: 'casual', label: 'Casual' },
      { value: 'storytelling', label: 'Storytelling' }
    ];
    
    return (
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Tone:
        </label>
        <div className="grid grid-cols-2 gap-3">
          {toneOptions.map((tone) => (
            <label key={tone.value} className="flex items-center p-3 border border-[var(--primary-color)6E] rounded-lg cursor-pointer hover:bg-green-50 transition-colors duration-200">
              <input
                type="radio"
                name="tone"
                value={tone.value}
                checked={formData.tone === tone.value}
                onChange={(e) => handleInputChange('tone', e.target.value)}
                className="w-4 h-4 text-[var(--primary-color)] focus:ring-green-500 border-gray-300"
                disabled={loading}
              />
              <span className="ml-2 text-gray-700 font-medium">{tone.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const LengthSelector = () => {
    const lengthOptions = [
      { value: '30s', label: '30 seconds' },
      { value: '1-2 min', label: '1-2 minutes' },
      { value: '5-10 min', label: '5-10 minutes' },
      { value: 'full talk', label: 'Full talk' }
    ];
    
    return (
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Length Preference:
        </label>
        <div className="grid grid-cols-2 gap-3">
          {lengthOptions.map((length) => (
            <label key={length.value} className="flex items-center p-3 border border-[var(--primary-color)6E] rounded-lg cursor-pointer hover:bg-green-50 transition-colors duration-200">
              <input
                type="radio"
                name="lengthPreference"
                value={length.value}
                checked={formData.lengthPreference === length.value}
                onChange={(e) => handleInputChange('lengthPreference', e.target.value)}
                className="w-4 h-4 text-[var(--primary-color)] focus:ring-green-500 border-gray-300"
                disabled={loading}
              />
              <span className="ml-2 text-gray-700 font-medium">{length.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-6xl p-8">
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Content Type Selection */}
        <ContentTypeSelector />

        <FormField
          label="Topic / Product / Message:"
          placeholder='e.g., "AI-powered logistics optimization", "Supply chain visibility platform"'
          field="topic"
          value={formData.topic || ''}
          loading={loading}
          isTextarea={true}
          handleInputChange={handleInputChange}
        />

        <FormField
          label="Audience:"
          placeholder='e.g., "Logistics CEOs", "Supply chain managers", "Importers"'
          field="targetAudience"
          value={formData.targetAudience || ''}
          loading={loading}
          handleInputChange={handleInputChange}
        />

        {/* Tone Selection */}
        <ToneSelector />

        {/* Length Preference Selection */}
        <LengthSelector />

        <FormField
          label="Call to Action (Optional):"
          placeholder='e.g., "Book a demo", "Download report", "Contact us"'
          field="cta"
          value={formData.cta || ''}
          loading={loading}
          handleInputChange={handleInputChange}
        />

        {/* Submit Button */}
        <div className="flex justify-center mt-8 mb-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`font-semibold px-8 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md ${
              loading 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-[var(--primary-color)] hover:bg-green-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Marketing Content...
              </>
            ) : (
              <>
                Generate Marketing Content
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Cloud Lead can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export { MarketingContentForm };
