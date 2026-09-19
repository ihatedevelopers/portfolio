const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const focusContent = {
    ai: ['AI workflows', 'Research, triage, personalisation and follow-up logic that keeps moving.'],
    web: ['Web / SEO', 'Fast, clear digital surfaces built to be found and understood.'],
    content: ['Content systems', 'A repeatable visual and editorial layer for social channels.'],
    experience: ['Human layer', 'Technology that still feels useful, direct and personal.'],
};

const updateFocus = (stage, key) => {
    const [title, description] = focusContent[key] || focusContent.ai;
    const titleNode = stage.querySelector('[data-focus-title]');
    const descriptionNode = stage.querySelector('[data-focus-description]');
    if (titleNode) titleNode.textContent = title;
    if (descriptionNode) descriptionNode.textContent = description;
    stage.querySelectorAll('.scene-node').forEach((node) => node.classList.toggle('is-active', node.dataset.focus === key));
};

document.querySelectorAll('.hero-stage').forEach((stage) => {
    stage.querySelectorAll('.scene-node').forEach((node) => node.addEventListener('click', () => updateFocus(stage, node.dataset.focus)));
});

const loadScene = async (stage) => {
    const canvas = stage.querySelector('#hero-canvas');
    if (!canvas) return;

    let THREE;
    try {
        THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
    } catch (error) {
        stage.classList.add('scene-fallback');
        return;
    }

    const theme = document.body.classList.contains('muge-page') || document.body.classList.contains('muge')
        ? { main: 0xff8066, secondary: 0xffc0a7, glow: 0x351819 }
        : { main: 0x8ef4d2, secondary: 0x9ed8ff, glow: 0x10372f };

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    camera.position.set(0, .2, 6.6);
    const world = new THREE.Group();
    scene.add(world);

    const ambient = new THREE.PointLight(theme.main, 3.4, 12);
    ambient.position.set(1.2, 1.7, 3);
    scene.add(ambient);
    const cool = new THREE.PointLight(theme.secondary, 1.8, 10);
    cool.position.set(-3, -1, 2);
    scene.add(cool);

    const core = new THREE.Group();
    world.add(core);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: theme.main, transparent: true, opacity: .78, wireframe: true });
    const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.16, 2), coreMaterial);
    core.add(coreMesh);
    const shellMaterial = new THREE.MeshBasicMaterial({ color: theme.secondary, transparent: true, opacity: .08, side: THREE.DoubleSide });
    core.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.36, 2), shellMaterial));
    const coreDot = new THREE.Mesh(new THREE.SphereGeometry(.08, 12, 12), new THREE.MeshBasicMaterial({ color: theme.main }));
    core.add(coreDot);

    const ringMaterial = new THREE.MeshBasicMaterial({ color: theme.main, transparent: true, opacity: .31, side: THREE.DoubleSide });
    [[1.62, .08, .34], [2.02, .05, -.7], [2.55, .035, .1]].forEach(([radius, tube, rotation]) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 96), ringMaterial);
        ring.rotation.x = Math.PI / 2 + rotation;
        ring.rotation.y = rotation * .7;
        world.add(ring);
    });

    const starsGeometry = new THREE.BufferGeometry();
    const stars = new Float32Array(330 * 3);
    for (let i = 0; i < stars.length; i += 3) {
        const radius = 3.2 + Math.random() * 2.7;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        stars[i] = radius * Math.sin(phi) * Math.cos(theta);
        stars[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        stars[i + 2] = radius * Math.cos(phi);
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(stars, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: theme.secondary, size: .022, transparent: true, opacity: .7, sizeAttenuation: true });
    world.add(new THREE.Points(starsGeometry, starsMaterial));

    const nodePositions = [
        new THREE.Vector3(-1.35, .78, .15),
        new THREE.Vector3(1.37, .5, .1),
        new THREE.Vector3(-1.15, -1.02, .2),
        new THREE.Vector3(1.1, -1.16, .12),
    ];
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: theme.main });
    nodePositions.forEach((position) => {
        const node = new THREE.Mesh(new THREE.SphereGeometry(.055, 12, 12), nodeMaterial);
        node.position.copy(position);
        world.add(node);
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([position.clone().multiplyScalar(.9), new THREE.Vector3(0, 0, 0)]);
        world.add(new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: theme.main, transparent: true, opacity: .29 })));
    });

    const resize = () => {
        const width = stage.clientWidth;
        const height = stage.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    stage.addEventListener('pointermove', (event) => {
        const rect = stage.getBoundingClientRect();
        pointerX = ((event.clientX - rect.left) / rect.width - .5) * 2;
        pointerY = ((event.clientY - rect.top) / rect.height - .5) * 2;
    }, { passive: true });
    stage.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; }, { passive: true });

    const clock = new THREE.Clock();
    const render = () => {
        const time = clock.getElapsedTime();
        targetX += (pointerY * .16 - targetX) * .045;
        targetY += (pointerX * .22 - targetY) * .045;
        world.rotation.x = prefersReducedMotion ? .05 : targetX + Math.sin(time * .17) * .035;
        world.rotation.y = prefersReducedMotion ? -.12 : targetY + time * .035;
        core.rotation.x = time * .16;
        core.rotation.z = time * .1;
        core.scale.setScalar(1 + Math.sin(time * 1.4) * .025);
        if (prefersReducedMotion) {
            renderer.render(scene, camera);
            return;
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };
    render();
};

document.querySelectorAll('.hero-stage').forEach((stage) => loadScene(stage));

const start = performance.now();
document.documentElement.style.setProperty('--page-start', `${start}`);
