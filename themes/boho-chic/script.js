function initTheme(data) {
  const safeSet = (selector, value, isHTML = false) => {
    const el = document.querySelector(selector);
    if (el) el[isHTML ? 'innerHTML' : 'textContent'] = value || "";
  };

  safeSet('[data-groom-short]', data.groom.name.split(',')[0]);
  safeSet('[data-bride-short]', data.bride.name.split(',')[0]);
  safeSet('[data-groom]', data.groom.name);
  safeSet('[data-bride]', data.bride.name);
  safeSet('[data-groom-parent]', data.groom.parent);
  safeSet('[data-bride-parent]', data.bride.parent);
  safeSet('[data-date-str]', data.dateStr);
  safeSet('[data-tagline]', data.tagline);

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

  ['ceremony', 'reception'].forEach(key => {
    safeSet(`[data-${key}-title]`, data[key].title);
    safeSet(`[data-${key}-venue]`, data[key].venue);
    safeSet(`[data-${key}-address]`, data[key].address, true);
    safeSet(`[data-${key}-time]`, data[key].time);
    safeSet(`[data-${key}-note]`, data[key].note);
    const map = document.getElementById(`${key}-maps`);
    if (map && data[key].mapsUrl) map.href = data[key].mapsUrl;
  });

  const storyList = document.getElementById('story-list');
  if (storyList && data.story) {
    storyList.innerHTML = data.story.map((item, i) => `
      <div class="story-boho" data-reveal data-reveal-delay="${(i % 4) + 1}" data-journal>
        <span style="color:var(--gold);font-weight:600;font-family:'Playfair Display',serif;">${item.date}</span>
        <h4 style="font-family:'Cormorant Garamond',serif;font-size:1.45rem;color:var(--accent);margin:0.25rem 0;">${item.title}</h4>
        <div class="story-toggle">Buka cerita ↓</div>
        <div class="story-body">
          <p style="font-size:1.05rem;opacity:0.85;line-height:1.6;">${item.desc}</p>
        </div>
      </div>
    `).join('');
  }

  const giftList = document.getElementById('gift-list');
  if (giftList && data.gift) {
    giftList.innerHTML = data.gift.map((g, i) => `
      <div class="gift-boho" data-reveal data-reveal-delay="${(i % 2) + 1}" data-gift-peek
        style="background:white;padding:2rem;border-radius:15px;box-shadow:0 4px 15px rgba(0,0,0,0.05);min-width:240px;cursor:pointer;">
        <p style="font-weight:600;color:var(--accent);">${g.bank}</p>
        <p class="gift-number" style="font-size:1.35rem;letter-spacing:2px;margin:0.5rem 0;">${g.accountNumber}</p>
        <p style="font-size:0.9rem;opacity:0.7;">a/n ${g.accountHolder}</p>
        <p class="gift-hint">Hover / ketuk untuk lihat nomor</p>
      </div>
    `).join('');
  }

  const polaroidGrid = document.getElementById('polaroid-grid');
  if (data.gallery && polaroidGrid) {
    polaroidGrid.innerHTML = '';
    data.gallery.forEach((url, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'polaroid';
      wrap.setAttribute('data-reveal', '');
      wrap.setAttribute('data-reveal-delay', String((i % 4) + 1));
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Boho moment';
      img.loading = 'lazy';
      wrap.appendChild(img);
      polaroidGrid.appendChild(wrap);
    });
  }

  safeSet('[data-footer-quote]', data.footer.quote);
  safeSet('[data-footer-verse]', data.footer.verse);
  safeSet('[data-footer-message]', data.footer.message, true);
  safeSet('[data-footer-closing]', data.footer.closing, true);

  if (data.dateISO) {
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
  }

  initLivestream(data);

  requestAnimationFrame(() => {
    initRevealOnScroll();
    initMagneticButtons();
    initScrollSettle();
    initJournal();
    initEventPanels();
    initGiftPeek();
    console.log('[soft-boho] effects ready');
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
    '.frame h1',
    '[data-date-str]',
    '[data-tagline]',
    '.love'
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

function initJournal() {
  document.querySelectorAll('[data-journal]').forEach(item => {
    item.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('[data-journal]').forEach(el => {
        el.classList.remove('is-open');
        const t = el.querySelector('.story-toggle');
        if (t) t.textContent = 'Buka cerita ↓';
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        const t = item.querySelector('.story-toggle');
        if (t) t.textContent = 'Tutup ↑';
      }
    });
  });
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
