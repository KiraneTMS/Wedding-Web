function initTheme(data) {
  const safeSet = (selector, value, isHTML = false) => {
    const el = document.querySelector(selector);
    if (el) el[isHTML ? 'innerHTML' : 'textContent'] = value || "";
  };

  applyOrchidBatik();

  safeSet('[data-tagline]', data.tagline);
  safeSet('[data-date-str]', data.dateStr);
  safeSet('[data-groom-short]', data.groom.name.split(',')[0]);
  safeSet('[data-bride-short]', data.bride.name.split(',')[0]);
  safeSet('[data-groom]', data.groom.name);
  safeSet('[data-bride]', data.bride.name);
  safeSet('[data-groom-parent]', data.groom.parent);
  safeSet('[data-bride-parent]', data.bride.parent);

  const gIg = document.getElementById('groom-ig');
  if (gIg && data.groom.instagram) {
    gIg.textContent = data.groom.instagram;
    gIg.href = `https://instagram.com/${data.groom.instagram.replace('@', '')}`;
  }
  const bIg = document.getElementById('bride-ig');
  if (bIg && data.bride.instagram) {
    bIg.textContent = data.bride.instagram;
    bIg.href = `https://instagram.com/${data.bride.instagram.replace('@', '')}`;
  }

  if (data.gallery && data.gallery.length > 0) {
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) heroBg.style.backgroundImage = `url('${data.gallery[0]}')`;
    const groomImg = document.getElementById('groom-img');
    const brideImg = document.getElementById('bride-img');
    if (groomImg) groomImg.src = data.gallery[1] || data.gallery[0];
    if (brideImg) brideImg.src = data.gallery[2] || data.gallery[0];
  }

  ['ceremony', 'reception'].forEach(key => {
    safeSet(`[data-${key}-title]`, data[key].title);
    safeSet(`[data-${key}-venue]`, data[key].venue);
    safeSet(`[data-${key}-address]`, data[key].address, true);
    safeSet(`[data-${key}-time]`, data[key].time);
    safeSet(`[data-${key}-note]`, data[key].note);
    const map = document.getElementById(`${key}-maps`);
    if (map) map.href = data[key].mapsUrl;
  });

  const storyList = document.getElementById('story-list');
  if (storyList && data.story) {
    storyList.innerHTML = data.story.map((item, i) => `
      <div class="text-center" data-reveal data-reveal-delay="${(i % 4) + 1}">
        <span class="text-soft text-[10px] tracking-widest uppercase">${item.date}</span>
        <h4 class="font-display text-2xl my-1">${item.title}</h4>
        <p class="text-muted text-sm">${item.desc}</p>
      </div>
    `).join('');
  }

  const giftList = document.getElementById('gift-list');
  if (giftList && data.gift) {
    giftList.innerHTML = data.gift.map((g, i) => `
      <div class="minimal-card tilt-card glass-soft rounded-sm px-6 pb-6" data-reveal data-reveal-delay="${(i % 2) + 1}">
        <p class="text-soft text-[10px] uppercase tracking-widest mb-2">${g.bank}</p>
        <p class="text-xl tracking-widest my-2">${g.accountNumber}</p>
        <p class="text-muted text-xs uppercase">a/n ${g.accountHolder}</p>
      </div>
    `).join('');
  }

  const galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid && data.gallery) {
    galleryGrid.innerHTML = data.gallery.map((url, i) => `
      <div class="orchid-frame" data-reveal data-reveal-delay="${(i % 4) + 1}">
        <img src="${url}" alt="Moment" loading="lazy">
      </div>
    `).join('');
  }

  safeSet('[data-footer-quote]', data.footer.quote);
  safeSet('[data-footer-verse]', data.footer.verse);
  safeSet('[data-footer-message]', data.footer.message, true);
  safeSet('[data-footer-closing]', data.footer.closing, true);

  const target = new Date(data.dateISO).getTime();
  setInterval(() => {
    const d = target - Date.now();
    if (d < 0) return;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
    set('days', Math.floor(d / 864e5));
    set('hours', Math.floor((d % 864e5) / 36e5));
    set('minutes', Math.floor((d % 36e5) / 6e4));
    set('seconds', Math.floor((d % 6e4) / 1000));
  }, 1000);

  spawnOrchidParticles();
  initLivestream(data);

  requestAnimationFrame(() => {
    initRevealOnScroll();
    initParallax();
    initCardTilt();
    initMagneticButtons();
    initScrollSettle();
    console.log('[orchid] light batik + effects ready');
  });
}

