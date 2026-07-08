// 1. VARIABLES GLOBALES (Accesibles para el evento Resize)
let backGroup, midGroup, frontGroup, camera, renderer, scene;
let backgroundMat;
let meshLogoBase;
let isDragging = false;
let mouseX = 0, mouseY = 0;
let dragX = 0, dragY = 0;
const mouseUV = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const textLabels = [];
// --- CONFIGURACIÓN DEL VIDEO TRANSPARENTE (.webm) ---
const video = document.createElement('video');
video.src = 'home/ISOLOGO_ANIMADO_04.webm'; // Tu nuevo archivo convertido
video.muted = true;
video.loop = true;
video.playsInline = true;
video.autoplay = true;
video.setAttribute('crossorigin', 'anonymous');

const videoTexture = new THREE.VideoTexture(video);

// Modifica tu función de carga del video
const playVideo = () => {
    video.play().then(() => {
        console.log("Video reproduciéndose correctamente");
    }).catch((error) => {
        console.warn("Autoplay bloqueado, esperando clic...", error);
        // Si falla, forzamos el inicio al primer clic en la pantalla
        window.addEventListener('click', () => {
            video.play();
        }, { once: true });
    });
};
// --- DENTRO DE TU JS ---
function setupVideoMesh() {
    if (meshLogoBase) return; // Evitar duplicados

    const videoAspect = video.videoWidth / video.videoHeight || 1.77; // fallback aspect
    const geometry = new THREE.PlaneGeometry(30 * videoAspect, 30);
    const material = new THREE.MeshBasicMaterial({
        map: videoTexture,
        transparent: true,
        blending: THREE.NormalBlending
    });

    meshLogoBase = new THREE.Mesh(geometry, material);
    meshLogoBase.name = "LOGO_PRINCIPAL";
    midGroup.add(meshLogoBase);
}

// Llama a playVideo cuando el video esté listo
video.oncanplaythrough = () => {
    playVideo();
};

// 2. SHADERS
const _VERTEX_SHADER = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const _FRAGMENT_SHADER = `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uTime;
    void main() {
        vec2 uv = vUv;
        uv.x += sin(uv.y * 10.0 + uTime * 0.5) * 0.001;
        uv.y += cos(uv.x * 10.0 + uTime * 0.5) * 0.001;
        gl_FragColor = texture2D(uTexture, uv);
    }
`;
// --- CONFIGURACIÓN DE ASSETS ---
const width = window.innerWidth;
const isMobile = width < 768;
const isTablet = width >= 768 && width < 1100;

const assets = {
    fondo: isMobile ? 'home/01_FONDO_largo_MOBILE.png' : 'home/01_FONDO_largo.webp',
    particulas: isMobile ? 'home/02_PARTICULAS_MOBILE.png' : 'home/02_PARTICULAS.png',
    luz: isMobile ? 'home/04_LUZ_MOBILE.png' : 'home/04_LUZ.png'
};

