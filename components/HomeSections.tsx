
import React, { useRef, useState } from 'react';
import { SiteConfig, Page, SectionContent, SectionElement, SectionStyle } from '../types';

const STYLE_MAPS = {
  variant: {
    glass: 'glass border border-white/20',
    solid: '',
    transparent: 'bg-transparent',
    dark: 'bg-brand-blue text-white',
    brand: 'bg-brand-green text-brand-blue',
    'image-bg': 'bg-cover bg-center text-white',
    custom: ''
  },
  shape: {
    rounded: 'rounded-[4rem]',
    sharp: 'rounded-none',
    pill: 'rounded-[10rem]',
    oval: 'rounded-[50%]',
    'arc-top': 'rounded-t-[100%] rounded-b-none',
    'arc-bottom': 'rounded-b-[100%] rounded-a-none'
  },
  padding: {
    none: 'py-0',
    small: 'py-12',
    medium: 'py-24',
    large: 'py-40',
    huge: 'py-64'
  },
  shadow: {
    none: 'shadow-none',
    soft: 'shadow-xl',
    medium: 'shadow-2xl',
    heavy: 'shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]',
    extra: 'shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]'
  }
};

const GRADIENTS = [
  { name: 'Nessuno', value: '' },
  { name: 'Clay Court', value: 'linear-gradient(135deg, #D35400 0%, #E67E22 100%)' },
  { name: 'Padel Night', value: 'linear-gradient(135deg, #1A2238 0%, #4E5B83 100%)' },
  { name: 'Forest Green', value: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)' },
  { name: 'Electric Padel', value: 'linear-gradient(135deg, #2D3142 0%, #4E5B83 50%, #A8D38E 100%)' },
  { name: 'Soft Glass', value: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' },
  { name: 'Morning Match', value: 'linear-gradient(135deg, #FDFCFB 0%, #E2D1C3 100%)' },
  { name: 'Deep Arena', value: 'radial-gradient(circle, #4E5B83 0%, #0F172A 100%)' }
];

const TEXT_SHADOWS = {
  none: 'none',
  soft: '2px 2px 4px rgba(0,0,0,0.2)',
  hard: '4px 4px 0px rgba(0,0,0,0.1)',
  glow: '0 0 15px rgba(168, 211, 142, 0.9)',
  neon: '0 0 5px #fff, 0 0 10px #fff, 0 0 20px var(--brand-green)',
  dark: '2px 2px 10px rgba(78, 91, 131, 0.6)',
  floating: '0 10px 20px rgba(0,0,0,0.2)'
};

const BOX_SHADOWS = {
  none: 'none',
  soft: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  medium: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  heavy: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  neon: '0 0 15px rgba(168, 211, 142, 0.5)',
};

interface ElementPositionEditorProps {
  style: SectionElement['style'];
  onUpdate: (updates: Partial<SectionElement['style']>) => void;
}

const ElementPositionEditor: React.FC<ElementPositionEditorProps> = ({ style, onUpdate }) => {
  const s = style || {};
  return (
    <div className="space-y-4 pt-4 border-t border-gray-100 text-left">
      <label className="text-[8px] font-black opacity-40 uppercase block mb-1">Posizionamento & Scala</label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[7px] font-bold opacity-30 block text-left">Offset X ({s.x || 0}px)</label>
          <input type="range" min="-300" max="300" value={s.x || 0} onChange={e => onUpdate({ x: +e.target.value })} className="w-full accent-brand-blue" />
        </div>
        <div>
          <label className="text-[7px] font-bold opacity-30 block text-left">Offset Y ({s.y || 0}px)</label>
          <input type="range" min="-300" max="300" value={s.y || 0} onChange={e => onUpdate({ y: +e.target.value })} className="w-full accent-brand-blue" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[7px] font-bold opacity-30 block text-left">Scala ({s.scale || 1})</label>
          <input type="range" min="0.1" max="5" step="0.1" value={s.scale || 1} onChange={e => onUpdate({ scale: +e.target.value })} className="w-full accent-brand-blue" />
        </div>
        <div>
          <label className="text-[7px] font-bold opacity-30 block text-left">Z-Index ({s.zIndex || 1})</label>
          <input type="range" min="1" max="100" value={s.zIndex || 1} onChange={e => onUpdate({ zIndex: +e.target.value })} className="w-full accent-brand-blue" />
        </div>
      </div>
      <div>
        <label className="text-[7px] font-bold opacity-30 block text-left">Rotazione ({s.rotation || 0}°)</label>
        <input type="range" min="0" max="360" value={s.rotation || 0} onChange={e => onUpdate({ rotation: +e.target.value })} className="w-full accent-brand-blue" />
      </div>
    </div>
  );
};

interface SectionEditorPanelProps {
  section: SectionContent;
  onUpdate: (updates: Partial<SectionContent>) => void;
  onDelete: () => void;
  onMove: (dir: 'up' | 'down') => void;
  onAddElement: (type: 'text' | 'image' | 'logo') => void;
  onImageUpload: () => void;
}

const SectionEditorPanel: React.FC<SectionEditorPanelProps> = ({ section, onUpdate, onDelete, onMove, onAddElement, onImageUpload }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'layout' | 'background'>('layout');

  const s = section.style || { variant: 'solid', shape: 'rounded', padding: 'medium', width: 'contained', shadow: 'soft', borderWidth: 0, borderColor: '#A8D38E', bgColor: '#FFFFFF', bgGradient: '', parallax: false };

  const updateStyle = (key: keyof SectionStyle, val: any) => {
    onUpdate({ style: { ...s, [key]: val } });
  };

  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-full shadow-2xl z-50">
      <button onClick={() => onMove('up')} className="hover:text-brand-green p-1 transition-all active:scale-75"><i className="fas fa-arrow-up text-xs"></i></button>
      <button onClick={() => onMove('down')} className="hover:text-brand-green p-1 transition-all active:scale-75"><i className="fas fa-arrow-down text-xs"></i></button>
      <div className="w-px h-4 bg-white/20 mx-2"></div>
      
      <button onClick={() => setIsOpen(!isOpen)} className={`p-1 hover:text-brand-green transition ${isOpen ? 'text-brand-green' : ''}`}>
        <i className="fas fa-paint-brush text-xs"></i>
      </button>

      <button onClick={() => onAddElement('text')} className="p-2 hover:text-brand-green transition" title="Aggiungi Testo">
        <i className="fas fa-font text-xs"></i>
      </button>
      <button onClick={() => onAddElement('image')} className="p-2 hover:text-brand-green transition" title="Aggiungi Immagine">
        <i className="fas fa-image text-xs"></i>
      </button>
      <button onClick={() => onAddElement('logo')} className="p-2 hover:text-brand-green transition" title="Aggiungi Logo">
        <i className="fas fa-star text-xs"></i>
      </button>
      
      <div className="w-px h-4 bg-white/20 mx-2"></div>
      <button onClick={onDelete} className="hover:text-red-400 p-1"><i className="fas fa-trash text-xs"></i></button>

      {isOpen && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white text-brand-blue p-8 rounded-[3rem] shadow-2xl border border-brand-blue/10 w-96 animate-in fade-in zoom-in duration-200">
          <div className="flex gap-2 mb-6 bg-gray-50 p-1 rounded-full">
            <button onClick={() => setTab('layout')} className={`flex-1 py-2 rounded-full text-[8px] font-black uppercase ${tab === 'layout' ? 'bg-brand-blue text-white' : ''}`}>Layout</button>
            <button onClick={() => setTab('background')} className={`flex-1 py-2 rounded-full text-[8px] font-black uppercase ${tab === 'background' ? 'bg-brand-blue text-white' : ''}`}>Sfondo & Effetti</button>
          </div>

          {tab === 'layout' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[9px] font-bold">
                <span className="opacity-40 uppercase">Variante Base</span>
                <select value={s.variant} onChange={e => updateStyle('variant', e.target.value)} className="bg-gray-50 p-2 rounded-lg outline-none">
                  <option value="solid">Solido</option>
                  <option value="glass">Vetro</option>
                  <option value="transparent">Trasparente</option>
                  <option value="dark">Dark</option>
                  <option value="brand">Brand</option>
                  <option value="image-bg">Immagine Sfondo</option>
                  <option value="custom">Personalizzato</option>
                </select>
              </div>
              <div className="flex justify-between items-center text-[9px] font-bold">
                <span className="opacity-40 uppercase">Forma</span>
                <select value={s.shape} onChange={e => updateStyle('shape', e.target.value)} className="bg-gray-50 p-2 rounded-lg outline-none">
                  <option value="rounded">Arrotondato</option>
                  <option value="sharp">Squadrato</option>
                  <option value="pill">Pillola</option>
                  <option value="oval">Ovale</option>
                  <option value="arc-top">Arco Sopra</option>
                  <option value="arc-bottom">Arco Sotto</option>
                </select>
              </div>
              <div className="flex justify-between items-center text-[9px] font-bold">
                <span className="opacity-40 uppercase">Padding</span>
                <select value={s.padding} onChange={e => updateStyle('padding', e.target.value)} className="bg-gray-50 p-2 rounded-lg outline-none">
                  <option value="none">Nessuno</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="huge">Huge</option>
                </select>
              </div>
              <div className="pt-4 border-t border-gray-100 space-y-4">
                 <div>
                    <label className="text-[8px] font-black opacity-30 uppercase block mb-2 text-left">Spessore Bordo ({s.borderWidth}px)</label>
                    <input type="range" min="0" max="20" value={s.borderWidth} onChange={e => updateStyle('borderWidth', +e.target.value)} className="w-full accent-brand-blue" />
                 </div>
                 <div>
                    <label className="text-[8px] font-black opacity-30 uppercase block mb-2 text-left">Colore Bordo</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={s.borderColor || '#A8D38E'} 
                        onChange={e => updateStyle('borderColor', e.target.value)} 
                        className="w-10 h-10 p-0 border-0 rounded-lg cursor-pointer bg-transparent" 
                      />
                      <span className="text-[10px] font-mono opacity-40 uppercase">{s.borderColor}</span>
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {s.variant === 'image-bg' ? (
                <div className="space-y-4">
                  <button onClick={onImageUpload} className="w-full py-3 bg-brand-light text-brand-blue rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-green transition">Cambia Immagine Sfondo</button>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-[9px] font-black opacity-40 uppercase">Effetto Parallasse</span>
                    <button 
                      onClick={() => updateStyle('parallax', !s.parallax)}
                      className={`w-12 h-6 rounded-full transition-all relative ${s.parallax ? 'bg-brand-green shadow-[0_0_10px_rgba(168,211,142,0.5)]' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${s.parallax ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                  <div>
                    <label className="text-[8px] font-black opacity-30 uppercase block mb-2 text-left">Luminosità Sfondo ({s.bgOpacity || 1})</label>
                    <input type="range" min="0" max="1" step="0.1" value={s.bgOpacity || 1} onChange={e => updateStyle('bgOpacity', +e.target.value)} className="w-full accent-brand-blue" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 no-scrollbar">
                  <div>
                    <label className="text-[8px] font-black opacity-30 uppercase block mb-3 text-left">Colore di Sfondo</label>
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                      <input type="color" value={s.bgColor || '#FFFFFF'} onChange={e => updateStyle('bgColor', e.target.value)} className="w-10 h-10 p-0 border-0 rounded-lg cursor-pointer bg-transparent" />
                      <span className="text-[10px] font-mono opacity-40 uppercase">{s.bgColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[8px] font-black opacity-30 uppercase block mb-3 text-left">Libreria Gradienti</label>
                    <div className="grid grid-cols-2 gap-2">
                      {GRADIENTS.map(g => (
                        <button 
                          key={g.name} 
                          onClick={() => updateStyle('bgGradient', g.value)}
                          className={`p-3 rounded-xl text-[7px] font-black uppercase border transition-all ${s.bgGradient === g.value ? 'ring-2 ring-brand-blue shadow-lg scale-[1.02]' : 'border-gray-100 opacity-60 hover:opacity-100'}`}
                          style={{ background: g.value || '#f3f4f6' }}
                        >
                          {g.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface LogoElementEditorProps {
  element: SectionElement;
  onUpdate: (content: string, style: Partial<SectionElement['style']>) => void;
}

const LogoElementEditor: React.FC<LogoElementEditorProps> = ({ element, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'style' | 'position'>('style');
  const style = element.style || {};

  return (
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-brand-blue text-white px-3 py-1 rounded-full shadow-lg z-[70] animate-in fade-in zoom-in duration-200">
      <button onClick={() => setIsOpen(!isOpen)} className="text-[9px] font-black uppercase tracking-tighter">
        <i className="fas fa-cog mr-1"></i> Logo Editor
      </button>
      
      {isOpen && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-brand-blue/20 w-80 z-[80] text-brand-blue text-left">
          <div className="flex gap-2 mb-4 bg-gray-50 p-1 rounded-full">
            <button onClick={() => setTab('style')} className={`flex-1 py-1 rounded-full text-[8px] font-black uppercase ${tab === 'style' ? 'bg-brand-blue text-white' : ''}`}>Stile</button>
            <button onClick={() => setTab('position')} className={`flex-1 py-1 rounded-full text-[8px] font-black uppercase ${tab === 'position' ? 'bg-brand-blue text-white' : ''}`}>Movimento</button>
          </div>

          {tab === 'style' ? (
            <div className="space-y-4">
              <div>
                <label className="text-[8px] font-black opacity-40 uppercase mb-2 block">Sorgente Logo</label>
                <select 
                  value={element.content} 
                  onChange={e => onUpdate(e.target.value, {})} 
                  className="w-full bg-gray-50 p-2 rounded-lg text-[10px] font-bold outline-none border-0"
                >
                  <option value="primary">Logo Primario</option>
                  <option value="secondary">Logo Secondario</option>
                </select>
              </div>
              <div>
                <label className="text-[8px] font-black opacity-40 uppercase mb-2 block">Larghezza ({style.width || '120px'})</label>
                <input 
                  type="range" 
                  min="20" 
                  max="600" 
                  value={parseInt(style.width || '120')} 
                  onChange={e => onUpdate(element.content, { width: `${e.target.value}px`, height: 'auto' })} 
                  className="w-full accent-brand-blue" 
                />
              </div>
              <div>
                <label className="text-[8px] font-black opacity-40 uppercase mb-2 block">Shadow Effect</label>
                <select 
                  value={Object.keys(BOX_SHADOWS).find(k => (BOX_SHADOWS as any)[k] === style.shadow) || 'none'} 
                  onChange={e => onUpdate(element.content, { shadow: (BOX_SHADOWS as any)[e.target.value] })} 
                  className="w-full bg-gray-50 p-2 rounded-lg text-[10px] font-bold outline-none border-0"
                >
                  <option value="none">Nessuna</option>
                  <option value="soft">Morbida</option>
                  <option value="medium">Media</option>
                  <option value="heavy">Marcata</option>
                  <option value="neon">Neon Verde</option>
                </select>
              </div>
              <div>
                <label className="text-[8px] font-black opacity-40 uppercase mb-2 block">Arrotondamento</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={parseInt(style.borderRadius || '0')} 
                  onChange={e => onUpdate(element.content, { borderRadius: `${e.target.value}%` })} 
                  className="w-full accent-brand-blue" 
                />
              </div>
            </div>
          ) : (
            <ElementPositionEditor style={style} onUpdate={(upd) => onUpdate(element.content, upd)} />
          )}
        </div>
      )}
    </div>
  );
};

interface TextElementEditorProps {
  element: SectionElement;
  onUpdateStyle: (updates: Partial<SectionElement['style']>) => void;
}

const TextElementEditor: React.FC<TextElementEditorProps> = ({ element, onUpdateStyle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'style' | 'position'>('style');
  const style = element.style || {};

  return (
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-brand-green text-brand-blue px-3 py-1 rounded-full shadow-lg z-40 animate-in fade-in zoom-in duration-200">
      <button onClick={() => setIsOpen(!isOpen)} className="text-[9px] font-black uppercase tracking-tighter">
        <i className="fas fa-text-height mr-1"></i> Text Editor
      </button>
      
      {isOpen && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-brand-green/20 w-80 z-50 text-brand-blue text-left">
          <div className="flex gap-2 mb-4 bg-gray-50 p-1 rounded-full">
            <button onClick={() => setTab('style')} className={`flex-1 py-1 rounded-full text-[8px] font-black uppercase ${tab === 'style' ? 'bg-brand-blue text-white' : ''}`}>Tipografia</button>
            <button onClick={() => setTab('position')} className={`flex-1 py-1 rounded-full text-[8px] font-black uppercase ${tab === 'position' ? 'bg-brand-blue text-white' : ''}`}>Movimento</button>
          </div>

          {tab === 'style' ? (
            <div className="space-y-5">
              <div>
                <label className="text-[8px] font-black opacity-40 uppercase mb-3 block">Colore Testo</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['#4E5B83', '#A8D38E', '#FFFFFF', '#000000', '#FF5A5F'].map(c => (
                    <button key={c} onClick={() => onUpdateStyle({ color: c })} className={`w-6 h-6 rounded-full border-2 ${style.color === c ? 'border-brand-blue scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                  ))}
                  <input type="color" value={style.color || '#4E5B83'} onChange={e => onUpdateStyle({ color: e.target.value })} className="w-6 h-6 p-0 border-0 rounded-full cursor-pointer bg-transparent" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-black opacity-40 uppercase mb-2 block">Size</label>
                  <input type="range" min="0.5" max="6" step="0.1" value={parseFloat(style.fontSize || '1.125')} onChange={e => onUpdateStyle({ fontSize: `${e.target.value}rem` })} className="w-full accent-brand-green" />
                </div>
                <div>
                  <label className="text-[8px] font-black opacity-40 uppercase mb-2 block">Interlinea</label>
                  <input type="range" min="0.8" max="2.5" step="0.1" value={parseFloat(style.lineHeight?.toString() || '1.5')} onChange={e => onUpdateStyle({ lineHeight: e.target.value })} className="w-full accent-brand-green" />
                </div>
              </div>

              <div>
                <label className="text-[8px] font-black opacity-40 uppercase mb-2 block text-left">Font Weight</label>
                <div className="flex gap-1">
                  {[
                    { label: 'Normal', val: 'normal' },
                    { label: 'Semi', val: '600' },
                    { label: 'Bold', val: 'bold' },
                    { label: 'Ultra', val: '900' }
                  ].map(w => (
                    <button 
                      key={w.val} 
                      onClick={() => onUpdateStyle({ fontWeight: w.val })} 
                      className={`flex-1 py-2 text-[7px] font-black uppercase rounded-lg border transition-all ${style.fontWeight === w.val ? 'bg-brand-blue text-white border-brand-blue' : 'bg-gray-50 border-gray-100 text-brand-blue/40'}`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[8px] font-black opacity-40 uppercase mb-2 block text-left">Effetti Ombra</label>
                <select value={Object.keys(TEXT_SHADOWS).find(k => (TEXT_SHADOWS as any)[k] === style.textShadow) || 'none'} onChange={e => onUpdateStyle({ textShadow: (TEXT_SHADOWS as any)[e.target.value] })} className="w-full bg-gray-50 p-3 rounded-xl text-[10px] font-bold outline-none border-0">
                  <option value="none">Piatto</option>
                  <option value="soft">Morbido</option>
                  <option value="hard">Retrò</option>
                  <option value="glow">Bagliore Verde</option>
                  <option value="neon">Neon White</option>
                  <option value="dark">Profondo</option>
                </select>
              </div>

              <div>
                <label className="text-[8px] font-black opacity-40 uppercase mb-2 block text-left">Allineamento</label>
                <div className="flex gap-2">
                  {(['left', 'center', 'right'] as const).map(align => (
                    <button 
                      key={align} 
                      onClick={() => onUpdateStyle({ textAlign: align })} 
                      className={`flex-1 p-3 rounded-xl transition-all ${style.textAlign === align ? 'bg-brand-blue text-white shadow-md' : 'bg-gray-50 text-brand-blue/40 border border-gray-100'}`}
                    >
                      <i className={`fas fa-align-${align} text-xs`}></i>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <ElementPositionEditor style={style} onUpdate={onUpdateStyle} />
          )}
        </div>
      )}
    </div>
  );
};

interface ImageElementEditorProps {
  element: SectionElement;
  onUpdateStyle: (updates: Partial<SectionElement['style']>) => void;
  onReplace: () => void;
}

const ImageElementEditor: React.FC<ImageElementEditorProps> = ({ element, onUpdateStyle, onReplace }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'style' | 'position'>('style');
  const style = element.style || {};

  const resetFilters = () => {
    onUpdateStyle({
      brightness: 1,
      contrast: 1,
      grayscale: 0,
      sepia: 0
    });
  };

  return (
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-brand-blue text-white px-3 py-1 rounded-full shadow-lg z-40 animate-in fade-in zoom-in duration-200">
      <button onClick={() => setIsOpen(!isOpen)} className="text-[9px] font-black uppercase tracking-tighter">
        <i className="fas fa-image mr-1"></i> Image Editor
      </button>
      
      {isOpen && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-brand-blue/20 w-80 z-50 text-brand-blue text-left">
          <div className="flex gap-2 mb-4 bg-gray-50 p-1 rounded-full">
            <button onClick={() => setTab('style')} className={`flex-1 py-1 rounded-full text-[8px] font-black uppercase ${tab === 'style' ? 'bg-brand-blue text-white' : ''}`}>Design & Filtri</button>
            <button onClick={() => setTab('position')} className={`flex-1 py-1 rounded-full text-[8px] font-black uppercase ${tab === 'position' ? 'bg-brand-blue text-white' : ''}`}>Ritaglio & Scala</button>
          </div>

          {tab === 'style' ? (
            <div className="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
              <button onClick={onReplace} className="w-full py-3 rounded-xl bg-brand-light text-brand-blue text-[9px] font-black uppercase tracking-widest hover:bg-brand-green transition">Cambia Immagine</button>
              
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <label className="text-[8px] font-black opacity-40 uppercase block mb-2">Dimensioni & Bordi</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[7px] font-bold opacity-30 block mb-1">Larghezza ({style.width || '100%'})</label>
                    <input type="text" value={style.width || '100%'} onChange={e => onUpdateStyle({ width: e.target.value })} className="w-full bg-gray-50 p-2 rounded-lg text-[10px] outline-none" placeholder="es. 100% o 300px" />
                  </div>
                  <div>
                    <label className="text-[7px] font-bold opacity-30 block mb-1">Altezza ({style.height || 'auto'})</label>
                    <input type="text" value={style.height || 'auto'} onChange={e => onUpdateStyle({ height: e.target.value })} className="w-full bg-gray-50 p-2 rounded-lg text-[10px] outline-none" placeholder="es. auto o 400px" />
                  </div>
                </div>
                <div>
                  <label className="text-[7px] font-bold opacity-30 block mb-1">Arrotondamento</label>
                  <input type="range" min="0" max="200" value={parseInt(style.borderRadius || '48')} onChange={e => onUpdateStyle({ borderRadius: `${e.target.value}px` })} className="w-full accent-brand-blue" />
                </div>
                <div>
                  <label className="text-[7px] font-bold opacity-30 block mb-1">Opacità ({style.opacity || 1})</label>
                  <input type="range" min="0" max="1" step="0.1" value={style.opacity || 1} onChange={e => onUpdateStyle({ opacity: +e.target.value })} className="w-full accent-brand-blue" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[8px] font-black opacity-40 uppercase">Filtri Immagine</label>
                  <button onClick={resetFilters} className="text-[7px] font-black uppercase text-brand-blue opacity-40 hover:opacity-100 transition">Reset</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[7px] font-bold opacity-30 block mb-1">Brightness ({style.brightness || 1})</label>
                    <input type="range" min="0" max="2" step="0.1" value={style.brightness || 1} onChange={e => onUpdateStyle({ brightness: +e.target.value })} className="w-full accent-brand-blue" />
                  </div>
                  <div>
                    <label className="text-[7px] font-bold opacity-30 block mb-1">Contrast ({style.contrast || 1})</label>
                    <input type="range" min="0" max="2" step="0.1" value={style.contrast || 1} onChange={e => onUpdateStyle({ contrast: +e.target.value })} className="w-full accent-brand-blue" />
                  </div>
                  <div>
                    <label className="text-[7px] font-bold opacity-30 block mb-1">Grayscale ({style.grayscale || 0})</label>
                    <input type="range" min="0" max="1" step="0.1" value={style.grayscale || 0} onChange={e => onUpdateStyle({ grayscale: +e.target.value })} className="w-full accent-brand-blue" />
                  </div>
                  <div>
                    <label className="text-[7px] font-bold opacity-30 block mb-1">Sepia ({style.sepia || 0})</label>
                    <input type="range" min="0" max="1" step="0.1" value={style.sepia || 0} onChange={e => onUpdateStyle({ sepia: +e.target.value })} className="w-full accent-brand-blue" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <label className="text-[8px] font-black opacity-40 uppercase block mb-2">Adattamento (Crop Mode)</label>
                <select 
                  value={style.objectFit || 'cover'} 
                  onChange={e => onUpdateStyle({ objectFit: e.target.value as any })} 
                  className="w-full bg-gray-50 p-2 rounded-lg text-[10px] font-bold outline-none border-0"
                >
                  <option value="cover">Riempi (Cover)</option>
                  <option value="contain">Contieni (Contain)</option>
                  <option value="fill">Stira (Fill)</option>
                  <option value="none">Originale</option>
                </select>
              </div>
            </div>
          ) : (
            <ElementPositionEditor style={style} onUpdate={onUpdateStyle} />
          )}
        </div>
      )}
    </div>
  );
};

interface HomeSectionsProps {
  config: SiteConfig;
  isEditMode: boolean;
  onUpdateConfig: (config: SiteConfig, save?: boolean) => void;
  onNavigate: (page: Page) => void;
}

const HomeSections: React.FC<HomeSectionsProps> = ({ config, isEditMode, onUpdateConfig, onNavigate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef<{sectionId: string, elementId?: string, isBg?: boolean} | null>(null);

  const updateSection = (id: string, updates: Partial<SectionContent>, save = true) => {
    onUpdateConfig({
      ...config,
      sections: config.sections.map(s => s.id === id ? { ...s, ...updates } : s)
    }, save);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...config.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newSections.length) return;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    onUpdateConfig({ ...config, sections: newSections });
  };

  const addElement = (sectionId: string, type: 'text' | 'image' | 'logo') => {
    const newElement: SectionElement = {
      id: `el_${Date.now()}`,
      type,
      content: type === 'text' ? 'Scrivi qui il tuo messaggio...' : type === 'image' ? 'https://images.unsplash.com/photo-1595435063785-547bb7c2c537?auto=format&fit=crop&q=80&w=800' : 'primary',
      style: { 
        width: type === 'logo' ? '120px' : '100%', 
        height: type === 'logo' ? 'auto' : 'auto',
        borderRadius: type === 'text' ? '3rem' : type === 'image' ? '3rem' : '0%',
        fontSize: '1.125rem',
        color: config.primaryColor,
        textAlign: 'center',
        textShadow: 'none',
        fontWeight: 'normal',
        lineHeight: '1.5',
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        zIndex: 5,
        brightness: 1,
        contrast: 1,
        grayscale: 0,
        sepia: 0,
        objectFit: 'cover'
      }
    };
    const next = config.sections.map(s => s.id === sectionId ? { ...s, elements: [...(s.elements || []), newElement] } : s);
    onUpdateConfig({ ...config, sections: next });
  };

  const updateElement = (sectionId: string, elId: string, content: string, save = true) => {
    const next = config.sections.map(s => s.id === sectionId ? {
      ...s,
      elements: s.elements?.map(el => el.id === elId ? { ...el, content } : el)
    } : s);
    onUpdateConfig({ ...config, sections: next }, save);
  };

  const updateElementStyle = (sectionId: string, elId: string, styleUpdates: Partial<SectionElement['style']>) => {
    const next = config.sections.map(s => s.id === sectionId ? {
      ...s,
      elements: s.elements?.map(el => el.id === elId ? { ...el, style: { ...(el.style || {}), ...styleUpdates } } : el)
    } : s);
    onUpdateConfig({ ...config, sections: next });
  };

  const handleImageClick = (sectionId: string, elementId?: string, isBg = false) => {
    uploadTarget.current = { sectionId, elementId, isBg };
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget.current) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result as string;
        if (uploadTarget.current?.isBg) {
          const sId = uploadTarget.current.sectionId;
          const section = config.sections.find(s => s.id === sId);
          if (section) {
            updateSection(sId, { style: { ...(section.style || {}), bgImageUrl: b64 } as any });
          }
        } else if (uploadTarget.current?.elementId) {
          updateElement(uploadTarget.current.sectionId, uploadTarget.current.elementId, b64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-24 pb-48 overflow-x-hidden">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
      
      {config.sections.map((section, idx) => {
        if (!section.enabled && !isEditMode) return null;

        const s = section.style || { variant: 'solid', shape: 'rounded', padding: 'medium', width: 'contained', shadow: 'soft', borderWidth: 0, borderColor: config.accentColor, bgColor: '#FFFFFF', bgGradient: '', parallax: false };
        
        const containerStyle: React.CSSProperties = {
          borderWidth: `${s.borderWidth}px`,
          borderColor: s.borderColor,
          borderStyle: s.borderWidth > 0 ? 'solid' : 'none',
          backgroundColor: (s.variant === 'solid' || s.variant === 'custom') ? s.bgColor : undefined,
          backgroundImage: s.variant === 'image-bg' ? `url(${s.bgImageUrl})` : (s.bgGradient || 'none'),
          backgroundAttachment: s.parallax ? 'fixed' : 'scroll',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        };

        const widthClass = s.width === 'full' ? 'w-full' : s.width === 'narrow' ? 'max-w-4xl' : 'max-w-7xl';

        return (
          <div 
            key={section.id} 
            style={containerStyle}
            className={`
              relative transition-all duration-700 mx-auto
              ${STYLE_MAPS.variant[s.variant || 'solid']}
              ${STYLE_MAPS.shape[s.shape || 'rounded']}
              ${STYLE_MAPS.padding[s.padding || 'medium']}
              ${STYLE_MAPS.shadow[s.shadow || 'none']}
              ${isEditMode ? 'ring-2 ring-dashed ring-brand-blue/10 m-6' : ''}
            `}
          >
            {/* Overlay per l'opacità/luminosità dello sfondo se è image-bg */}
            {s.variant === 'image-bg' && s.bgOpacity !== undefined && (
              <div 
                className="absolute inset-0 pointer-events-none transition-all duration-500" 
                style={{ backgroundColor: `rgba(0,0,0,${1 - (s.bgOpacity || 1)})` }}
              ></div>
            )}

            {isEditMode && (
              <SectionEditorPanel 
                section={section}
                onUpdate={(upd) => updateSection(section.id, upd)}
                onDelete={() => onUpdateConfig({ ...config, sections: config.sections.filter(s => s.id !== section.id) })}
                onMove={(dir) => moveSection(idx, dir)}
                onAddElement={(type) => addElement(section.id, type)}
                onImageUpload={() => handleImageClick(section.id, undefined, true)}
              />
            )}

            <div className={`${widthClass} mx-auto px-6 relative z-10`}>
              <div className="text-center space-y-6 relative">
                {isEditMode ? (
                  <div className="space-y-4 relative z-10">
                    <input 
                      value={section.title} 
                      onChange={e => updateSection(section.id, { title: e.target.value }, false)}
                      className="text-4xl md:text-7xl font-black uppercase text-center w-full bg-transparent outline-none italic tracking-tighter"
                    />
                    <textarea 
                      value={section.description} 
                      onChange={e => updateSection(section.id, { description: e.target.value }, false)}
                      className="text-xl opacity-60 italic text-center w-full bg-transparent outline-none resize-none min-h-[100px]"
                    />
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom duration-1000 relative z-10">
                    <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 italic">{section.title}</h2>
                    <p className="text-xl opacity-60 italic max-w-3xl mx-auto">{section.description}</p>
                  </div>
                )}

                {/* Grid Elementi Dinamici */}
                <div className={`grid grid-cols-1 md:grid-cols-${Math.min(section.elements?.length || 1, 3)} gap-12 mt-20 items-center justify-items-center relative`}>
                  {section.elements?.map(el => {
                    const elStyle = el.style || {};
                    const transformStyle: React.CSSProperties = {
                      transform: `translate(${elStyle.x || 0}px, ${elStyle.y || 0}px) rotate(${elStyle.rotation || 0}deg) scale(${elStyle.scale || 1})`,
                      zIndex: elStyle.zIndex || 5,
                      position: 'relative',
                      transition: 'transform 0.2s ease-out'
                    };

                    const commonControls = isEditMode && (
                      <div className="absolute -top-4 -right-4 flex gap-2 z-[90] opacity-0 group-hover/el:opacity-100 transition-all">
                        <button onClick={() => {
                          const next = config.sections.map(sec => sec.id === section.id ? { ...sec, elements: sec.elements?.filter(e => e.id !== el.id) } : sec);
                          onUpdateConfig({ ...config, sections: next });
                        }} className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-90"><i className="fas fa-times text-xs"></i></button>
                      </div>
                    );

                    if (el.type === 'text') {
                      const textStyles: React.CSSProperties = {
                        ...transformStyle,
                        fontSize: elStyle.fontSize || '1.125rem',
                        color: elStyle.color || 'inherit',
                        textAlign: elStyle.textAlign || 'center',
                        textShadow: elStyle.textShadow || 'none',
                        fontWeight: elStyle.fontWeight || 'normal',
                        lineHeight: elStyle.lineHeight || '1.5'
                      };

                      return (
                        <div key={el.id} className="relative group/el w-full">
                          {commonControls}
                          <div style={textStyles} className="relative p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner h-full flex flex-col items-center justify-center">
                            {isEditMode && <TextElementEditor element={el} onUpdateStyle={(upd) => updateElementStyle(section.id, el.id, upd)} />}
                            {isEditMode ? (
                              <textarea value={el.content} onChange={e => updateElement(section.id, el.id, e.target.value, false)} className="w-full bg-transparent outline-none italic opacity-80 resize-none h-32" />
                            ) : (
                              <p className="italic opacity-80 whitespace-pre-wrap">{el.content}</p>
                            )}
                          </div>
                        </div>
                      );
                    }

                    if (el.type === 'image') {
                      const filters = `brightness(${elStyle.brightness || 1}) contrast(${elStyle.contrast || 1}) grayscale(${elStyle.grayscale || 0}) sepia(${elStyle.sepia || 0})`;
                      return (
                        <div key={el.id} className="relative group/el w-full">
                          {commonControls}
                          <div 
                            style={{ 
                              ...transformStyle, 
                              borderRadius: elStyle.borderRadius || '3rem', 
                              opacity: elStyle.opacity || 1,
                              width: elStyle.width || '100%',
                              height: elStyle.height || '400px',
                              overflow: 'hidden'
                            }} 
                            className="relative group/img cursor-pointer shadow-2xl transition-all duration-500" 
                            onClick={() => isEditMode && handleImageClick(section.id, el.id)}
                          >
                            {isEditMode && <ImageElementEditor element={el} onUpdateStyle={(upd) => updateElementStyle(section.id, el.id, upd)} onReplace={() => handleImageClick(section.id, el.id)} />}
                            <img 
                              src={el.content} 
                              style={{ 
                                filter: filters,
                                objectFit: elStyle.objectFit || 'cover',
                                transition: 'filter 0.3s ease-out'
                              }}
                              className="w-full h-full transition-transform duration-1000 group-hover/img:scale-105" 
                            />
                          </div>
                        </div>
                      );
                    }

                    if (el.type === 'logo') {
                      const logoUrl = el.content === 'primary' ? config.primaryLogoUrl : config.secondaryLogoUrl;
                      return (
                        <div key={el.id} className="relative group/el">
                          {commonControls}
                          <div style={transformStyle} className="relative">
                            {isEditMode && (
                              <LogoElementEditor 
                                element={el} 
                                onUpdate={(content, styleUpdates) => {
                                  const nextElements = section.elements?.map(e => e.id === el.id ? { ...e, content, style: { ...e.style, ...styleUpdates } } : e);
                                  updateSection(section.id, { elements: nextElements });
                                }} 
                              />
                            )}
                            <div 
                              style={{ 
                                width: elStyle.width || '120px', 
                                height: 'auto', 
                                borderRadius: elStyle.borderRadius || '0%',
                                boxShadow: elStyle.shadow || 'none'
                              }} 
                              className="bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl flex items-center justify-center p-4 overflow-hidden"
                            >
                              {logoUrl ? (
                                <img src={logoUrl} className="w-full h-full object-contain" alt="Logo Element" />
                              ) : (
                                <div className="text-brand-blue/20 text-4xl"><i className="fas fa-star"></i></div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {isEditMode && (
        <div className="flex justify-center pt-24">
          <button 
            onClick={() => {
              const id = `custom_${Date.now()}`;
              onUpdateConfig({
                ...config,
                sections: [...config.sections, { 
                  id, 
                  title: 'Nuova Arena Area', 
                  navLabel: 'Area', 
                  enabled: true, 
                  isCustom: true, 
                  elements: [],
                  style: { variant: 'solid', shape: 'rounded', padding: 'medium', width: 'contained', shadow: 'soft', borderWidth: 0, borderColor: config.accentColor, bgColor: '#FFFFFF', bgGradient: '', parallax: false }
                }]
              });
            }}
            className="group flex flex-col items-center gap-6 bg-white border-4 border-dashed border-brand-blue/10 px-24 py-16 rounded-[6rem] text-brand-blue/30 hover:text-brand-green hover:border-brand-green transition-all shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]"
          >
            <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center text-5xl group-hover:bg-brand-green group-hover:text-brand-blue transition-all">
              <i className="fas fa-plus"></i>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-black uppercase italic tracking-tighter">Espandi la tua Arena</span>
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-60">Aggiungi una nuova sezione architettonica</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeSections;
