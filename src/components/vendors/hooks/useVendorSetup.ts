import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import type { SetupStep, SocialLinks } from '../types/vendor-setup';

interface VendorSetupState {
  selectedTemplate: number;
  selectedDisplay: string;
  selectedBento: string;
  socialLinks: SocialLinks;
  aboutMe: string;
  enableReviews: boolean;
  enableFeatured: boolean;
  country: string;
  timezone: string;
}

interface VendorSetupHook {
  currentStep: SetupStep;
  state: VendorSetupState;
  setters: {
    setSelectedTemplate: (templateId: number) => void;
    setSelectedDisplay: (display: string) => void;
    setSelectedBento: (bento: string) => void;
    setSocialLinks: React.Dispatch<React.SetStateAction<SocialLinks>>;
    setAboutMe: (about: string) => void;
    setEnableReviews: (enable: boolean) => void;
    setEnableFeatured: (enable: boolean) => void;
    setCountry: (country: string) => void;
    setTimezone: (timezone: string) => void;
  };
  navigation: {
    handleNext: () => void;
    handleBack: () => void;
    handleLaunch: () => Promise<void>;
  };
  validateStep: (step: SetupStep) => boolean;
}

export const useVendorSetup = (): VendorSetupHook => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<SetupStep>('template');

  const [state, setState] = useState<VendorSetupState>({
    selectedTemplate: 1,
    selectedDisplay: 'default',
    selectedBento: 'default',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    aboutMe: '',
    enableReviews: false,
    enableFeatured: false,
    country: '',
    timezone: ''
  });

  const setters = {
    setSelectedTemplate: (templateId: number) => 
      setState(prev => ({ ...prev, selectedTemplate: templateId })),

    setSelectedDisplay: (display: string) => 
      setState(prev => ({ ...prev, selectedDisplay: display })),

    setSelectedBento: (bento: string) => 
      setState(prev => ({ ...prev, selectedBento: bento })),

    setSocialLinks: (value: React.SetStateAction<SocialLinks>) => 
      setState(prev => ({ 
        ...prev, 
        socialLinks: typeof value === 'function' ? value(prev.socialLinks) : value 
      })),

    setAboutMe: (about: string) => 
      setState(prev => ({ ...prev, aboutMe: about })),

    setEnableReviews: (enable: boolean) => 
      setState(prev => ({ ...prev, enableReviews: enable })),

    setEnableFeatured: (enable: boolean) => 
      setState(prev => ({ ...prev, enableFeatured: enable })),

    setCountry: (country: string) => 
      setState(prev => ({ ...prev, country: country })),

    setTimezone: (timezone: string) => 
      setState(prev => ({ ...prev, timezone: timezone }))
  };

  // Define the order of steps
  const steps: SetupStep[] = [
    'template',
    'display',
    'bento',
    'additional',
    'confirmation'
  ];

  // Navigation functions
  const navigation = {
    handleNext: () => {
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex < steps.length - 1 && validateStep(currentStep)) {
        setCurrentStep(steps[currentIndex + 1]);
      }
    },

    handleBack: () => {
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex > 0) {
        setCurrentStep(steps[currentIndex - 1]);
      }
    },

    handleLaunch: async () => {
      try {
        // Validate all steps before launching
        const isValid = steps.every(step => validateStep(step));
        
        if (!isValid) {
          throw new Error('Please complete all required fields');
        }

        // Here you would typically make an API call to save the vendor profile
        // const response = await api.createVendorProfile(state);
        
        toast({
          title: "Success!",
          description: "Your vendor profile has been created successfully!"
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create vendor profile"
        });
      }
    }
  };

  // Validation function for each step
  const validateStep = (step: SetupStep): boolean => {
    switch (step) {
      case 'template':
        return state.selectedTemplate > 0;
      
      case 'display':
        return state.selectedDisplay.length > 0;
      
      case 'bento':
        return state.selectedBento.length > 0;
      
      case 'additional':
        return (
          state.aboutMe.length > 0 &&
          state.country.length > 0 &&
          state.timezone.length > 0 &&
          Object.values(state.socialLinks).some(link => link.length > 0)
        );
      
      case 'confirmation':
        return true;
      
      default:
        return false;
    }
  };

  return {
    currentStep,
    state,
    setters,
    navigation,
    validateStep
  };
};
