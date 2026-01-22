
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PromoModal: React.FC = () => {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const config = settings.promoConfig;

  useEffect(() => {
    if (!config.enabled) return;

    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('subhub_promo_dismissed');
    if (isDismissed) return;

    // Show after 2 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [config.enabled]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('subhub_promo_dismissed', 'true');
  };

  const handleAction = () => {
    handleClose();
    if (config.buttonLink.startsWith('http')) {
      window.open(config.buttonLink, '_blank');
    } else {
      navigate(config.buttonLink);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative max-w-lg w-full bg-[#0f172a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.15)] animate-in zoom-in-95 duration-500 slide-in-from-bottom-8">
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all border border-white/5"
        >
          <X size={20} />
        </button>

        {/* Promo Image */}
        {config.imageUrl && (
          <div className="h-48 w-full relative overflow-hidden">
            <img 
              src={config.imageUrl} 
              alt="Promotion" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
          </div>
        )}

        <div className="p-10 space-y-6">
          <div className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                <Sparkles size={28} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-white leading-tight">
              {config.title}
            </h2>
            <p className="text-slate-400 leading-relaxed">
              {config.description}
            </p>
          </div>

          <button 
            onClick={handleAction}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {config.buttonText} <ArrowRight size={20} />
          </button>
          
          <p className="text-center text-[10px] uppercase font-black tracking-widest text-slate-600">
            Limited time offer • Terms Apply
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromoModal;
