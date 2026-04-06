import React, { useState } from 'react';
import { X, Upload, ChevronDown } from 'lucide-react';
import { useHttp } from '@/hooks';

interface BrandOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

interface BrandFormData {
  full_name: string;
  company_name: string;
  company_description: string;
  logo_url: string;
  industry: string;
  target_audience: string;
  brand_voice: string;
  key_values: string;
}

const BrandOnboardingModal: React.FC<BrandOnboardingModalProps> = ({ 
  isOpen, 
  onClose, 
  onComplete 
}) => {
  const [formData, setFormData] = useState<BrandFormData>({
    full_name: '',
    company_name: '',
    company_description: '',
    logo_url: '',
    industry: '',
    target_audience: '',
    brand_voice: '',
    key_values: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [errors, setErrors] = useState<Partial<BrandFormData>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const http = new useHttp();

  const handleInputChange = (field: keyof BrandFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BrandFormData> = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }
    
    if (!formData.company_description.trim()) {
      newErrors.company_description = 'Company description is required';
    } else if (formData.company_description.trim().length < 10) {
      newErrors.company_description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response:any = await http.post('/user-brand/upsert', formData);
      
      if (response?.data?.success) {
        // Brand onboarding completed successfully
        onComplete?.();
        onClose();
      } else {
        // Handle API error
        console.error('Brand onboarding failed:', response?.data?.message);
      }
    } catch (error) {
      console.error('Error submitting brand data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploadingLogo(true);
    setUploadedFile(file);

    try {
      // Create preview URL immediately for better UX
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('logo_url', e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file to server
      const formData = new FormData();
      formData.append('logo', file);

      const response: any = await http.postV2('/user-brand/upload-logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response?.data?.success) {
        // Update with server URL
        handleInputChange('logo_url', response.data.data.logo_url);
      } else {
        alert('Failed to upload logo. Please try again.');
        // Reset to empty if upload failed
        handleInputChange('logo_url', '');
        setUploadedFile(null);
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      alert('Failed to upload logo. Please try again.');
      // Reset to empty if upload failed
      handleInputChange('logo_url', '');
      setUploadedFile(null);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-[720px] w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-1 pb-0 text-center  border-gray-100">
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            
            <div className="mb-2">
              <div className="w-16 h-16  rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <img src="/assets/icons/brand-icon-lg.png" alt="Logo" className="h-10 w-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Help Us Understand Your Brand</h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
                Tell us a few things about your company so we can start creating content that fits your business, audience, and voice.
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Logo Upload */}
            <div className="">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center mb-3 hover:border-green-400 transition-colors cursor-pointer relative overflow-hidden">
                  {formData.logo_url ? (
                    <img 
                      src={formData.logo_url} 
                      alt="Logo preview" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload size={20} className="text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-500">Upload</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleLogoUpload}
                    disabled={isUploadingLogo}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Max 5MB • JPEG, PNG, GIF, WebP
                </span>
              </div>
            </div>

            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Your Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                  errors.full_name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
              )}
            </div>

            {/* Company Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Company Name
              </label>
              <input
                type="text"
                placeholder="e.g.   logistics company X"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                  errors.company_name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.company_name && (
                <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
              )}
            </div>

            {/* Company Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                What Does Your Company Do?
              </label>
              <textarea
                placeholder="e.g. We provide delivery services for ecommerce brands"
                value={formData.company_description}
                onChange={(e) => handleInputChange('company_description', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none ${
                  errors.company_description ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.company_description && (
                <p className="mt-1 text-sm text-red-600">{errors.company_description}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Setting up your brand...
                </>
              ) : (
                <>
                  Let's Go
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>

            {/* Footer Note */}
            <div className="mt-6 flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                This info helps Cloud Lead tailor every post, email, and campaign to your brand from day one.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export { BrandOnboardingModal };