// Ajuste de geometrías según dispositivo
const geoSizes = {
    fondo: isMobile ? [105, 185] : isTablet ? [450, 300] : [310, 220],
    particulas: isMobile ? [240, 95] : isTablet ? [160, 100] : [100, 60],
    luz: isMobile ? [65, 65] : isTablet ? [90, 90] : [60, 60]
};
// 3. FUNCIÓN DE ADAPTACIÓN (RESPONSIVE)
function updateGlobalScale() {
    if (!camera || !midGroup || !frontGroup) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    let config;

    if (width <= 360) {
        config = { fov: 65.5, scale: 1.22, z: 49 };
    } else if (width <= 481) {
        config = { fov: 63.5, scale: 1.33, z: 47 };
    } else if (width <= 768 && aspect < 1) {
        config = { fov: 60, scale: 1.45, z: 44 };
    } else if (width <= 932 && aspect < 1) {
        config = { fov: 58, scale: 1.35, z: 46 };
    } else if (width <= 1199 && aspect < 1) {
        config = { fov: 56, scale: 1.28, z: 48 };
    } else if (width <= 1199) {
        config = { fov: 58, scale: 1.45, z: 38 };
    } else {
        config = { fov: 58, scale: 1.55, z: 30 };
    }

    gsap.to(camera, { fov: config.fov, duration: 0.8 });
    gsap.to(camera.position, { z: config.z, duration: 0.8 });

    gsap.to(midGroup.scale, {
        x: config.scale,
        y: config.scale,
        z: config.scale,
        duration: 0.8
    });

    gsap.to(frontGroup.scale, {
        x: config.scale,
        y: config.scale,
        z: config.scale,
        duration: 0.8
    });

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

// 4. EVENTO RESIZE GLOBAL
window.addEventListener('resize', () => {
    if (!renderer || !camera) return;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    updateGlobalScale();
});
let starStuff; // Asegúrate de tener esta variable global declarada

function createStars(scene) {
    const starCount = 5000; // ¡Subimos mucho la cantidad para llenar el fondo!
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorHelper = new THREE.Color();

    for (let i = 0; i < starCount; i++) {
        // Distribuimos las micro-estrellas en un volumen muy amplio
        // ¡Atención! Subimos los valores para que cubran todo el fondo
        positions[i * 3] = (Math.random() - 0.5) * 800; // X muy amplio
        positions[i * 3 + 1] = (Math.random() - 0.5) * 600; // Y muy amplio

        // Posición Z (profundidad). Queremos que estén *muy* al fondo (-150).
        positions[i * 3 + 2] = (Math.random() - 0.5) * 400 - 100; // Fondo profundo

        // --- COLOR AZUL BRILLANTE (tipo NEÓN/CIAN) ---
        // Hacemos que la mayoría sean de un tono cian/azul intenso y vibrante
        const hue = 0.5 + Math.random() * 0.1; // Tono cian/azul brillante
        const saturation = 0.8 + Math.random() * 0.2; // Saturación ALTA para azul vivo
        const lightness = 0.7 + Math.random() * 0.5; // Brillo ALTO para neón
        colorHelper.setHSL(hue, saturation, lightness);

        colors[i * 3] = colorHelper.r;
        colors[i * 3 + 1] = colorHelper.g;
        colors[i * 3 + 2] = colorHelper.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)); // Activamos colores por vértice

    // --- TEXTURA DE MICRO-PUNTO DIFUMINADO (SOFT MICRO DOT) ---
    // Usamos el CanvasTexture de nuevo, pero con un degradado súper apretado
    const canvas = document.createElement('canvas');
    canvas.width = 18; // ¡Súper pequeño para puntos diminutos!
    canvas.height = 18;
    const ctx = canvas.getContext('2d');

    // Un círculo blanco con un degradado radial muy corto para el punto diminuto
    const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Centro blanco puro
    gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.8)'); // Borde suave
    gradient.addColorStop(0.5, 'rgba(23, 91, 180, 0.79)'); // Exterior transparente

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);

    const starTexture = new THREE.CanvasTexture(canvas);

    // --- MATERIAL DE PUNTOS MEJORADO PARA MICRO-ESTRELLAS BRILLANTES ---
    const material = new THREE.PointsMaterial({
        size: 0.2, // ¡CLAVE! Tamaño diminuto para micro-estrellas (antes 2.0)
        map: starTexture, // Usamos la textura circular
        transparent: true,
        vertexColors: true, // Usamos los colores azul brillantes definidos arriba
        blending: THREE.AdditiveBlending, // ¡CLAVE! Hace que las estrellas brillen al superponerse
        depthWrite: false, // ¡CLAVE! Evita que las estrellas lejanas tapen a las cercanas o al logo
        sizeAttenuation: true // Hace que las estrellas lejanas se vean más pequeñas (efecto túnel)
    });

    starStuff = new THREE.Points(geometry, material);
    scene.add(starStuff);
}
// 5. INICIALIZADOR PRINCIPAL
window.initParticlesLogo = function () {
    const container = document.getElementById('scene-container');
    const loaderWrapper = document.getElementById('loader-wrapper');
    if (!container) return;

    // Evitar múltiples instancias si Angular re-ejecuta el script
    if (container.dataset.initialized === "true") {
        updateGlobalScale(); // Solo re-ajustamos
        return;
    }
    container.dataset.initialized = "true";

    scene = new THREE.Scene();

    createStars(scene);
    // IMPORTANTE: Sin 'const' para usar la variable global
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // El canvas queda visual, pero no toca/captura clicks
    container.style.pointerEvents = 'none';
    renderer.domElement.style.pointerEvents = 'none';

    // Inicializamos Grupos (Sin 'const')
    backGroup = new THREE.Group();
    midGroup = new THREE.Group();
    frontGroup = new THREE.Group();
    scene.add(backGroup, midGroup, frontGroup);

    const clock = new THREE.Clock();
    const manager = new THREE.LoadingManager();

    manager.onLoad = () => {
        if (loaderWrapper) {
            gsap.to(loaderWrapper, {
                opacity: 0,
                duration: 2.5,
                onComplete: () => {
                    loaderWrapper.style.display = 'none';
                    // --- FIX AQUÍ ---
                    if (typeof AOS !== 'undefined') {
                        AOS.refresh();
                    }
                }
            });
            updateGlobalScale();
        }
    };

    const loader = new THREE.TextureLoader(manager);

    // Carga de Fondo (Shader)
    loader.load(assets.fondo, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        backgroundMat = new THREE.ShaderMaterial({
            vertexShader: _VERTEX_SHADER,
            fragmentShader: _FRAGMENT_SHADER,
            uniforms: { uTexture: { value: texture }, uTime: { value: 0 } },
            transparent: true
        });
        // Usamos los tamaños definidos en geoSizes
        const bg = new THREE.Mesh(
            new THREE.PlaneGeometry(geoSizes.fondo[0], geoSizes.fondo[1]),
            backgroundMat
        );
        bg.position.z = -50;
        bg.scale.set(isMobile ? 1.25 : 1.6, isMobile ? 1.25 : 1.6, 1);

        scene.add(bg);
    });

    // Carga de Partículas
    loader.load(assets.particulas, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        const mat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: isMobile ? 0.6 : 0.4, // Un poco más de opacidad en mobile si son menos partículas
            blending: THREE.AdditiveBlending
        });
        const p = new THREE.Mesh(
            new THREE.PlaneGeometry(geoSizes.particulas[0], geoSizes.particulas[1]),
            mat
        );
        p.position.z = -20;
        backGroup.add(p);
    });

    // Carga de Luz
    loader.load(assets.luz, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        const light = new THREE.Mesh(
            new THREE.PlaneGeometry(geoSizes.luz[0], geoSizes.luz[1]),
            new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })
        );
        light.position.z = -5;
        midGroup.add(light);
    });

    video.onloadedmetadata = function () {
        const videoAspect = video.videoWidth / video.videoHeight;
        const geometry = new THREE.PlaneGeometry(15 * videoAspect, 15);

        // Usamos MeshBasicMaterial con la textura de video
        const material = new THREE.MeshBasicMaterial({
            map: videoTexture,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        /*
        const material = new THREE.MeshBasicMaterial({
            map: videoTexture,
            transparent: true,
            blending: THREE.NormalBlending, 
            depthWrite: true,               
            opacity: 0.6,                  
            alphaTest: 0.05                
        });
        */

        meshLogoBase = new THREE.Mesh(geometry, material);
        meshLogoBase.name = "LOGO_PRINCIPAL";
        midGroup.add(meshLogoBase);
    };


    // Etiquetas de Texto
    function createTextLabel(text, x, y, z, link) {
        const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const width = window.innerWidth;
const isMobile = width < 768;
const isSmallMobile = width <= 480;

canvas.width = 1024;
canvas.height = 256;

const fontSize =
    isSmallMobile ? 40 :
    isMobile ? 65 :
    70;

ctx.font = `Bold ${fontSize}px Arial`;
ctx.fillStyle = '#1CA4DA';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.shadowBlur = 10;
ctx.shadowColor = '#1CA4DA';

ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(
                isMobile ? 14 : 6,
                isMobile ? 3 : 1.5
            ),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, opacity: 0.8 })
        );
        mesh.position.set(x, y, z);
        mesh.userData.link = link;
        mesh.userData.isTextLabel = true;
        midGroup.add(mesh);
        textLabels.push(mesh);
    }

    function clearTextLabels() {
        textLabels.forEach(label => {
            midGroup.remove(label);
            label.geometry.dispose();
            label.material.map?.dispose();
            label.material.dispose();
        });
    
        textLabels.length = 0;
    }
    
    function renderTextLabels() {
        clearTextLabels();
    
        const width = window.innerWidth;
        const isSmallMobile = width <= 480;
        const isMobile = width < 768;
    
        if (isSmallMobile) {
            createTextLabel('Latin America', -5.5, 3.5, 2, 'latin-america');
            createTextLabel('Innovation', 6, -5, 2, 'innovation');
            createTextLabel('CRO Expert', 4.5, 8, 2, 'cro-expert');
    
        } else if (isMobile) {
            createTextLabel('Latin America', -12, 3.5, 2, 'latin-america');
            createTextLabel('Innovation', 15, -5.8, 2, 'innovation');
            createTextLabel('CRO Expert', 11, 11.5, 2, 'cro-expert');
    
        } else {
            createTextLabel('Latin America', -9, 0.5, 2, 'latin-america');
            createTextLabel('Innovation', 7, -3.5, 2, 'innovation');
            createTextLabel('CRO Expert', 6.5, 6, 2, 'cro-expert');
        }
    }
    
    renderTextLabels();
    
    window.addEventListener('resize', () => {
        renderTextLabels();
    });

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
        mouseUV.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseUV.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });


    function animate() {
        requestAnimationFrame(animate);
        if (video.readyState >= video.HAVE_CURRENT_DATA) {
            videoTexture.needsUpdate = true;
        }
        const time = clock.getElapsedTime();
        if (videoTexture) {
            videoTexture.needsUpdate = true;
        }
        // --- ANIMACIÓN DE ESTRELLAS ---
        if (starStuff) {
            const positions = starStuff.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                // Movimiento lento hacia adelante (efecto viaje espacial)
                positions[i + 2] += 0.05;

                // Si la estrella se acerca demasiado a la cámara, la mandamos al fondo
                if (positions[i + 2] > 50) {
                    positions[i + 2] = -150;
                }

                // Movimiento lateral suave basado en el mouse (paralaje)
                positions[i] += (mouseX * 0.1);
                positions[i + 1] += (-mouseY * 0.1);
            }
            starStuff.geometry.attributes.position.needsUpdate = true;
        }
        const aspect = window.innerWidth / window.innerHeight;

        const width = window.innerWidth;
