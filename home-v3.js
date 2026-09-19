const v3ReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const v3Turkish = document.documentElement.lang === 'tr';
const v3Root = document.body;
const v3Intro = document.querySelector('[data-v3-intro]');
const v3Nav = document.querySelector('[data-v3-nav]');
const v3Menu = document.querySelector('[data-v3-menu]');
const v3Visual = document.querySelector('[data-v3-visual]');
const v3Canvas = document.querySelector('#v3-thread');
const v3Live = document.querySelector('[data-v3-live]');
const v3Word = document.querySelector('[data-v3-word]');
const v3Stages = [...document.querySelectorAll('[data-v3-stage]')];
const v3WorkMedia = document.querySelector('[data-v3-work-media]');
const v3WorkImage = document.querySelector('[data-v3-work-image]');

const v3Lines = v3Turkish ? [
    'Fikir önce bir titreşimdir.',
    'Sonra doğru sistem onu taşır.',
    'İyi iş, görünmeyeni sadeleştirir.',
] : [
    'Every idea starts as a signal.',
    'The right system carries it forward.',
    'Good work makes the invisible clear.',
];
let v3LineIndex = 0;
let v3WriteId = 0;

const v3WriteLine = (value) => {
    if (!v3Live) return;
    v3WriteId += 1;
    const id = v3WriteId;
    if (v3ReducedMotion) { v3Live.textContent = value; return; }
    const previous = v3Live.textContent || '';
    let index = previous.length;
    let phase = 'erase';
    const tick = () => {
        if (id !== v3WriteId) return;
        if (phase === 'erase' && index > 0) { v3Live.textContent = previous.slice(0, --index); window.setTimeout(tick, 20); }
        else if (phase === 'erase') { phase = 'write'; index = 0; window.setTimeout(tick, 70); }
        else if (index <= value.length) { v3Live.textContent = value.slice(0, index++); window.setTimeout(tick, 42); }
    };
    tick();
};

if (!v3ReducedMotion) window.setInterval(() => { v3LineIndex = (v3LineIndex + 1) % v3Lines.length; v3WriteLine(v3Lines[v3LineIndex]); }, 5600);

const v3Words = v3Turkish ? ['çalışan', 'görünen', 'büyüyen', 'anlamlı'] : ['useful', 'visible', 'moving', 'memorable'];
let v3WordIndex = 0;
const v3SwapWord = () => {
    if (!v3Word || v3ReducedMotion) return;
    v3Word.classList.add('is-swapping');
    window.setTimeout(() => {
        v3WordIndex = (v3WordIndex + 1) % v3Words.length;
        v3Word.textContent = v3Words[v3WordIndex];
        v3Word.classList.remove('is-swapping');
        v3Word.classList.add('is-entering');
        window.setTimeout(() => v3Word.classList.remove('is-entering'), 420);
    }, 260);
};
if (!v3ReducedMotion) window.setInterval(v3SwapWord, 4600);

let v3StageIndex = 0;
if (!v3ReducedMotion && v3Stages.length) window.setInterval(() => {
    v3StageIndex = (v3StageIndex + 1) % v3Stages.length;
    v3Stages.forEach((stage, index) => stage.classList.toggle('is-active', index === v3StageIndex));
}, 1350);

v3Menu?.addEventListener('click', () => {
    const open = v3Nav?.classList.toggle('is-open');
    v3Menu.setAttribute('aria-expanded', String(Boolean(open)));
});
document.querySelectorAll('.v3-links a').forEach((link) => link.addEventListener('click', () => { v3Nav?.classList.remove('is-open'); v3Menu?.setAttribute('aria-expanded', 'false'); }));
window.addEventListener('scroll', () => v3Nav?.classList.toggle('is-scrolled', window.scrollY > 30), { passive: true });

const v3RevealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); v3RevealObserver.unobserve(entry.target); } }), { threshold: .1 });
document.querySelectorAll('.v3-home .reveal').forEach((element) => v3RevealObserver.observe(element));

const workImages = {
    ai: 'assets/visual-ai-v1.png',
    web: 'assets/visual-web-v1.png',
    content: 'assets/visual-content-v1.png',
    tooling: 'assets/hero-workflow-v1.png',
};
document.querySelectorAll('[data-v3-work]').forEach((item) => {
    const show = () => {
        const next = workImages[item.dataset.v3Work];
        if (!next || !v3WorkImage || !v3WorkMedia) return;
        document.querySelectorAll('[data-v3-work]').forEach((node) => node.classList.toggle('is-active', node === item));
        v3WorkMedia.classList.add('is-changing');
        window.setTimeout(() => { v3WorkImage.src = next; v3WorkMedia.classList.remove('is-changing'); }, 180);
    };
    item.addEventListener('mouseenter', show);
    item.addEventListener('focus', show);
});

