/**
 * ASAYESH HOTEL - 3D Engine & Interactive Experiences
 * Built with Three.js (WebGL) and Spatial Parallax Physics
 * Bachelor's Degree Capstone Project
 */

// -------------------------------------------------------------
// 1. 3D HERO ARCHITECTURAL HOTEL SCENE (Three.js)
// -------------------------------------------------------------
function initHero3D() {
    const container = document.getElementById('hero-3d-container');
    if (!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(12, 10, 16);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Controls
    let controls = null;
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
        controls.maxPolarAngle = Math.PI / 2.1;
        controls.minPolarAngle = Math.PI / 4;
    }

    // Ambient and Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfef08a, 1.4);
    dirLight.position.set(15, 25, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const pointLight1 = new THREE.PointLight(0x38bdf8, 2, 20);
    pointLight1.position.set(-6, 8, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xf59e0b, 2.5, 20);
    pointLight2.position.set(5, 4, -4);
    scene.add(pointLight2);

    // Group for Hotel Architecture
    const hotelGroup = new THREE.Group();
    scene.add(hotelGroup);

    // Island / Podium Base
    const baseGeo = new THREE.CylinderGeometry(8.5, 9.5, 0.8, 32);
    const baseMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.3,
        metalness: 0.4
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.4;
    baseMesh.receiveShadow = true;
    hotelGroup.add(baseMesh);

    // Glowing Podium Ring
    const ringGeo = new THREE.TorusGeometry(8.6, 0.1, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.02;
    hotelGroup.add(ringMesh);

    // Main Tower (Tower 1 - High Rise)
    const tower1Geo = new THREE.BoxGeometry(3.6, 7.5, 3.6);
    const tower1Mat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.2,
        metalness: 0.6
    });
    const tower1 = new THREE.Mesh(tower1Geo, tower1Mat);
    tower1.position.set(-1.2, 3.75, 0);
    tower1.castShadow = true;
    tower1.receiveShadow = true;
    hotelGroup.add(tower1);

    // Secondary Luxury Wing (Tower 2 - Modern Terraced)
    const tower2Geo = new THREE.BoxGeometry(4.2, 4.5, 3);
    const tower2Mat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.3,
        metalness: 0.5
    });
    const tower2 = new THREE.Mesh(tower2Geo, tower2Mat);
    tower2.position.set(2.2, 2.25, 0.8);
    tower2.castShadow = true;
    tower2.receiveShadow = true;
    hotelGroup.add(tower2);

    // Glass Windows Grid (Glowing Gold & Cyan)
    const windowMatWarm = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const windowMatCool = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });

    for (let floor = 0; floor < 6; floor++) {
        for (let col = 0; col < 3; col++) {
            const winGeo = new THREE.PlaneGeometry(0.6, 0.5);
            const isWarm = (floor + col) % 2 === 0;
            const winMesh = new THREE.Mesh(winGeo, isWarm ? windowMatWarm : windowMatCool);
            winMesh.position.set(-2.4 + col * 1.2, 1.2 + floor * 1.0, 1.81);
            hotelGroup.add(winMesh);

            // Back side windows
            const winBack = winMesh.clone();
            winBack.position.z = -1.81;
            winBack.rotation.y = Math.PI;
            hotelGroup.add(winBack);
        }
    }

    // Infinity Rooftop Pool on Tower 2
    const poolGeo = new THREE.BoxGeometry(3.6, 0.2, 2.4);
    const poolMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.85
    });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.position.set(2.2, 4.55, 0.8);
    hotelGroup.add(pool);

    // Glowing Penthouse Sky Lounge
    const loungeGeo = new THREE.BoxGeometry(2.4, 1.5, 2.4);
    const loungeMat = new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        transmission: 0.7,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 1.5
    });
    const lounge = new THREE.Mesh(loungeGeo, loungeMat);
    lounge.position.set(-1.2, 8.25, 0);
    hotelGroup.add(lounge);

    // Roof Spire with beacon
    const spireGeo = new THREE.CylinderGeometry(0.04, 0.15, 2.5, 12);
    const spireMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9 });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.set(-1.2, 9.8, 0);
    hotelGroup.add(spire);

    const beaconGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(-1.2, 11.0, 0);
    hotelGroup.add(beacon);

    // Floating Luxury Diamond Crystals / Particles
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    const particleGeo = new THREE.OctahedronGeometry(0.25, 0);
    const particleMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.2,
        metalness: 0.8
    });

    const particles = [];
    for (let i = 0; i < 24; i++) {
        const p = new THREE.Mesh(particleGeo, particleMat);
        const angle = (i / 24) * Math.PI * 2;
        const radius = 6.5 + Math.random() * 3.5;
        p.position.set(
            Math.cos(angle) * radius,
            2 + Math.random() * 8,
            Math.sin(angle) * radius
        );
        p.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        particleGroup.add(p);
        particles.push({
            mesh: p,
            speed: 0.005 + Math.random() * 0.01,
            floatSpeed: 0.02 + Math.random() * 0.02,
            initialY: p.position.y
        });
    }

    // Mouse Interaction Parallax
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
            mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
            targetRotationY = mouseX * 0.4;
            targetRotationX = mouseY * 0.2;
        }
    });

    // Resize Handler
    function onWindowResize() {
        if (!container) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        if (newW > 0 && newH > 0) {
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
        }
    }
    window.addEventListener('resize', onWindowResize);

    // Animation Loop
    let clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Beacon pulsing
        beaconMat.color.setHSL(0, 0.9, 0.4 + 0.3 * Math.sin(elapsedTime * 6));

        // Floating particles
        particles.forEach((p, idx) => {
            p.mesh.rotation.x += p.speed;
            p.mesh.rotation.y += p.speed * 1.5;
            p.mesh.position.y = p.initialY + Math.sin(elapsedTime * 2 + idx) * 0.35;
        });

        // Soft smooth mouse tilt on hotelGroup
        if (!controls || !controls.state == -1) {
            hotelGroup.rotation.y += (targetRotationY - hotelGroup.rotation.y) * 0.05;
            hotelGroup.rotation.x += (targetRotationX - hotelGroup.rotation.x) * 0.05;
        }

        if (controls) controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

