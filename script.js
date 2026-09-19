const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const focusContent = {
    ai: {
        title: 'AI orchestration',
        description: 'AI araçlarını tek bir üretim akışına bağlar; araştırır, sınıflandırır ve işi ileri taşır.',
        stage: 'INPUT RECEIVED',
        index: 0,
    },
    web: {
        title: 'Web / SEO',
        description: 'Bulunur, anlaşılır ve dönüşür: tasarım ile teknik görünürlüğü aynı sistemde kurarız.',
        stage: 'INTELLIGENCE ONLINE',
        index: 1,
    },
    content: {
        title: 'Content engine',
        description: 'Sosyal içerik, video ve görsel dili tek seferlik postlar değil, tekrar üretilebilir bir sisteme çevirir.',
        stage: 'OUTPUT SHAPED',
        index: 2,
    },
    experience: {
        title: 'Human layer',
        description: 'Otomasyonun soğuklaşmasına izin vermeden, insan kararını doğru yerde tutar.',
        stage: 'HUMAN IN THE LOOP',
        index: 3,
    },
};

const updateFocus = (stage, key) => {
    const info = focusContent[key] || focusContent.ai;
    stage.dataset.focus = key;
    const titleNode = stage.querySelector('[data-focus-title]');
    const descriptionNode = stage.querySelector('[data-focus-description]');
    const stageLabel = stage.querySelector('[data-stage-label]');
    if (titleNode) titleNode.textContent = info.title;
    if (descriptionNode) descriptionNode.textContent = info.description;
    if (stageLabel) stageLabel.textContent = info.stage;
    stage.querySelectorAll('[data-focus]').forEach((node) => node.classList.toggle('is-active', node.dataset.focus === key));
};

document.querySelectorAll('.hero-stage').forEach((stage) => {
    stage.dataset.focus = stage.dataset.focus || 'ai';
    stage.querySelectorAll('[data-focus]').forEach((node) => node.addEventListener('click', () => updateFocus(stage, node.dataset.focus)));
});

const menuTrigger = document.querySelector('[data-menu-trigger]');
menuTrigger?.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    menuTrigger.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    menuTrigger?.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const shaderVertex = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const shaderFragment = `
    precision highp float;
    uniform float uTime;
    uniform float uStage;
    uniform vec2 uMouse;
    uniform vec3 uPrimary;
    uniform vec3 uSecondary;
    varying vec2 vUv;

    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = .55;
        for (int i = 0; i < 5; i++) {
            value += amplitude * noise(p);
            p = p * 2.03 + vec2(13.7, 9.2);
            amplitude *= .5;
        }
        return value;
    }
    void main() {
        vec2 uv = vUv - .5;
        uv.x *= 1.7;
        vec2 drift = vec2(uTime * .045, -uTime * .028) + uMouse * .25;
        float large = fbm(uv * 2.6 + drift + uStage * .21);
        float fine = fbm(uv * 6.0 - drift * 1.4);
        float veins = smoothstep(.38, .77, large + fine * .24);
        float halo = smoothstep(.9, .05, length(uv * vec2(.75, 1.0)));
        vec3 color = mix(uSecondary, uPrimary, veins);
        color += uPrimary * halo * .16;
        color *= .65 + fine * .42;
        gl_FragColor = vec4(color, .98);
    }
`;

