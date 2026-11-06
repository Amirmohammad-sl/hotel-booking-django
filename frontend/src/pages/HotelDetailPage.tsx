import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { HOTELS_DATA } from '../data/hotels';
import type { Hotel, Room } from '../types';
import {
  Star,
  MapPin,
  Share2,
  Heart,
  ArrowLeft,
  Check,
  Calendar,
  Users,
  ShieldCheck,
  Sparkles,
  Maximize2,
  X,
  Compass,
  Coffee,
  Wifi,
  Waves,
  Utensils,
  Sun,
  Moon,
  Sunset
} from 'lucide-react';

interface HotelDetailPageProps {
  onOpenBooking: (hotel: Hotel, roomId?: string) => void;
}

export const HotelDetailPage: React.FC<HotelDetailPageProps> = ({ onOpenBooking }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hotel = HOTELS_DATA.find((h) => h.id === id) || HOTELS_DATA[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room>(hotel.rooms[0]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Reservation sidebar states
  const [checkIn, setCheckIn] = useState('2026-12-10');
  const [checkOut, setCheckOut] = useState('2026-12-15');
  const [guestsCount, setGuestsCount] = useState(2);

  // 3D Virtual Suite Tour Canvas
  const suiteCanvasRef = useRef<HTMLCanvasElement>(null);
  const [lightingMode, setLightingMode] = useState<'day' | 'sunset' | 'night'>('night');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (hotel.rooms.length > 0) {
      setSelectedRoom(hotel.rooms[0]);
    }
  }, [id, hotel]);

  // Setup 3D Suite Viewer
  useEffect(() => {
    const canvas = suiteCanvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(
      lightingMode === 'night' ? 0x050714 : lightingMode === 'sunset' ? 0x1a0f1d : 0x0d1829
    );

    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 3.5, 7);
    camera.lookAt(0, 0.5, 0);

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(
      lightingMode === 'night' ? 0x1e293b : lightingMode === 'sunset' ? 0xff7744 : 0x93c5fd,
      lightingMode === 'night' ? 0.6 : 0.8
    );
    scene.add(ambientLight);

    // Directional Window Light
    const windowLight = new THREE.DirectionalLight(
      lightingMode === 'night' ? 0x38bdf8 : lightingMode === 'sunset' ? 0xfb923c : 0xffffff,
      lightingMode === 'night' ? 1.0 : 2.0
    );
    windowLight.position.set(-6, 5, -2);
    windowLight.castShadow = true;
    scene.add(windowLight);

    // Warm Bedside Lamps (Point Lights)
    const lampColor = lightingMode === 'night' ? 0xf59e0b : 0xfef08a;
    const lamp1 = new THREE.PointLight(lampColor, 2.5, 8);
    lamp1.position.set(-2.2, 1.4, 0.2);
    scene.add(lamp1);

    const lamp2 = new THREE.PointLight(lampColor, 2.5, 8);
    lamp2.position.set(2.2, 1.4, 0.2);
    scene.add(lamp2);

    // Suite Room Interior Construction
    const roomGroup = new THREE.Group();

    // Floor (Dark polished hardwood)
    const floorGeo = new THREE.PlaneGeometry(10, 8);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111625,
      roughness: 0.25,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Back Wall
    const backWallGeo = new THREE.PlaneGeometry(10, 5);
    const backWallMat = new THREE.MeshStandardMaterial({ color: 0x0c1020, roughness: 0.8 });
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, 2.5, -3.5);
    backWall.receiveShadow = true;
    roomGroup.add(backWall);

    // Large Panoramic Window on Left Wall
    const windowFrameGeo = new THREE.BoxGeometry(0.1, 3.8, 6);
    const windowFrameMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: lightingMode === 'night' ? 0.3 : 0.8,
      roughness: 0.1,
    });
    const windowFrame = new THREE.Mesh(windowFrameGeo, windowFrameMat);
    windowFrame.position.set(-4.9, 2.2, 0);
    roomGroup.add(windowFrame);

    // King Size Luxury Bed
    const bedBaseGeo = new THREE.BoxGeometry(3.2, 0.5, 3.6);
    const bedBaseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const bedBase = new THREE.Mesh(bedBaseGeo, bedBaseMat);
    bedBase.position.set(0, 0.25, 0);
    bedBase.castShadow = true;
    bedBase.receiveShadow = true;
    roomGroup.add(bedBase);

    // Mattress (Crisp White Luxury Linen)
    const mattressGeo = new THREE.BoxGeometry(3.0, 0.45, 3.4);
    const mattressMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
    const mattress = new THREE.Mesh(mattressGeo, mattressMat);
    mattress.position.set(0, 0.65, 0);
    mattress.castShadow = true;
    roomGroup.add(mattress);

    // Royal Gold Duvet Runner
    const runnerGeo = new THREE.BoxGeometry(3.05, 0.46, 1.2);
    const runnerMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.2,
    });
    const runner = new THREE.Mesh(runnerGeo, runnerMat);
    runner.position.set(0, 0.66, 0.8);
    roomGroup.add(runner);

    // Velvet Headboard with Gold Trim
    const headboardGeo = new THREE.BoxGeometry(3.6, 2.2, 0.25);
    const headboardMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.5,
      metalness: 0.1,
    });
    const headboard = new THREE.Mesh(headboardGeo, headboardMat);
    headboard.position.set(0, 1.4, -1.8);
    headboard.castShadow = true;
    roomGroup.add(headboard);

    // Two Plush Pillows
    [-0.8, 0.8].forEach((xPos) => {
      const pillowGeo = new THREE.BoxGeometry(0.9, 0.2, 0.6);
      const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
      const pillow = new THREE.Mesh(pillowGeo, pillowMat);
      pillow.position.set(xPos, 0.95, -1.1);
      pillow.rotation.x = -0.2;
      roomGroup.add(pillow);
    });

    // Bedside Nightstands
    [-2.2, 2.2].forEach((xPos) => {
      const standGeo = new THREE.BoxGeometry(0.8, 0.7, 0.8);
      const standMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
      const stand = new THREE.Mesh(standGeo, standMat);
      stand.position.set(xPos, 0.35, -1.4);
      stand.castShadow = true;
      roomGroup.add(stand);

      // Nightstand Lamp
      const lampStemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8);
      const lampStemMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 });
      const stem = new THREE.Mesh(lampStemGeo, lampStemMat);
      stem.position.set(xPos, 0.9, -1.4);
      roomGroup.add(stem);

      const shadeGeo = new THREE.ConeGeometry(0.25, 0.35, 12, 1, true);
      const shadeMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.8,
        side: THREE.DoubleSide,
      });
      const shade = new THREE.Mesh(shadeGeo, shadeMat);
      shade.position.set(xPos, 1.2, -1.4);
      roomGroup.add(shade);
    });

    // Designer Lounge Chair
    const chairGeo = new THREE.BoxGeometry(1.1, 0.8, 1.1);
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 });
    const chair = new THREE.Mesh(chairGeo, chairMat);
    chair.position.set(-2.4, 0.4, 1.6);
    chair.rotation.y = 0.5;
    chair.castShadow = true;
    roomGroup.add(chair);

    // Luxury Carpet Rug
    const rugGeo = new THREE.BoxGeometry(4.2, 0.02, 4.6);
    const rugMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.position.set(0, 0.01, 0.4);
    roomGroup.add(rug);

    scene.add(roomGroup);

    // Interactive Orbit Handling
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotY = 0;
    let rotX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      rotY += deltaX * 0.005;
      rotX += deltaY * 0.005;
      rotX = Math.max(-0.4, Math.min(0.6, rotX));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      // Subtle breathing camera movement
      if (!isDragging) {
        rotY += 0.0012;
      }

      const radius = 6.8;
      camera.position.x = Math.sin(rotY) * radius * Math.cos(rotX);
      camera.position.z = Math.cos(rotY) * radius * Math.cos(rotX);
      camera.position.y = 2.5 + Math.sin(rotX) * 2.5;
      camera.lookAt(0, 0.8, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!canvas) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [lightingMode]);

  // Calculations for sticky booking card
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffDays = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)));
  const currentRoomPrice = selectedRoom ? selectedRoom.pricePerNight : hotel.pricePerNight;
  const totalBasePrice = currentRoomPrice * diffDays;
  const taxesFee = Math.round(totalBasePrice * 0.12);
  const finalTotal = totalBasePrice + taxesFee;

  return (
    <div className="min-h-screen bg-[#050714] text-slate-100 pt-24 pb-20 selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* 1. TOP BREADCRUMB & ACTIONS BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-slate-800">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Luxury Portfolios
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isFavorite
                  ? 'border-rose-500/50 bg-rose-500/20 text-rose-400'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
              title="Add to Favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('VIP Link copied to clipboard!');
              }}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Share Sanctuary"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. HOTEL HERO HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
                AURA Heritage Collection
              </span>
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">
              {hotel.name}
            </h1>

            <div className="flex items-center gap-2 text-slate-400 text-sm mt-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{hotel.location} · {hotel.country}</span>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl self-start md:self-end">
            <div className="text-right">
              <div className="text-sm font-bold text-white">Exceptional 5-Star</div>
              <div className="text-xs text-slate-400">{hotel.reviewCount} verified international reviews</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-serif font-black text-slate-950 text-xl shadow-lg shadow-amber-500/20">
              {hotel.rating}
            </div>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE HIGH-RES PHOTO GALLERY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[460px]">
          {/* Main big image */}
          <div
            onClick={() => setIsLightboxOpen(true)}
            className="md:col-span-2 relative rounded-3xl overflow-hidden group cursor-pointer border border-slate-800"
          >
            <img
              src={hotel.gallery[activeImageIndex] || hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className="text-xs font-medium text-slate-200 bg-slate-950/80 px-3 py-1.5 rounded-full border border-slate-700">
                Click to expand gallery ({hotel.gallery.length} High-Res Photos)
              </span>
              <div className="p-2 rounded-full bg-slate-900/80 text-amber-400">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Thumbnails grid */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4 h-full">
            {hotel.gallery.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer border transition-all ${
                  activeImageIndex === idx
                    ? 'border-amber-400 ring-2 ring-amber-400/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <img
                  src={img}
                  alt={`${hotel.name} view ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTENT & STICKY BOOKING CARD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT 2 COLUMNS: Overview, 3D Suite Tour, Rooms, Amenities, Reviews */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Overview & Highlights */}
            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" /> Sanctuary Overview
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                {hotel.description}
              </p>

              {/* Curated Highlights Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {hotel.highlights.map((hl, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200"
                  >
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-medium">{hl}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 3D VIRTUAL SUITE TOUR EMBED */}
            <section className="p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400 font-bold mb-1">
                    <Sparkles className="w-4 h-4" /> Interactive WebGL Experience
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    360° Virtual Suite Inspection
                  </h3>
                  <p className="text-xs text-slate-400">
                    Click & drag to rotate camera in 360°. Switch lighting mode below.
                  </p>
                </div>

                {/* Lighting Switcher */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
                  <button
                    onClick={() => setLightingMode('day')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      lightingMode === 'day' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" /> Day
                  </button>
                  <button
                    onClick={() => setLightingMode('sunset')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      lightingMode === 'sunset' ? 'bg-orange-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sunset className="w-3.5 h-3.5" /> Sunset
                  </button>
                  <button
                    onClick={() => setLightingMode('night')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      lightingMode === 'night' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" /> Night
                  </button>
                </div>
              </div>

              {/* WebGL Canvas */}
              <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-800 relative bg-[#050714]">
                <canvas ref={suiteCanvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 text-[11px] text-slate-300 pointer-events-none">
                  🖱️ Drag to rotate 3D suite
                </div>
              </div>
            </section>

            {/* AVAILABLE ROOM TYPES */}
            <section id="room-selection" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white">
                    Available Suites & Residences
                  </h2>
                  <p className="text-xs text-slate-400">All suites include 24/7 dedicated butler & private check-in</p>
                </div>
              </div>

              <div className="space-y-4">
                {hotel.rooms.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  return (
                    <div
                      key={room.id}
                      className={`p-6 rounded-3xl border transition-all ${
                        isSelected
                          ? 'border-amber-400/80 bg-gradient-to-r from-amber-500/10 to-transparent shadow-xl shadow-amber-500/5'
                          : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                          <img
                            src={room.image}
                            alt={room.name}
                            className="w-full sm:w-36 h-28 object-cover rounded-2xl shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-serif font-bold text-white">{room.name}</h3>
                              {isSelected && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                                  Current Choice
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              {room.size} · {room.bedType} · {room.view} · Up to {room.maxGuests} Guests
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {room.amenities.map((am, i) => (
                                <span
                                  key={i}
                                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300"
                                >
                                  {am}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="text-right flex md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800 shrink-0">
                          <div>
                            <span className="text-2xl font-serif font-black text-amber-400">
                              ${room.pricePerNight.toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-400"> / night</span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedRoom(room);
                              onOpenBooking(hotel, room.id);
                            }}
                            className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                          >
                            Reserve This Suite
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* AMENITIES SECTION */}
            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-white">
                World-Class Amenities & Privileges
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {hotel.amenities.map((amenity, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center gap-3 text-sm text-slate-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* GUEST REVIEWS */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white">
                    Verified Guest Experiences
                  </h2>
                  <p className="text-xs text-slate-400">Reviews verified by international diplomatic booking registry</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotel.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white text-sm">{rev.author}</h4>
                        <span className="text-[11px] text-slate-400">{rev.country} · {rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{rev.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: STICKY BOOKING SUMMARY PANEL */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 p-6 rounded-3xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-2xl shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">Starting from</span>
                  <span className="text-3xl font-serif font-black text-amber-400">
                    ${currentRoomPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400"> / night</span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                    Instant Confirmation
                  </span>
                </div>
              </div>

              {/* Suite Selection Pill */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Selected Suite</span>
                <span className="text-sm font-semibold text-white block">{selectedRoom?.name || 'Grand Suite'}</span>
                <span className="text-xs text-amber-400 mt-0.5 block">{selectedRoom?.view}</span>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                  Guests Count
                </label>
                <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                  <span>{guestsCount} Adults (VIP)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setGuestsCount(Math.min(6, guestsCount + 1))}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Calculation Breakdown */}
              <div className="text-xs space-y-2 border-t border-slate-800 pt-4 text-slate-300">
                <div className="flex justify-between">
                  <span>${currentRoomPrice.toLocaleString()} × {diffDays} nights</span>
                  <span className="font-semibold text-white">${totalBasePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Hospitality & Resort Surcharges (12%)</span>
                  <span>+${taxesFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>VIP Concierge Privileges</span>
                  <span>Complimentary</span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="font-semibold text-white text-sm">Estimated Total</span>
                  <span className="text-2xl font-serif font-black text-amber-400">
                    ${finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => onOpenBooking(hotel, selectedRoom?.id)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                Reserve Suite Now
              </button>

              <div className="space-y-2 text-[11px] text-slate-400 text-center">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" /> Best Luxury Rate Guarantee
                </div>
                <p>No cancellation fees up to 48 hours before check-in date.</p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-serif font-bold text-white">
              {hotel.name} — Photo {activeImageIndex + 1} of {hotel.gallery.length}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center justify-center my-auto max-h-[75vh]">
            <img
              src={hotel.gallery[activeImageIndex]}
              alt="Enlarged view"
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>

          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
            {hotel.gallery.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="thumb"
                onClick={() => setActiveImageIndex(i)}
                className={`w-16 h-12 object-cover rounded-lg cursor-pointer border transition-all ${
                  activeImageIndex === i ? 'border-amber-400 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
