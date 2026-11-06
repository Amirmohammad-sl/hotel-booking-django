import React, { useState, useMemo } from 'react';
import { Hero3DScene } from '../components/3d/Hero3DScene';
import { Interactive3DGlobe } from '../components/3d/Interactive3DGlobe';
import { HeroSearch } from '../components/HeroSearch';
import { HotelCard } from '../components/HotelCard';
import { PopularDestinations } from '../components/PopularDestinations';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { SpecialOffers } from '../components/SpecialOffers';
import { Testimonials } from '../components/Testimonials';
import { Newsletter } from '../components/Newsletter';
import { HOTELS_DATA } from '../data/hotels';
import type { Hotel, SearchQuery } from '../types';
import { Filter, SlidersHorizontal, Sparkles, MapPin, Building, Globe, Star } from 'lucide-react';

interface HomePageProps {
  onOpenBooking: (hotel: Hotel, roomId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenBooking }) => {
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'rating'>('featured');
  const [minRating, setMinRating] = useState<number>(0);

  // Filtered & Sorted hotels
  const filteredHotels = useMemo(() => {
    let result = [...HOTELS_DATA];

    if (selectedCityFilter !== 'All') {
      result = result.filter(h => 
        h.city.toLowerCase() === selectedCityFilter.toLowerCase() ||
        h.location.toLowerCase().includes(selectedCityFilter.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(h => 
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q)
      );
    }

    if (minRating > 0) {
      result = result.filter(h => h.stars >= minRating);
    }

    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCityFilter, searchQuery, sortBy, minRating]);

  const handleHeroSearch = (query: SearchQuery) => {
    if (query.destination) {
      setSearchQuery(query.destination);
    }
    const section = document.getElementById('featured-hotels');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGlobeSelectDestination = (destId: string) => {
    // destId is e.g. "dubai", "paris", "tokyo", etc.
    const cityMap: Record<string, string> = {
      dubai: 'Dubai',
      paris: 'Paris',
      istanbul: 'Istanbul',
      tokyo: 'Tokyo',
      newyork: 'New York',
      maldives: 'Maldives',
    };
    const city = cityMap[destId] || 'All';
    setSelectedCityFilter(city);
    const section = document.getElementById('featured-hotels');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cities = ['All', 'Dubai', 'Maldives', 'Paris', 'Tokyo', 'New York', 'Istanbul'];

  return (
    <div className="relative min-h-screen bg-[#050714] text-slate-100 overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* 1. CINEMATIC 3D HERO SECTION */}
      <section className="relative min-h-[92vh] flex flex-col justify-between pt-24 pb-12 overflow-hidden border-b border-slate-800/60">
        {/* Background 3D Architectural Scene */}
        <div className="absolute inset-0 z-0">
          <Hero3DScene />
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050714] via-transparent to-[#050714]/60 pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#050714]/80 to-transparent pointer-events-none" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
          <div className="max-w-3xl">
            {/* Super luxury badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-xl mb-6 shadow-lg shadow-amber-500/10 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AURA 3D WebGL Hospitality Experience</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight text-white leading-[1.08] drop-shadow-2xl">
              Discover Your <br />
              <span className="gold-gradient-text">Perfect Stay</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl drop-shadow-md">
              Experience exceptional hotels and unforgettable destinations. Explore real-time 3D architectural sanctuaries and reserve your private presidential suite with bespoke concierge service.
            </p>

            {/* Key Value Points */}
            <div className="flex flex-wrap items-center gap-6 mt-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Real-Time 3D Exploration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Best Luxury Price Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Direct VIP Butler Line</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Glassmorphism Hero Search */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
          <HeroSearch onSearch={handleHeroSearch} />
        </div>
      </section>

      {/* 2. FEATURED HOTELS DISCOVERY SECTION */}
      <section id="featured-hotels" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-bold mb-2">
              <Building className="w-4 h-4" /> Curated Portfolios
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Featured Luxury Hotels & Resorts
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Hover over cards for 3D cursor-tracking parallax tilt. Each retreat is hand-vetted for architectural distinction and world-class hospitality.
            </p>
          </div>

          {/* Controls: Sorting */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-slate-900 text-white">Featured</option>
                <option value="rating" className="bg-slate-900 text-white">Highest Rated</option>
                <option value="priceAsc" className="bg-slate-900 text-white">Price: Low to High</option>
                <option value="priceDesc" className="bg-slate-900 text-white">Price: High to Low</option>
              </select>
            </div>

            <div className="flex items-center gap-1 px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>5 Stars:</span>
              <button
                type="button"
                onClick={() => setMinRating(minRating === 5 ? 0 : 5)}
                className={`ml-1 px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  minRating === 5 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {minRating === 5 ? 'Active' : 'All'}
              </button>
            </div>
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <Filter className="w-4 h-4 text-amber-400 shrink-0 mr-1" />
          {cities.map((city) => {
            const isActive = selectedCityFilter === city;
            return (
              <button
                key={city}
                onClick={() => setSelectedCityFilter(city)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {city}
              </button>
            );
          })}

          {selectedCityFilter !== 'All' && (
            <button
              onClick={() => setSelectedCityFilter('All')}
              className="text-xs text-amber-400/80 hover:text-amber-300 underline underline-offset-4 ml-2 whitespace-nowrap cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Hotels Grid with 3D Tilt Cards */}
        {filteredHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onSelect={(h) => onOpenBooking(h)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800">
            <Building className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-white">No Hotels Found</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any sanctuaries matching &quot;{selectedCityFilter}&quot; with your criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCityFilter('All');
                setSearchQuery('');
                setMinRating(0);
              }}
              className="mt-4 px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors cursor-pointer"
            >
              View All 6 Worldwide Resorts
            </button>
          </div>
        )}
      </section>

      {/* 3. INTERACTIVE 3D GLOBE EXPERIENCE SECTION */}
      <section id="3d-globe" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400 font-bold mb-2">
            <Globe className="w-4 h-4" /> Spatial WebGL Engine
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-white">
            Interactive 3D World Tour
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Drag the 3D globe to navigate between global destinations. Click on any coordinates marker (Dubai, Paris, Istanbul, Tokyo, New York, Maldives) for live telemetry and instant hotel discovery.
          </p>
        </div>

        {/* 3D Globe Canvas Container */}
        <div className="h-[650px] w-full rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl relative">
          <Interactive3DGlobe onSelectDestination={handleGlobeSelectDestination} />
        </div>
      </section>

      {/* 4. POPULAR DESTINATIONS SECTION */}
      <section id="destinations" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <PopularDestinations onSelectCity={(city) => {
          setSelectedCityFilter(city);
          const el = document.getElementById('featured-hotels');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }} />
      </section>

      {/* 5. SPECIAL OFFERS SECTION */}
      <section id="offers" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <SpecialOffers onApplyOffer={(hotelId) => {
          const hotel = HOTELS_DATA.find(h => h.id === hotelId) || HOTELS_DATA[0];
          onOpenBooking(hotel);
        }} />
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <WhyChooseUs />
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <Testimonials />
      </section>

      {/* 8. VIP NEWSLETTER CLUB */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <Newsletter />
      </section>

    </div>
  );
};
