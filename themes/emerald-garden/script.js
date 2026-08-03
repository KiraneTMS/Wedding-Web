function initTheme(data) {
  const safeSet = (selector, value, isHTML = false) => {
    const el = document.querySelector(selector);
    if (el) el[isHTML ? 'innerHTML' : 'textContent'] = value || "";
  };

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
      <div class="story-leaf" data-reveal data-reveal-delay="${(i % 4) + 1}">
        <span class="text-[#c9a66b] text-xs tracking-widest uppercase">${item.date}</span>
        <h4 class="font-display text-2xl text-white my-1">${item.title}</h4>
        <p class="text-[#f5f1e8]/60 text-sm leading-relaxed">${item.desc}</p>
      </div>
    `).join('');
  }

  const giftList = document.getElementById('gift-list');
  if (giftList && data.gift) {
    giftList.innerHTML = data.gift.map((g, i) => `
      <div class="corner-frame gift-peek text-left" data-reveal data-reveal-delay="${(i % 2) + 1}" data-gift-peek>
        <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
        <p class="text-[#c9a66b] text-xs uppercase tracking-widest mb-2">${g.bank}</p>
        <p class="text-2xl text-white tracking-widest my-2 gift-number">${g.accountNumber}</p>
        <p class="text-[#f5f1e8]/60 text-xs uppercase">a/n ${g.accountHolder}</p>
        <p class="gift-hint">Hover / ketuk untuk lihat nomor</p>
      </div>
    `).join('');
  }

  const galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid && data.gallery) {
    galleryGrid.innerHTML = data.gallery.map((url, i) => `
      <div class="hex-frame hex-frame--sm" data-reveal data-reveal-delay="${(i % 4) + 1}">
        <div class="hex-frame-inner">
          <img src="${url}" alt="Moment" loading="lazy">
        </div>
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

  spawnGardenParticles();
  initLivestream(data);

  requestAnimationFrame(() => {
    initRevealOnScroll();
    initMagneticButtons();
    initScrollSettle();
    initEventPanels();
    initGiftPeek();
    console.log('[emerald-hex] effects ready');
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

function spawnGardenParticles() {
  const container = document.getElementById('heart-container');
  if (!container) return;

  const symbols = ['🌿', '✦', '🍃'];
  for (let i = 0; i < 18; i++) {
    const particle = document.createElement('div');
    particle.className = 'garden-particle';
    particle.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.fontSize = (10 + Math.random() * 16) + 'px';
    const duration = 16 + Math.random() * 18;
    particle.style.animation = `driftGarden ${duration}s infinite ease-in-out`;
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
  }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
  els.forEach(el => observer.observe(el));
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
    '.couple-col h2',
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
    offset = Math.max(-maxOffset, Math.min(maxOffset, -dy * 0.32));
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

function initEventPanels() {
  document.querySelectorAll('[data-event]').forEach(panel => {
    panel.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      panel.classList.toggle('is-open');
    });
  });
}

function initGiftPeek() {
  document.querySelectorAll('[data-gift-peek]').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-revealed');
    });
  });
}

window.initTheme = initTheme;
