import React from 'react';

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

// Template 1: Classic Layout (Vertical Menu)
export const ClassicTemplate: React.FC<VendorTemplateProps> = ({ colors, ...props }) => {
  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }}>
      {/* Banner Section */}
      <div style={{ 
        height: '200px', 
        backgroundColor: colors.primary,
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          left: '50px',
          width: '100px',
          height: '100px',
          backgroundColor: colors.secondary,
          borderRadius: '50%'
        }}>
          {/* Profile Image Placeholder */}
        </div>
      </div>

      <div style={{ display: 'flex', marginTop: '60px' }}>
        {/* Vertical Menu */}
        <nav style={{ 
          width: '200px',
          backgroundColor: colors.secondary,
          padding: '20px'
        }}>
          {props.menuItems.map(item => (
            <div key={item} style={{ marginBottom: '10px' }}>{item}</div>
          ))}
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '20px' }}>
          <section>{/* Shop Section */}</section>
          <section>{/* About Section */}</section>
          <section>{/* Social Links */}</section>
        </main>
      </div>
    </div>
  );
};

// Template 2: Modern Grid
export const ModernGridTemplate: React.FC<VendorTemplateProps> = ({ colors, ...props }) => {
  return (
    <div style={{ 
      backgroundColor: colors.background,
      color: colors.text,
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridGap: '20px',
      padding: '20px'
    }}>
      {/* Banner (Full Width) */}
      <div style={{ 
        gridColumn: '1 / -1',
        height: '300px',
        backgroundColor: colors.primary
      }}></div>

      {/* Profile Image */}
      <div style={{ 
        gridColumn: '1 / 2',
        backgroundColor: colors.secondary,
        aspectRatio: '1',
        borderRadius: '50%'
      }}></div>

      {/* Menu (Horizontal) */}
      <nav style={{ 
        gridColumn: '2 / -1',
        backgroundColor: colors.accent,
        padding: '20px'
      }}></nav>

      {/* Shop Section */}
      <div style={{ 
        gridColumn: '1 / -1',
        backgroundColor: colors.secondary,
        minHeight: '400px'
      }}></div>

      {/* About Section */}
      <div style={{ 
        gridColumn: '1 / 3',
        backgroundColor: colors.accent,
        padding: '20px'
      }}></div>

      {/* Social Links */}
      <div style={{ 
        gridColumn: '3 / -1',
        backgroundColor: colors.secondary,
        padding: '20px'
      }}></div>
    </div>
  );
};

// Template 3: Minimalist Split
export const MinimalistSplitTemplate: React.FC<VendorTemplateProps> = ({ colors, ...props }) => {
  return (
    <div style={{ 
      display: 'flex',
      height: '100vh',
      backgroundColor: colors.background,
      color: colors.text
    }}>
      {/* Left Side - Fixed */}
      <div style={{ 
        width: '300px',
        backgroundColor: colors.primary,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Profile Section */}
        <div style={{
          width: '150px',
          height: '150px',
          backgroundColor: colors.secondary,
          borderRadius: '50%',
          margin: '0 auto 20px'
        }}></div>

        {/* Vertical Menu */}
        <nav style={{ marginBottom: '20px' }}></nav>

        {/* Social Links */}
        <div style={{ marginTop: 'auto' }}></div>
      </div>

      {/* Right Side - Scrollable Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Banner */}
        <div style={{ 
          height: '200px',
          backgroundColor: colors.accent
        }}></div>

        {/* Shop Section */}
        <div style={{ padding: '20px' }}></div>

        {/* About Section */}
        <div style={{ 
          padding: '20px',
          backgroundColor: colors.secondary
        }}></div>
      </div>
    </div>
  );
};

// Template 4: Masonry Layout
export const MasonryTemplate: React.FC<VendorTemplateProps> = ({ colors, ...props }) => {
  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }}>
      {/* Full-width banner */}
      <div style={{ 
        height: '250px', 
        backgroundColor: colors.primary,
        position: 'relative'
      }}>
        {/* Centered profile image */}
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '100px',
          backgroundColor: colors.secondary,
          borderRadius: '50%'
        }}/>
      </div>

      {/* Horizontal Menu */}
      <nav style={{
        backgroundColor: colors.accent,
        padding: '1rem',
        marginTop: '60px',
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem'
      }}/>

      {/* Masonry Grid Layout */}
      <div style={{
        padding: '2rem',
        columnCount: 3,
        columnGap: '1rem',
      }}>
        {/* Shop Items */}
        <div style={{ breakInside: 'avoid', marginBottom: '1rem', backgroundColor: colors.secondary }}/>
        <div style={{ breakInside: 'avoid', marginBottom: '1rem', backgroundColor: colors.accent }}/>
      </div>

      {/* Footer with About and Social */}
      <footer style={{
        backgroundColor: colors.primary,
        padding: '2rem',
        marginTop: '2rem'
      }}/>
    </div>
  );
};

// Template 5: Carousel Focus
export const CarouselTemplate: React.FC<VendorTemplateProps> = ({ colors, ...props }) => {
  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }}>
      {/* Side Profile Panel */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '250px',
        backgroundColor: colors.primary,
        padding: '2rem'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: colors.secondary,
          margin: '0 auto 2rem'
        }}/>
        {/* Menu */}
        <nav style={{ marginBottom: '2rem' }}/>
        {/* Social Links */}
        <div style={{ marginTop: 'auto' }}/>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '250px' }}>
        {/* Featured Carousel Area */}
        <div style={{
          height: '400px',
          backgroundColor: colors.accent,
          marginBottom: '2rem'
        }}/>

        {/* Shop Grid */}
        <div style={{
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem'
        }}/>
      </div>
    </div>
  );
};

// Template 6: Full Screen Sections
export const FullScreenTemplate: React.FC<VendorTemplateProps> = ({ colors, ...props }) => {
  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }}>
      {/* Full Screen Banner */}
      <section style={{
        height: '100vh',
        backgroundColor: colors.primary,
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: colors.secondary,
            margin: '0 auto 2rem'
          }}/>
        </div>
      </section>

      {/* Full Screen Shop */}
      <section style={{
        height: '100vh',
        backgroundColor: colors.secondary,
        padding: '2rem'
      }}/>

      {/* Full Screen About */}
      <section style={{
        height: '100vh',
        backgroundColor: colors.accent,
        padding: '2rem'
      }}/>
    </div>
  );
};
