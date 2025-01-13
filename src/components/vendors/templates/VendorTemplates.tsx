import React from 'react';
import type { VendorTemplate, TemplateStyleConfig, TemplateLayoutConfig } from '../types/vendor-setup';

export const ClassicTemplate: React.FC<{ colors: TemplateStyleConfig['colors'] }> = ({ colors }) => {
  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }}>
      <header style={{ backgroundColor: colors.primary, padding: '1rem' }}>
        <h1 style={{ color: colors.text }}>Classic Template</h1>
      </header>
      <main className="grid grid-cols-3 gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ backgroundColor: colors.secondary }} className="p-4 rounded">
            Product {i}
          </div>
        ))}
      </main>
    </div>
  );
};

export const ModernGridTemplate: React.FC<{ colors: TemplateStyleConfig['colors'] }> = ({ colors }) => {
  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }}>
      <div className="grid grid-cols-4 gap-4 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ backgroundColor: colors.secondary }} className="aspect-square rounded" />
        ))}
      </div>
    </div>
  );
};

export const MasonryTemplate: React.FC<{ colors: TemplateStyleConfig['colors'] }> = ({ colors }) => {
  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }}>
      <div className="columns-3 gap-4 p-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            style={{ backgroundColor: colors.secondary }} 
            className={`mb-4 break-inside-avoid rounded h-${Math.floor(Math.random() * 3 + 2) * 32}`} 
          />
        ))}
      </div>
    </div>
  );
};

export const CarouselTemplate: React.FC<{ colors: TemplateStyleConfig['colors'] }> = ({ colors }) => {
  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }}>
      <div className="flex overflow-x-auto gap-4 p-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            style={{ backgroundColor: colors.secondary }} 
            className="flex-none w-64 h-64 rounded"
          />
        ))}
      </div>
    </div>
  );
};

export const FullScreenTemplate: React.FC<{ colors: TemplateStyleConfig['colors'] }> = ({ colors }) => {
  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }} className="min-h-screen">
      <div className="h-screen grid place-items-center">
        <div style={{ backgroundColor: colors.secondary }} className="p-8 rounded">
          Full Screen Content
        </div>
      </div>
    </div>
  );
};

export const MinimalistSplitTemplate: React.FC<{ colors: TemplateStyleConfig['colors'] }> = ({ colors }) => {
  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }} className="min-h-screen">
      <div className="grid grid-cols-2 min-h-screen">
        <div style={{ backgroundColor: colors.primary }} className="p-8">
          Left Content
        </div>
        <div style={{ backgroundColor: colors.secondary }} className="p-8">
          Right Content
        </div>
      </div>
    </div>
  );
};

export default {
  ClassicTemplate,
  ModernGridTemplate,
  MasonryTemplate,
  CarouselTemplate,
  FullScreenTemplate,
  MinimalistSplitTemplate
};