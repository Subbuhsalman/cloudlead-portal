"use client";
import React from 'react';
import { ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { FormField } from './Field';
import { AIFormData } from '@/types';

type ContentType = 'social_post' | 'email' | 'blog' | 'b2b_content' | 'marketing_content' | 'research' | 'pitch_deck';

interface AIPromptFormProps {
  formData: AIFormData;
  onFormDataChange: (formData: AIFormData) => void;
  onSubmit: (formData: AIFormData) => void;
  loading?: boolean;
  error?: string | null;
  selectedContentType: ContentType | null;
  onBack: () => void;
}

const B2BContentForm: React.FC<AIPromptFormProps> = ({
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

  const B2BContentTypeSelector = () => {
    const contentTypes = [
      { value: 'pitch_deck', label: 'Sales Presentations & Pitch Decks' },
      { value: 'discovery_call', label: 'Discovery Call Scripts' }
    ] as const;
    
    return (
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Content Type: <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 gap-3">
          {contentTypes.map((type) => (
            <label key={type.value} className="flex items-center p-4 border border-[var(--primary-color)6E] rounded-lg cursor-pointer hover:bg-green-50 transition-colors duration-200">
              <input
                type="radio"
                name="b2bContentType"
                value={type.value}
                checked={formData.b2bContentType === type.value}
                onChange={(e) => handleInputChange('b2bContentType', e.target.value)}
                className="w-4 h-4 text-[var(--primary-color)] focus:ring-green-500 border-gray-300 mr-3"
                disabled={loading}
              />
              <span className="text-gray-700 font-medium">{type.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const DurationSelector = () => {
    const durations = ['10', '20', '30'] as const;
    
    return (
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Duration (minutes): <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {durations.map((duration) => (
            <label key={duration} className="flex items-center justify-center p-3 border border-[var(--primary-color)6E] rounded-lg cursor-pointer hover:bg-green-50 transition-colors duration-200">
              <input
                type="radio"
                name="duration"
                value={duration}
                checked={formData.duration === duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-4 h-4 text-[var(--primary-color)] focus:ring-green-500 border-gray-300 mr-2"
                disabled={loading}
              />
              <span className="text-gray-700 font-medium">{duration} min</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const CallLengthSelector = () => {
    const durations = ['15', '25', '30'] as const;
    
    return (
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Call Length (minutes) (Optional):
        </label>
        <div className="grid grid-cols-3 gap-3">
          {durations.map((duration) => (
            <label key={duration} className="flex items-center justify-center p-3 border border-[var(--primary-color)6E] rounded-lg cursor-pointer hover:bg-green-50 transition-colors duration-200">
              <input
                type="radio"
                name="callLength"
                value={duration}
                checked={formData.callLength === duration}
                onChange={(e) => handleInputChange('callLength', e.target.value)}
                className="w-4 h-4 text-[var(--primary-color)] focus:ring-green-500 border-gray-300 mr-2"
                disabled={loading}
              />
              <span className="text-gray-700 font-medium">{duration} min</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const ToneSelector = () => {
    const tones = ['Professional', 'Persuasive', 'Storytelling'] as const;
    
    return (
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Tone (Optional):
        </label>
        <div className="grid grid-cols-3 gap-3">
          {tones.map((tone) => (
            <label key={tone} className="flex items-center justify-center p-3 border border-[var(--primary-color)6E] rounded-lg cursor-pointer hover:bg-green-50 transition-colors duration-200">
              <input
                type="radio"
                name="tone"
                value={tone}
                checked={formData.tone === tone}
                onChange={(e) => handleInputChange('tone', e.target.value)}
                className="w-4 h-4 text-[var(--primary-color)] focus:ring-green-500 border-gray-300 mr-2"
                disabled={loading}
              />
              <span className="text-gray-700 font-medium">{tone}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const DiscoveryToneSelector = () => {
    const tones = ['Consultative', 'Challenger', 'Friendly'] as const;
    
    return (
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Tone (Optional):
        </label>
        <div className="grid grid-cols-3 gap-3">
          {tones.map((tone) => (
            <label key={tone} className="flex items-center justify-center p-3 border border-[var(--primary-color)6E] rounded-lg cursor-pointer hover:bg-green-50 transition-colors duration-200">
              <input
                type="radio"
                name="discoveryTone"
                value={tone}
                checked={formData.discoveryTone === tone}
                onChange={(e) => handleInputChange('discoveryTone', e.target.value)}
                className="w-4 h-4 text-[var(--primary-color)] focus:ring-green-500 border-gray-300 mr-2"
                disabled={loading}
              />
              <span className="text-gray-700 font-medium">{tone}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const isFormValid = () => {
    if (selectedContentType === 'pitch_deck' || selectedContentType === 'b2b_content') {
      if (!formData.b2bContentType) return false;
      
      if (formData.b2bContentType === 'pitch_deck') {
        return formData.audience && formData.topic && formData.deckGoal && formData.duration;
      } else if (formData.b2bContentType === 'discovery_call') {
        return formData.persona && formData.industry && formData.callGoal;
      }
    }
    return true; // For other content types, no specific validation
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

  // Show B2B content form for pitch_deck or b2b_content types
  if (selectedContentType === 'pitch_deck' || selectedContentType === 'b2b_content') {
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
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Select Content Type
            </h2>
            <B2BContentTypeSelector />
          </div>

          {/* Conditional Form Based on Selected Content Type */}
          {formData.b2bContentType === 'pitch_deck' && (
            <>
              {/* Required Fields Section for Pitch Deck */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Required Information - Sales Presentations & Pitch Decks
                </h2>
                
                <FormField
                  label="Audience"
                  placeholder='e.g., "Investors", "Logistics CEOs", "Supply Chain Managers"'
                  field="audience" 
                  value={formData.audience || ''} 
                  loading={loading} 
                  handleInputChange={handleInputChange}
                  required={true}
                />

                <FormField
                  label="Topic / Product"
                  placeholder='e.g., "Sealink Portal", "AI-powered freight platform"'
                  field="topic" 
                  value={formData.topic || ''} 
                  loading={loading} 
                  handleInputChange={handleInputChange}
                  required={true}
                />

                <FormField
                  label="Goal of Deck"
                  placeholder='e.g., "Raise funding", "Win client", "Pilot proposal"'
                  field="deckGoal" 
                  value={formData.deckGoal || ''} 
                  loading={loading} 
                  handleInputChange={handleInputChange}
                  required={true}
                />

                <DurationSelector />
              </div>

              {/* Optional Fields Section for Pitch Deck */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Optional Information (to refine quality)
                </h2>
                
                <FormField
                  label="Competitors"
                  placeholder='e.g., "FedEx, UPS, DHL" (comma separated)'
                  field="competitors" 
                  value={formData.competitors || ''} 
                  loading={loading} 
                  handleInputChange={handleInputChange}
                />

                <FormField
                  label="Key Proof Point"
                  placeholder='e.g., "30% reduction in delivery time", "$2M ARR growth"'
                  field="keyProofPoint" 
                  value={formData.keyProofPoint || ''} 
                  loading={loading} 
                  handleInputChange={handleInputChange}
                />

                <ToneSelector />

                <FormField
                  label="Call to Action"
                  placeholder='e.g., "Schedule pilot program", "Investment meeting", "Sign contract"'
                  field="callToAction" 
                  value={formData.callToAction || ''} 
                  loading={loading} 
                  handleInputChange={handleInputChange}
                />
              </div>
            </>
          )}

          {formData.b2bContentType === 'discovery_call' && (
            <>
              {/* Required Fields Section for Discovery Call */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Required Information - Discovery Call Scripts
                </h2>
                
                <FormField
                  label="Persona"
                  placeholder='e.g., "Logistics Director", "CFO", "Operations Manager"'
                  field="persona" 
                  value={formData.persona || ''} 
                  loading={loading} 
                  handleInputChange={handleInputChange}
                  required={true}
                />

                <FormField
                  label="Industry"
                  placeholder='e.g., "Apparel importers", "Retail logistics", "Manufacturing"'
                  field="industry" 
                  value={formData.industry || ''} 
                  loading={loading} 
                  handleInputChange={handleInputChange}
                  required={true}
                />

                <FormField
                  label="Goal of Call"
                  placeholder='e.g., "Qualify lead", "Book demo", "Move to proposal"'
                  field="callGoal" 
                  value={formData.callGoal || ''} 
                  loading={loading} 
                  handleInputChange={handleInputChange}
                  required={true}
                />
              </div>

              {/* Optional Fields Section for Discovery Call */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Optional Information (to refine quality)
                </h2>
                
                <CallLengthSelector />

                <FormField
                  label="Known Challenges"
                  placeholder='e.g., "High shipping costs, Poor visibility" (1-2 main pains)'
                  field="knownChallenges" 
                  value={formData.knownChallenges || ''} 
                  loading={loading} 
                  handleInputChange={handleInputChange}
                />

                <FormField
                  label="Expected Objections"
                  placeholder='e.g., "Too expensive, We already have a solution" (comma separated)'
                  field="expectedObjections" 
                  value={formData.expectedObjections || ''} 
                  loading={loading} 
                  handleInputChange={handleInputChange}
                />

                <DiscoveryToneSelector />
              </div>
            </>
          )}

          {/* Form Validation Message */}
          {!isFormValid() && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-700">
                <strong>Required:</strong> Please fill in all required fields (marked with *) before generating your content.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center mt-8 mb-6">
            <button
              onClick={handleSubmit}
              disabled={loading || !isFormValid()}
              className={`font-semibold px-8 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md ${
                loading || !isFormValid()
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-[var(--primary-color)] hover:bg-green-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>
                  Generate B2B Sales Content
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

  // Legacy form for other content types
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

        <FormField
          label="Topic:"
          placeholder='e.g., "AI-powered route optimization for freight delivery"'
          field="topic" value={formData['topic'] || ''} loading={loading} handleInputChange={handleInputChange}        />

        <FormField
          label="Post Objective:"
          placeholder='e.g., "Promote new logistics product feature"'
          field="objective" value={formData['objective'] || ''} loading={loading} handleInputChange={handleInputChange}        />

        <FormField
          label="Program:"
          placeholder='e.g., "Stand-alone post" or "Multi-post campaign"'
          field="program" value={formData['program'] || ''} loading={loading} handleInputChange={handleInputChange}        />

        <FormField
          label="Targeted Industry:"
          placeholder='e.g., "Last-Mile Logistics"'
          field="industry" value={formData['industry'] || ''} loading={loading} handleInputChange={handleInputChange}        />

        <FormField
          label="Targeted Audience:"
          placeholder='e.g., "Fleet Operations Manager"'
          field="audience" value={formData['audience'] || ''} loading={loading} handleInputChange={handleInputChange}        />

        {/* Social Media Platform Selection - Only for social_post */}
        {selectedContentType === 'social_post' && <SocialMediaSelector />}

        <FormField
          label="Tone of Voice:"
          placeholder='e.g., "Confident & Data-Driven"'
          field="tone" value={formData['tone'] || ''} loading={loading} handleInputChange={handleInputChange}        />

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

export {B2BContentForm}
