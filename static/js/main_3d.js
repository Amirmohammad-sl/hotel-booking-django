/**
 * ASAYESH HOTEL - High-End 3D WebGL Spatial Experience
 * Built with Three.js (Interactive Particle Galaxy Sphere & Wave Dynamics)
 * Modern Luxury Dark Glassmorphism
 */

(function () {
    'use strict';

    // -------------------------------------------------------------
    // 1. THREE.JS INTERACTIVE 3D PARTICLE GALAXY & ORBITAL RINGS
    // -------------------------------------------------------------
    function init3DParticleGalaxy() {
        const canvas = document.getElementById('webgl-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        // Scene & Fog
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050714, 0.0018);

        // Camera
        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.set(0, 0, 520);

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Group container for all 3D cosmos elements
        const cosmosGroup = new THREE.Group();
        scene.add(cosmosGroup);

        // A) 3D Particle Sphere (Core Celestial Hotel Nexus)
        const particleCount = 7500;
        const sphereRadius = 180;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const originalPositions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const colorCore = new THREE.Color('#38bdf8');   // Electric Sky Blue
        const colorMid = new THREE.Color('#818cf8');    // Royal Indigo
        const colorAccent = new THREE.Color('#f59e0b'); // Golden Champagne
        const colorViolet = new THREE.Color('#c084fc'); // Neon Violet

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Golden spiral distribution on sphere surface
            const phi = Math.acos(-1 + (2 * i) / particleCount);
            const theta = Math.sqrt(particleCount * Math.PI) * phi;

            // Subtle depth variation
            const r = sphereRadius + (Math.random() - 0.5) * 35;

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            originalPositions[i3] = x;
            originalPositions[i3 + 1] = y;
            originalPositions[i3 + 2] = z;

            // Blended cosmic gradient
            const ratio = Math.random();
            let mixedColor;
            if (ratio < 0.4) {
                mixedColor = colorCore.clone().lerp(colorMid, ratio / 0.4);
            } else if (ratio < 0.8) {
                mixedColor = colorMid.clone().lerp(colorViolet, (ratio - 0.4) / 0.4);
            } else {
                mixedColor = colorViolet.clone().lerp(colorAccent, (ratio - 0.8) / 0.2);
            }

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create round glowing star texture programmatically
        function createStarTexture() {
            const size = 64;
            const canvas2 = document.createElement('canvas');
            canvas2.width = size;
            canvas2.height = size;
            const ctx = canvas2.getContext('2d');

            const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.2, 'rgba(147, 197, 253, 0.85)');
            gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.35)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);

            const texture = new THREE.Texture(canvas2);
            texture.needsUpdate = true;
            return texture;
        }

        const particleMaterial = new THREE.PointsMaterial({
            size: 3.2,
            map: createStarTexture(),
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particleSphere = new THREE.Points(geometry, particleMaterial);
        cosmosGroup.add(particleSphere);

        // B) Orbital Halo Rings around Sphere
        function createOrbitalRing(radius, tubeRadius, particleNum, colorHex, tiltX, tiltZ) {
            const ringGeo = new THREE.BufferGeometry();
            const ringPositions = new Float32Array(particleNum * 3);
            const ringColors = new Float32Array(particleNum * 3);
            const baseColor = new THREE.Color(colorHex);

            for (let i = 0; i < particleNum; i++) {
                const i3 = i * 3;
                const angle = (i / particleNum) * Math.PI * 2;
                const spread = (Math.random() - 0.5) * tubeRadius;
                const r = radius + spread;

                ringPositions[i3] = Math.cos(angle) * r;
                ringPositions[i3 + 1] = (Math.random() - 0.5) * tubeRadius;
                ringPositions[i3 + 2] = Math.sin(angle) * r;

                ringColors[i3] = baseColor.r + (Math.random() - 0.5) * 0.15;
                ringColors[i3 + 1] = baseColor.g + (Math.random() - 0.5) * 0.15;
                ringColors[i3 + 2] = baseColor.b + (Math.random() - 0.5) * 0.15;
            }

            ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
            ringGeo.setAttribute('color', new THREE.BufferAttribute(ringColors, 3));

            const ringMat = new THREE.PointsMaterial({
                size: 2.8,
                map: createStarTexture(),
                vertexColors: true,
                transparent: true,
                opacity: 0.75,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const ring = new THREE.Points(ringGeo, ringMat);
            ring.rotation.x = tiltX;
            ring.rotation.z = tiltZ;
            return ring;
        }

        const ring1 = createOrbitalRing(260, 24, 2000, '#38bdf8', Math.PI / 3.5, Math.PI / 8);
        cosmosGroup.add(ring1);

        const ring2 = createOrbitalRing(320, 30, 2400, '#f59e0b', -Math.PI / 4, -Math.PI / 6);
        cosmosGroup.add(ring2);

        // C) Subtle ambient floating background dust
        const dustCount = 1200;
        const dustGeo = new THREE.BufferGeometry();
        const dustPos = new Float32Array(dustCount * 3);

        for (let i = 0; i < dustCount * 3; i += 3) {
            dustPos[i] = (Math.random() - 0.5) * 1400;
            dustPos[i + 1] = (Math.random() - 0.5) * 1000;
            dustPos[i + 2] = (Math.random() - 0.5) * 800;
        }

        dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
        const dustMat = new THREE.PointsMaterial({
            size: 1.8,
            map: createStarTexture(),
            color: 0x94a3b8,
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending
        });
        const dustField = new THREE.Points(dustGeo, dustMat);
        scene.add(dustField);

        // Responsive Resizing
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Mouse Parallax & Dynamic Tracking
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        let scrollY = 0;
        let targetScrollY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2);
            mouseY = (e.clientY - window.innerHeight / 2);
        });

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
        }, { passive: true });

        // Animation Loop with Wave Harmonics
        let clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            // Smooth parallax lerp
            targetX += (mouseX * 0.08 - targetX) * 0.04;
            targetY += (mouseY * 0.08 - targetY) * 0.04;
            targetScrollY += (scrollY * 0.15 - targetScrollY) * 0.05;

            // Camera movement
            camera.position.x = targetX;
            camera.position.y = -targetY - targetScrollY * 0.5;
            camera.lookAt(0, -targetScrollY * 0.5, 0);

            // Orbit & wave rotation
            cosmosGroup.rotation.y = time * 0.06;
            ring1.rotation.y = time * 0.04;
            ring2.rotation.y = -time * 0.035;

            // Modulate sphere points with subtle organic breathing waves
            const posAttr = particleSphere.geometry.attributes.position;
            const posData = posAttr.array;

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const ox = originalPositions[i3];
                const oy = originalPositions[i3 + 1];
                const oz = originalPositions[i3 + 2];

                const wave = Math.sin(time * 2.0 + (ox + oy) * 0.02) * 4.5;
                const factor = 1 + wave / sphereRadius;

                posData[i3] = ox * factor;
                posData[i3 + 1] = oy * factor;
                posData[i3 + 2] = oz * factor;
            }
            posAttr.needsUpdate = true;

            // Dust rotation
            dustField.rotation.y = time * 0.008;

            renderer.render(scene, camera);
        }
        animate();
    }

    // -------------------------------------------------------------
    // 2. 3D CARD PARALLAX TILT & IRIDESCENT GLARE PHYSICS
    // -------------------------------------------------------------
    function init3DCardTilt() {
        const cards = document.querySelectorAll('.hotel-card, .room-card, .glass-search-card, .feature-3d-box, .stat-glass-badge');

        cards.forEach((card) => {
            card.style.transformStyle = 'preserve-3d';
            card.style.transition = 'transform 0.12s ease-out, box-shadow 0.25s ease, border-color 0.25s ease';

            let glare = card.querySelector('.card-glare');
            if (!glare) {
                glare = document.createElement('div');
                glare.className = 'card-glare';
                card.appendChild(glare);
            }

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -10; // 10deg max tilt
                const rotateY = ((x - centerX) / centerX) * 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`;

                // Dynamic Glare Position
                const glareX = (x / rect.width) * 100;
                const glareY = (y / rect.height) * 100;
                glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.18) 0%, rgba(99, 102, 241, 0.08) 40%, transparent 70%)`;
                glare.style.opacity = '1';

                // Pop elements along Z axis
                const popped = card.querySelectorAll('.card-img-container, .stars-badge, .price-tag, .btn, .badge');
                popped.forEach((el) => {
                    el.style.transform = 'translateZ(24px)';
                    el.style.transition = 'transform 0.12s ease-out';
                });
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
                glare.style.opacity = '0';
                const popped = card.querySelectorAll('.card-img-container, .stars-badge, .price-tag, .btn, .badge');
                popped.forEach((el) => {
                    el.style.transform = 'translateZ(0px)';
                });
            });
        });
    }

    // -------------------------------------------------------------
    // INITIALIZATION
    // -------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', () => {
        init3DParticleGalaxy();
        init3DCardTilt();
    });
})();
