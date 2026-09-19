(() => {
    const preferenceKey = 'omer-muge-language';
    const current = document.documentElement.lang === 'tr' ? 'tr' : 'en';
    const path = window.location.pathname.toLowerCase();
    const normalizedPath = path.replace(/\/$/, '');
    const isHome = /(?:^|\/)(?:index(?:_tr)?\.html)?$/.test(path) || normalizedPath.endsWith('/portfolio');
    let saved = '';
    try {
        const stored = window.localStorage.getItem(preferenceKey);
        saved = stored === 'tr' || stored === 'en' ? stored : '';
    } catch {
        saved = '';
    }
    const browserLanguage = (navigator.languages?.[0] || navigator.language || '').toLowerCase();
    const detected = browserLanguage.startsWith('tr') ? 'tr' : 'en';
    const target = saved || detected;

    if (isHome && target !== current) {
        const destination = target === 'tr' ? 'index_tr.html' : 'index.html';
        window.location.replace(`${destination}${window.location.search}${window.location.hash}`);
        return;
    }

    document.querySelectorAll('[data-lang-choice]').forEach((link) => {
        link.addEventListener('click', () => {
            try { window.localStorage.setItem(preferenceKey, link.dataset.langChoice); } catch { /* private browsing */ }
        });
    });
})();
