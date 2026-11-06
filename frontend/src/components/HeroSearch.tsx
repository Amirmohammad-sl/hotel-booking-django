import React, { useState } from 'react';
import { MapPin, Calendar, Users, DoorOpen, Search, Sparkles } from 'lucide-react';
import type { SearchQuery } from '../types';

interface HeroSearchProps {
  onSearch: (query: SearchQuery) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch }) => {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('2026-11-15');
  const [checkOut, setCheckOut] = useState('2026-11-20');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ destination, checkIn, checkOut, guests, rooms });
    // Smooth scroll to hotels list
    const el = document.getElementById('featured-hotels');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative z-30 max-w-6xl mx-auto px-4 -mt-10 md:-mt-14">
      <div className="glass-panel-glow rounded-3xl p-5 md:p-7 shadow-2xl transition-all duration-300">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* 1. Destination Input */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Destination or Resort</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Dubai, Paris, Maldives..."
                className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>

          {/* 2. Check-In Date */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Check-in</span>
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-all cursor-pointer"
            />
          </div>

          {/* 3. Check-Out Date */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Check-out</span>
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-all cursor-pointer"
            />
          </div>

          {/* 4. Number of Guests */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Guests</span>
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-all cursor-pointer"
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests</option>
              <option value={5}>5+ Guests</option>
            </select>
          </div>

          {/* 5. Number of Rooms */}
          <div className="md:col-span-1 space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
              <DoorOpen className="w-3.5 h-3.5 text-violet-400" />
              <span>Rooms</span>
            </label>
            <select
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-2.5 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-all cursor-pointer"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4+</option>
            </select>
          </div>

          {/* 6. Search Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full h-[48px] rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>Search Hotels</span>
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1 text-slate-500 font-medium">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Trending:
          </span>
          {['Dubai', 'Maldives', 'Paris', 'Tokyo', 'New York'].map((trend) => (
            <button
              key={trend}
              type="button"
              onClick={() => {
                setDestination(trend);
                onSearch({ destination: trend, checkIn, checkOut, guests, rooms });
                const el = document.getElementById('featured-hotels');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              {trend}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