if (v3Intro) {
    const progress = v3Intro.querySelector('[data-v3-progress]');
    const duration = v3ReducedMotion ? 180 : 760;
    const start = performance.now();
    const count = (now) => { const value = Math.min((now - start) / duration, 1); if (progress) progress.textContent = String(Math.round(value * 100)).padStart(2, '0'); if (value < 1) requestAnimationFrame(count); };
    requestAnimationFrame(count);
    window.setTimeout(() => v3Intro.classList.add('is-leaving'), v3ReducedMotion ? 220 : 920);
}

const initV3Thread = async () => {
    if (!v3Canvas || !v3Visual) return;
    let THREE;
    try { THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'); } catch { v3Visual.classList.add('scene-fallback'); return; }
    const renderer = new THREE.WebGLRenderer({ canvas: v3Canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 680 ? 1.2 : 1.5));
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, 1, .1, 100);
    camera.position.set(0, 0, 8);
    const world = new THREE.Group();
    scene.add(world);
    const mint = new THREE.Color(0xa6ead6);
    const paper = new THREE.Color(0xf3f0e9);
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.9, -.12, .04),
        new THREE.Vector3(-2.45, -.1, .08),
        new THREE.Vector3(-1.1, .17, .1),
        new THREE.Vector3(.22, -.08, .08),
        new THREE.Vector3(1.4, .12, .06),
        new THREE.Vector3(3.65, .1, .04),
    ]);
    const thread = new THREE.Mesh(new THREE.TubeGeometry(curve, 120, .012, 5, false), new THREE.MeshBasicMaterial({ color: mint, transparent: true, opacity: .82 }));
    world.add(thread);
    const anchor = new THREE.Mesh(new THREE.TorusGeometry(.33, .012, 8, 72), new THREE.MeshBasicMaterial({ color: mint, transparent: true, opacity: .8 }));
    anchor.position.set(.95, .05, .12);
    world.add(anchor);
    const moving = new THREE.Mesh(new THREE.SphereGeometry(.055, 12, 12), new THREE.MeshBasicMaterial({ color: paper, transparent: true, opacity: .95 }));
    world.add(moving);
    const particles = [];
    for (let index = 0; index < 7; index += 1) { const particle = new THREE.Mesh(new THREE.SphereGeometry(.024, 8, 8), new THREE.MeshBasicMaterial({ color: mint, transparent: true, opacity: .72 })); world.add(particle); particles.push({ mesh: particle, offset: index / 7 }); }
    let pointerX = 0; let pointerY = 0; let targetX = 0; let targetY = 0; let elapsed = 0;
    const resize = () => { const width = Math.max(1, v3Visual.clientWidth); const height = Math.max(1, v3Visual.clientHeight); renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); world.scale.setScalar(window.innerWidth < 680 ? .72 : 1); };
    resize(); window.addEventListener('resize', resize, { passive: true });
    v3Visual.addEventListener('pointermove', (event) => { const bounds = v3Visual.getBoundingClientRect(); targetX = ((event.clientX - bounds.left) / bounds.width - .5) * 2; targetY = ((event.clientY - bounds.top) / bounds.height - .5) * 2; v3Visual.style.setProperty('--visual-x', `${targetX * -5}px`); v3Visual.style.setProperty('--visual-y', `${targetY * -4}px`); }, { passive: true });
    v3Visual.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; v3Visual.style.setProperty('--visual-x', '0px'); v3Visual.style.setProperty('--visual-y', '0px'); }, { passive: true });
    const render = () => { elapsed += .016; pointerX += (targetX - pointerX) * .04; pointerY += (targetY - pointerY) * .04; world.rotation.y += (pointerX * .07 - world.rotation.y) * .035; world.rotation.x += (-pointerY * .05 - world.rotation.x) * .035; anchor.rotation.z = elapsed * .12; const progress = (elapsed * .075) % 1; moving.position.copy(curve.getPoint(progress)); moving.scale.setScalar(1 + Math.sin(progress * Math.PI) * 1.2); particles.forEach(({ mesh, offset }) => mesh.position.copy(curve.getPoint((offset + progress) % 1))); renderer.render(scene, camera); if (!v3ReducedMotion) requestAnimationFrame(render); };
    render();
};
initV3Thread();
