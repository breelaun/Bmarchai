import React from 'react';
import { VendorTemplateProps } from './types';

export const MagazineTemplate: React.FC<VendorTemplateProps> = ({ colors }) => {
  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }}>
      {/* Magazine style layout implementation */}
      <div className="p-4">
        <h2 style={{ color: colors.primary }}>Magazine Layout</h2>
        <div className="grid grid-cols-2 gap-4">
          <div style={{ backgroundColor: colors.secondary }} className="p-4 rounded">
            Featured Content
          </div>
          <div className="space-y-4">
            <div style={{ backgroundColor: colors.secondary }} className="p-4 rounded">
              Article 1
            </div>
            <div style={{ backgroundColor: colors.secondary }} className="p-4 rounded">
              Article 2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PortfolioTemplate: React.FC<VendorTemplateProps> = ({ colors }) => {
  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }}>
      {/* Portfolio style layout implementation */}
      <div className="p-4">
        <h2 style={{ color: colors.primary }}>Portfolio Layout</h2>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ backgroundColor: colors.secondary }} className="aspect-square rounded">
              Project {i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SinglePageTemplate: React.FC<VendorTemplateProps> = ({ colors }) => {
  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }}>
      {/* Single page layout implementation */}
      <div className="min-h-screen p-4">
        <h2 style={{ color: colors.primary }}>Single Page Layout</h2>
        <div style={{ backgroundColor: colors.secondary }} className="mt-4 p-8 rounded">
          Main Content Section
        </div>
      </div>
    </div>
  );
};