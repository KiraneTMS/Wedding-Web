function initTheme(data) {
  const safeSet = (selector, value, isHTML = false) => {
    const el = document.querySelector(selector);
    if (el) el[isHTML ? 'innerHTML' : 'textContent'] = value || "";
  };

  const groomShort = data.groom.name.split(',')[0];
  const brideShort = data.bride.name.split(',')[0];

  safeSet('[data-tagline]', data.tagline);
  safeSet('[data-date-str]', data.dateStr);
  safeSet('[data-groom-short]', groomShort);
  safeSet('[data-bride-short]', brideShort);
  safeSet('[data-groom-initial]', groomShort.trim().charAt(0).toUpperCase());
  safeSet('[data-bride-initial]', brideShort.trim().charAt(0).toUpperCase());
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

  // Story — expandable journal
  const storyList = document.getElementById('story-list');
  if (storyList && data.story) {
    storyList.innerHTML = data.story.map((item, i) => `
      <div class="journal-item" data-reveal data-reveal-delay="${(i % 4) + 1}" data-journal>
        <span class="text-[#c1502e] text-xs tracking-widest uppercase">${item.date}</span>
        <h4 class="font-display text-xl md:text-2xl text-[#4a2f1c] my-1">${item.title}</h4>
        <div class="journal-toggle">Buka cerita ↓</div>
        <div class="journal-body">
          <p class="text-[#7a5c3e] text-sm leading-relaxed">${item.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // Gifts — blurred until hover/tap
  const giftList = document.getElementById('gift-list');
  if (giftList && data.gift) {
    giftList.innerHTML = data.gift.map((g, i) => `
      <div class="clay-tile gift-peek text-left" data-reveal data-reveal-delay="${(i % 2) + 1}" data-gift-peek>
        <p class="text-[#c1502e] text-xs uppercase tracking-widest mb-2">${g.bank}</p>
        <p class="text-2xl text-[#4a2f1c] tracking-widest my-2 gift-number">${g.accountNumber}</p>
        <p class="text-[#7a5c3e] text-xs uppercase">a/n ${g.accountHolder}</p>
        <p class="gift-hint">Hover / ketuk untuk lihat nomor</p>
      </div>
    `).join('');
  }

  // Gallery — swinging frames
  const galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid && data.gallery) {
    galleryGrid.innerHTML = data.gallery.map((url, i) => {
      const angle = (i % 2 === 0 ? -1 : 1) * (3 + ((i * 7) % 6));
      return `
        <div class="boho-frame-wrap" style="--tilt: ${angle}deg;" data-reveal data-reveal-delay="${(i % 4) + 1}">
          <span class="boho-knot"></span>
          <img src="${url}" alt="Moment" loading="lazy" class="boho-frame">
        </div>
      `;
    }).join('');
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

  spawnLeaves();
  initLivestream(data);

  requestAnimationFrame(() => {
    initRevealOnScroll();
    initMagneticButtons();
    initScrollSettle();
    initFlipCards();
    initJournal();
    initGiftPeek();
    initSealPress();
    console.log('[boho-clay] effects ready');
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

function spawnLeaves() {
  const container = document.getElementById('heart-container');
  if (!container) return;

  const symbols = ['🍂', '🌾', '🥀', '✦'];
  for (let i = 0; i < 16; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'boho-particle';
    leaf.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
    leaf.style.left = Math.random() * 100 + '%';
    leaf.style.top = Math.random() * 100 + '%';
    leaf.style.fontSize = (12 + Math.random() * 16) + 'px';
    const duration = 12 + Math.random() * 14;
    leaf.style.animation = `driftLeaf ${duration}s infinite ease-in-out`;
    leaf.style.animationDelay = `-${Math.random() * duration}s`;
    container.appendChild(leaf);
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
    '.couple-info h2',
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

/* Flip cards — hover on desktop, tap toggle on touch */
function initFlipCards() {
  document.querySelectorAll('[data-flip]').forEach(scene => {
    scene.addEventListener('click', (e) => {
      // Don't toggle when clicking the maps link on the back
      if (e.target.closest('a')) return;
      scene.classList.toggle('is-flipped');
    });
  });
}

/* Journal expand/collapse */
function initJournal() {
  document.querySelectorAll('[data-journal]').forEach(item => {
    item.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('[data-journal]').forEach(el => {
        el.classList.remove('is-open');
        const t = el.querySelector('.journal-toggle');
        if (t) t.textContent = 'Buka cerita ↓';
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        const t = item.querySelector('.journal-toggle');
        if (t) t.textContent = 'Tutup ↑';
      }
    });
  });
}

/* Gift number reveal on tap (mobile) — hover handled by CSS */
function initGiftPeek() {
  document.querySelectorAll('[data-gift-peek]').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-revealed');
    });
  });
}

/* Wax seal press animation */
function initSealPress() {
  const seal = document.getElementById('clay-seal-btn');
  if (!seal) return;
  seal.addEventListener('click', () => {
    seal.classList.add('is-pressed');
    setTimeout(() => seal.classList.remove('is-pressed'), 180);
    // Soft confetti of leaves burst near seal
    burstLeavesNear(seal);
  });
}

function burstLeavesNear(el) {
  const container = document.getElementById('heart-container');
  if (!container) return;
  const rect = el.getBoundingClientRect();
  const symbols = ['✦', '🍂', '🌾'];
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('div');
    p.className = 'boho-particle';
    p.innerHTML = symbols[i % symbols.length];
    p.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 40) + 'px';
    p.style.top = (rect.top + window.scrollY) + 'px';
    p.style.fontSize = '14px';
    p.style.opacity = '0.8';
    p.style.position = 'absolute';
    p.style.animation = `driftLeaf ${2 + Math.random()}s ease-out forwards`;
    container.appendChild(p);
    setTimeout(() => p.remove(), 3000);
  }
}

window.initTheme = initTheme;
