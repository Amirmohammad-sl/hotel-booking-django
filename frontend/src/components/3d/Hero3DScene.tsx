import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(13, 11, 16);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 1.8);
    sunLight.position.set(16, 25, 14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const cyanPointLight = new THREE.PointLight(0x38bdf8, 2.5, 30);
    cyanPointLight.position.set(-8, 8, 6);
    scene.add(cyanPointLight);

    const goldenPointLight = new THREE.PointLight(0xf59e0b, 3.2, 30);
    goldenPointLight.position.set(7, 4, -6);
    scene.add(goldenPointLight);

    // 3. Hotel Architectural Complex Group
    const hotelGroup = new THREE.Group();
    scene.add(hotelGroup);

    // Island / Futuristic Podium
    const baseGeo = new THREE.CylinderGeometry(8.5, 9.6, 0.9, 36);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.25,
      metalness: 0.55
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.45;
    baseMesh.receiveShadow = true;
    hotelGroup.add(baseMesh);

    // Glowing Neon Rings
    const ringGeo = new THREE.TorusGeometry(8.7, 0.09, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.03;
    hotelGroup.add(ringMesh);

    // Grand Tower 1 (Ultra Luxury High-Rise)
    const tower1Geo = new THREE.BoxGeometry(3.8, 8.2, 3.8);
    const tower1Mat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.15,
      metalness: 0.65
    });
    const tower1 = new THREE.Mesh(tower1Geo, tower1Mat);
    tower1.position.set(-1.4, 4.1, 0);
    tower1.castShadow = true;
    hotelGroup.add(tower1);

    // Terraced Luxury Wing (Tower 2)
    const tower2Geo = new THREE.BoxGeometry(4.4, 4.8, 3.2);
    const tower2Mat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.25,
      metalness: 0.55
    });
    const tower2 = new THREE.Mesh(tower2Geo, tower2Mat);
    tower2.position.set(2.4, 2.4, 0.8);
    tower2.castShadow = true;
    hotelGroup.add(tower2);

    // Glowing Golden & Cyan Windows Grid
    const winWarm = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const winCool = new THREE.MeshBasicMaterial({ color: 0x7dd3fc });

    for (let floor = 0; floor < 7; floor++) {
      for (let col = 0; col < 3; col++) {
        const winGeo = new THREE.PlaneGeometry(0.65, 0.55);
        const isWarm = (floor + col) % 2 === 0;
        const winFront = new THREE.Mesh(winGeo, isWarm ? winWarm : winCool);
        winFront.position.set(-2.6 + col * 1.25, 1.2 + floor * 1.0, 1.91);
        hotelGroup.add(winFront);

        const winBack = winFront.clone();
        winBack.position.z = -1.91;
        winBack.rotation.y = Math.PI;
        hotelGroup.add(winBack);
      }
    }

    // Rooftop Infinity Pool (Cyan Translucent Glass)
    const poolGeo = new THREE.BoxGeometry(3.8, 0.25, 2.6);
    const poolMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.05,
      metalness: 0.9,
      transparent: true,
      opacity: 0.9
    });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.position.set(2.4, 4.9, 0.8);
    hotelGroup.add(pool);

    // Sky Penthouse VIP Lounge
    const loungeGeo = new THREE.BoxGeometry(2.6, 1.6, 2.6);
    const loungeMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      transmission: 0.75,
      opacity: 0.95,
      transparent: true,
      roughness: 0.1,
      ior: 1.5
    });
    const lounge = new THREE.Mesh(loungeGeo, loungeMat);
    lounge.position.set(-1.4, 9.0, 0);
    hotelGroup.add(lounge);

    // Spire & Blinking Beacon
    const spireGeo = new THREE.CylinderGeometry(0.04, 0.16, 2.8, 12);
    const spireMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95 });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.set(-1.4, 11.0, 0);
    hotelGroup.add(spire);

    const beaconGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(-1.4, 12.4, 0);
    hotelGroup.add(beacon);

    // Floating Golden Diamond Particles
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    const diaGeo = new THREE.OctahedronGeometry(0.26, 0);
    const diaMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.15 });

    const particles: { mesh: THREE.Mesh; speed: number; initialY: number }[] = [];
    for (let i = 0; i < 28; i++) {
      const p = new THREE.Mesh(diaGeo, diaMat);
      const angle = (i / 28) * Math.PI * 2;
      const radius = 6.5 + Math.random() * 4.0;
      p.position.set(
        Math.cos(angle) * radius,
        2 + Math.random() * 9,
        Math.sin(angle) * radius
      );
      particleGroup.add(p);
      particles.push({
        mesh: p,
        speed: 0.008 + Math.random() * 0.012,
        initialY: p.position.y
      });
    }

    // 4. Mouse Tracking & Drag Orbit Support
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        const deltaY = e.clientY - previousMouseY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.005;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
      } else {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotationY = mouseX * 0.45;
        targetRotationX = mouseY * 0.25;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
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

    // 5. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      beaconMat.color.setHSL(0, 0.95, 0.4 + 0.35 * Math.sin(time * 6));

      particles.forEach((p, idx) => {
        p.mesh.rotation.x += p.speed;
        p.mesh.rotation.y += p.speed * 1.5;
        p.mesh.position.y = p.initialY + Math.sin(time * 2 + idx) * 0.35;
      });

      // Smooth inertia rotation
      hotelGroup.rotation.y += (targetRotationY - hotelGroup.rotation.y) * 0.05 + 0.002;
      hotelGroup.rotation.x += (targetRotationX - hotelGroup.rotation.x) * 0.05;

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
  }, []);

  return (
    <div className="relative w-full h-[460px] md:h-[520px] cursor-grab active:cursor-grabbing select-none flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs text-slate-300 pointer-events-none flex items-center gap-2 shadow-xl">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>Drag to explore 3D luxury resort architecture</span>
      </div>
    </div>
  );
};
