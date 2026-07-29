function initTheme(data) {
  const setText = (selector, text, isHTML = false) => {
    const el = document.querySelector(selector);
    if (el) el[isHTML ? 'innerHTML' : 'textContent'] = text || '';
  };

  // Names & basic
  setText('[data-tagline]', data.tagline);
  setText('[data-date-str]', data.dateStr);
  setText('[data-groom-short]', data.groom.name.split(',')[0]);
  setText('[data-bride-short]', data.bride.name.split(',')[0]);
  setText('[data-groom]', data.groom.name);
  setText('[data-bride]', data.bride.name);
  setText('[data-groom-parent]', data.groom.parent);
  setText('[data-bride-parent]', data.bride.parent);

  // Images
  if (data.gallery?.length > 0) {
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) heroBg.style.backgroundImage = `url('${data.gallery[0]}')`;
    const groomImg = document.getElementById('groom-img');
    const brideImg = document.getElementById('bride-img');
    if (groomImg) groomImg.src = data.gallery[1] || data.gallery[0];
    if (brideImg) brideImg.src = data.gallery[2] || data.gallery[0];
  }

  // Events
  ['ceremony', 'reception'].forEach(key => {
    setText(`[data-${key}-title]`, data[key].title);
    setText(`[data-${key}-venue]`, data[key].venue);
    setText(`[data-${key}-address]`, data[key].address, true);
    setText(`[data-${key}-time]`, data[key].time);
    setText(`[data-${key}-note]`, data[key].note);
    const map = document.getElementById(`${key}-maps`);
    if (map) map.href = data[key].mapsUrl;
  });

  // Story
  const storyList = document.getElementById('story-list');
  if (storyList && data.story) {
    storyList.innerHTML = data.story.map(item => `
      <div class="flex gap-6">
        <div class="flex-shrink-0 w-px bg-[#c9a84c]/30 relative">
          <div class="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#c9a84c]"></div>
        </div>
        <div>
          <span class="text-[11px] tracking-[0.25em] uppercase text-[#c9a84c]">${item.date}</span>
          <h4 class="text-xl font-light italic mt-1 mb-2">${item.title}</h4>
          <p class="text-sm text-[#a8a29e] leading-relaxed">${item.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // Gifts
  const giftList = document.getElementById('gift-list');
  if (giftList && data.gift) {
    giftList.innerHTML = data.gift.map(g => `
      <div class="border border-[#c9a84c]/20 bg-[#0f1c33]/50 p-8">
        <p class="text-[11px] tracking-[0.3em] uppercase text-[#c9a84c] mb-3">${g.bank}</p>
        <p class="text-2xl tracking-widest font-light mb-2">${g.accountNumber}</p>
        <p class="text-xs text-[#a8a29e] uppercase">a/n ${g.accountHolder}</p>
      </div>
    `).join('');
  }

  // Gallery
  const galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid && data.gallery) {
    data.gallery.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Moment';
      img.loading = 'lazy';
      img.className = 'w-full aspect-square object-cover border border-[#c9a84c]/15';
      galleryGrid.appendChild(img);
    });
  }

  // Footer
  setText('[data-footer-quote]', data.footer.quote);
  setText('[data-footer-verse]', data.footer.verse);
  setText('[data-footer-message]', data.footer.message, true);
  setText('[data-footer-closing]', data.footer.closing, true);

  // Countdown
  const target = new Date(data.dateISO).getTime();
  setInterval(() => {
    const d = target - Date.now();
    if (d < 0) return;
    document.getElementById('days').innerText = Math.floor(d / 864e5);
    document.getElementById('hours').innerText = Math.floor((d % 864e5) / 36e5);
    document.getElementById('minutes').innerText = Math.floor((d % 36e5) / 6e4);
    document.getElementById('seconds').innerText = Math.floor((d % 6e4) / 1000);
  }, 1000);

  spawnSparkles();
  initReveal();
  initLivestream(data);
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

function spawnSparkles() {
  const container = document.getElementById('heart-container');
  if (!container) return;

  const symbols = ['✦', '✧', '⋆', '·'];
  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.className = 'sparkle';
    el.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.fontSize = (8 + Math.random() * 14) + 'px';
    el.style.animationDuration = (14 + Math.random() * 16) + 's';
    el.style.animationDelay = (Math.random() * 12) + 's';
    container.appendChild(el);
  }
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('section, footer').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

window.initTheme = initTheme;