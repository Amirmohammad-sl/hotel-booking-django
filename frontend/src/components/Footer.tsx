import React from 'react';
import { Compass, ShieldCheck, Award, Sparkles, Mail, Phone, MapPin, Globe2, Heart, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#03050d] text-slate-400 border-t border-slate-800/80 pt-20 pb-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                <Compass className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-black tracking-wider text-white">
                  AURA <span className="text-amber-400 text-sm font-sans font-bold px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">3D</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-medium">
                  Architectural Luxury Stays
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The world&apos;s premier 3D interactive hotel reservation portal. Combining spatial WebGL architecture, curated 5-star sanctuaries, and bespoke concierge hospitality worldwide.
            </p>

            {/* Live Trust Badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>256-Bit Encrypted</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Verified 5-Star Portfolios</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Three.js Real-Time Engine</span>
              </div>
            </div>
          </div>

          {/* Luxury Destinations */}
          <div>
            <h4 className="text-white font-serif font-semibold text-base mb-5 tracking-wide flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-amber-400" /> Destinations
            </h4>
            <ul className="space-y-3 text-sm">
              {['Dubai, UAE', 'Maldives Atolls', 'Paris, France', 'Tokyo, Japan', 'New York, USA', 'Istanbul, Turkey'].map((city) => (
                <li key={city}>
                  <Link to="/" className="text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1 group">
                    <span>{city}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-y-0.5 transition-all text-amber-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bespoke Services */}
          <div>
            <h4 className="text-white font-serif font-semibold text-base mb-5 tracking-wide">
              Aura Services
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                '3D Virtual Suite Tours',
                'Private Island Charters',
                'Helicopter Transfers',
                'Michelin Dining Reservations',
                '24/7 Diplomatic Butler',
                'Exclusive Member Rates'
              ].map((service) => (
                <li key={service}>
                  <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Global Hub */}
          <div>
            <h4 className="text-white font-serif font-semibold text-base mb-5 tracking-wide">
              Global Concierge
            </h4>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-xs leading-snug">
                  AURA Pavilion, Level 68, Sheikh Zayed Rd, Dubai, UAE
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300 text-xs">+1 (800) 789-AURA / +971 4 800 2872</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300 text-xs">concierge@aura3dhotels.luxury</span>
              </div>

              {/* Status Indicator */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-medium text-emerald-400">Concierge Desk Live 24/7</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Average VIP response: under 90 seconds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Graduation Project Acknowledgement & Copyright */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} AURA 3D Luxury Reservations. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium">
              پروژه کارشناسی مهندسی نرم‌افزار — Amirmohammad-sl
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-slate-200 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-200 cursor-pointer transition-colors">Terms of Hospitality</span>
            <span className="hover:text-slate-200 cursor-pointer transition-colors">Security Audit</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
