import React from 'react';
import { Tag, Clock, ArrowRight, Sparkles, Percent } from 'lucide-react';

interface SpecialOffersProps {
  onApplyPromo?: (code: string) => void;
}

export const SpecialOffers: React.FC<SpecialOffersProps> = ({ onApplyPromo }) => {
  const offers = [
    {
      code: 'AURAESCAPE25',
      discount: '25% OFF',
      title: 'Maldives Island Sanctuary Package',
      description: 'Book 5 nights or more at Soneva Jani or luxury atoll villas and enjoy complimentary roundtrip seaplane transfers & spa credits.',
      validUntil: 'Valid through Dec 2026',
      badge: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80'
    },
    {
      code: 'DUBAIROYAL30',
      discount: '30% OFF',
      title: 'Burj Al Arab Duplex Suite Escape',
      description: 'Exclusive suite upgrade, VIP private island access, and daily Michelin-starred breakfast for two over the Arabian Gulf.',
      validUntil: 'Limited to first 50 guests',
      badge: 'Ultra-Exclusive',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    },
    {
      code: 'PARISVENDOME',
      discount: '$350 CREDIT',
      title: 'Ritz Paris Grand Autumn Experience',
      description: 'Complimentary dinner for two at L’Espadon, private Chanel Spa treatment, and VIP airport fast-track meet & greet.',
      validUntil: 'Valid this season',
      badge: 'Heritage Luxury',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section id="offers" className="max-w-7xl mx-auto px-4 py-20 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Limited-Time Privileges</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Special <span className="gold-gradient-text">Offers & Discounts</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 max-w-xl">
            Take advantage of curated promotional packages with verified coupon codes and exclusive club perks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer, idx) => (
          <div
            key={idx}
            className="group relative bg-slate-900/70 backdrop-blur-xl border border-white/10 hover:border-amber-400/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2"
          >
            {/* Header Image */}
            <div className="relative h-48 overflow-hidden bg-slate-950">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-lg">
                {offer.discount}
              </div>
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-slate-300 text-[10px] font-semibold">
                {offer.badge}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {offer.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {offer.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{offer.validUntil}</span>
                  </div>
                  <span className="font-mono text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[11px]">
                    {offer.code}
                  </span>
                </div>

                <button
                  onClick={() => onApplyPromo && onApplyPromo(offer.code)}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-white/10 font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 group-hover:border-amber-400"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Claim Offer & Copy Code</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
