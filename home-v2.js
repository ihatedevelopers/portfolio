const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTurkish = document.documentElement.lang === 'tr';
const root = document.body;
const intro = document.querySelector('[data-intro]');
const nav = document.querySelector('[data-v2-nav]');
const menu = document.querySelector('[data-v2-menu]');
const stage = document.querySelector('[data-v2-stage]');
const canvas = document.querySelector('#orchestration-canvas');
const liveLine = document.querySelector('[data-v2-live]');
const stageStatuses = [...document.querySelectorAll('[data-v2-status]')];
const stageTabs = [...document.querySelectorAll('[data-v2-phase]')];
const processSteps = [...document.querySelectorAll('[data-v2-step]')];

const copy = isTurkish ? {
    lines: [
        'Fikir önce bir titreşimdir.',
        'Tekrar eden işi akışa çeviririz.',
        'İyi bir deneyim görünmez emeği gösterir.',
        'İnsan kararını sistemin içinde tutarız.',
    ],
    phases: {
        ai: { line: 'Fikri akışa çevir.', status: 'DÜŞÜN / YÖNLENDİR / OTOMATİKLEŞTİR' },
        web: { line: 'Görünmeyeni bulunur kıl.', status: 'ŞEKİLLENDİR / YAPILANDIR / GÖRÜNÜR KIL' },
        content: { line: 'Bir fikre hatırlanacak bir yüz ver.', status: 'ANLAT / ÇERÇEVELE / HATIRLAT' },
    },
} : {
    lines: [
        'Every idea starts as a signal.',
        'We turn repetitive work into flow.',
        'Good experience makes invisible work legible.',
        'Human judgement stays inside the system.',
    ],
    phases: {
        ai: { line: 'Turn the idea into flow.', status: 'THINK / ROUTE / AUTOMATE' },
        web: { line: 'Make the invisible findable.', status: 'SHAPE / STRUCTURE / BE FOUND' },
        content: { line: 'Give the idea a memorable face.', status: 'TELL / FRAME / REMEMBER' },
    },
};

const phaseColors = { ai: '#a1ead4', web: '#f2b86f', content: '#ee9178' };
let currentPhase = 'ai';
let lineIndex = 0;
let writerId = 0;

const writeLine = (value, animate = true) => {
    if (!liveLine) return;
    writerId += 1;
    const id = writerId;
    if (!animate || reducedMotion) {
        liveLine.textContent = value;
        return;
    }
    const previous = liveLine.textContent || '';
    let index = previous.length;
    let phase = 'erase';
    const tick = () => {
        if (id !== writerId) return;
        if (phase === 'erase' && index > 0) {
            liveLine.textContent = previous.slice(0, --index);
            window.setTimeout(tick, 20);
        } else if (phase === 'erase') {
            phase = 'write';
            index = 0;
            window.setTimeout(tick, 75);
        } else if (index <= value.length) {
            liveLine.textContent = value.slice(0, index++);
            window.setTimeout(tick, index % 4 === 0 ? 65 : 38);
        }
    };
    tick();
};

const setPhase = (phase, animate = true) => {
    if (!copy.phases[phase]) return;
    currentPhase = phase;
    const phaseCopy = copy.phases[phase];
    root.dataset.phase = phase;
    root.style.setProperty('--phase-color', phaseColors[phase]);
    stage?.setAttribute('data-phase', phase);
    stageTabs.forEach((tab) => {
        const active = tab.dataset.v2Phase === phase;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
    });
    stageStatuses.forEach((node) => { node.textContent = phaseCopy.status; });
    writeLine(phaseCopy.line, animate);
};

setPhase('ai', false);
stageTabs.forEach((tab) => tab.addEventListener('click', () => setPhase(tab.dataset.v2Phase)));
if (!reducedMotion) {
    window.setInterval(() => {
        lineIndex = (lineIndex + 1) % copy.lines.length;
        writeLine(copy.lines[lineIndex]);
    }, 5600);
}

menu?.addEventListener('click', () => {
    const open = nav?.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(Boolean(open)));
});
document.querySelectorAll('.v2-nav-links a').forEach((link) => link.addEventListener('click', () => {
    nav?.classList.remove('is-open');
    menu?.setAttribute('aria-expanded', 'false');
}));

window.addEventListener('scroll', () => nav?.classList.toggle('is-scrolled', window.scrollY > 30), { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            processSteps.forEach((step) => step.classList.toggle('is-active', step === entry.target));
            const phase = entry.target.dataset.v2Step;
            if (phase) setPhase(phase);
        }
    });
}, { threshold: .55 });
processSteps.forEach((step) => stepObserver.observe(step));

