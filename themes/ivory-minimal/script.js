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
    const spine = storyList.querySelector('.timeline-spine');
    storyList.innerHTML = '';
    if (spine) storyList.appendChild(spine);

    data.story.forEach((item, index) => {
      const isEven = index % 2 === 0;
      const node = document.createElement('div');
      node.className = 'timeline-node';
      node.setAttribute('data-reveal', '');
      node.setAttribute('data-reveal-delay', String((index % 4) + 1));
      node.innerHTML = `
        <div class="timeline-dot">
          <div class="timeline-dot-inner">
            <span class="text-[10px] tracking-widest text-[#9c8f7e] font-medium text-center leading-tight px-1">${item.date}</span>
          </div>
        </div>
        <div class="timeline-body ${isEven ? 'timeline-body--right' : 'timeline-body--left'}">
          <h4 class="text-xl font-light mb-2">${item.title}</h4>
          <p class="text-sm text-[#7a7368] leading-relaxed">${item.desc}</p>
        </div>
      `;
      storyList.appendChild(node);
    });
  }

  const giftList = document.getElementById('gift-list');
  if (giftList && data.gift) {
    giftList.innerHTML = data.gift.map((g, i) => `
      <div class="line-card gift-mask text-left" data-reveal data-reveal-delay="${(i % 2) + 1}" data-gift-mask>
        <p class="text-[11px] tracking-[0.3em] uppercase text-[#9c8f7e] mb-3">${g.bank}</p>
        <p class="text-xl tracking-widest mb-2 gift-number">${g.accountNumber}</p>
        <p class="text-xs text-[#7a7368] uppercase">a/n ${g.accountHolder}</p>
        <p class="gift-hint">Hover / tap to reveal</p>
      </div>
    `).join('');
  }

  const galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid && data.gallery) {
    galleryGrid.innerHTML = '';
    data.gallery.forEach((url, i) => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Moment';
      img.loading = 'lazy';
      img.setAttribute('data-reveal', '');
      img.setAttribute('data-reveal-delay', String((i % 4) + 1));
      galleryGrid.appendChild(img);
    });
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

  spawnDots();
  initLivestream(data);

  requestAnimationFrame(() => {
    initRevealOnScroll();
    initMagneticButtons();
    initScrollSettle();
    initEventPanels();
    initGiftMask();
    console.log('[quiet-ivory] effects ready');
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

function spawnDots() {
  const container = document.getElementById('heart-container');
  if (!container) return;

  for (let i = 0; i < 14; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot-particle';
    dot.style.left = Math.random() * 100 + '%';
    dot.style.animationDuration = (18 + Math.random() * 20) + 's';
    dot.style.animationDelay = (Math.random() * 15) + 's';
    container.appendChild(dot);
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
  }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });
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
      btn.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px)`;
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
    '#couple h2',
    'footer .text-2xl'
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
  const maxOffset = window.matchMedia('(max-width: 768px)').matches ? 6 : 12;

  function apply(y) {
    const val = `translate3d(0, ${y}px, 0)`;
    targets.forEach(el => { el.style.transform = val; });
  }

  function onScroll() {
    const y = window.scrollY || 0;
    const dy = y - lastY;
    lastY = y;
    offset = Math.max(-maxOffset, Math.min(maxOffset, -dy * 0.28));
    phase = 'dragging';
    apply(offset);

    clearTimeout(stopTimer);
    stopTimer = setTimeout(() => {
      phase = 'overshoot';
      const bounce = Math.max(-maxOffset * 0.35, Math.min(maxOffset * 0.35, -offset * 0.4));
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

function initGiftMask() {
  document.querySelectorAll('[data-gift-mask]').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-revealed');
    });
  });
}

window.initTheme = initTheme;
