import {
  ClassicTemplate,
  ModernGridTemplate,
  MasonryTemplate,
  CarouselTemplate,
  FullScreenTemplate,
  MinimalistSplitTemplate
} from './VendorTemplates';

import {
  MagazineTemplate,
  PortfolioTemplate,
  SinglePageTemplate
} from './AdditionalTemplates';

import type { TemplateOption } from './types';

// Define all available templates with their metadata
export const templates: TemplateOption[] = [
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
  MinimalistSplitTemplate,
  MagazineTemplate,
  PortfolioTemplate,
  SinglePageTemplate
};

// Export types
export * from './types';
