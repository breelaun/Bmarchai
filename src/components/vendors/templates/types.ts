// src/components/vendors/templates/types.ts
export interface VendorTemplateProps {
  bannerImage?: string;
  profileImage?: string;
  storeName: string;
  menuItems: string[];
  products: any[];
  aboutText: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
}

export interface TemplateOption {
  id: number;
  name: string;
  component: React.FC<VendorTemplateProps>;
  preview: string;
  description: string;
}

// src/components/vendors/templates/VendorTemplates.tsx
import React from 'react';
import { VendorTemplateProps } from './types';

export const ClassicTemplate: React.FC<VendorTemplateProps> = ({ colors, ...props }) => {
  // Implementation from previous artifact
  // ... (ClassicTemplate implementation)
};

export const ModernGridTemplate: React.FC<VendorTemplateProps> = ({ colors, ...props }) => {
  // Implementation from previous artifact
  // ... (ModernGridTemplate implementation)
};

export const MasonryTemplate: React.FC<VendorTemplateProps> = ({ colors, ...props }) => {
  // Implementation from previous artifact
  // ... (MasonryTemplate implementation)
};

export const CarouselTemplate: React.FC<VendorTemplateProps> = ({ colors, ...props }) => {
  // Implementation from previous artifact
  // ... (CarouselTemplate implementation)
};

export const FullScreenTemplate: React.FC<VendorTemplateProps> = ({ colors, ...props }) => {
  // Implementation from previous artifact
  // ... (FullScreenTemplate implementation)
};

// src/components/vendors/templates/AdditionalTemplates.tsx
export const MagazineTemplate: React.FC<VendorTemplateProps> = ({ colors, ...props }) => {
  // Implementation from previous artifact
  // ... (MagazineTemplate implementation)
};

export const PortfolioTemplate: React.FC<VendorTemplateProps> = ({ colors, ...props }) => {
  // Implementation from previous artifact
  // ... (PortfolioTemplate implementation)
};

export const SinglePageTemplate: React.FC<VendorTemplateProps> = ({ colors, ...props }) => {
  // Implementation from previous artifact
  // ... (SinglePageTemplate implementation)
};

// src/components/vendors/templates/index.ts
import {
  ClassicTemplate, ModernGridTemplate, MasonryTemplate,
  CarouselTemplate, FullScreenTemplate
} from './VendorTemplates';
import {
  MagazineTemplate, PortfolioTemplate, SinglePageTemplate
} from './AdditionalTemplates';
import { TemplateOption } from './types';

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
  // ... Add all other templates with their metadata
];

export * from './VendorTemplates';
export * from './AdditionalTemplates';
export * from './types';

// src/components/vendors/setup/TemplateSelection.tsx
import { useState } from 'react';
import { allTemplates } from '../templates';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { VendorTemplateProps } from '../templates/types';

interface TemplateSelectionProps {
  selectedTemplate: number;
  setSelectedTemplate: (templateId: number) => void;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  selectedTemplate,
  setSelectedTemplate,
}) => {
  const [previewColors, setPreviewColors] = useState({
    primary: '#4F46E5',
    secondary: '#818CF8',
    background: '#FFFFFF',
    text: '#1F2937',
    accent: '#C7D2FE',
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Choose Your Template</h2>
        <Tabs defaultValue="grid" className="w-[200px]">
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <TabsContent value="grid">
        <div className="grid grid-cols-3 gap-4">
          {allTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all ${
                selectedTemplate === template.id 
                  ? 'ring-2 ring-primary' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardContent className="p-4">
                <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <template.component
                    colors={previewColors}
                    storeName="Preview Store"
                    menuItems={[]}
                    products={[]}
                    aboutText=""
                    socialLinks={[]}
                  />
                </div>
                <h3 className="mt-2 font-medium text-center">{template.name}</h3>
                <p className="text-sm text-gray-500 text-center mt-1">
                  {template.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="list">
        <div className="space-y-4">
          {allTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all ${
                selectedTemplate === template.id 
                  ? 'ring-2 ring-primary' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardContent className="p-4 flex gap-4">
                <div className="w-[200px] bg-gray-100 rounded-md overflow-hidden">
                  <template.component
                    colors={previewColors}
                    storeName="Preview Store"
                    menuItems={[]}
                    products={[]}
                    aboutText=""
                    socialLinks={[]}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {template.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </div>
  );
};

export default TemplateSelection;

// src/components/vendors/hooks/useVendorSetup.ts
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useVendorSetup = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<
    'template' | 'display' | 'bento' | 'additional' | 'confirmation'
  >('template');

  const [state, setState] = useState({
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

  const navigation = {
    handleNext: () => {
      const steps: typeof currentStep[] = [
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
      const steps: typeof currentStep[] = [
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
        // Implementation for launching the vendor profile
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

  return {
    currentStep,
    state,
    setters,
    navigation
  };
};
