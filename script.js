  document.documentElement.classList.add('js');

  // ---- sticky nav border
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('stuck', window.scrollY > 8);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  // ---- reveal on scroll
  // A plain rect check instead of IntersectionObserver: it behaves the same for readers and cannot
  // leave a section invisible in a host that throttles observers (offscreen windows, some embeds).
  const revealNow = () => {
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.93 && r.bottom > 0) el.classList.add('in');
    });
  };
  addEventListener('scroll', revealNow, { passive: true });
  addEventListener('resize', revealNow);
  addEventListener('load', revealNow);
  revealNow();

  // ---- performance bars: empty by default, exactly like the app
  const meterObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.3 });
  document.querySelectorAll('.fill').forEach((f) => meterObserver.observe(f));

  // ---- carousel
  const rail = document.getElementById('rail');
  const dots = document.getElementById('dots');
  const slides = [...rail.querySelectorAll('.slide')];
  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Screenshot ' + (i + 1));
    b.addEventListener('click', () => {
      rail.scrollTo({ left: slides[i].offsetLeft - rail.offsetLeft, behavior: 'smooth' });
    });
    dots.appendChild(b);
  });
  const syncDots = () => {
    const center = rail.scrollLeft + rail.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    slides.forEach((s, i) => {
      const mid = s.offsetLeft - rail.offsetLeft + s.clientWidth / 2;
      const d = Math.abs(mid - center);
      if (d < bestDist) { bestDist = d; best = i; }
      s.setAttribute('aria-hidden', 'false');
    });
    [...dots.children].forEach((d, i) => d.setAttribute('aria-current', String(i === best)));
  };
  rail.addEventListener('scroll', () => { clearTimeout(rail._t); rail._t = setTimeout(syncDots, 90); }, { passive: true });
  addEventListener('resize', syncDots);
  syncDots();
  document.getElementById('prev').addEventListener('click', () => {
    const i = [...dots.children].findIndex((d) => d.getAttribute('aria-current') === 'true');
    const t = Math.max(0, i - 1);
    rail.scrollTo({ left: slides[t].offsetLeft - rail.offsetLeft, behavior: 'smooth' });
  });
  document.getElementById('next').addEventListener('click', () => {
    const i = [...dots.children].findIndex((d) => d.getAttribute('aria-current') === 'true');
    const t = Math.min(slides.length - 1, i + 1);
    rail.scrollTo({ left: slides[t].offsetLeft - rail.offsetLeft, behavior: 'smooth' });
  });

  // ---- OS detection: one build exists today (Windows x64). Every platform gets a button that is
  // visible and says exactly what it will do, instead of a Windows-only page pretending otherwise.
  (() => {
    const platforms = [
      {
        id: 'windows',
        label: 'Windows 10/11',
        note: 'x64 installer · NSIS · 103.6 MB',
        match: (ua, plat) => /Windows/i.test(ua) || /Win/i.test(plat),
        href: 'Lighting-Launcher-Setup-0.9.5-win-x64.exe',
        available: true
      },
      {
        id: 'macos',
        label: 'macOS',
        note: 'Apple silicon and Intel — not built yet',
        // iPadOS sends a Mac UA — a touch-capable "Mac" is an iPad, handled below.
        match: (ua, plat) => (/Mac/i.test(ua) || /Mac/i.test(plat)) && navigator.maxTouchPoints <= 1,
        available: false
      },
      {
        // Phones report "Linux" in the user agent too, so they must be matched before desktops.
        id: 'android',
        label: 'Android / iOS',
        note: 'No mobile build — this launcher runs Java',
        match: (ua, plat) => /Android|iPhone|iPad|iPod/i.test(ua) || (/Mac/i.test(plat) && navigator.maxTouchPoints > 1),
        available: false
      },
      {
        id: 'linux',
        label: 'Linux',
        note: 'x64 — not built yet',
        match: (ua, plat) => /Linux|X11/i.test(ua) || /Linux/i.test(plat),
        available: false
      }
    ]

    const ua = navigator.userAgent || ''
    const plat = navigator.userAgentData?.platform || navigator.platform || ''
    const detected = platforms.find((p) => p.match(ua, plat)) ?? platforms[0]

    const detect = document.getElementById('osdetect')
    const label = document.getElementById('oslabel')
    const primary = document.getElementById('dlprimary')
    const primaryLabel = document.getElementById('dlprimarylabel')
    const heroBtn = document.getElementById('herodownload')
    const heroLabel = document.getElementById('herodownloadlabel')
    const otherBtn = document.getElementById('dlother')
    const otherLabel = document.getElementById('dlotherlabel')
    const list = document.getElementById('dllist')
    const file = document.getElementById('dlfile')
    const size = document.getElementById('dlsize')
    const sha = document.getElementById('dlsha')
    const reqKey = document.getElementById('dlreqk')
    const req = document.getElementById('dlreq')

    const ICON = {
      windows: '<path d="M3 5.5 10.5 4.6v6.9H3z"/><path d="M12 4.3 21 3v8.5h-9z"/><path d="M3 13h7.5v6.9L3 19z"/><path d="M12 13h9V21l-9-1.2z"/>',
      macos: '<path d="M16 3.5c-1.1.1-2.3.8-3 1.7-.6.8-1.1 2-.9 3.1 1.2 0 2.4-.7 3.1-1.6.7-.9 1-2 .8-3.2Z"/><path d="M19.5 16.2c-.5 1.2-.8 1.7-1.4 2.7-.9 1.4-2.2 3.1-3.8 3.1-1.4 0-1.8-.9-3.7-.9s-2.3.9-3.6.9c-1.6 0-2.8-1.6-3.7-2.9-2.6-3.9-2.9-8.5-1.3-10.9 1.1-1.7 2.9-2.7 4.6-2.7 1.7 0 2.7 1 4.1 1 1.4 0 2.2-1 4.1-1 1.5 0 3 .8 4.1 2.2-3.6 2-3 7.1.6 8.5Z"/>',
      linux: '<path d="M12 2.8c-2 0-3 1.7-3 3.8 0 1.4-.4 2.3-1.2 3.5C6.6 11.8 5.5 14 5.5 16.2c0 2.6 2.4 4.4 6.5 4.4s6.5-1.8 6.5-4.4c0-2.2-1.1-4.4-2.3-6.1-.8-1.2-1.2-2.1-1.2-3.5 0-2.1-1-3.8-3-3.8Z"/><path d="M10.4 7.4h.01M13.6 7.4h.01"/>',
      android: '<rect x="6" y="8" width="12" height="12" rx="2.4"/><path d="M9 5.5 8 3.4M15 5.5l1-2.1"/><path d="M3.6 11v5M20.4 11v5"/>'
    }

    const row = (p, isDetected) => {
      const el = document.createElement(p.available ? 'a' : 'button')
      if (p.available) {
        el.href = p.href
        el.setAttribute('download', '')
      } else {
        el.type = 'button'
        el.setAttribute('aria-disabled', 'true')
        el.title = 'No ' + p.label + ' build exists yet'
      }
      el.className = 'dl-row'
      el.innerHTML =
        '<svg class="ic" viewBox="0 0 24 24">' + ICON[p.id] + '</svg>' +
        '<span><b>' + p.label + '</b><span>' + p.note + '</span></span>' +
        (p.available
          ? (isDetected ? '<span class="tag">Your system</span>' : '<span class="tag">Download</span>')
          : '<span class="tag soon">Not built</span>')
      return el
    }

    // Primary button follows the detected OS.
    if (detected.available) {
      primary.href = detected.href
      primaryLabel.textContent = 'Download for ' + detected.label
      heroBtn.href = detected.href
      heroLabel.textContent = 'Download for ' + detected.label
      detect.classList.remove('unsupported')
      label.textContent = 'Detected ' + detected.label + ' — this build is ready'
      req.textContent = detected.id === 'windows' ? 'Windows 10/11 · x64 · 4 GB RAM or more' : detected.note
    } else {
      // Nothing to download for this OS: point the primary button at the list and say so.
      primary.removeAttribute('href')
      primary.removeAttribute('download')
      primary.setAttribute('role', 'button')
      primary.setAttribute('aria-disabled', 'true')
      primary.classList.remove('btn-primary')
      primary.classList.add('btn-ghost', 'is-disabled')
      primary.style.cursor = 'not-allowed'
      primaryLabel.textContent = 'No ' + detected.label + ' build'
      heroBtn.href = '#download'
      heroBtn.removeAttribute('download')
      heroLabel.textContent = 'Windows build only'
      detect.classList.add('unsupported')
      label.textContent = 'Detected ' + detected.label + ' — no build for this OS yet'
      file.textContent = 'Windows build: ' + 'Lighting-Launcher-Setup-0.9.5-win-x64.exe'
      req.textContent = 'This launcher is Windows-only today'
    }

    // The full list is always one click away and every row is visible.
    platforms
      .slice()
      .sort((a, b) => Number(b.id === detected.id) - Number(a.id === detected.id))
      .forEach((p) => list.appendChild(row(p, p.id === detected.id)))
    if (!detected.available) list.hidden = false, otherLabel.textContent = 'Hide platform list'
    otherBtn.addEventListener('click', () => {
      const open = list.hidden
      list.hidden = !open
      otherBtn.setAttribute('aria-expanded', String(open))
      otherLabel.textContent = open ? 'Hide platform list' : 'Other platforms'
    })
  })()

  // ---- keyboard for the rail
  rail.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); document.getElementById('next').click(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); document.getElementById('prev').click(); }
  });
