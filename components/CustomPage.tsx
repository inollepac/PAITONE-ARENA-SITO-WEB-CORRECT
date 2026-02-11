
import React from 'react';
import { SectionContent, SiteConfig } from '../types';

interface CustomPageProps {
  section: SectionContent;
  config: SiteConfig;
}

const CustomPage: React.FC<CustomPageProps> = ({ section, config }) => {
  const { navbarLogo } = config;
  const logoUrl = navbarLogo.logoSource === 'primary' ? config.primaryLogoUrl : config.secondaryLogoUrl;

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 animate-in fade-in duration-700">
      <div className="max-w-4xl">
        <div className="flex items-center gap-8 mb-12">
          {section.showLogo && logoUrl && (
            <div 
              className="overflow-hidden shadow-2xl shrink-0"
              style={{ 
                width: '100px', 
                height: '100px',
                borderRadius: `${navbarLogo.borderRadius}%`,
                border: navbarLogo.borderWidth > 0 ? `${navbarLogo.borderWidth}px solid var(--brand-green)` : 'none'
              }}
            >
              <img 
                src={logoUrl} 
                className="w-full h-full" 
                style={{ 
                  objectFit: navbarLogo.objectFit,
                  transform: `scale(${navbarLogo.scale})` 
                }} 
                alt="Logo" 
              />
            </div>
          )}
          <h1 className="text-6xl md:text-8xl font-black text-brand-blue uppercase italic tracking-tighter leading-none">
            {section.title}
          </h1>
        </div>
        <div className="relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-green rounded-full"></div>
          <p className="text-2xl text-brand-blue/70 leading-relaxed italic pl-10 font-medium">
            {section.description}
          </p>
        </div>
        
        <div className="mt-20 p-12 bg-white rounded-[4rem] shadow-xl border border-brand-blue/5">
           <div className="h-64 rounded-3xl bg-brand-light flex items-center justify-center text-brand-blue/10">
              <i className="fas fa-camera text-9xl"></i>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPage;
