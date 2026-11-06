import React, { useState } from 'react';
import { Crown, Globe, Menu, X, Sparkles, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onOpenBookingModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBookingModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currency, setCurrency] = useState('USD ($)');

  return (
    <header className="sticky top-4 z-50 px-4 max-w-7xl mx-auto w-full">
      <nav className="glass-panel rounded-full px-5 py-3 md:px-7 md:py-3.5 shadow-2xl flex items-center justify-between border border-white/10 transition-all duration-300">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:rotate-12 transition-transform duration-300">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-black text-xl tracking-tight text-white flex items-center gap-1.5">
              AURA <span className="text-[10px] uppercase font-sans tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">3D</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-medium">Ultra Luxury Collection</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-medium text-slate-300">
          <a href="#destinations" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <span>Destinations</span>
          </a>
          <a href="#featured-hotels" className="hover:text-amber-400 transition-colors">
            Featured Hotels
          </a>
          <a href="#3d-globe" className="hover:text-amber-400 transition-colors flex items-center gap-1 text-cyan-400">
            <Globe className="w-3.5 h-3.5" />
            <span>3D Interactive Globe</span>
          </a>
          <a href="#offers" className="hover:text-amber-400 transition-colors">
            Exclusive Offers
          </a>
          <a href="#why-us" className="hover:text-amber-400 transition-colors">
            Why AURA
          </a>
        </div>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Currency Select */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Select Currency"
              className="bg-slate-900/60 border border-white/10 rounded-full px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="AED (د.إ)">AED (د.إ)</option>
              <option value="GBP (£)">GBP (£)</option>
            </select>
          </div>

          <a
            href="tel:+18005550199"
            className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            title="VIP Concierge Call"
          >
            <PhoneCall className="w-4 h-4 text-amber-400" />
          </a>

          <button
            onClick={onOpenBookingModal}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reserve Stay</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-full bg-slate-900/60 border border-white/10 text-slate-200"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-5 glass-panel-glow rounded-3xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-3 text-sm text-slate-200 font-medium">
            <a
              href="#destinations"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              Destinations
            </a>
            <a
              href="#featured-hotels"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              Featured Hotels
            </a>
            <a
              href="#3d-globe"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-cyan-400 hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span>3D Interactive Globe</span>
            </a>
            <a
              href="#offers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              Exclusive Offers
            </a>
            <a
              href="#why-us"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              Why AURA
            </a>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenBookingModal) onOpenBookingModal();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-amber-500 text-white font-semibold text-sm shadow-lg text-center"
            >
              Reserve a Stay
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
