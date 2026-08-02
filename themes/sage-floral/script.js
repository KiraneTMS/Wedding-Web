function initTheme(data) {
  const setText = (selector, text, isHTML = false) => {
    const el = document.querySelector(selector);
    if (el) el[isHTML ? 'innerHTML' : 'textContent'] = text || '';
  };

  setText('[data-tagline]', data.tagline);
  setText('[data-date-str]', data.dateStr);
  setText('[data-groom-short]', data.groom.name.split(',')[0]);
  setText('[data-bride-short]', data.bride.name.split(',')[0]);
  setText('[data-groom]', data.groom.name);
  setText('[data-bride]', data.bride.name);
  setText('[data-groom-parent]', data.groom.parent);
  setText('[data-bride-parent]', data.bride.parent);

  // Instagram links if elements exist
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

  if (data.gallery?.length > 0) {
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) heroBg.style.backgroundImage = `url('${data.gallery[0]}')`;
    const groomImg = document.getElementById('groom-img');
    const brideImg = document.getElementById('bride-img');
    if (groomImg) groomImg.src = data.gallery[1] || data.gallery[0];
    if (brideImg) brideImg.src = data.gallery[2] || data.gallery[0];
  }

  ['ceremony', 'reception'].forEach(key => {
    setText(`[data-${key}-title]`, data[key].title);
    setText(`[data-${key}-venue]`, data[key].venue);
    setText(`[data-${key}-address]`, data[key].address, true);
    setText(`[data-${key}-time]`, data[key].time);
    setText(`[data-${key}-note]`, data[key].note);
    const map = document.getElementById(`${key}-maps`);
    if (map) map.href = data[key].mapsUrl;
  });

  const storyList = document.getElementById('story-list');
  if (storyList && data.story) {
    storyList.innerHTML = data.story.map((item, i) => `
      <div class="story-node" data-reveal data-reveal-delay="${(i % 4) + 1}">
        <span class="text-[#a3b18a] text-xs tracking-widest uppercase">${item.date}</span>
        <h4 class="text-xl md:text-2xl font-serif text-[#4a5d4e] my-1">${item.title}</h4>
        <p class="text-[#6b705c] text-sm leading-relaxed">${item.desc}</p>
      </div>
    `).join('');
  }

  const giftList = document.getElementById('gift-list');
  if (giftList && data.gift) {
    giftList.innerHTML = data.gift.map((g, i) => `
      <div class="sage-card text-left" data-reveal data-reveal-delay="${(i % 2) + 1}">
        <p class="text-[#a3b18a] text-xs uppercase tracking-widest mb-2">${g.bank}</p>
        <p class="text-xl md:text-2xl tracking-widest my-2 text-[#4a5d4e]">${g.accountNumber}</p>
        <p class="text-xs text-[#6b705c] uppercase">a/n ${g.accountHolder}</p>
      </div>
    `).join('');
  }

  const galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid && data.gallery) {
    galleryGrid.innerHTML = data.gallery.map((url, i) => `
      <div class="gal-item" data-reveal data-reveal-delay="${(i % 4) + 1}">
        <img src="${url}" alt="Moment" loading="lazy">
      </div>
    `).join('');
  }

  setText('[data-footer-quote]', data.footer.quote);
  setText('[data-footer-verse]', data.footer.verse);
  setText('[data-footer-message]', data.footer.message, true);
  setText('[data-footer-closing]', data.footer.closing, true);

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

  spawnFlowers();
  initLivestream(data);

  requestAnimationFrame(() => {
    initRevealOnScroll();
    initMagneticButtons();
    initScrollSettle();
    console.log('[sage-garden] effects ready');
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

function spawnFlowers() {
  const container = document.getElementById('heart-container');
  if (!container) return;

  const colors = ['#a3b18a', '#588157', '#dad7cd', '#6b705c', '#b7c4a8'];
  const symbols = ['❀', '✿', '🍃', '🌿', '🌱', '❁'];

  for (let i = 0; i < 24; i++) {
    const petal = document.createElement('div');
    petal.className = 'flower-particle';
    petal.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left = Math.random() * 100 + '%';
    petal.style.top = Math.random() * 100 + '%';
    petal.style.color = colors[Math.floor(Math.random() * colors.length)];
    petal.style.fontSize = (11 + Math.random() * 16) + 'px';
    const duration = 14 + Math.random() * 16;
    petal.style.animation = `floatLeaf ${duration}s infinite linear`;
    petal.style.animationDelay = `-${Math.random() * duration}s`;
    container.appendChild(petal);
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
    'h1',
    '[data-tagline]',
    '[data-date-str]',
    '.portrait-caption h2',
    'footer .font-serif',
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

window.initTheme = initTheme;