const loadThreeScene = async (stage) => {
    const canvas = stage.querySelector('#hero-canvas');
    if (!canvas) return;
    let THREE;
    try {
        THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
    } catch {
        stage.classList.add('scene-fallback');
        return;
    }

    const isMuge = document.body.classList.contains('muge-page') || document.body.classList.contains('muge');
    const primary = new THREE.Color(isMuge ? 0xff8066 : 0x8ef4d2);
    const secondary = new THREE.Color(isMuge ? 0x37171b : 0x0c3a35);
    const cool = new THREE.Color(isMuge ? 0xffc3a8 : 0xa7d8ff);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setClearColor(0x050708, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    camera.position.set(0, 0, 5.8);

    const backgroundMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uStage: { value: 0 },
            uMouse: { value: new THREE.Vector2() },
            uPrimary: { value: primary },
            uSecondary: { value: secondary },
        },
        vertexShader: shaderVertex,
        fragmentShader: shaderFragment,
        depthWrite: false,
    });
    const background = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), backgroundMaterial);
    background.position.z = -3.5;
    scene.add(background);

    const world = new THREE.Group();
    world.position.z = isMuge ? .05 : 0;
    scene.add(world);
    const core = new THREE.Group();
    world.add(core);

    const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(isMuge ? 1.04 : 1.16, 2), new THREE.MeshBasicMaterial({ color: primary, transparent: true, opacity: .84, wireframe: true }));
    core.add(wire);
    core.add(new THREE.Mesh(new THREE.IcosahedronGeometry(isMuge ? 1.25 : 1.4, 2), new THREE.MeshBasicMaterial({ color: cool, transparent: true, opacity: .06 })));
    core.add(new THREE.Mesh(new THREE.SphereGeometry(.07, 12, 12), new THREE.MeshBasicMaterial({ color: primary })));

    [[1.55, .055, .32], [1.95, .035, -.72], [2.42, .025, .08]].forEach(([radius, tube, tilt]) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 128), new THREE.MeshBasicMaterial({ color: primary, transparent: true, opacity: .38 }));
        ring.rotation.x = Math.PI / 2 + tilt;
        ring.rotation.y = tilt * .8;
        world.add(ring);
    });

    const points = [];
    const pointCount = window.innerWidth < 700 ? 170 : 320;
    for (let i = 0; i < pointCount; i += 1) {
        const radius = 2.8 + Math.random() * 2.4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        points.push(radius * Math.sin(phi) * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi));
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    world.add(new THREE.Points(pointsGeometry, new THREE.PointsMaterial({ color: cool, size: .023, transparent: true, opacity: .76 })));

    const links = [];
    for (let i = 0; i < 32; i += 1) {
        const a = new THREE.Vector3((Math.random() - .5) * 4.5, (Math.random() - .5) * 4.5, (Math.random() - .5) * 2.5);
        const b = a.clone().add(new THREE.Vector3((Math.random() - .5) * 1.4, (Math.random() - .5) * 1.4, (Math.random() - .5) * 1.4));
        links.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    const linkGeometry = new THREE.BufferGeometry();
    linkGeometry.setAttribute('position', new THREE.Float32BufferAttribute(links, 3));
    world.add(new THREE.LineSegments(linkGeometry, new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity: .13 })));

    const focusToIndex = { ai: 0, web: 1, content: 2, experience: 3 };
    const resize = () => {
        const width = stage.clientWidth;
        const height = stage.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        const visibleHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * Math.abs(camera.position.z - background.position.z);
        background.scale.set((visibleHeight * camera.aspect) / 2, visibleHeight / 2, 1);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let pointerX = 0;
    let pointerY = 0;
    stage.addEventListener('pointermove', (event) => {
        const rect = stage.getBoundingClientRect();
        pointerX = ((event.clientX - rect.left) / rect.width - .5) * 2;
        pointerY = ((event.clientY - rect.top) / rect.height - .5) * 2;
    }, { passive: true });
    stage.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; }, { passive: true });

    const clock = new THREE.Clock();
    const render = () => {
        const elapsed = clock.getElapsedTime();
        const key = stage.dataset.focus || 'ai';
        const stageIndex = focusToIndex[key] || 0;
        backgroundMaterial.uniforms.uTime.value = prefersReducedMotion ? 1.7 : elapsed;
        backgroundMaterial.uniforms.uStage.value += (stageIndex - backgroundMaterial.uniforms.uStage.value) * .04;
        backgroundMaterial.uniforms.uMouse.value.x += (pointerX - backgroundMaterial.uniforms.uMouse.value.x) * .04;
        backgroundMaterial.uniforms.uMouse.value.y += (pointerY - backgroundMaterial.uniforms.uMouse.value.y) * .04;
        world.rotation.x += ((pointerY * .12) - world.rotation.x) * .035;
        world.rotation.y += ((pointerX * .16 + .003) - world.rotation.y) * .035;
        core.rotation.x = elapsed * .16;
        core.rotation.z = elapsed * .1;
        core.scale.setScalar(1 + Math.sin(elapsed * 1.35) * .025);
        renderer.render(scene, camera);
        if (!prefersReducedMotion) requestAnimationFrame(render);
    };
    render();
};

