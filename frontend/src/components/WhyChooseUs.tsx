import React from 'react';
import { ShieldCheck, Sparkles, Award, Headphones, CreditCard, Clock } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const perks = [
    {
      icon: <Award className="w-7 h-7 text-amber-400" />,
      title: 'Guaranteed Best Rates',
      description: 'Direct relationships with ultra-luxury properties guarantee the lowest verified price, plus exclusive room upgrades.'
    },
    {
      icon: <Sparkles className="w-7 h-7 text-cyan-400" />,
      title: '3D Spatial Exploration',
      description: 'Explore hotel architecture, island layouts, and suite interiors in full 3D WebGL space before confirming your arrival.'
    },
    {
      icon: <Headphones className="w-7 h-7 text-indigo-400" />,
      title: '24/7 VIP Concierge',
      description: 'Dedicated personal travel architects on call to handle private aviation, yacht charters, and bespoke dining reservations.'
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-emerald-400" />,
      title: '100% Instant Confirmation',
      description: 'Seamless mathematical inventory locking ensures zero overbooking, instant mobile vouchers, and flexible cancellation.'
    }
  ];

  return (
    <section id="why-us" className="max-w-7xl mx-auto px-4 py-20 relative">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The AURA Distinction</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
          Why Discerning Travelers <span className="gold-gradient-text">Choose Us</span>
        </h2>
        <p className="text-slate-400 text-sm mt-4 leading-relaxed">
          We redefine luxury hospitality booking by harmonizing bespoke personal concierge care with next-generation interactive 3D spatial technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {perks.map((p, i) => (
          <div
            key={i}
            className="group bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-amber-400/40 rounded-3xl p-7 shadow-xl hover:shadow-amber-500/10 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {p.icon}
              </div>
              <h3 className="font-serif font-bold text-xl text-white mb-2.5">
                {p.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs text-slate-500 font-medium">
              <span>Standard for all bookings</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