/* Batik follows theme colors (silver / soft charcoal on white), drawn semi-transparent */
function applyOrchidBatik() {
  const root = document.getElementById('wedding-root');
  if (!root) return;

  try {
    const tile = document.createElement('canvas');
    const ctx = tile.getContext('2d');
    const size = 300;
    tile.width = size;
    tile.height = size;

    // Theme-matched palette (minimal orchid greys)
    const cBg = '#ffffff';
    const cPetal = '#b8bcc2';       // soft silver-grey petal
    const cCenter = '#9ca3ac';      // mid grey core
    const cVine = '#c9ccd1';        // light vine
    const cIsen = 'rgba(156, 163, 172, 0.18)';
    const cCrackle = 'rgba(45, 45, 45, 0.04)';
    const cStroke = 'rgba(255, 255, 255, 0.6)';

    ctx.fillStyle = cBg;
    ctx.fillRect(0, 0, size, size);

    // Isen-isen
    ctx.fillStyle = cIsen;
    for (let x = 0; x < size; x += 15) {
      for (let y = 0; y < size; y += 15) {
        const xOffset = (y % 30 === 0) ? 7.5 : 0;
        ctx.beginPath();
        ctx.arc(x + xOffset, y, 1.15, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Suluran
    ctx.strokeStyle = cVine;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(-20, size + 20);
    ctx.bezierCurveTo(size * 0.3, size * 0.7, size * 0.4, size * 0.3, size + 20, -20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size * 0.35, size * 0.55);
    ctx.bezierCurveTo(size * 0.1, size * 0.4, 0, size * 0.1, size * 0.2, -20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size * 0.7, size * 0.25);
    ctx.bezierCurveTo(size * 0.9, size * 0.5, size + 20, size * 0.6, size * 0.8, size + 20);
    ctx.stroke();

    function drawOrchid(cx, cy, scale, rot) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.scale(scale, scale);

      ctx.fillStyle = cPetal;
      ctx.strokeStyle = cStroke;
      ctx.lineWidth = 1.5;

      const angles = [-Math.PI / 2, Math.PI / 5, Math.PI - Math.PI / 5];
      angles.forEach(a => {
        ctx.save();
        ctx.rotate(a);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(15, -35, 40, -35, 0, -65);
        ctx.bezierCurveTo(-40, -35, -15, -35, 0, 0);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      [-Math.PI / 12, Math.PI + Math.PI / 12].forEach(a => {
        ctx.save();
        ctx.rotate(a);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(45, -15, 55, 20, 70, 0);
        ctx.bezierCurveTo(55, -35, 25, -25, 0, 0);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      ctx.fillStyle = cCenter;
      ctx.beginPath();
      ctx.moveTo(0, -5);
      ctx.bezierCurveTo(20, 5, 15, 35, 0, 30);
      ctx.bezierCurveTo(-15, 35, -20, 5, 0, -5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e8eaed';
      ctx.beginPath();
      ctx.arc(0, 5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    drawOrchid(size * 0.5, size * 0.45, 0.75, 0.2);
    drawOrchid(0, 0, 0.55, -0.5);
    drawOrchid(size, 0, 0.55, 0.5);
    drawOrchid(0, size, 0.55, 0.8);
    drawOrchid(size, size, 0.55, -0.3);

    // Soft crackle
    ctx.strokeStyle = cCrackle;
    ctx.lineWidth = 0.7;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * size, 0);
      let currentX = Math.random() * size;
      let currentY = 0;
      while (currentY < size) {
        currentX += (Math.random() - 0.5) * 25;
        currentY += Math.random() * 30;
        ctx.lineTo(currentX, currentY);
      }
      ctx.stroke();
    }

    const dataUrl = tile.toDataURL();

    // Apply as fixed layer at half opacity so theme stays white-dominant
    let layer = document.getElementById('batik-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'batik-layer';
      layer.setAttribute('aria-hidden', 'true');
      layer.style.cssText = [
        'position:fixed',
        'inset:0',
        'z-index:0',
        'pointer-events:none',
        'opacity:0.5',
        'background-repeat:repeat',
        'background-size:300px 300px'
      ].join(';');
      root.insertBefore(layer, root.firstChild);
    }
    layer.style.backgroundImage = `url(${dataUrl})`;
    root.style.backgroundColor = '#ffffff';
  } catch (e) {
    console.warn('[orchid] batik canvas failed', e);
    root.style.backgroundColor = '#ffffff';
  }
}

function initLivestream(data) {
  const statusEl = document.getElementById('livestream-status');
  const linkEl = document.getElementById('livestream-link');
  if (!linkEl) return;

  const eventTime = new Date(data.dateISO).getTime();

  function update() {
    const isLive = data.livestreamUrl && Date.now() >= eventTime;
    if (isLive) {
      linkEl.href = data.livestreamUrl;
      linkEl.target = '_blank';
      linkEl.style.opacity = '';
      linkEl.style.pointerEvents = '';
      linkEl.removeAttribute('aria-disabled');
      if (statusEl) statusEl.textContent = '🔴 Live sekarang! Klik tombol di bawah untuk menonton.';
    } else {
      linkEl.href = '#';
      linkEl.removeAttribute('target');
      linkEl.style.opacity = '0.5';
      linkEl.style.pointerEvents = 'none';
      linkEl.setAttribute('aria-disabled', 'true');
      if (statusEl) statusEl.textContent = '▶ Live streaming akan dimulai pada hari-H';
    }
  }

  update();
  setInterval(update, 30000);
}

function spawnOrchidParticles() {
  const container = document.getElementById('heart-container');
  if (!container) return;

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.className = 'orchid-particle';
    const size = 2 + Math.random() * 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    const duration = 18 + Math.random() * 14;
    particle.style.animation = `fadeDrift ${duration}s infinite ease-in-out`;
    particle.style.animationDelay = `-${Math.random() * duration}s`;
    container.appendChild(particle);
  }
}

function initRevealOnScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
    return;
  }
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => observer.observe(el));
}

function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;
  const layers = document.querySelectorAll('[data-parallax]');
  if (!layers.length) return;
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY || 0;
      layers.forEach(layer => {
        const speed = parseFloat(layer.getAttribute('data-parallax')) || 0.1;
        layer.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
      });
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initCardTilt() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
      const rotateX = ((rect.height / 2 - y) / (rect.height / 2)) * 5;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
    });
  });
}