if (intro) {
    const progress = intro.querySelector('[data-v2-progress]');
    const duration = reducedMotion ? 200 : 880;
    const start = performance.now();
    const count = (now) => {
        const value = Math.min((now - start) / duration, 1);
        if (progress) progress.textContent = `${String(Math.round(value * 100)).padStart(2, '0')}`;
        if (value < 1) requestAnimationFrame(count);
    };
    requestAnimationFrame(count);
    window.setTimeout(() => intro.classList.add('is-leaving'), reducedMotion ? 240 : 1080);
}

const initScene = async () => {
    if (!canvas || !stage) return;
    let THREE;
    try {
        THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
    } catch {
        stage.classList.add('scene-fallback');
        return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 680 ? 1.2 : 1.6));
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, .1, 100);
    camera.position.set(0, 0, 8.2);
    const world = new THREE.Group();
    scene.add(world);

    const colors = {
        ai: new THREE.Color(0xa1ead4),
        web: new THREE.Color(0xf2b86f),
        content: new THREE.Color(0xee9178),
        paper: new THREE.Color(0xf1eee6),
    };
    const lineMaterial = (color, opacity = .72) => new THREE.LineBasicMaterial({ color, transparent: true, opacity });
    const meshMaterial = (color, opacity = .7) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
    const layerGroups = {};

    const ai = new THREE.Group();
    const aiRing = new THREE.Mesh(new THREE.TorusGeometry(.68, .025, 8, 96), meshMaterial(colors.ai, .95));
    aiRing.rotation.x = Math.PI / 2;
    ai.add(aiRing);
    const aiCore = new THREE.Mesh(new THREE.IcosahedronGeometry(.32, 1), meshMaterial(colors.ai, .72));
    ai.add(aiCore);
    const aiSpokes = new THREE.Group();
    for (let index = 0; index < 6; index += 1) {
        const angle = (Math.PI * 2 * index) / 6;
        const spokeGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(Math.cos(angle) * .8, Math.sin(angle) * .8, Math.sin(angle * 2) * .12),
        ]);
        aiSpokes.add(new THREE.Line(spokeGeometry, lineMaterial(colors.ai, .62)));
    }
    ai.add(aiSpokes);
    ai.position.set(-2.15, .15, .08);
    layerGroups.ai = ai;
    world.add(ai);

    const web = new THREE.Group();
    for (let index = 0; index < 3; index += 1) {
        const plane = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.15 - index * .1, .9 - index * .08, .06)), lineMaterial(colors.web, .68 - index * .12));
        plane.position.set(index * .08, index * -.08, index * -.12);
        plane.rotation.z = (index - 1) * .1;
        web.add(plane);
    }
    const webDot = new THREE.Mesh(new THREE.SphereGeometry(.08, 12, 12), meshMaterial(colors.web, .9));
    webDot.position.set(.36, .27, .16);
    web.add(webDot);
    web.position.set(0, -.13, .02);
    layerGroups.web = web;
    world.add(web);

    const content = new THREE.Group();
    const contentCurves = [
        [[.75, .4, .1], [1.15, -.2, .1], [1.7, .38, .08], [2.4, -.18, .08]],
        [[.72, -.24, .14], [1.2, .35, .1], [1.76, -.34, .08], [2.42, .28, .07]],
    ];
    contentCurves.forEach((points, index) => {
        const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
        content.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, index ? .028 : .018, 6, false), meshMaterial(index ? colors.paper : colors.content, index ? .68 : .9)));
    });
    const contentFrame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.ConeGeometry(.54, .86, 3, 1, true)), lineMaterial(colors.content, .76));
    contentFrame.position.set(2.35, .08, .13);
    contentFrame.rotation.z = Math.PI / 2;
    content.add(contentFrame);
    layerGroups.content = content;
    world.add(content);

    const spineCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.55, 0, -.05),
        new THREE.Vector3(-1.45, .42, .1),
        new THREE.Vector3(-.5, -.35, .15),
        new THREE.Vector3(.48, .28, .12),
        new THREE.Vector3(1.5, -.2, .1),
        new THREE.Vector3(2.65, .1, .08),
    ]);
    const spine = new THREE.Mesh(new THREE.TubeGeometry(spineCurve, 100, .012, 5, false), meshMaterial(colors.paper, .48));
    world.add(spine);

    const particles = [];
    const particleGeometry = new THREE.SphereGeometry(.035, 8, 8);
    for (let index = 0; index < 18; index += 1) {
        const particle = new THREE.Mesh(particleGeometry, meshMaterial(index % 3 === 0 ? colors.ai : index % 3 === 1 ? colors.web : colors.content, .9));
        world.add(particle);
        particles.push({ mesh: particle, offset: index / 18, speed: .065 + (index % 5) * .009 });
    }

    const pulses = [];
    let elapsed = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    const focus = () => Object.entries(layerGroups).forEach(([key, group]) => {
        const active = key === currentPhase;
        group.scale.lerp(new THREE.Vector3(active ? 1.1 : .82, active ? 1.1 : .82, active ? 1.1 : .82), .08);
        group.traverse((object) => {
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.filter(Boolean).forEach((material) => {
                const base = material.userData.baseOpacity ?? material.opacity;
                material.userData.baseOpacity = base;
                material.opacity = base * (active ? 1 : .3);
            });
        });
    });
    const resize = () => {
        const width = Math.max(1, stage.clientWidth);
        const height = Math.max(1, stage.clientHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        world.scale.setScalar(window.innerWidth < 680 ? .82 : 1);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    stage.addEventListener('pointermove', (event) => {
        const bounds = stage.getBoundingClientRect();
        targetX = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
        targetY = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
        stage.style.setProperty('--stage-x', `${targetX * -8}px`);
        stage.style.setProperty('--stage-y', `${targetY * -6}px`);
    }, { passive: true });
    stage.addEventListener('pointerleave', () => {
        targetX = 0;
        targetY = 0;
        stage.style.setProperty('--stage-x', '0px');
        stage.style.setProperty('--stage-y', '0px');
    }, { passive: true });

    const ignite = () => {
        stage.classList.remove('is-ignited');
        void stage.offsetWidth;
        stage.classList.add('is-ignited');
        const bounds = stage.getBoundingClientRect();
        const button = stage.querySelector('[data-v2-ignite]')?.getBoundingClientRect();
        const burst = document.createElement('div');
        burst.className = 'v2-burst';
        burst.innerHTML = '<i></i><i></i><i></i>';
        burst.style.left = `${button ? button.left - bounds.left + button.width / 2 : bounds.width * .52}px`;
        burst.style.top = `${button ? button.top - bounds.top + button.height / 2 : bounds.height * .58}px`;
        stage.appendChild(burst);
        window.setTimeout(() => burst.remove(), 1350);
        for (let index = 0; index < 3; index += 1) {
            const pulse = new THREE.Mesh(new THREE.SphereGeometry(.08, 10, 10), meshMaterial(index === 0 ? colors.ai : index === 1 ? colors.web : colors.content, 1));
            world.add(pulse);
            pulses.push({ mesh: pulse, born: elapsed + index * .18 });
        }
        stageStatuses.forEach((node) => { node.textContent = isTurkish ? 'AKIŞ ÜÇ KATMANDAN GEÇİYOR' : 'CURRENT MOVING THROUGH THREE LAYERS'; });
        document.querySelector('[data-v2-hero-ignite]')?.classList.add('is-fired');
        window.setTimeout(() => {
            stage.classList.remove('is-ignited');
            stageStatuses.forEach((node) => { node.textContent = copy.phases[currentPhase].status; });
        }, 1600);
    };
    stage.querySelector('[data-v2-ignite]')?.addEventListener('click', ignite);
    document.querySelector('[data-v2-hero-ignite]')?.addEventListener('click', ignite);

    const render = () => {
        elapsed += .016;
        pointerX += (targetX - pointerX) * .045;
        pointerY += (targetY - pointerY) * .045;
        world.rotation.y += (pointerX * .12 - world.rotation.y) * .035;
        world.rotation.x += (-pointerY * .08 - world.rotation.x) * .035;
        ai.rotation.z = elapsed * .12;
        aiRing.rotation.z = elapsed * -.22;
        web.rotation.z = Math.sin(elapsed * .6) * .035;
        content.rotation.y = Math.sin(elapsed * .7) * .08;
        particles.forEach(({ mesh, offset, speed }) => {
            const progress = (offset + elapsed * speed) % 1;
            mesh.position.copy(spineCurve.getPoint(progress));
            mesh.scale.setScalar(.6 + Math.sin(progress * Math.PI) * 1.2);
        });
        pulses.splice(0, pulses.length, ...pulses.filter(({ mesh, born }) => {
            const progress = Math.max(0, Math.min(1, (elapsed - born) / 1.35));
            mesh.position.copy(spineCurve.getPoint(progress));
            mesh.scale.setScalar(progress > 0 && progress < 1 ? 1 + Math.sin(progress * Math.PI) * 2.5 : 0);
            mesh.material.opacity = progress > 0 ? 1 - progress : 0;
            if (progress >= 1) {
                world.remove(mesh);
                return false;
            }
            return true;
        }));
        focus();
        renderer.render(scene, camera);
        if (!reducedMotion) requestAnimationFrame(render);
    };
    render();
};

initScene();
