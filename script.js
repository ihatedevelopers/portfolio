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

/* Home page: one expressive, pointer-responsive signal instead of a dashboard of effects. */
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
const signalCanvas = document.querySelector('#signal-canvas');

if (signalStage && signalCanvas) {
    const context = signalCanvas.getContext('2d');
    const igniteButton = signalStage.querySelector('[data-signal-ignite]');
    const statusNode = signalStage.querySelector('[data-signal-status]');
    const pointer = { x: .7, y: .5, tx: .7, ty: .5, active: false };
    const bursts = [];
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let ignition = 0;

    const resizeSignal = () => {
        const bounds = signalStage.getBoundingClientRect();
        pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        width = Math.max(1, bounds.width);
        height = Math.max(1, bounds.height);
        signalCanvas.width = Math.round(width * pixelRatio);
        signalCanvas.height = Math.round(height * pixelRatio);
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const signalPoint = (u, time, lane = 0) => {
        const drift = Math.sin((u * 5.4) + time * .00056 + lane * .9);
        const smaller = Math.sin((u * 12.4) - time * .0011 + lane * 1.7);
        const pull = Math.exp(-Math.pow((u - .54) / .23, 2));
        const baseX = width * (.65 + drift * .125 + smaller * .022 + lane * .012);
        const targetX = pointer.x * width;
        const targetY = pointer.y * height;
        return {
            x: baseX + (targetX - baseX) * pull * .19,
            y: height * (.07 + u * .86) + Math.cos((u * 8.4) + time * .0007 + lane) * height * .022 + (targetY - height * .5) * pull * .09,
        };
    };

    const ignite = () => {
        const center = signalPoint(.53, performance.now());
        bursts.push({ x: center.x, y: center.y, born: performance.now() });
        ignition = 1;
        signalStage.classList.add('is-ignited');
        if (statusNode) statusNode.textContent = document.documentElement.lang === 'tr' ? 'SİNYAL YAYILIYOR' : 'SIGNAL EXPANDING';
        window.setTimeout(() => {
            signalStage.classList.remove('is-ignited');
            if (statusNode) statusNode.textContent = document.documentElement.lang === 'tr' ? 'SİNYAL HAREKETTE' : 'SIGNAL IN MOTION';
        }, 1300);
    };

    signalStage.addEventListener('pointermove', (event) => {
        const bounds = signalStage.getBoundingClientRect();
        pointer.tx = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
        pointer.ty = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
        pointer.active = true;
    }, { passive: true });
    signalStage.addEventListener('pointerleave', () => { pointer.active = false; }, { passive: true });
    igniteButton?.addEventListener('click', ignite);
    window.addEventListener('resize', resizeSignal, { passive: true });
    resizeSignal();

    const drawLine = (time, lane, color, lineWidth, alpha) => {
        context.beginPath();
        const steps = 120;
        for (let step = 0; step <= steps; step += 1) {
            const point = signalPoint(step / steps, time, lane);
            if (step === 0) context.moveTo(point.x, point.y);
            else context.lineTo(point.x, point.y);
        }
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.globalAlpha = alpha;
        context.stroke();
    };

    const renderSignal = (time) => {
        if (!width || !height) return;
        pointer.x += ((pointer.active ? pointer.tx : .7) - pointer.x) * .055;
        pointer.y += ((pointer.active ? pointer.ty : .5) - pointer.y) * .055;
        ignition *= .968;
        context.clearRect(0, 0, width, height);

        const glow = context.createRadialGradient(width * .67, height * .49, 5, width * .67, height * .49, Math.max(width, height) * .53);
        glow.addColorStop(0, `rgba(154, 241, 212, ${.11 + ignition * .11})`);
        glow.addColorStop(.43, 'rgba(247, 188, 111, .035)');
        glow.addColorStop(1, 'rgba(13, 13, 14, 0)');
        context.fillStyle = glow;
        context.fillRect(0, 0, width, height);

        context.save();
        context.globalCompositeOperation = 'lighter';
        context.lineCap = 'round';
        context.shadowBlur = 25 + ignition * 45;
        context.shadowColor = 'rgba(154, 241, 212, .56)';
        drawLine(time, -1, '#f7bc6f', 1.15, .62);
        drawLine(time, 0, '#9af1d4', 2.25 + ignition * 1.2, .88);
        drawLine(time, 1, '#cbbcff', 1.1, .48);

        for (let index = 0; index < 30; index += 1) {
            const flow = (index / 30 + time * .000082) % 1;
            const point = signalPoint(flow, time, (index % 3) - 1);
            const radius = 1.2 + ((index * 7) % 4) * .35 + ignition * 1.3;
            context.beginPath();
            context.fillStyle = index % 4 === 0 ? '#f7bc6f' : '#e9e3d9';
            context.globalAlpha = .4 + (Math.sin(time * .004 + index) + 1) * .2;
            context.arc(point.x, point.y, radius, 0, Math.PI * 2);
            context.fill();
        }

        for (let index = bursts.length - 1; index >= 0; index -= 1) {
            const burst = bursts[index];
            const age = (time - burst.born) / 1100;
            if (age >= 1) {
                bursts.splice(index, 1);
                continue;
            }
            context.beginPath();
            context.globalAlpha = (1 - age) * .72;
            context.strokeStyle = age < .45 ? '#f7bc6f' : '#9af1d4';
            context.lineWidth = 1.2;
            context.arc(burst.x, burst.y, 20 + age * Math.min(width, height) * .68, 0, Math.PI * 2);
            context.stroke();
        }
        context.restore();
        if (!prefersReducedMotion) requestAnimationFrame(renderSignal);
    };
    renderSignal(performance.now());
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
