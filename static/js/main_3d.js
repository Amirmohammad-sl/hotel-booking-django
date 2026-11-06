/**
 * ASAYESH HOTEL - Comprehensive 3D Spatial Frontend Engine
 * Three.js WebGL + 3D Cylindrical Carousel + Parallax Physics
 * Bachelor's Degree Capstone Project
 */

// -------------------------------------------------------------
// 1. GLOBAL 3D SPATIAL BACKGROUND (Runs across the entire site)
// -------------------------------------------------------------
function initGlobal3DBackground() {
    const canvas = document.getElementById('global-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf59e0b, 1.0);
    dirLight2.position.set(-10, -10, 10);
    scene.add(dirLight2);

    // Floating 3D Geometric Luxury Polyhedra (Diamonds, Torus, Crystals)
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    const geometries = [
        new THREE.OctahedronGeometry(1.2, 0),
        new THREE.IcosahedronGeometry(1.0, 0),
        new THREE.TorusGeometry(1.4, 0.25, 16, 50),
        new THREE.TetrahedronGeometry(1.2, 0),
        new THREE.DodecahedronGeometry(1.1, 0)
    ];

    const materials = [
        new THREE.MeshPhysicalMaterial({
            color: 0x38bdf8,
            roughness: 0.1,
            metalness: 0.2,
            transmission: 0.85,
            opacity: 0.7,
            transparent: true,
            ior: 1.5
        }),
        new THREE.MeshPhysicalMaterial({
            color: 0xf59e0b,
            roughness: 0.2,
            metalness: 0.6,
            transmission: 0.6,
            opacity: 0.75,
            transparent: true
        }),
        new THREE.MeshStandardMaterial({
            color: 0x6366f1,
            roughness: 0.3,
            metalness: 0.8
        })
    ];

    const floatingObjects = [];
    const count = 18;

    for (let i = 0; i < count; i++) {
        const geo = geometries[i % geometries.length];
        const mat = materials[i % materials.length];
        const mesh = new THREE.Mesh(geo, mat);

        mesh.position.set(
            (Math.random() - 0.5) * 45,
            (Math.random() - 0.5) * 35,
            (Math.random() - 0.5) * 20 - 5
        );

        const s = 0.5 + Math.random() * 0.7;
        mesh.scale.set(s, s, s);

        objectsGroup.add(mesh);
        floatingObjects.push({
            mesh: mesh,
            rotX: (Math.random() - 0.5) * 0.015,
            rotY: (Math.random() - 0.5) * 0.015,
            rotZ: (Math.random() - 0.5) * 0.015,
            floatY: mesh.position.y,
            speed: 0.001 + Math.random() * 0.002,
            offset: Math.random() * Math.PI * 2
        });
    }

    // 3D Luminous Particle Constellation Field
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 60;
        posArray[i + 1] = (Math.random() - 0.5) * 50;
        posArray[i + 2] = (Math.random() - 0.5) * 30;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
        size: 0.22,
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.65
    });

    const particleMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particleMesh);

    // Mouse and Scroll Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = 0;
    let targetScrollY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        targetX += (mouseX * 4 - targetX) * 0.04;
        targetY += (mouseY * 3 - targetY) * 0.04;
        targetScrollY += (scrollY * 0.01 - targetScrollY) * 0.05;

        camera.position.x = targetX;
        camera.position.y = targetY - targetScrollY;
        camera.lookAt(0, -targetScrollY, 0);

        // Rotate objects & float
        floatingObjects.forEach((item) => {
            item.mesh.rotation.x += item.rotX;
            item.mesh.rotation.y += item.rotY;
            item.mesh.rotation.z += item.rotZ;
            item.mesh.position.y = item.floatY + Math.sin(elapsed * 1.5 + item.offset) * 0.6;
        });

        particleMesh.rotation.y = elapsed * 0.02;
        particleMesh.rotation.x = elapsed * 0.01;

        renderer.render(scene, camera);
    }
    animate();
}

