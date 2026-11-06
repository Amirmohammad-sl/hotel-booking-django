import React from 'react';
import { POPULAR_DESTINATIONS } from '../data/hotels';
import type { Destination } from '../types';
import { MapPin, ArrowUpRight, Sparkles } from 'lucide-react';

interface PopularDestinationsProps {
  onSelectDestination: (dest: Destination) => void;
}

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({ onSelectDestination }) => {
  return (
    <section id="destinations" className="max-w-7xl mx-auto px-4 py-20 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Global Havens</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Popular <span className="cyan-gradient-text">Destinations</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 max-w-xl">
            From futuristic desert metropolises to secluded private island lagoons, discover our hand-picked sanctuaries across the world.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          6 Premier Worldwide Locations
        </div>
      </div>

      {/* Grid of 6 Destinations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POPULAR_DESTINATIONS.map((dest) => (
          <div
            key={dest.id}
            onClick={() => onSelectDestination(dest)}
            className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-white/10 hover:border-amber-400/50 transition-all duration-500 transform hover:-translate-y-2 select-none"
          >
            {/* Background Image with Layered Depth Zoom */}
            <img
              src={dest.image}
              alt={dest.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

            {/* Top Tag */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-300">
                {dest.hotelCount} Exclusive Hotels
              </span>
              <div className="w-10 h-10 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300 shadow-lg">
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{dest.country}</span>
              </div>

              <h3 className="font-serif font-bold text-3xl text-white group-hover:text-amber-300 transition-colors">
                {dest.name}
              </h3>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">Starting from</span>
                <span className="text-base font-bold text-amber-400 font-sans">
                  ${dest.startingPrice} <span className="text-xs text-slate-400 font-normal">/ night</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