document.querySelectorAll('.hero-stage').forEach((stage) => loadThreeScene(stage));

/* Home page: a three-layer WebGL signal with a clear human story. */
const introGate = document.querySelector('.intro-gate');
if (introGate && !prefersReducedMotion) {
    const progressNode = introGate.querySelector('[data-gate-progress]');
    const startedAt = performance.now();
    const duration = 760;
    const countUp = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        if (progressNode) progressNode.textContent = String(Math.round(progress * 100)).padStart(2, '0');
        if (progress < 1) requestAnimationFrame(countUp);
    };
    requestAnimationFrame(countUp);
    window.setTimeout(() => document.body.classList.add('site-ready'), 930);
} else {
    document.body.classList.add('site-ready');
}

const signalStage = document.querySelector('[data-signal-stage]');
const signalThreeCanvas = document.querySelector('#signal-three');
const signalLayerButtons = [...document.querySelectorAll('[data-signal-layer]')];

if (signalStage) {
    const isTurkishHome = document.documentElement.lang === 'tr';
    const layerContent = isTurkishHome ? {
        ai: { line: 'Fikir önce bir titreşimdir.', lines: ['Fikir önce bir titreşimdir.', 'Tekrar eden işi akışa çeviririz.', 'İnsan kararını sistemin içinde tutarız.'], status: 'DÜŞÜN / YÖNLENDİR / OTOMATİKLEŞTİR' },
        web: { line: 'Görünmeyeni bulunur hâle getiririz.', lines: ['Görünmeyeni bulunur hâle getiririz.', 'İyi bir site önce anlaşılır olmalıdır.', 'Arama ile deneyim aynı yöne bakar.'], status: 'ŞEKİLLENDİR / YAPILANDIR / GÖRÜNÜR KIL' },
        content: { line: 'Bir fikre hatırlanacak bir yüz veririz.', lines: ['Bir fikre hatırlanacak bir yüz veririz.', 'İçerik sadece paylaşılmaz, ritim kazanır.', 'Görsel dil, doğru anda anlam kurar.'], status: 'ANLAT / ÇERÇEVELE / HATIRLAT' },
    } : {
        ai: { line: 'Ideas begin as a signal.', lines: ['Ideas begin as a signal.', 'Turn repetitive work into flow.', 'Keep human judgement in the system.'], status: 'THINK / ROUTE / AUTOMATE' },
        web: { line: 'Make the invisible findable.', lines: ['Make the invisible findable.', 'A good site should feel clear first.', 'Search and experience should move together.'], status: 'SHAPE / STRUCTURE / BE FOUND' },
        content: { line: 'Give an idea a face people remember.', lines: ['Give an idea a face people remember.', 'Content is not posted. It gains a rhythm.', 'Visual language makes meaning arrive on time.'], status: 'TELL / FRAME / REMEMBER' },
    };
    const lineNode = signalStage.querySelector('[data-signal-line]');
    const heroLineNode = document.querySelector('[data-hero-line]');
    const statusNode = signalStage.querySelector('[data-signal-status]');
    const igniteButton = signalStage.querySelector('[data-signal-ignite]');
    let activeLayer = 'ai';
    let writingId = 0;
    const lineIndexes = { ai: 0, web: 0, content: 0 };

    const setLayerText = (key, animate = true) => {
        const content = layerContent[key] || layerContent.ai;
        activeLayer = key;
        writingId += 1;
        const currentWritingId = writingId;
        const line = content.lines?.[lineIndexes[key] || 0] || content.line;
        signalStage.dataset.layer = key;
        signalLayerButtons.forEach((button) => {
            const active = button.dataset.signalLayer === key;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-selected', String(active));
        });
        const targets = [lineNode, heroLineNode];
        targets.forEach((target) => {
            if (!target) return;
            target.classList.remove('is-writing');
            if (!animate || prefersReducedMotion) {
                target.textContent = line;
                return;
            }
            target.classList.add('is-writing');
            const previous = target.textContent || '';
            let index = previous.length;
            let phase = 'erase';
            const write = () => {
                if (currentWritingId !== writingId) return;
                if (phase === 'erase' && index > 0) {
                    index -= 1;
                    target.textContent = previous.slice(0, index);
                    window.setTimeout(write, 24);
                } else if (phase === 'erase') {
                    phase = 'write';
                    index = 0;
                    window.setTimeout(write, 95);
                } else if (index <= line.length) {
                    target.textContent = line.slice(0, index);
                    index += 1;
                    window.setTimeout(write, index % 4 === 0 ? 72 : 42);
                } else {
                    target.classList.remove('is-writing');
                }
            };
            write();
        });
        if (statusNode && !signalStage.classList.contains('is-ignited')) statusNode.textContent = isTurkishHome ? 'SİNYAL HAREKETTE' : 'SIGNAL IN MOTION';
        signalStage.style.setProperty('--layer-status', `'${content.status}'`);
    };
    signalLayerButtons.forEach((button) => button.addEventListener('click', () => {
        lineIndexes[button.dataset.signalLayer] = 0;
        setLayerText(button.dataset.signalLayer);
    }));
    setLayerText(activeLayer, false);
    if (!prefersReducedMotion) {
        window.setInterval(() => {
            const lines = layerContent[activeLayer]?.lines || [];
            if (lines.length < 2) return;
            lineIndexes[activeLayer] = (lineIndexes[activeLayer] + 1) % lines.length;
            setLayerText(activeLayer);
        }, 5200);
    }

    const loadHomeSignalScene = async () => {
        if (!signalThreeCanvas) return;
        let THREE;
        try {
            THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
        } catch {
            signalStage.classList.add('scene-fallback');
            return;
        }

        const renderer = new THREE.WebGLRenderer({ canvas: signalThreeCanvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 680 ? 1.25 : 1.65));
        renderer.setClearColor(0x000000, 0);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(31, 1, .1, 100);
        camera.position.set(0, .05, 7.2);
        const world = new THREE.Group();
        world.position.y = -.05;
        scene.add(world);

        const palette = {
            ai: new THREE.Color(0x9af1d4),
            web: new THREE.Color(0xcbbcff),
            content: new THREE.Color(0xff9d7d),
            pulse: new THREE.Color(0xf7bc6f),
        };
        const makeLineMaterial = (color, opacity = .72) => new THREE.LineBasicMaterial({ color, transparent: true, opacity });
        const makeBasicMaterial = (color, opacity = .72) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
        const layerGroups = {};

        const aiGroup = new THREE.Group();
        aiGroup.position.x = -1.48;
        const aiWire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(.78, 2)), makeLineMaterial(palette.ai, .82));
        aiGroup.add(aiWire);
        aiGroup.add(new THREE.Mesh(new THREE.IcosahedronGeometry(.25, 1), makeBasicMaterial(palette.ai, .72)));
        [[1.03, .012, .25], [1.28, .009, -.55]].forEach(([radius, tube, tilt]) => {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 96), makeBasicMaterial(palette.ai, .46));
            ring.rotation.x = Math.PI / 2 + tilt;
            ring.rotation.y = tilt;
            aiGroup.add(ring);
        });
        layerGroups.ai = aiGroup;
        world.add(aiGroup);

        const webGroup = new THREE.Group();
        const webMaterial = makeLineMaterial(palette.web, .62);
        for (let index = 0; index < 4; index += 1) {
            const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.26 - index * .08, .92 - index * .05, .06)), webMaterial.clone());
            frame.position.z = index * -.17;
            frame.position.x = index * .05;
            frame.rotation.z = (index - 1.5) * .075;
            webGroup.add(frame);
        }
        const grid = new THREE.GridHelper(1.38, 8, palette.web, palette.web);
        grid.rotation.x = Math.PI / 2;
        grid.rotation.z = -.2;
        grid.material.transparent = true;
        grid.material.opacity = .26;
        webGroup.add(grid);
        layerGroups.web = webGroup;
        world.add(webGroup);

        const contentGroup = new THREE.Group();
        const curves = [
            [[- .7, -.55, 0], [- .25, .35, .1], [.25, -.2, .16], [.78, .58, .05]],
            [[- .78, .5, -.1], [- .25, -.25, .05], [.28, .4, .15], [.76, -.48, .02]],
            [[- .8, 0, -.2], [- .32, .18, .02], [.33, -.05, .15], [.8, .1, .1]],
        ];
        curves.forEach((points, index) => {
            const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
            const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, index === 2 ? .026 : .014, 6, false), makeBasicMaterial(index === 1 ? palette.pulse : palette.content, index === 2 ? .88 : .56));
            contentGroup.add(tube);
        });
        const contentFrame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.4, 1.03)), makeLineMaterial(palette.content, .35));
        contentFrame.rotation.z = -.12;
        contentGroup.add(contentFrame);
        contentGroup.position.x = 1.48;
        layerGroups.content = contentGroup;
        world.add(contentGroup);

        const bridgeCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1.48, 0, -.25),
            new THREE.Vector3(-.65, .25, .1),
            new THREE.Vector3(.65, -.2, .14),
            new THREE.Vector3(1.48, 0, -.1),
        ]);
        const bridge = new THREE.Line(new THREE.BufferGeometry().setFromPoints(bridgeCurve.getPoints(70)), makeLineMaterial(palette.pulse, .26));
        world.add(bridge);
        const pulseMeshes = [];
        const pulseGeometry = new THREE.SphereGeometry(.055, 12, 12);
        const pulseMaterial = makeBasicMaterial(palette.pulse, .95);
        const activeRings = [];
        let ignitionStarted = -10;
        let pointerX = 0;
        let pointerY = 0;
        let targetX = 0;
        let targetY = 0;
        let elapsed = 0;

        const materialOpacity = (group, active) => {
            group.traverse((object) => {
                const materials = Array.isArray(object.material) ? object.material : [object.material];
                materials.filter(Boolean).forEach((material) => {
                    const base = material.userData?.baseOpacity ?? material.opacity ?? .7;
                    material.userData.baseOpacity = base;
                    material.opacity = base * (active ? 1 : .34);
                });
            });
        };
        const focusLayer = () => Object.entries(layerGroups).forEach(([key, group]) => {
            const focused = key === activeLayer;
            group.scale.lerp(new THREE.Vector3(focused ? 1.16 : .82, focused ? 1.16 : .82, focused ? 1.16 : .82), .09);
            materialOpacity(group, focused);
        });
        const ignite = () => {
            ignitionStarted = elapsed;
            signalStage.classList.remove('is-ignited');
            void signalStage.offsetWidth;
            signalStage.classList.add('is-ignited');
            if (statusNode) statusNode.textContent = isTurkishHome ? 'SİNYAL KATMANLARA YAYILIYOR' : 'SIGNAL MOVING THROUGH LAYERS';
            for (let index = 0; index < 3; index += 1) {
                const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial.clone());
                world.add(pulse);
                pulseMeshes.push({ mesh: pulse, born: elapsed + index * .12 });
                const ring = new THREE.Mesh(new THREE.TorusGeometry(.2 + index * .08, .012, 8, 64), makeBasicMaterial(index === 0 ? palette.pulse : index === 1 ? palette.ai : palette.web, .75));
                ring.position.set(-1.48 + index * 1.48, 0, .12);
                world.add(ring);
                activeRings.push({ mesh: ring, born: elapsed + index * .18 });
            }
            const stageBounds = signalStage.getBoundingClientRect();
            const buttonBounds = igniteButton?.getBoundingClientRect();
            const burstVisual = document.createElement('div');
            burstVisual.className = 'ignition-burst';
            burstVisual.setAttribute('aria-hidden', 'true');
            burstVisual.innerHTML = '<span></span><span></span><span></span>';
            burstVisual.style.left = `${buttonBounds ? buttonBounds.left - stageBounds.left + buttonBounds.width / 2 : stageBounds.width * .68}px`;
            burstVisual.style.top = `${buttonBounds ? buttonBounds.top - stageBounds.top + buttonBounds.height / 2 : stageBounds.height * .5}px`;
            signalStage.appendChild(burstVisual);
            window.setTimeout(() => burstVisual.remove(), 1550);
            window.setTimeout(() => {
                signalStage.classList.remove('is-ignited');
                if (statusNode) statusNode.textContent = isTurkishHome ? 'SİNYAL HAREKETTE' : 'SIGNAL IN MOTION';
            }, 1750);
        };
        igniteButton?.addEventListener('click', ignite);
        signalStage.addEventListener('pointermove', (event) => {
            const bounds = signalStage.getBoundingClientRect();
            targetX = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
            targetY = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
            signalStage.style.setProperty('--art-x', `${targetX * -12}px`);
            signalStage.style.setProperty('--art-y', `${targetY * -8}px`);
        }, { passive: true });
        signalStage.addEventListener('pointerleave', () => {
            targetX = 0;
            targetY = 0;
            signalStage.style.setProperty('--art-x', '0px');
            signalStage.style.setProperty('--art-y', '0px');
        }, { passive: true });
        const resize = () => {
            const width = Math.max(1, signalStage.clientWidth);
            const height = Math.max(1, signalStage.clientHeight);
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            world.scale.setScalar(window.innerWidth < 680 ? .76 : 1);
        };
        window.addEventListener('resize', resize, { passive: true });
        resize();
        const render = () => {
            elapsed += .016;
            pointerX += (targetX - pointerX) * .045;
            pointerY += (targetY - pointerY) * .045;
            world.rotation.y += (pointerX * .12 - world.rotation.y) * .035;
            world.rotation.x += (-pointerY * .08 - world.rotation.x) * .035;
            aiGroup.rotation.y = elapsed * .22;
            aiGroup.rotation.z = Math.sin(elapsed * .7) * .08;
            webGroup.rotation.y = Math.sin(elapsed * .65) * .12;
            webGroup.rotation.z = Math.sin(elapsed * .45) * .035;
            contentGroup.rotation.y = Math.sin(elapsed * .8) * .12;
            bridge.material.opacity = .22 + Math.sin(elapsed * 1.4) * .06;
            focusLayer();
            pulseMeshes.splice(0, pulseMeshes.length, ...pulseMeshes.filter(({ mesh, born }) => {
                const progress = Math.max(0, Math.min(1, (elapsed - born) / 1.28));
                const point = bridgeCurve.getPoint(progress);
                mesh.position.copy(point);
                mesh.scale.setScalar(progress > 0 && progress < 1 ? 1 + Math.sin(progress * Math.PI) * 1.8 : 0);
                mesh.material.opacity = progress > 0 ? 1 - progress : 0;
                if (progress >= 1) {
                    world.remove(mesh);
                    return false;
                }
                return true;
            }));
            activeRings.splice(0, activeRings.length, ...activeRings.filter(({ mesh, born }) => {
                const progress = Math.max(0, Math.min(1, (elapsed - born) / 1.1));
                mesh.scale.setScalar(progress > 0 ? 1 + progress * 3.5 : .01);
                mesh.material.opacity = progress > 0 ? (1 - progress) * .72 : 0;
                if (progress >= 1) {
                    world.remove(mesh);
                    return false;
                }
                return true;
            }));
            renderer.render(scene, camera);
            if (!prefersReducedMotion) requestAnimationFrame(render);
        };
        render();
    };
    loadHomeSignalScene();
}

