
import React from 'react';
import { SiteConfig } from '../types';

interface FooterProps {
  config: SiteConfig;
}

const Footer: React.FC<FooterProps> = ({ config }) => {
  return (
    <footer className="bg-brand-blue text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center mb-12">
          {/* Brand Info */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">{config.centerName}</h2>
            <p className="text-[10px] font-black uppercase opacity-40 tracking-widest italic">Tennis & Padel Club</p>
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