// -------------------------------------------------------------
// 2. HERO 3D ARCHITECTURAL RESORT SCENE (Hero Centerpiece)
// -------------------------------------------------------------
function initHero3DScene() {
    const container = document.getElementById('hero-3d-container');
    if (!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(13, 11, 16);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    let controls = null;
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.0;
        controls.maxPolarAngle = Math.PI / 2.1;
        controls.minPolarAngle = Math.PI / 4.5;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 1.6);
    sunLight.position.set(14, 22, 12);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const cyanGlow = new THREE.PointLight(0x38bdf8, 2.5, 25);
    cyanGlow.position.set(-7, 8, 5);
    scene.add(cyanGlow);

    const amberGlow = new THREE.PointLight(0xf59e0b, 3, 25);
    amberGlow.position.set(6, 4, -5);
    scene.add(amberGlow);

    // Group for Hotel Complex
    const hotelGroup = new THREE.Group();
    scene.add(hotelGroup);

    // Island / Futuristic Podium
    const baseGeo = new THREE.CylinderGeometry(8.5, 9.8, 0.9, 36);
    const baseMat = new THREE.MeshStandardMaterial({
        color: 0x090d16,
        roughness: 0.25,
        metalness: 0.5
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.45;
    baseMesh.receiveShadow = true;
    hotelGroup.add(baseMesh);

    // Glowing Cyan Rings
    const ringGeo = new THREE.TorusGeometry(8.7, 0.09, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.03;
    hotelGroup.add(ringMesh);

    // Tower 1 (Grand High-Rise Hotel Tower)
    const tower1Geo = new THREE.BoxGeometry(3.8, 8.0, 3.8);
    const tower1Mat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.15,
        metalness: 0.65
    });
    const tower1 = new THREE.Mesh(tower1Geo, tower1Mat);
    tower1.position.set(-1.4, 4.0, 0);
    tower1.castShadow = true;
    hotelGroup.add(tower1);

    // Tower 2 (Terraced Luxury Wing)
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

    // Glowing Golden & Sky-Blue Windows
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
    lounge.position.set(-1.4, 8.8, 0);
    hotelGroup.add(lounge);

    // Spire & Blinking Beacon
    const spireGeo = new THREE.CylinderGeometry(0.04, 0.16, 2.8, 12);
    const spireMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95 });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.set(-1.4, 10.8, 0);
    hotelGroup.add(spire);

    const beaconGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(-1.4, 12.2, 0);
    hotelGroup.add(beacon);

    // Floating Golden Diamond Particles
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    const diaGeo = new THREE.OctahedronGeometry(0.25, 0);
    const diaMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 });

    const particles = [];
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
            speed: 0.006 + Math.random() * 0.012,
            initialY: p.position.y
        });
    }

    // Resize Handler
    window.addEventListener('resize', () => {
        if (!container) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        if (newW > 0 && newH > 0) {
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
        }
    });

    // Animation Loop
    let clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        beaconMat.color.setHSL(0, 0.95, 0.4 + 0.35 * Math.sin(time * 6));

        particles.forEach((p, idx) => {
            p.mesh.rotation.x += p.speed;
            p.mesh.rotation.y += p.speed * 1.5;
            p.mesh.position.y = p.initialY + Math.sin(time * 2 + idx) * 0.35;
        });

        if (controls) controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

// -------------------------------------------------------------
// 3. 3D SPATIAL CYLINDRICAL CAROUSEL (Showcase of Top Hotels)
// -------------------------------------------------------------
let carouselCurrentIndex = 0;
let carouselItemsCount = 0;
let carouselAutoTimer = null;
let isGridViewActive = false;

