import { useState, useEffect } from 'react';
import { useHttp } from './';

interface BrandInfo {
  user_brand_id: number;
  user_id: number;
  full_name: string;
  company_name: string;
  company_description: string;
  logo_url?: string;
  industry?: string;
  target_audience?: string;
  brand_voice?: string;
  key_values?: string;
  brand_colors?: any;
  meta_data?: any;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export const useBrandOnboarding = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(false);
  const [brandInfo, setBrandInfo] = useState<BrandInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);

  const http = new useHttp();

  const checkOnboardingStatus = async () => {
    try {
      setIsLoading(true);
      const response:any = await http.get('/user-brand/onboarding-status');
      
      if (response?.data?.success) {
        const completed = response.data.data.completed;
        setIsOnboardingCompleted(completed);
        
        // If not completed, show modal
        if (!completed) {
          setShowOnboardingModal(true);
        }
      }
    } catch (error) {
      // On error, assume onboarding is not completed
      setIsOnboardingCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getBrandInfo = async () => {
    try {
      const response:any = await http.get('/user-brand');
      
      if (response?.data?.success) {
        setBrandInfo(response.data.data);
        setIsOnboardingCompleted(response.data.data.onboarding_completed);
      }
    } catch (error) {
      console.error('Error fetching brand info:', error);
    }
  };

  const handleOnboardingComplete = () => {
    setIsOnboardingCompleted(true);
    setShowOnboardingModal(false);
    // Refresh brand info after completion
    getBrandInfo();
  };

  const handleSkipOnboarding = () => {
    setShowOnboardingModal(false);
  };

  const triggerOnboarding = () => {
    setShowOnboardingModal(true);
  };

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  return {
    isOnboardingCompleted,
    brandInfo,
    isLoading,
    showOnboardingModal,
    handleOnboardingComplete,
    handleSkipOnboarding,
    triggerOnboarding,
    refreshBrandInfo: getBrandInfo,
    checkOnboardingStatus
  };
};