const practiceConsole = document.querySelector('.practice-console');
if (practiceConsole) {
    const isTurkish = document.documentElement.lang === 'tr';
    const practiceContent = isTurkish ? {
        ai: { index: '01 / THINK', title: 'Tekrar eden işi<br><em>akıllı akışa</em> dönüştür.', copy: 'Araştırma, kişiselleştirme, e-posta yönetimi ve takip gibi operasyonları insan kontrolünü kaybetmeden birbirine bağlarız.', whisper: 'RESEARCH → DECIDE → FOLLOW UP' },
        web: { index: '02 / SHAPE', title: 'Görünür ol.<br><em>Anlaşılır kal.</em>', copy: 'Tasarımdan teknik düzene, içerik mimarisinden SEO temizliğine kadar sitenin bulunması ve güven vermesi için gereken katmanları kurarız.', whisper: 'DESIGN → STRUCTURE → BE FOUND' },
        content: { index: '03 / TELL', title: 'Markanın sesini<br><em>hareketli tut.</em>', copy: 'Sosyal medya, kısa video ve görsel yönü tek seferlik paylaşımlar değil, hatırlanabilir bir içerik ritmine dönüştürürüz.', whisper: 'IDEA → MAKE → PUBLISH' },
    } : {
        ai: { index: '01 / THINK', title: 'Turn repetitive work<br>into <em>an intelligent flow.</em>', copy: 'Research, personalisation, email operations and follow-ups become connected workflows—without removing the human judgement that matters.', whisper: 'RESEARCH → DECIDE → FOLLOW UP' },
        web: { index: '02 / SHAPE', title: 'Be visible.<br><em>Stay clear.</em>', copy: 'From design to technical hygiene, content architecture to SEO cleanup: we build the layers that let a site be found and trusted.', whisper: 'DESIGN → STRUCTURE → BE FOUND' },
        content: { index: '03 / TELL', title: 'Keep the brand voice<br><em>in motion.</em>', copy: 'Social content, short-form video and visual direction become a memorable publishing rhythm—not one-off posts.', whisper: 'IDEA → MAKE → PUBLISH' },
    };
    const indexNode = practiceConsole.querySelector('[data-practice-index]');
    const titleNode = practiceConsole.querySelector('[data-practice-title]');
    const copyNode = practiceConsole.querySelector('[data-practice-copy]');
    const whisperNode = practiceConsole.querySelector('[data-practice-whisper]');
    practiceConsole.querySelectorAll('[data-practice-tab]').forEach((button) => button.addEventListener('click', () => {
        const key = button.dataset.practiceTab;
        const content = practiceContent[key];
        if (!content) return;
        practiceConsole.dataset.practice = key;
        indexNode.textContent = content.index;
        titleNode.innerHTML = content.title;
        copyNode.textContent = content.copy;
        whisperNode.textContent = content.whisper;
        practiceConsole.querySelectorAll('[data-practice-tab]').forEach((tab) => {
            const active = tab === button;
            tab.classList.toggle('is-active', active);
            tab.setAttribute('aria-selected', String(active));
        });
    }));
}
