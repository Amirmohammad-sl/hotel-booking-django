import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { HomePage } from './pages/HomePage';
import { HotelDetailPage } from './pages/HotelDetailPage';
import { HOTELS_DATA } from './data/hotels';
import type { Hotel } from './types';

// Scroll to top helper on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(HOTELS_DATA[0]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(undefined);

  const handleOpenBooking = (hotel?: Hotel, roomId?: string) => {
    setSelectedHotel(hotel || HOTELS_DATA[0]);
    setSelectedRoomId(roomId);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#050714] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
        
        {/* Floating Global Navbar */}
        <Navbar onOpenBookingModal={() => handleOpenBooking(HOTELS_DATA[0])} />

        {/* Main Routed Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onOpenBooking={handleOpenBooking} />} />
            <Route path="/hotel/:id" element={<HotelDetailPage onOpenBooking={handleOpenBooking} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Global Interactive Booking & Payment Modal */}
        <BookingModal
          isOpen={isBookingOpen}
          onClose={handleCloseBooking}
          hotel={selectedHotel}
          initialRoomId={selectedRoomId}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
