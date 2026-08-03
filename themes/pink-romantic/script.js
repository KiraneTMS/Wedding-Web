function initTheme(data) {
  const safeSetText = (selector, text, isHTML = false) => {
    const el = document.querySelector(selector);
    if (el) el[isHTML ? 'innerHTML' : 'textContent'] = text || '';
  };

  safeSetText('[data-tagline]', data.tagline);
  safeSetText('[data-date-str]', data.dateStr);
  safeSetText('[data-groom-short]', data.groom.name.split(',')[0]);
  safeSetText('[data-bride-short]', data.bride.name.split(',')[0]);
  safeSetText('[data-groom]', data.groom.name);
  safeSetText('[data-bride]', data.bride.name);
  safeSetText('[data-groom-parent]', data.groom.parent);
  safeSetText('[data-bride-parent]', data.bride.parent);

  ['ceremony', 'reception'].forEach(key => {
    safeSetText(`[data-${key}-title]`, data[key].title);
    safeSetText(`[data-${key}-venue]`, data[key].venue);
    safeSetText(`[data-${key}-address]`, data[key].address, true);
    safeSetText(`[data-${key}-time]`, data[key].time);
    safeSetText(`[data-${key}-note]`, data[key].note);
    const map = document.getElementById(`${key}-maps`);
    if (map) map.href = data[key].mapsUrl;
  });

  const storyCont = document.getElementById('story-container');
  if (storyCont && data.story) {
    const line = storyCont.querySelector('.timeline-line');
    storyCont.innerHTML = '';
    if (line) storyCont.appendChild(line);

    data.story.forEach((item, index) => {
      const isOdd = index % 2 === 0;
      const node = document.createElement('div');
      node.className = `timeline-node relative flex items-center justify-between md:justify-normal ${isOdd ? 'md:flex-row-reverse' : ''} group`;
      node.setAttribute('data-reveal', '');
      node.setAttribute('data-reveal-delay', String((index % 4) + 1));
      node.innerHTML = `
        <div class="timeline-dot md:order-1 ${isOdd ? 'md:-translate-x-1/2' : 'md:translate-x-1/2'}">${item.date}</div>
        <div class="w-[calc(100%-4rem)] md:w-[45%] p-6 rounded-2xl bg-rose-50 border border-rose-100 shadow-sm">
          <h4 class="font-bold text-rose-500 mb-1">${item.title}</h4>
          <p class="text-slate-600 text-sm leading-relaxed">${item.desc}</p>
        </div>
      `;
      storyCont.appendChild(node);
    });
  }

  const giftCont = document.getElementById('gift-container');
  if (giftCont && data.gift) {
    giftCont.innerHTML = data.gift.map((g, i) => `
      <div class="p-6 bg-white rounded-2xl border-2 border-dashed border-rose-200 gift-rose cursor-pointer text-left" data-reveal data-reveal-delay="${(i % 2) + 1}" data-gift-peek>
        <p class="font-bold text-rose-600">${g.bank}</p>
        <p class="text-xl tracking-widest my-2 gift-number">${g.accountNumber}</p>
        <p class="text-xs text-slate-500 uppercase">a/n ${g.accountHolder}</p>
        <p class="gift-hint">Hover / tap to reveal</p>
      </div>
    `).join('');
  }

  safeSetText('[data-footer-quote]', data.footer.quote);
  safeSetText('[data-footer-verse]', data.footer.verse);
  safeSetText('[data-footer-message]', data.footer.message, true);
  safeSetText('[data-footer-closing]', data.footer.closing, true);

  if (data.gallery?.length > 0) {
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) heroBg.style.backgroundImage = `url('${data.gallery[0]}')`;
    const groomImg = document.getElementById('groom-img');
    const brideImg = document.getElementById('bride-img');
    if (groomImg) groomImg.src = data.gallery[1] || data.gallery[0];
    if (brideImg) brideImg.src = data.gallery[2] || data.gallery[0];
  }

  startCountdown(data.dateISO);
  spawnHearts();
  initLivestream(data);

  requestAnimationFrame(() => {
    initRevealOnScroll();
    initMagneticButtons();
    initScrollSettle();
    initEventPanels();
    initGiftPeek();
    console.log('[rose-bloom] effects ready');
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

function startCountdown(dateISO) {
  const target = new Date(dateISO).getTime();
  setInterval(() => {
    const d = target - Date.now();
    if (d < 0) return;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
    set('days', Math.floor(d / 864e5));
    set('hours', Math.floor((d % 864e5) / 36e5));
    set('minutes', Math.floor((d % 36e5) / 6e4));
    set('seconds', Math.floor((d % 6e4) / 1000));
  }, 1000);
}

function spawnHearts() {
  const container = document.getElementById('heart-container');
  if (!container) return;

  for (let i = 0; i < 14; i++) {
    const heart = document.createElement('div');
    heart.className = 'rose-heart';
    heart.innerHTML = '❤';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.top = Math.random() * 100 + '%';
    heart.style.fontSize = (14 + Math.random() * 18) + 'px';
    heart.style.animationDuration = (3 + Math.random() * 5) + 's';
    heart.style.animationDelay = (Math.random() * 4) + 's';
    container.appendChild(heart);
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
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
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
      btn.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px)`;
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
    'footer .text-3xl'
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
  const maxOffset = window.matchMedia('(max-width: 768px)').matches ? 8 : 12;

  function apply(y) {
    const val = `translate3d(0, ${y}px, 0)`;
    targets.forEach(el => { el.style.transform = val; });
  }

  function onScroll() {
    const y = window.scrollY || 0;
    const dy = y - lastY;
    lastY = y;
    offset = Math.max(-maxOffset, Math.min(maxOffset, -dy * 0.3));
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