const isSmallMobile = width <= 480;
const isMobile = width < 768;
const isTablet = width >= 768 && width < 1200;

        // 1. SHADER DE FONDO
        if (backgroundMat) backgroundMat.uniforms.uTime.value = time;

        // --- 2. LÓGICA DE DRAG (MOUSE) CON MÁS INERCIA ---
        const powerX = aspect > 1 ? 15 : 10;
        const powerY = aspect > 1 ? 10 : 8;

        const targetX = isDragging ? mouseX * powerX : 0;
        const targetY = isDragging ? -mouseY * powerY : 0;

        // --- CAMBIO CLAVE AQUI ---
        // Bajamos el factor de suavizado de 0.05 a 0.02.
        // Esto hace que el grupo tarde mucho más en alcanzar la posición del mouse,
        // creando una sensación de "arrastre pesado" o inercia.
        dragX += (targetX - dragX) * 0.05;
        dragY += (targetY - dragY) * 0.05;


        camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 10 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        // --- 4. ANIMACIÓN DE LAS CAPAS ---
        midGroup.position.x = dragX;
        midGroup.position.y = dragY;

        // Un ligero balanceo lateral basado en el movimiento para dar más realismo
        midGroup.rotation.y = dragX * 0.06;
        midGroup.rotation.x = -dragY * 0.05; // Balanceo sutil arriba/abajo

        // FLOTACIÓN DEL LOGO BASE
        const floatIntensity = 1.0;
        midGroup.children.forEach(child => {
            if (child.geometry && child.geometry.type === "PlaneGeometry") {
                // Mantenemos la respiración y la flotación independiente
                const breath = 1 + Math.sin(time * 0.5) * 0.02;

                if (child.name === "LOGO_PRINCIPAL") {
                    const logoSize =
                        isSmallMobile ? 1.15 :
                        isMobile ? 1.25 :
                        isTablet ? 1.18 :
                        1.08;
                
                    child.scale.set(breath * logoSize, breath * logoSize, breath * logoSize);
                } else {
                    child.scale.set(breath, breath, breath);
                }

                if (Math.abs(child.position.x) < 0.5) {
                    child.position.y = Math.sin(time * 0.7) * floatIntensity;
                    child.rotation.z = Math.sin(time * 0.5) * 0.01;
                }
            }
        });

        // CAPA FRONTAL (Bolas sueltas)
        if (frontGroup) {
            frontGroup.position.x = dragX * 1.1;
            frontGroup.position.y = (dragY * 1.1) + Math.sin(time * 0.5) * 0.6;
            frontGroup.position.z = Math.cos(time * 0.3) * 0.5;
        }

        // CAPA TRASERA (Partículas)
        if (backGroup) {
            backGroup.position.x = dragX * 0.8 + Math.sin(time * 0.5) * 2;
            backGroup.position.y = dragY * 0.8 + Math.cos(time * 0.5) * 1;
        }

        // --- 5. INTERACCIÓN CON ETIQUETAS ---
        raycaster.setFromCamera(mouseUV, camera);
        const intersects = raycaster.intersectObjects(textLabels);
        textLabels.forEach(l => {
            l.position.y += Math.sin(time * 1.5 + l.position.x) * 0.005;
            l.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
            l.material.opacity = THREE.MathUtils.lerp(l.material.opacity, 0.7, 0.1);
        });
        if (intersects.length > 0) {
            intersects[0].object.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.2);
            intersects[0].object.material.opacity = 1.0;
        }

        renderer.render(scene, camera);
    }

    animate();
    updateGlobalScale();
};