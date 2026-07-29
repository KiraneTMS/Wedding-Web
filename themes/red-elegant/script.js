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

  // 2. Gallery images (hero bg + profile photos)
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
    storyList.innerHTML = data.story.map(item => `
      <div class="border-l border-amber-600/40 pl-6">
        <span class="text-amber-500 text-xs tracking-widest uppercase">${item.date}</span>
        <h4 class="text-2xl text-white font-light my-1">${item.title}</h4>
        <p class="text-stone-400 text-sm">${item.desc}</p>
      </div>
    `).join('');
  }

  // 5. Gifts
  const giftList = document.getElementById('gift-list');
  if (giftList && data.gift) {
    giftList.innerHTML = data.gift.map(g => `
      <div class="border border-amber-900/30 p-8">
        <p class="text-amber-500 text-xs uppercase tracking-widest mb-2">${g.bank}</p>
        <p class="text-2xl text-white tracking-widest my-2">${g.accountNumber}</p>
        <p class="text-stone-400 text-xs uppercase">a/n ${g.accountHolder}</p>
      </div>
    `).join('');
  }

  // 6. Gallery grid
  const galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid && data.gallery) {
    data.gallery.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = "Moment";
      img.loading = "lazy";
      img.className = "w-full aspect-square object-cover border border-amber-900/30";
      galleryGrid.appendChild(img);
    });
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
    document.getElementById('days').innerText = Math.floor(d / 864e5);
    document.getElementById('hours').innerText = Math.floor((d % 864e5) / 36e5);
    document.getElementById('minutes').innerText = Math.floor((d % 36e5) / 6e4);
    document.getElementById('seconds').innerText = Math.floor((d % 6e4) / 1000);
  }, 1000);

  spawnHearts();

  // 9. Live Streaming (stays as placeholder until the event date/time arrives)
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
  // Re-check periodically in case the page is left open across the event start time
  setInterval(update, 30000);
}

function spawnHearts() {
  const container = document.getElementById('heart-container');
  if (!container) return;

  // Membuat efek hujan hati yang naik ke atas secara perlahan
  for (let i = 0; i < 25; i++) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤';
    heart.className = 'floating-heart';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (10 + Math.random() * 20) + 'px';
    heart.style.animationDuration = (10 + Math.random() * 15) + 's';
    heart.style.animationDelay = (Math.random() * 20) + 's';
    container.appendChild(heart);
  }
}

window.initTheme = initTheme;