// -------------------------------------------------------------
// 2. INTERACTIVE 3D VIRTUAL SUITE EXPLORER (Three.js 360 Viewer)
// -------------------------------------------------------------
let roomScene, roomCamera, roomRenderer, roomControls;
let roomLampLights = [];
let roomSunLight = null;
let isNightMode = false;

function initRoom3D() {
    const container = document.getElementById('room-3d-canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 420;

    roomScene = new THREE.Scene();
    roomCamera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    roomCamera.position.set(7, 5, 8);

    roomRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    roomRenderer.setSize(width, height);
    roomRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    roomRenderer.shadowMap.enabled = true;
    roomRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(roomRenderer.domElement);

    if (typeof THREE.OrbitControls !== 'undefined') {
        roomControls = new THREE.OrbitControls(roomCamera, roomRenderer.domElement);
        roomControls.enableDamping = true;
        roomControls.dampingFactor = 0.06;
        roomControls.maxPolarAngle = Math.PI / 2.05;
        roomControls.minDistance = 4;
        roomControls.maxDistance = 15;
        roomControls.target.set(0, 1, 0);
    }

    // Lighting Setup
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    roomScene.add(ambient);

    roomSunLight = new THREE.DirectionalLight(0xfff7ed, 1.3);
    roomSunLight.position.set(8, 10, 5);
    roomSunLight.castShadow = true;
    roomSunLight.shadow.mapSize.width = 1024;
    roomSunLight.shadow.mapSize.height = 1024;
    roomScene.add(roomSunLight);

    // Room Structure (Floor & Back Walls)
    const roomGroup = new THREE.Group();
    roomScene.add(roomGroup);

    // Hardwood Floor
    const floorGeo = new THREE.BoxGeometry(7, 0.2, 7);
    const floorMat = new THREE.MeshStandardMaterial({
        color: 0x27272a,
        roughness: 0.4,
        metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.1;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Luxury Carpet / Rug under bed
    const rugGeo = new THREE.BoxGeometry(4.2, 0.05, 4.6);
    const rugMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        roughness: 0.9,
        metalness: 0.05
    });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.position.set(0, 0.02, 0);
    rug.receiveShadow = true;
    roomGroup.add(rug);

    // Back Wall (Accent Headboard Wall)
    const backWallGeo = new THREE.BoxGeometry(7, 4.5, 0.2);
    const backWallMat = new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.7
    });
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, 2.15, -3.4);
    backWall.receiveShadow = true;
    roomGroup.add(backWall);

    // Side Wall (Window Wall)
    const sideWallGeo = new THREE.BoxGeometry(0.2, 4.5, 7);
    const sideWallMat = new THREE.MeshStandardMaterial({
        color: 0x27272a,
        roughness: 0.6
    });
    const sideWall = new THREE.Mesh(sideWallGeo, sideWallMat);
    sideWall.position.set(-3.4, 2.15, 0);
    sideWall.receiveShadow = true;
    roomGroup.add(sideWall);

    // Panoramic Window Glass
    const windowGeo = new THREE.PlaneGeometry(4.5, 3.2);
    const windowMat = new THREE.MeshPhysicalMaterial({
        color: 0x93c5fd,
        transmission: 0.85,
        opacity: 0.6,
        transparent: true,
        roughness: 0.1,
        ior: 1.4
    });
    const windowMesh = new THREE.Mesh(windowGeo, windowMat);
    windowMesh.rotation.y = Math.PI / 2;
    windowMesh.position.set(-3.29, 2.3, 0);
    roomGroup.add(windowMesh);

    // Luxury King Bed: Base / Platform
    const bedBaseGeo = new THREE.BoxGeometry(2.6, 0.4, 3.2);
    const bedBaseMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.3 });
    const bedBase = new THREE.Mesh(bedBaseGeo, bedBaseMat);
    bedBase.position.set(0, 0.2, -0.6);
    bedBase.castShadow = true;
    bedBase.receiveShadow = true;
    roomGroup.add(bedBase);

    // Mattress
    const matGeo = new THREE.BoxGeometry(2.4, 0.45, 3.0);
    const matMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 });
    const mattress = new THREE.Mesh(matGeo, matMat);
    mattress.position.set(0, 0.55, -0.6);
    mattress.castShadow = true;
    mattress.receiveShadow = true;
    roomGroup.add(mattress);

    // Duvet / Quilt (Royal Navy & Gold Accent)
    const quiltGeo = new THREE.BoxGeometry(2.44, 0.2, 2.0);
    const quiltMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 });
    const quilt = new THREE.Mesh(quiltGeo, quiltMat);
    quilt.position.set(0, 0.7, 0.0);
    quilt.castShadow = true;
    roomGroup.add(quilt);

    // Gold Bed Runner
    const runnerGeo = new THREE.BoxGeometry(2.46, 0.22, 0.5);
    const runnerMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.5 });
    const runner = new THREE.Mesh(runnerGeo, runnerMat);
    runner.position.set(0, 0.72, 0.6);
    roomGroup.add(runner);

    // Pillows
    const pillowGeo = new THREE.BoxGeometry(0.9, 0.18, 0.5);
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });

    const pillowLeft = new THREE.Mesh(pillowGeo, pillowMat);
    pillowLeft.position.set(-0.6, 0.85, -1.7);
    pillowLeft.rotation.x = 0.2;
    pillowLeft.castShadow = true;
    roomGroup.add(pillowLeft);

    const pillowRight = pillowLeft.clone();
    pillowRight.position.x = 0.6;
    roomGroup.add(pillowRight);

    // Bed Headboard
    const headboardGeo = new THREE.BoxGeometry(3.6, 1.8, 0.2);
    const headboardMat = new THREE.MeshStandardMaterial({
        color: 0x52525b,
        roughness: 0.6
    });
    const headboard = new THREE.Mesh(headboardGeo, headboardMat);
    headboard.position.set(0, 1.4, -2.2);
    headboard.castShadow = true;
    roomGroup.add(headboard);

    // Nightstands & Glowing Lamps (Left & Right)
    const standGeo = new THREE.BoxGeometry(0.7, 0.6, 0.7);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.3 });

    [-1.9, 1.9].forEach((xPos) => {
        const stand = new THREE.Mesh(standGeo, standMat);
        stand.position.set(xPos, 0.3, -1.8);
        stand.castShadow = true;
        stand.receiveShadow = true;
        roomGroup.add(stand);

        // Lamp Base & Stem
        const stemGeo = new THREE.CylinderGeometry(0.04, 0.08, 0.45, 16);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9 });
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.set(xPos, 0.75, -1.8);
        roomGroup.add(stem);

        // Lamp Shade
        const shadeGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.35, 16);
        const shadeMat = new THREE.MeshStandardMaterial({
            color: 0xfef3c7,
            emissive: 0xf59e0b,
            emissiveIntensity: 0.6
        });
        const shade = new THREE.Mesh(shadeGeo, shadeMat);
        shade.position.set(xPos, 1.05, -1.8);
        roomGroup.add(shade);

        // Warm Lamp Point Light
        const lampLight = new THREE.PointLight(0xfbbf24, 1.2, 4.5);
        lampLight.position.set(xPos, 1.1, -1.8);
        lampLight.castShadow = true;
        roomGroup.add(lampLight);
        roomLampLights.push(lampLight);
    });

    // Modern Lounge Chair
    const chairBaseGeo = new THREE.BoxGeometry(1.0, 0.4, 1.0);
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 });
    const chair = new THREE.Mesh(chairBaseGeo, chairMat);
    chair.position.set(-1.8, 0.2, 1.4);
    chair.rotation.y = Math.PI / 4;
    chair.castShadow = true;
    roomGroup.add(chair);

    const chairBackGeo = new THREE.BoxGeometry(1.0, 0.9, 0.2);
    const chairBack = new THREE.Mesh(chairBackGeo, chairMat);
    chairBack.position.set(-2.15, 0.75, 1.05);
    chairBack.rotation.y = Math.PI / 4;
    chairBack.castShadow = true;
    roomGroup.add(chairBack);

    // Resize Handler
    function onRoomResize() {
        if (!container) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        if (newW > 0 && newH > 0) {
            roomCamera.aspect = newW / newH;
            roomCamera.updateProjectionMatrix();
            roomRenderer.setSize(newW, newH);
        }
    }
    window.addEventListener('resize', onRoomResize);

    // Animation Loop
    function animateRoom() {
        requestAnimationFrame(animateRoom);
        if (roomControls) roomControls.update();
        roomRenderer.render(roomScene, roomCamera);
    }
    animateRoom();
}

