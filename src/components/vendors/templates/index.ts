// src/components/vendors/templates/index.ts
import {
  ClassicTemplate,
  ModernGridTemplate,
  MasonryTemplate,
  CarouselTemplate,
  FullScreenTemplate
} from './VendorTemplates';

import {
  MagazineTemplate,
  PortfolioTemplate,
  SinglePageTemplate
} from './AdditionalTemplates';

import { TemplateOption } from './types';

// Define all available templates with their metadata
export const allTemplates: TemplateOption[] = [
  {
    id: 1,
    name: 'Classic Layout',
    component: ClassicTemplate,
    preview: '/previews/classic.png',
    description: 'Traditional layout with vertical menu and clean sections'
  },
  {
    id: 2,
    name: 'Modern Grid',
    component: ModernGridTemplate,
    preview: '/previews/modern.png',
    description: 'Contemporary grid-based layout with dynamic sections'
  },
  {
    id: 3,
    name: 'Masonry Layout',
    component: MasonryTemplate,
    preview: '/previews/masonry.png',
    description: 'Pinterest-style masonry grid layout for visual appeal'
  },
  {
    id: 4,
    name: 'Carousel Focus',
    component: CarouselTemplate,
    preview: '/previews/carousel.png',
    description: 'Slideshow-focused layout highlighting featured items'
  },
  {
    id: 5,
    name: 'Full Screen',
    component: FullScreenTemplate,
    preview: '/previews/fullscreen.png',
    description: 'Immersive full-screen sections for maximum impact'
  },
  {
    id: 6,
    name: 'Magazine Style',
    component: MagazineTemplate,
    preview: '/previews/magazine.png',
    description: 'Editorial-inspired layout with dynamic content blocks'
  },
  {
    id: 7,
    name: 'Portfolio Grid',
    component: PortfolioTemplate,
    preview: '/previews/portfolio.png',
    description: 'Professional portfolio-style product showcase'
  },
  {
    id: 8,
    name: 'Single Page Scroll',
    component: SinglePageTemplate,
    preview: '/previews/single-page.png',
    description: 'Smooth-scrolling single page experience'
  }
];

// Export individual templates for direct use
export {
  ClassicTemplate,
  ModernGridTemplate,
  MasonryTemplate,
  CarouselTemplate,
  FullScreenTemplate,
  MagazineTemplate,
  PortfolioTemplate,
  SinglePageTemplate
};

// Export types
export * from './types';

// src/components/vendors/hooks/useVendorSetup.ts
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { VendorProfile, SocialLinks } from '@/types/vendor'; // Assuming you have these types

// Define the possible setup steps
type SetupStep = 'template' | 'display' | 'bento' | 'additional' | 'confirmation';

// Define the state interface
interface VendorSetupState {
  selectedTemplate: number;
  selectedDisplay: string;
  selectedBento: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  aboutMe: string;
  enableReviews: boolean;
  enableFeatured: boolean;
  country: string;
  timezone: string;
}

export const useVendorSetup = () => {
  const { toast } = useToast();
  
  // Initialize setup step state
  const [currentStep, setCurrentStep] = useState<SetupStep>('template');

  // Initialize vendor profile state
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

  // Create setters for each state property
  const setters = {
    setSelectedTemplate: (templateId: number) => 
      setState(prev => ({ ...prev, selectedTemplate: templateId })),
      
    setSelectedDisplay: (display: string) => 
      setState(prev => ({ ...prev, selectedDisplay: display })),
      
    setSelectedBento: (bento: string) => 
      setState(prev => ({ ...prev, selectedBento: bento })),
      
    setSocialLinks: (links: typeof state.socialLinks) => 
      setState(prev => ({ ...prev, socialLinks: links })),
      
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

  // Setup navigation functions
  const navigation = {
    handleNext: () => {
      const steps: SetupStep[] = [
        'template',
        'display',
        'bento',
        'additional',
        'confirmation'
      ];
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1]);
      }
    },

    handleBack: () => {
      const steps: SetupStep[] = [
        'template',
        'display',
        'bento',
        'additional',
        'confirmation'
      ];
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex > 0) {
        setCurrentStep(steps[currentIndex - 1]);
      }
    },

    handleLaunch: async () => {
      try {
        // Add your API call here to save the vendor profile
        // const response = await createVendorProfile(state);
        
        toast({
          title: "Success",
          description: "Your vendor profile has been created successfully!"
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create vendor profile. Please try again."
        });
      }
    }
  };

  // Optional: Add validation function
  const validateStep = (step: SetupStep): boolean => {
    switch (step) {
      case 'template':
        return state.selectedTemplate > 0;
      case 'display':
        return !!state.selectedDisplay;
      case 'bento':
        return !!state.selectedBento;
      case 'additional':
        return !!state.aboutMe && !!state.country && !!state.timezone;
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
