function initTheme(data) {
  const safeSet = (selector, value, isHTML = false) => {
    const el = document.querySelector(selector);
    if (el) el[isHTML ? 'innerHTML' : 'textContent'] = value || "";
  };

  // 1. Hero & Names
  safeSet('[data-tagline]', data.tagline);
  safeSet('[data-date-str]', data.dateStr);
  safeSet('[data-groom-short]', data.groom.name.split(',')[0]);
  safeSet('[data-bride-short]', data.bride.name.split(',')[0]);
  safeSet('[data-groom]', data.groom.name);
  safeSet('[data-bride]', data.bride.name);
  safeSet('[data-groom-parent]', data.groom.parent);
  safeSet('[data-bride-parent]', data.bride.parent);

  // Socials
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

  // 2. Gallery images
  if (data.gallery && data.gallery.length > 0) {
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) heroBg.style.backgroundImage = `url('${data.gallery[0]}')`;
    const groomImg = document.getElementById('groom-img');
    const brideImg = document.getElementById('bride-img');
    if (groomImg) groomImg.src = data.gallery[1] || data.gallery[0];
    if (brideImg) brideImg.src = data.gallery[2] || data.gallery[0];
  }

  // 3. Event Details
  ['ceremony', 'reception'].forEach(key => {
    safeSet(`[data-${key}-title]`, data[key].title);
    safeSet(`[data-${key}-venue]`, data[key].venue);
    safeSet(`[data-${key}-address]`, data[key].address, true);
    safeSet(`[data-${key}-time]`, data[key].time);
    safeSet(`[data-${key}-note]`, data[key].note);
    const map = document.getElementById(`${key}-maps`);
    if (map) map.href = data[key].mapsUrl;
  });

  // 4. Love Story
  const storyList = document.getElementById('story-list');
  if (storyList && data.story) {
    storyList.innerHTML = data.story.map((item, i) => `
      <div class="story-item" data-reveal data-reveal-delay="${(i % 4) + 1}">
        <span class="story-dot"></span>
        <div class="text-[10px] tracking-[0.3em] uppercase text-[#a88b5c]">${item.date}</div>
        <h4 class="font-display text-xl md:text-2xl my-2 text-[#f0e0c8]">${item.title}</h4>
        <p class="text-[#b8a08a] text-sm leading-relaxed max-w-md mx-auto">${item.desc}</p>
      </div>
    `).join('');
  }

  // 5. Gifts
  const giftList = document.getElementById('gift-list');
  if (giftList && data.gift) {
    giftList.innerHTML = data.gift.map((g, i) => `
      <div class="velvet-gift-card text-left tilt-card" data-reveal data-reveal-delay="${(i % 2) + 1}">
        <p class="text-[#a88b5c] text-[10px] uppercase tracking-[0.25em] mb-2">${g.bank}</p>
        <p class="text-lg md:text-xl tracking-widest my-2 text-[#f0e0c8] font-display">${g.accountNumber}</p>
        <p class="text-[#b8a08a] text-xs uppercase tracking-wider">a/n ${g.accountHolder}</p>
      </div>
    `).join('');
  }

  // 6. Gallery
  const galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid && data.gallery) {
    galleryGrid.innerHTML = data.gallery.map((url, i) => `
      <div class="velvet-gallery-item" data-reveal data-reveal-delay="${(i % 4) + 1}">
        <img src="${url}" alt="Moment" loading="lazy">
      </div>
    `).join('');
  }

  // 7. Footer
  safeSet('[data-footer-quote]', data.footer.quote);
  safeSet('[data-footer-verse]', data.footer.verse);
  safeSet('[data-footer-message]', data.footer.message, true);
  safeSet('[data-footer-closing]', data.footer.closing, true);

  // 8. Countdown
  const target = new Date(data.dateISO).getTime();
  setInterval(() => {
    const now = new Date().getTime();
    const d = target - now;
    if (d < 0) return;
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    if (daysEl) daysEl.innerText = Math.floor(d / 864e5);
    if (hoursEl) hoursEl.innerText = Math.floor((d % 864e5) / 36e5);
    if (minutesEl) minutesEl.innerText = Math.floor((d % 36e5) / 6e4);
    if (secondsEl) secondsEl.innerText = Math.floor((d % 6e4) / 1000);
  }, 1000);

  // 9. Particles
  spawnVelvetParticles();

  // 10. Live Streaming
  initLivestream(data);

  // 11. Interactive effects (after DOM content is filled)
  requestAnimationFrame(() => {
    initRevealOnScroll();
    initParallax();
    initCardTilt();
    initMagneticButtons();
    initScrollSettle();
    console.log('[moody-velvet] effects ready');
  });
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

function spawnVelvetParticles() {
  const container = document.getElementById('heart-container');
  if (!container) return;

  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.className = 'velvet-particle';

    const size = 1.5 + Math.random() * 2.5;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';

    const duration = 16 + Math.random() * 18;
    particle.style.animation = `fadeDrift ${duration}s infinite ease-in-out`;
    particle.style.animationDelay = `-${Math.random() * duration}s`;

    container.appendChild(particle);
  }
}

/* ===== Reveal on scroll ===== */
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
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ===== Parallax (subtle, mobile-safe) ===== */
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
      const scrollY = window.scrollY || window.pageYOffset;
      layers.forEach(layer => {
        const speed = parseFloat(layer.getAttribute('data-parallax')) || 0.1;
        layer.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
      });
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===== Card tilt (desktop only) ===== */
function initCardTilt() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateY = ((x - midX) / midX) * 8;
      const rotateX = ((midY - y) / midY) * 8;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

/* ===== Magnetic buttons ===== */
function initMagneticButtons() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const buttons = document.querySelectorAll('.magnetic-btn');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

/* ===== Scroll overshoot → settle =====
   While scrolling, key text lags slightly.
   When scroll stops: overshoot past rest, then ease back to 0. */
function initScrollSettle() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const selectors = [
    '.velvet-hero h1',
    '.velvet-hero [data-tagline]',
    '.velvet-hero [data-date-str]',
    '#couple-section h2',
    '.velvet-event-card h3',
    '.story-item h4',
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
  let phase = 'idle'; // idle | dragging | overshoot

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const maxOffset = isMobile ? 14 : 28;

  function apply(y) {
    const val = `translate3d(0, ${y}px, 0)`;
    targets.forEach(el => { el.style.transform = val; });
  }

  function onScroll() {
    const y = window.scrollY || 0;
    const dy = y - lastY;
    lastY = y;

    // Lag opposite to scroll direction
    offset = Math.max(-maxOffset, Math.min(maxOffset, -dy * 0.4));
    phase = 'dragging';
    apply(offset);

    clearTimeout(stopTimer);
    stopTimer = setTimeout(() => {
      // 1) overshoot past zero (opposite of lag)
      phase = 'overshoot';
      const bounce = Math.max(-maxOffset * 0.45, Math.min(maxOffset * 0.45, -offset * 0.5));
      apply(bounce);

      // 2) settle to rest
      setTimeout(() => {
        if (phase !== 'overshoot') return;
        phase = 'idle';
        apply(0);
        offset = 0;
      }, 140);
    }, 70);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

window.initTheme = initTheme;
