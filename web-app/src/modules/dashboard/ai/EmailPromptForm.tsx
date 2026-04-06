"use client";
import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { AIFormData } from '@/types';
import { IndustrySelector } from './IndustrySelector';


interface EmailPromptFormProps {
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
        rows={4}
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

const EmailPromptForm: React.FC<EmailPromptFormProps> = ({
  formData,
  onFormDataChange,
  onSubmit,
  loading = false,
  error = null,
  onBack
}) => {
  // Local state for custom industry input to prevent focus loss
  const [customIndustry, setCustomIndustry] = useState('');

  // Initialize custom industry value from formData
  useEffect(() => {
    if (formData?.industryContext?.startsWith('custom:')) {
      setCustomIndustry(formData.industryContext.replace('custom:', ''));
    } else {
      setCustomIndustry('');
    }
  }, [formData?.industryContext]);

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

  // Handle custom industry input changes
  const handleCustomIndustryChange = (value: string) => {
    setCustomIndustry(value);
    
    // Clear any selected radio button when user starts typing
    if (value && !formData?.industryContext?.startsWith('custom:')) {
      handleInputChange('industryContext', `custom:${value}`);
    } else if (value) {
      handleInputChange('industryContext', `custom:${value}`);
    } else {
      // Clear the field if empty
      handleInputChange('industryContext', '');
    }
  };

  // Handle industry radio button selection
  const handleIndustryRadioChange = (value: string) => {
    setCustomIndustry(''); // Clear custom input when radio is selected
    handleInputChange('industryContext', value);
  };

  const EmailTypeSelector = () => {
    const emailTypes = [
      { value: 'cold-email', label: 'Cold Email' },
      { value: 'industry-news', label: 'Industry News' },
      { value: 'holiday-closure', label: 'Holiday Closure' }
    ];
    
    return (
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Email Type:
        </label>
        <div className="grid grid-cols-2 gap-3">
          {emailTypes.map((type) => (
            <label key={type.value} className="flex items-center p-3 border border-[var(--primary-color)6E] rounded-lg cursor-pointer hover:bg-green-50 transition-colors duration-200">
              <input
                type="radio"
                name="emailType"
                value={type.value}
                checked={formData?.emailType === type.value}
                onChange={(e) => handleInputChange('emailType', e.target.value)}
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

        {/* Email Type Selection */}
        <EmailTypeSelector />

        <FormField
          label="Target Audience:"
          placeholder='e.g., "Fleet managers, CFOs, supply chain directors"'
          field="targetAudience"
          value={formData?.targetAudience || ''}
          loading={loading}
          handleInputChange={handleInputChange}
        />

        {/* Industry Context Selection */}
        <IndustrySelector {...{formData, handleIndustryRadioChange, loading, customIndustry, handleCustomIndustryChange}} />

        <FormField
          label="Objective/Purpose:"
          placeholder='e.g., "Lead generation, awareness, information sharing"'
          field="objective"
          value={formData?.objective || ''}
          loading={loading}
          handleInputChange={handleInputChange}
        />

        <FormField
          label="Main Message/Details:"
          placeholder='e.g., "Tariff update details, closure dates, value proposition, product features..."'
          field="mainMessage"
          value={formData?.mainMessage || ''} 
          loading={loading}
          handleInputChange={handleInputChange}
          isTextarea={true}
        />

        <FormField
          label="Call-to-Action (CTA):"
          placeholder='e.g., "Schedule a demo", "Read full report", "Contact support"'
          field="cta"
          value={formData?.cta || ''}
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
                Generating Email...
              </>
            ) : (
              <>
                Generate Email
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

export { EmailPromptForm };