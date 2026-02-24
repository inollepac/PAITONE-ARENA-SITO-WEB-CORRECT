
import React from 'react';
import { SiteConfig } from '../types';

interface FooterProps {
  config: SiteConfig;
}

const Footer: React.FC<FooterProps> = ({ config }) => {
  const { footerLogo } = config;
  const logoUrl = footerLogo.logoSource === 'primary' ? config.primaryLogoUrl : config.secondaryLogoUrl;

  return (
    <footer className="bg-brand-blue text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center mb-12">
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start gap-4">
            {footerLogo.enabled && logoUrl && (
              <div 
                className="overflow-hidden bg-white/5 flex items-center justify-center"
                style={{ 
                  width: `${footerLogo.width}px`, 
                  height: `${footerLogo.height}px`,
                  borderRadius: `${footerLogo.borderRadius}%`,
                  border: footerLogo.borderWidth > 0 ? `${footerLogo.borderWidth}px solid var(--brand-green)` : 'none'
                }}
              >
                <img src={logoUrl} className="w-full h-full object-contain p-1" alt="Footer Logo" />
              </div>
            )}
            <div className="text-center md:text-left">
              {footerLogo.showName && <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-1">{config.centerName}</h2>}
              <p className="text-[10px] font-black uppercase opacity-40 tracking-widest italic">Tennis & Padel Club</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6">
            {config.instagram && (
              <a href={config.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-green hover:text-brand-blue transition-all group">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            )}
            {config.facebook && (
              <a href={config.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-green hover:text-brand-blue transition-all group">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
            )}
            {config.twitter && (
              <a href={config.twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-green hover:text-brand-blue transition-all group">
                <i className="fab fa-twitter text-xl"></i>
              </a>
            )}
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-right">
             <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{config.address}</p>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{config.phone}</p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 opacity-30 italic font-black uppercase tracking-widest text-[9px]">
          <span>© {new Date().getFullYear()} {config.centerName}</span>
          <span>Powered by Next v2.8</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
