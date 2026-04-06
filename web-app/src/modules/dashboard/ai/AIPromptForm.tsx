"use client";
import React from 'react';
import { ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { FormField } from './Field';
import { AIFormData } from '@/types';



type ContentType = 'social_post' | 'email' | 'blog' | 'b2b_content' | 'marketing_content' | 'research';

interface AIPromptFormProps {
  formData: AIFormData;
  onFormDataChange: (formData: AIFormData) => void;
  onSubmit: (formData: AIFormData) => void;
  loading?: boolean;
  error?: string | null;
  selectedContentType: ContentType | null;
  onBack: () => void;
}

const AIPromptForm: React.FC<AIPromptFormProps> = ({
  formData,
  onFormDataChange,
  onSubmit,
  loading = false,
  error = null,
  selectedContentType,
  onBack
}) => {
  const handleInputChange = (field: keyof AIFormData, value: string) => {
    const newFormData = {
      ...formData,
      [field]: value
    };
    onFormDataChange(newFormData);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };


  const SocialMediaSelector = () => {
    const socialPlatforms = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn'] as const;
    
    return (
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Social Media Platform:
        </label>
        <div className="grid grid-cols-2 gap-3">
          {socialPlatforms.map((platform) => (
            <label key={platform} className="flex items-center p-3 border border-[var(--primary-color)6E] rounded-lg cursor-pointer hover:bg-green-50 transition-colors duration-200">
              <input
                type="radio"
                name="socialMedia"
                value={platform}
                checked={formData.socialMedia === platform}
                onChange={(e) => handleInputChange('socialMedia', e.target.value as 'Facebook' | 'Twitter' | 'Instagram' | 'LinkedIn')}
                className="w-4 h-4 text-[var(--primary-color)] focus:ring-green-500 border-gray-300"
                disabled={loading}
              />
              <span className="ml-2 text-gray-700 font-medium">{platform}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen  flex flex-col items-center  p-6">
      <div className="w-full max-w-6xl  p-8">
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <FormField
          label="Topic:"
          placeholder='e.g., "AI-powered route optimization for freight delivery"'
          field="topic" value={formData['topic']} loading={loading} handleInputChange={handleInputChange}        />

        <FormField
          label="Post Objective:"
          placeholder='e.g., "Promote new logistics product feature"'
          field="objective" value={formData['objective']} loading={loading} handleInputChange={handleInputChange}        />

        <FormField
          label="Program:"
          placeholder='e.g., "Stand-alone post" or "Multi-post campaign"'
          field="program" value={formData['program']} loading={loading} handleInputChange={handleInputChange}        />

        <FormField
          label="Targeted Industry:"
          placeholder='e.g., "Last-Mile Logistics"'
          field="industry" value={formData['industry']} loading={loading} handleInputChange={handleInputChange}        />

        <FormField
          label="Targeted Audience:"
          placeholder='e.g., "Fleet Operations Manager"'
          field="audience" value={formData['audience']} loading={loading} handleInputChange={handleInputChange}        />

        {/* Social Media Platform Selection - Only for social_post */}
        {selectedContentType === 'social_post' && <SocialMediaSelector />}

        <FormField
          label="Tone of Voice:"
          placeholder='e.g., "Confident & Data-Driven"'
          field="tone" value={formData['tone']} loading={loading} handleInputChange={handleInputChange}        />

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
                Generating...
              </>
            ) : (
              <>
                Let's Go
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
}

export {AIPromptForm}