function init3DSpatialCarousel() {
    const stage = document.getElementById('carousel-3d-stage');
    const ring = document.getElementById('carousel-3d-ring');
    const items = document.querySelectorAll('.carousel-3d-card');

    if (!stage || !ring || items.length === 0) return;

    carouselItemsCount = items.length;
    const radius = 420; // 3D radius in px
    const theta = 360 / carouselItemsCount;

    // Arrange items on a 3D circle
    items.forEach((item, i) => {
        const itemAngle = theta * i;
        item.dataset.angle = itemAngle;
        item.style.transform = `rotateY(${itemAngle}deg) translateZ(${radius}px)`;
    });

    function updateCarouselRotation() {
        const currentAngle = -carouselCurrentIndex * theta;
        ring.style.transform = `translateZ(-${radius}px) rotateY(${currentAngle}deg)`;

        // Highlight active front card
        items.forEach((item, i) => {
            const normalizedIndex = (carouselCurrentIndex % carouselItemsCount + carouselItemsCount) % carouselItemsCount;
            if (i === normalizedIndex) {
                item.classList.add('active-3d-card');
                item.style.opacity = '1';
                item.style.filter = 'drop-shadow(0 20px 30px rgba(37, 99, 235, 0.3))';
            } else {
                item.classList.remove('active-3d-card');
                item.style.opacity = '0.75';
                item.style.filter = 'none';
            }
        });
    }

    updateCarouselRotation();

    // Next / Prev Global Controllers
    window.rotate3DCarousel = function (direction) {
        carouselCurrentIndex += direction;
        updateCarouselRotation();
        resetAutoRotateTimer();
    };

    window.toggleCarouselViewMode = function () {
        isGridViewActive = !isGridViewActive;
        const wrapper = document.getElementById('carousel-3d-wrapper');
        const gridView = document.getElementById('carousel-grid-fallback');
        const btn = document.getElementById('btn-toggle-view-mode');

        if (isGridViewActive) {
            if (wrapper) wrapper.classList.add('d-none');
            if (gridView) gridView.classList.remove('d-none');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-cube text-warning ms-1"></i> بازگشت به نمای استوانه سه‌بعدی';
            if (carouselAutoTimer) clearInterval(carouselAutoTimer);
        } else {
            if (wrapper) wrapper.classList.remove('d-none');
            if (gridView) gridView.classList.add('d-none');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-table-cells ms-1"></i> مشاهده به صورت شبکه‌ای';
            startAutoRotate();
        }
    };

    // Auto rotate every 4.5 seconds
    function startAutoRotate() {
        if (carouselAutoTimer) clearInterval(carouselAutoTimer);
        carouselAutoTimer = setInterval(() => {
            if (!isGridViewActive) {
                carouselCurrentIndex++;
                updateCarouselRotation();
            }
        }, 4500);
    }

    function resetAutoRotateTimer() {
        if (carouselAutoTimer) clearInterval(carouselAutoTimer);
        startAutoRotate();
    }

    startAutoRotate();

    // Pause on mouse enter
    stage.addEventListener('mouseenter', () => {
        if (carouselAutoTimer) clearInterval(carouselAutoTimer);
    });
    stage.addEventListener('mouseleave', () => {
        resetAutoRotateTimer();
    });

    // Touch & Drag Support
    let startX = 0;
    let isDragging = false;

    stage.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
    });

    window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diff = e.clientX - startX;
        if (diff > 50) {
            rotate3DCarousel(-1);
        } else if (diff < -50) {
            rotate3DCarousel(1);
        }
    });

    stage.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].clientX - startX;
        if (diff > 50) {
            rotate3DCarousel(-1);
        } else if (diff < -50) {
            rotate3DCarousel(1);
        }
    }, { passive: true });
}

// -------------------------------------------------------------
// 4. 3D CARD PARALLAX TILT & SPECULAR GLARE PHYSICS
// -------------------------------------------------------------
function init3DTiltAndGlare() {
    const cards = document.querySelectorAll('.hotel-card, .room-card, .hero-search-card, .stat-3d-card, .feature-3d-box');

    cards.forEach((card) => {
        card.style.transformStyle = 'preserve-3d';
        card.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease';

        // Add specular glare overlay element if not present
        let glare = card.querySelector('.card-3d-glare');
        if (!glare) {
            glare = document.createElement('div');
            glare.className = 'card-3d-glare';
            card.appendChild(glare);
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -11; // Max 11 deg tilt
            const rotateY = ((x - centerX) / centerX) * 11;

            card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;

            // Glare reflection position
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22) 0%, transparent 65%)`;
            glare.style.opacity = '1';

            // Popped elements forward on Z axis
            const popped = card.querySelectorAll('.card-img-container, .stars-badge, .price-tag, .badge, .btn');
            popped.forEach(el => {
                el.style.transform = 'translateZ(26px)';
                el.style.transition = 'transform 0.15s ease-out';
            });
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            glare.style.opacity = '0';
            const popped = card.querySelectorAll('.card-img-container, .stars-badge, .price-tag, .badge, .btn');
            popped.forEach(el => {
                el.style.transform = 'translateZ(0px)';
            });
        });
    });
}

// -------------------------------------------------------------
// INITIALIZE ON DOM READY
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initGlobal3DBackground();
    initHero3DScene();
    init3DSpatialCarousel();
    init3DTiltAndGlare();
});