function initMagneticButtons() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

function initScrollSettle() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const selectors = [
    'h1.font-display',
    '[data-tagline]',
    '[data-date-str]',
    '#couple-section h2',
    '.minimal-card h3',
    'footer .font-display',
    '[data-footer-quote]'
  ];

  const targets = [];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('scroll-settle');
      targets.push(el);
    });
  });
  if (!targets.length) return;

  let lastY = window.scrollY || 0;
  let offset = 0;
  let stopTimer = null;
  let phase = 'idle';
  const maxOffset = window.matchMedia('(max-width: 768px)').matches ? 8 : 14;

  function apply(y) {
    const val = `translate3d(0, ${y}px, 0)`;
    targets.forEach(el => { el.style.transform = val; });
  }

  function onScroll() {
    const y = window.scrollY || 0;
    const dy = y - lastY;
    lastY = y;
    offset = Math.max(-maxOffset, Math.min(maxOffset, -dy * 0.35));
    phase = 'dragging';
    apply(offset);

    clearTimeout(stopTimer);
    stopTimer = setTimeout(() => {
      phase = 'overshoot';
      const bounce = Math.max(-maxOffset * 0.4, Math.min(maxOffset * 0.4, -offset * 0.45));
      apply(bounce);
      setTimeout(() => {
        if (phase !== 'overshoot') return;
        phase = 'idle';
        apply(0);
        offset = 0;
      }, 120);
    }, 70);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

window.initTheme = initTheme;