// Toggle Day / Night Lighting Mode in 3D Suite Viewer
window.toggleRoom3DLighting = function () {
    isNightMode = !isNightMode;
    const btn = document.getElementById('btn-toggle-night');

    if (isNightMode) {
        if (roomSunLight) roomSunLight.intensity = 0.15;
        roomLampLights.forEach(l => l.intensity = 2.4);
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-sun text-warning ms-1"></i> تغییر به حالت روز (Day Mode)';
            btn.classList.replace('btn-outline-light', 'btn-warning');
        }
    } else {
        if (roomSunLight) roomSunLight.intensity = 1.3;
        roomLampLights.forEach(l => l.intensity = 1.0);
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-moon text-info ms-1"></i> تغییر به حالت شب (Night Mode)';
            btn.classList.replace('btn-warning', 'btn-outline-light');
        }
    }
};

// Reset 3D Camera View
window.resetRoom3DView = function () {
    if (roomCamera && roomControls) {
        roomCamera.position.set(7, 5, 8);
        roomControls.target.set(0, 1, 0);
        roomControls.update();
    }
};

// -------------------------------------------------------------
// 3. 3D CARD PARALLAX & TILT PHYSICS (Vanilla Spatial Interaction)
// -------------------------------------------------------------
function init3DTiltCards() {
    const cards = document.querySelectorAll('.hotel-card, .room-card, .hero-search-card, .feature-3d-card');

    cards.forEach((card) => {
        card.style.transformStyle = 'preserve-3d';
        card.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease';

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg tilt
            const rotateY = ((x - centerX) / centerX) * 9;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Depth pop on inner children
            const popElements = card.querySelectorAll('.card-img-container, .stars-badge, .price-tag, .badge');
            popElements.forEach(el => {
                el.style.transform = 'translateZ(25px)';
                el.style.transition = 'transform 0.15s ease-out';
            });
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            const popElements = card.querySelectorAll('.card-img-container, .stars-badge, .price-tag, .badge');
            popElements.forEach(el => {
                el.style.transform = 'translateZ(0px)';
            });
        });
    });
}

// -------------------------------------------------------------
// INITIALIZE ON DOM READY
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initHero3D();
    initRoom3D();
    init3DTiltCards();
});
