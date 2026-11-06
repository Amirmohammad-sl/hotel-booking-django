import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { POPULAR_DESTINATIONS } from '../../data/hotels';
import type { Destination } from '../../types';
import { MapPin, Navigation, Sparkles } from 'lucide-react';

interface Interactive3DGlobeProps {
  onSelectDestination?: (dest: Destination) => void;
}

export const Interactive3DGlobe: React.FC<Interactive3DGlobeProps> = ({ onSelectDestination }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDest, setActiveDest] = useState<Destination>(POPULAR_DESTINATIONS[0]);
  const [hoveredDest, setHoveredDest] = useState<Destination | null>(null);

  // Targets for smooth rotation
  const targetRotation = useRef<{ x: number; y: number }>({ x: 0.3, y: -0.8 });

  // Convert lat/long to 3D Cartesian coords on sphere
  const latLongToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  const focusDestination = (dest: Destination) => {
    setActiveDest(dest);
    // Calculate target rotation to face this destination towards camera (+Z)
    const lat = dest.coordinates.lat;
    const lon = dest.coordinates.lng;
    targetRotation.current.y = -(lon + 90) * (Math.PI / 180);
    targetRotation.current.x = (lat - 15) * (Math.PI / 180);
    if (onSelectDestination) {
      onSelectDestination(dest);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 520;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 320);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const globeRadius = 100;

    // Base Sphere (Obsidian Navy Glass)
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x0a1226,
      roughness: 0.25,
      metalness: 0.65,
      emissive: 0x050814,
      emissiveIntensity: 0.5
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphereMesh);

    // Glowing Atmospheric Outer Rim
    const atmosphereGeo = new THREE.SphereGeometry(globeRadius * 1.15, 64, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // Latitude & Longitude Wireframe Lines
    const wireGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(globeRadius * 1.002, 24, 24));
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x1e3a8a,
      transparent: true,
      opacity: 0.35
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    globeGroup.add(wireMesh);

    // 3. Glowing Location Pins on Globe Surface
    const markerPins: { mesh: THREE.Mesh; dest: Destination }[] = [];
    const pinGeo = new THREE.SphereGeometry(2.4, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });

    POPULAR_DESTINATIONS.forEach((dest) => {
      const pos = latLongToVector3(dest.coordinates.lat, dest.coordinates.lng, globeRadius);

      // Pin stem
      const stemGeo = new THREE.CylinderGeometry(0.4, 0.4, 6, 8);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      
      const pinPos = pos.clone().normalize().multiplyScalar(globeRadius + 3);
      stem.position.copy(pinPos);
      stem.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      globeGroup.add(stem);

      // Glowing Pin Head
      const pinHead = new THREE.Mesh(pinGeo, pinMat.clone());
      const headPos = pos.clone().normalize().multiplyScalar(globeRadius + 6);
      pinHead.position.copy(headPos);
      globeGroup.add(pinHead);

      // Pulsing Wave Ring around Pin
      const haloGeo = new THREE.RingGeometry(3, 4.5, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(pos.clone().normalize().multiplyScalar(globeRadius + 0.5));
      halo.lookAt(pos.clone().multiplyScalar(2));
      globeGroup.add(halo);

      markerPins.push({ mesh: pinHead, dest });
    });

    // 4. Floating Luxury Diamond Dust surrounding Globe
    const dustCount = 450;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount * 3; i += 3) {
      const radius = 130 + Math.random() * 80;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      dustPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      dustPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      dustPositions[i + 2] = radius * Math.cos(phi);
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 2.2,
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const dustField = new THREE.Points(dustGeo, dustMat);
    scene.add(dustField);

    // 5. Drag & Touch Interaction
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      targetRotation.current.y += dx * 0.008;
      targetRotation.current.x += dy * 0.008;
      targetRotation.current.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetRotation.current.x));
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    window.addEventListener('resize', onResize);

    // 6. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth inertia rotation towards target
      if (!isDragging) {
        targetRotation.current.y += 0.002; // subtle continuous idle spin
      }
      globeGroup.rotation.y += (targetRotation.current.y - globeGroup.rotation.y) * 0.06;
      globeGroup.rotation.x += (targetRotation.current.x - globeGroup.rotation.x) * 0.06;

      // Pulse pin colors
      markerPins.forEach((pin, i) => {
        const mat = pin.mesh.material as THREE.MeshBasicMaterial;
        const isCurrent = pin.dest.id === activeDest.id;
        const scale = isCurrent ? 1.4 + 0.3 * Math.sin(time * 5) : 1.0;
        pin.mesh.scale.set(scale, scale, scale);
        mat.color.set(isCurrent ? 0xf59e0b : 0x38bdf8);
      });

      dustField.rotation.y = time * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, [activeDest]);

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl p-6 md:p-10 glass-panel-glow overflow-hidden my-12">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Interactive Control Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Destination Navigator</span>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
              Explore Luxury <br />
              <span className="gold-gradient-text">Across the Globe</span>
            </h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Rotate the interactive 3D globe to navigate our world-class hotels in premier international travel hubs. Click any capital to fly the camera directly there.
            </p>
          </div>

          {/* Quick Destination Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            {POPULAR_DESTINATIONS.map((dest) => {
              const isSelected = dest.id === activeDest.id;
              return (
                <button
                  key={dest.id}
                  onClick={() => focusDestination(dest)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 scale-105'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-white/5'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{dest.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Destination Card Preview */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-4 transition-all">
            <img
              src={activeDest.image}
              alt={activeDest.name}
              className="w-20 h-20 rounded-xl object-cover shadow-md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-lg text-white truncate">{activeDest.name}</h4>
                <span className="text-xs text-cyan-400 font-semibold">{activeDest.hotelCount} Hotels</span>
              </div>
              <p className="text-xs text-slate-400 truncate">{activeDest.country}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">From <strong className="text-amber-400 font-bold">${activeDest.startingPrice}</strong> / night</span>
                <button
                  onClick={() => onSelectDestination && onSelectDestination(activeDest)}
                  className="text-xs text-white bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1 rounded-lg font-medium transition-colors"
                >
                  View Hotels
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 3D Globe WebGL Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          <div
            ref={containerRef}
            className="w-full h-[400px] md:h-[480px] cursor-grab active:cursor-grabbing select-none"
          />
          <div className="absolute bottom-2 text-center text-xs text-slate-400 pointer-events-none flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
            <Navigation className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Click & drag to spin the 3D globe freely</span>
          </div>
        </div>
      </div>
    </div>
  );
};
