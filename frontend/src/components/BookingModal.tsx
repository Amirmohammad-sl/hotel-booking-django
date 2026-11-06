import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, ShieldCheck, CheckCircle2, Sparkles, CreditCard, Tag, Printer, Download, Clock } from 'lucide-react';
import type { Hotel, Room } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel | null;
  initialRoomId?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  hotel,
  initialRoomId
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState<string>('2026-12-10');
  const [checkOut, setCheckOut] = useState<string>('2026-12-14');
  const [guests, setGuests] = useState<number>(2);

  // Add-ons
  const [addOns, setAddOns] = useState({
    airportTransfer: false,
    michelinBreakfast: true,
    spaAccess: false,
  });

  // Guest Details
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Card details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9812');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('888');

  // Booking Confirmation Data
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    if (hotel) {
      if (initialRoomId) {
        const found = hotel.rooms.find(r => r.id === initialRoomId);
        setSelectedRoom(found || hotel.rooms[0] || null);
      } else {
        setSelectedRoom(hotel.rooms[0] || null);
      }
    }
    // Reset state on open
    if (isOpen) {
      setStep(1);
      setPromoMessage(null);
      setDiscountPercent(0);
    }
  }, [hotel, initialRoomId, isOpen]);

  if (!isOpen || !hotel) return null;

  // Calculate nights
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = Math.max(d2.getTime() - d1.getTime(), 1000 * 60 * 60 * 24);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const roomPricePerNight = selectedRoom?.pricePerNight || hotel.pricePerNight;
  const baseRoomTotal = roomPricePerNight * nights;
  
  let addOnTotal = 0;
  if (addOns.airportTransfer) addOnTotal += 280;
  if (addOns.michelinBreakfast) addOnTotal += 95 * nights * guests;
  if (addOns.spaAccess) addOnTotal += 150 * nights;

  const subtotal = baseRoomTotal + addOnTotal;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxAndLuxuryFee = Math.round((subtotal - discountAmount) * 0.12);
  const grandTotal = subtotal - discountAmount + taxAndLuxuryFee;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'AURAESCAPE25' || code === 'DUBAIROYAL30') {
      const pct = code === 'DUBAIROYAL30' ? 30 : 25;
      setDiscountPercent(pct);
      setPromoMessage({ text: `Promotional code accepted! ${pct}% luxury discount applied.`, success: true });
    } else if (code === 'AURAVIP20' || code === 'PARISROMANCE20') {
      setDiscountPercent(20);
      setPromoMessage({ text: 'VIP member code accepted! 20% discount applied.', success: true });
    } else if (code === 'TOKYOSAKURA15') {
      setDiscountPercent(15);
      setPromoMessage({ text: 'Sakura code applied! 15% discount applied.', success: true });
    } else {
      setDiscountPercent(0);
      setPromoMessage({ text: 'Invalid promo code. Use AURAESCAPE25 or AURAVIP20.', success: false });
    }
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRef = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(generatedRef);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#090d1a] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-200 my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">{hotel.name}</h3>
              <p className="text-xs text-slate-400">{hotel.location} · 5-Star Luxury Reservation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (for steps 1-3) */}
        {step < 4 && (
          <div className="grid grid-cols-3 border-b border-slate-800/80 text-xs text-center font-medium">
            <div className={`py-3 px-2 border-b-2 transition-all ${step === 1 ? 'border-amber-400 text-amber-400 bg-amber-400/5' : 'border-transparent text-slate-400'}`}>
              1. Dates & Suite
            </div>
            <div className={`py-3 px-2 border-b-2 transition-all ${step === 2 ? 'border-amber-400 text-amber-400 bg-amber-400/5' : 'border-transparent text-slate-400'}`}>
              2. Guest Info & VIP Code
            </div>
            <div className={`py-3 px-2 border-b-2 transition-all ${step === 3 ? 'border-amber-400 text-amber-400 bg-amber-400/5' : 'border-transparent text-slate-400'}`}>
              3. Review & Payment
            </div>
          </div>
        )}

        {/* Step 1: Dates & Suite Selection */}
        {step === 1 && (
          <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  Check-in Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  Check-out Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400" />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Room selection */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                Select Suite / Room ({hotel.rooms.length} Available)
              </label>
              <div className="grid grid-cols-1 gap-3">
                {hotel.rooms.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  return (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-400/80 bg-amber-500/10 shadow-lg shadow-amber-500/5'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={room.image}
                          alt={room.name}
                          className="w-20 h-16 object-cover rounded-xl shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white text-sm">{room.name}</h4>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {room.size} · {room.bedType} · {room.view}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                            {room.amenities.slice(0, 3).map((am, i) => (
                              <span key={i} className="bg-slate-800/80 px-2 py-0.5 rounded">
                                {am}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-0 text-right self-end sm:self-center shrink-0">
                        <span className="text-lg font-serif font-bold text-amber-400">
                          ${room.pricePerNight.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400"> / night</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guests count */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-amber-400" />
                <div>
                  <h5 className="text-sm font-semibold text-white">Guests Count</h5>
                  <p className="text-xs text-slate-400">Adults & VIP travelers</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="font-semibold text-white text-base w-6 text-center">{guests}</span>
                <button
                  type="button"
                  onClick={() => setGuests(Math.min(6, guests + 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Luxury Add-ons */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                Complimentary & Bespoke Add-ons
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  addOns.airportTransfer ? 'border-amber-400/60 bg-amber-500/10' : 'border-slate-800 bg-slate-900/40'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Rolls-Royce Transfer</span>
                    <input
                      type="checkbox"
                      checked={addOns.airportTransfer}
                      onChange={(e) => setAddOns({ ...addOns, airportTransfer: e.target.checked })}
                      className="accent-amber-400 rounded"
                    />
                  </div>
                  <span className="text-[11px] text-amber-400 font-medium mt-2">+$280 flat</span>
                </label>

                <label className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  addOns.michelinBreakfast ? 'border-amber-400/60 bg-amber-500/10' : 'border-slate-800 bg-slate-900/40'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Michelin Breakfast</span>
                    <input
                      type="checkbox"
                      checked={addOns.michelinBreakfast}
                      onChange={(e) => setAddOns({ ...addOns, michelinBreakfast: e.target.checked })}
                      className="accent-amber-400 rounded"
                    />
                  </div>
                  <span className="text-[11px] text-amber-400 font-medium mt-2">+$95 / guest / day</span>
                </label>

                <label className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  addOns.spaAccess ? 'border-amber-400/60 bg-amber-500/10' : 'border-slate-800 bg-slate-900/40'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">VIP Hydrothermal Spa</span>
                    <input
                      type="checkbox"
                      checked={addOns.spaAccess}
                      onChange={(e) => setAddOns({ ...addOns, spaAccess: e.target.checked })}
                      className="accent-amber-400 rounded"
                    />
                  </div>
                  <span className="text-[11px] text-amber-400 font-medium mt-2">+$150 / day</span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-800">
              <div>
                <span className="text-xs text-slate-400">Total duration: </span>
                <span className="text-sm font-semibold text-white">{nights} Nights</span>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                Continue to Guest Info →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Guest Information & Promo Code */}
        {step === 2 && (
          <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  Full Name (as in Passport) *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Amir Mohammad"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="vip@guest.com"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+98 912 000 0000"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  Country of Residence
                </label>
                <input
                  type="text"
                  defaultValue="United Arab Emirates"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                Special Requests or Dietary Requirements
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="High floor suite, late check-in, anniversary champagne setup, etc."
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Promo Code Box */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Have an Exclusive Promo Code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="e.g. AURAESCAPE25 or AURAVIP20"
                  className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white uppercase tracking-wider focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Apply Code
                </button>
              </div>
              {promoMessage && (
                <p className={`text-xs mt-2 ${promoMessage.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {promoMessage.text}
                </p>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!guestName || !guestEmail) {
                    alert('Please enter your full name and email address.');
                    return;
                  }
                  setStep(3);
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                Proceed to Payment →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Payment Simulation */}
        {step === 3 && (
          <form onSubmit={handleConfirmReservation} className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Order Summary */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h4 className="text-sm font-serif font-bold text-white border-b border-slate-800 pb-2">
                  Reservation Breakdown
                </h4>
                
                <div className="text-xs space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span>{selectedRoom?.name} ({nights} nights)</span>
                    <span className="font-semibold text-white">${baseRoomTotal.toLocaleString()}</span>
                  </div>
                  {addOns.airportTransfer && (
                    <div className="flex justify-between text-slate-400">
                      <span>Rolls-Royce Transfer</span>
                      <span>+$280</span>
                    </div>
                  )}
                  {addOns.michelinBreakfast && (
                    <div className="flex justify-between text-slate-400">
                      <span>Michelin Breakfast ({guests} guests)</span>
                      <span>+${(95 * nights * guests).toLocaleString()}</span>
                    </div>
                  )}
                  {addOns.spaAccess && (
                    <div className="flex justify-between text-slate-400">
                      <span>VIP Hydrothermal Spa</span>
                      <span>+${(150 * nights).toLocaleString()}</span>
                    </div>
                  )}
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Special Promo Discount ({discountPercent}%)</span>
                      <span>-${discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Taxes & Luxury Hospitality Surcharge (12%)</span>
                    <span>+${taxAndLuxuryFee.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">Grand Total</span>
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Best Luxury Guarantee
                    </span>
                  </div>
                  <span className="text-2xl font-serif font-black text-amber-400">
                    ${grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Input */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <CreditCard className="w-4 h-4 text-amber-400" /> Secure Card Checkout
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Expires (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Your payment details are tokenized with 256-bit bank-grade encryption. Free cancellation available up to 48 hours prior to check-in.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-700 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Authorize & Confirm Stay (${grandTotal.toLocaleString()})
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Booking Confirmation Voucher */}
        {step === 4 && (
          <div className="p-6 md:p-10 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Reservation Confirmed
              </span>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mt-1">
                Your Sanctuary Awaits
              </h3>
              <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
                A formal VIP itinerary and check-in credentials have been dispatched to <span className="text-amber-400 font-semibold">{guestEmail || 'your email'}</span>.
              </p>
            </div>

            {/* Printable Voucher Card */}
            <div className="max-w-xl mx-auto p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 text-left relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block">
                    AURA 3D VIP VOUCHER
                  </span>
                  <h4 className="font-serif font-bold text-lg text-white">{hotel.name}</h4>
                  <p className="text-xs text-slate-400">{hotel.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 block">Booking Reference</span>
                  <span className="text-sm font-mono font-bold text-amber-400 tracking-wider">
                    {bookingRef}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs mb-4">
                <div>
                  <span className="text-slate-500 block">Guest Name</span>
                  <span className="text-white font-medium">{guestName || 'Amir Mohammad'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Suite Selected</span>
                  <span className="text-white font-medium">{selectedRoom?.name || 'Grand Suite'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Duration</span>
                  <span className="text-white font-medium">{nights} Nights ({guests} Guests)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Check-in</span>
                  <span className="text-white font-medium">{checkIn} (15:00)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Check-out</span>
                  <span className="text-white font-medium">{checkOut} (12:00)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Settled</span>
                  <span className="text-emerald-400 font-bold">${grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>24/7 Private Butler Dedicated Upon Arrival</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                  PAID IN FULL
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                Print Confirmation Voucher
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                Complete & Explore More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
