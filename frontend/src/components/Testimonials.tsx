import React from 'react';
import { Star, Quote, Sparkles, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Princess Noor Al-Sabah',
      role: 'Private Traveler',
      location: 'Kuwait City',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      hotelStayed: 'Burj Al Arab Jumeirah, Dubai',
      quote: 'Booking through AURA was immaculate from start to finish. The 3D suite preview matched reality to the exact millimeter, and our private helicopter transfer was flawless.'
    },
    {
      name: 'Alexander Van Der Bilt',
      role: 'Investment Director',
      location: 'Geneva, Switzerland',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      hotelStayed: 'Soneva Jani, Maldives',
      quote: 'The retractable stargazing roof over our lagoon villa at Soneva Jani was life-changing. AURA secured our preferred villa number and customized our dining itinerary impeccably.'
    },
    {
      name: 'Victoria Sterling-Fox',
      role: 'Architectural Critic',
      location: 'London, UK',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      hotelStayed: 'Aman Tokyo, Japan',
      quote: 'The attention to detail and zero-glitch booking platform makes AURA the only luxury reservation network I trust. The Mount Fuji suite view was beyond words.'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 relative">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Verified Guest Stories</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
          Voices of Our <span className="cyan-gradient-text">Distinguished Guests</span>
        </h2>
        <p className="text-slate-400 text-sm mt-3">
          Over 12,000 discerning travelers choose AURA each year for seamless ultra-luxury hospitality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, i) => (
          <div
            key={i}
            className="group relative bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-cyan-400/40 rounded-3xl p-8 shadow-xl flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2"
          >
            <div>
              <Quote className="w-8 h-8 text-amber-400/30 mb-4" />
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {Array.from({ length: rev.rating }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                "{rev.quote}"
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center gap-3.5">
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-11 h-11 rounded-full object-cover border border-amber-400/40"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif font-bold text-sm text-white truncate">{rev.name}</h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                </div>
                <div className="text-[11px] text-slate-400 truncate">{rev.location}</div>
                <div className="text-[10px] text-amber-300/80 font-medium truncate mt-0.5">{rev.hotelStayed}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
