import React, { useState, useRef } from 'react';
import { Star, MapPin, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import type { Hotel } from '../types';
import { Link } from 'react-router-dom';

interface HotelCardProps {
  hotel: Hotel;
  onOpenBooking?: (hotel: Hotel) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onOpenBooking }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0, x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9; // 9 deg tilt
    const rotateY = ((x - centerX) / centerX) * 9;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`);
    setGlareStyle({
      opacity: 1,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)');
    setGlareStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease'
      }}
      className="group relative bg-slate-900/75 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 rounded-3xl overflow-hidden shadow-2xl hover:shadow-indigo-500/20 flex flex-col h-full select-none"
    >
      {/* Specular Glare Reflection Sheen */}
      <div
        style={{
          background: `radial-gradient(circle at ${glareStyle.x}% ${glareStyle.y}%, rgba(255, 255, 255, 0.18) 0%, rgba(99, 102, 241, 0.08) 45%, transparent 70%)`,
          opacity: glareStyle.opacity
        }}
        className="pointer-events-none absolute inset-0 z-20 rounded-3xl transition-opacity duration-300"
      />

      {/* Top Image & Floating Badges */}
      <div className="relative h-64 overflow-hidden bg-slate-950">
        <img
          src={hotel.featuredImage}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

        {/* Favorite Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors shadow-lg active:scale-90"
          title="Save to favorites"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Category Pill */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-amber-300 uppercase tracking-wider shadow-md">
          {hotel.category}
        </div>

        {/* Guest Rating & Stars Floating Bar */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 font-bold">
            <span className="text-emerald-400">{hotel.guestRating.toFixed(2)}</span>
            <span className="text-slate-400 font-normal">({hotel.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">{hotel.city}, {hotel.country}</span>
          </div>

          <h3 className="font-serif font-bold text-xl text-white group-hover:text-amber-300 transition-colors line-clamp-1">
            {hotel.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {hotel.description}
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hotel.highlights.slice(0, 2).map((hl, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium"
              >
                <ShieldCheck className="w-2.5 h-2.5 text-indigo-400" />
                {hl}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Starting from</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-400 font-sans tracking-tight">
                ${hotel.pricePerNight}
              </span>
              <span className="text-xs text-slate-400">/ night</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/hotel/${hotel.id}`}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={() => onOpenBooking && onOpenBooking(hotel)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
