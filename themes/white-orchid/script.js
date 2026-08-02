function initTheme(data) {
  const safeSet = (selector, value, isHTML = false) => {
    const el = document.querySelector(selector);
    if (el) el[isHTML ? 'innerHTML' : 'textContent'] = value || "";
  };

  safeSet('[data-tagline]', data.tagline);
  safeSet('[data-date-str]', data.dateStr);
  const groomShort = data.groom.name.split(',')[0];
  const brideShort = data.bride.name.split(',')[0];
  safeSet('[data-groom-short]', groomShort);
  safeSet('[data-bride-short]', brideShort);
  splitLetters(document.querySelector('[data-groom-short]'), 0.1);
  splitLetters(document.querySelector('[data-bride-short]'), 0.1 + groomShort.length * 0.045 + 0.15);
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
        <span class="text-[#9ca3ac] text-[10px] tracking-widest uppercase">${item.date}</span>
        <h4 class="font-display text-2xl my-1">${item.title}</h4>
        <p class="text-[#6b6f76] text-sm">${item.desc}</p>
      </div>
    `).join('');
  }

  const giftList = document.getElementById('gift-list');
  if (giftList && data.gift) {
    giftList.innerHTML = data.gift.map((g, i) => `
      <div class="minimal-card tilt-card glass-soft rounded-sm px-6 pb-6" data-reveal data-reveal-delay="${(i % 2) + 1}">
        <p class="text-[#9ca3ac] text-[10px] uppercase tracking-widest mb-2">${g.bank}</p>
        <p class="text-xl tracking-widest my-2">${g.accountNumber}</p>
        <p class="text-[#6b6f76] text-xs uppercase">a/n ${g.accountHolder}</p>
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
    initGalleryLightbox(data.gallery);
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
    initScrollProgress();
    initStoryTimeline();
    console.log('[orchid] effects ready');
  });
}

function splitLetters(el, baseDelay = 0) {
  if (!el) return;
  const text = el.textContent;
  if (!text) return;
  el.setAttribute('aria-label', text);
  el.innerHTML = text.split('').map((ch, i) => {
    const delay = (baseDelay + i * 0.045).toFixed(3);
    const glyph = ch === ' ' ? '&nbsp;' : ch;
    return `<span style="animation-delay:${delay}s" aria-hidden="true">${glyph}</span>`;
  }).join('');
}

function spawnPetalBurst(count = 16) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const container = document.getElementById('heart-container');
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'orchid-particle orchid-burst';
    const size = 3 + Math.random() * 3;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    petal.style.left = Math.random() * 100 + '%';
    petal.style.top = '-4%';
    petal.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    const duration = 2.5 + Math.random() * 1.5;
    petal.style.animation = `petalFall ${duration}s ease-in forwards`;
    petal.style.animationDelay = (Math.random() * 0.3) + 's';
    container.appendChild(petal);
    setTimeout(() => petal.remove(), (duration + 0.5) * 1000);
  }
}
window.spawnPetalBurst = spawnPetalBurst;

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function initStoryTimeline() {
  const track = document.getElementById('story-timeline-fill');
  const wrapper = track ? track.parentElement : null;
  if (!track || !wrapper) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  function update() {
    ticking = false;
    const rect = wrapper.getBoundingClientRect();
    const viewH = window.innerHeight || document.documentElement.clientHeight;
    const total = rect.height;
    if (total <= 0) return;
    const visibleTravel = viewH - rect.top;
    const pct = Math.max(0, Math.min(1, visibleTravel / (total + viewH * 0.3)));
    track.style.height = (pct * 100) + '%';
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function initGalleryLightbox(gallery) {
  const lightbox = document.getElementById('lightbox');
  const imgEl = document.getElementById('lightbox-img');
  const counterEl = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const frames = document.querySelectorAll('#gallery-grid .orchid-frame');
  if (!lightbox || !imgEl || !frames.length || !gallery || !gallery.length) return;

  let currentIndex = 0;

  function show(index) {
    currentIndex = (index + gallery.length) % gallery.length;
    imgEl.src = gallery[currentIndex];
    if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${gallery.length}`;
  }

  function open(index) {
    show(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.setProperty('overflow', 'hidden', 'important');
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.removeProperty('overflow');
  }

  frames.forEach((frame, i) => {
    frame.addEventListener('click', () => open(i));
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn) prevBtn.addEventListener('click', () => show(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => show(currentIndex + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
    if (e.key === 'ArrowRight') show(currentIndex + 1);
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 40) {
      dx > 0 ? show(currentIndex - 1) : show(currentIndex + 1);
    }
  }, { passive: true });
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