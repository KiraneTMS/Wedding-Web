function initTheme(data) {
  const safeSet = (selector, value, isHTML = false) => {
    const el = document.querySelector(selector);
    if (el) el[isHTML ? 'innerHTML' : 'textContent'] = value || "";
  };

  // 1. Hero & Names
  safeSet('[data-groom-short]', data.groom.name.split(',')[0]);
  safeSet('[data-bride-short]', data.bride.name.split(',')[0]);
  safeSet('[data-groom]', data.groom.name);
  safeSet('[data-bride]', data.bride.name);
  safeSet('[data-groom-parent]', data.groom.parent);
  safeSet('[data-bride-parent]', data.bride.parent);
  safeSet('[data-date-str]', data.dateStr);
  safeSet('[data-tagline]', data.tagline);

  // Socials
  const gIg = document.getElementById('groom-ig');
  if (gIg) { gIg.textContent = data.groom.instagram; gIg.href = `https://instagram.com/${data.groom.instagram.replace('@','')}`; }
  const bIg = document.getElementById('bride-ig');
  if (bIg) { bIg.textContent = data.bride.instagram; bIg.href = `https://instagram.com/${data.bride.instagram.replace('@','')}`; }

  // 2. Event Details
  ['ceremony', 'reception'].forEach(key => {
    safeSet(`[data-${key}-title]`, data[key].title);
    safeSet(`[data-${key}-venue]`, data[key].venue);
    safeSet(`[data-${key}-address]`, data[key].address, true);
    safeSet(`[data-${key}-time]`, data[key].time);
    safeSet(`[data-${key}-note]`, data[key].note);
  });

  // 3. Love Story (Timeline style)
  const storyList = document.getElementById('story-list');
  if (storyList && data.story) {
    storyList.innerHTML = data.story.map(item => `
      <div style="margin-bottom: 2rem; border-left: 2px solid var(--accent); padding-left: 1.5rem;">
        <span style="color: var(--gold); font-weight: bold; font-family: 'Playfair Display';">${item.date}</span>
        <h4 style="font-family: 'Cormorant Garamond'; font-size: 1.5rem; color: var(--accent); margin: 0.3rem 0;">${item.title}</h4>
        <p style="font-size: 1.1rem; opacity: 0.8;">${item.desc}</p>
      </div>
    `).join('');
  }

  // 4. Gifts (Bank Info)
  const giftList = document.getElementById('gift-list');
  if (giftList && data.gift) {
    giftList.innerHTML = data.gift.map(g => `
      <div style="background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); min-width: 250px;">
        <p style="font-weight: bold; color: var(--accent);">${g.bank}</p>
        <p style="font-size: 1.4rem; letter-spacing: 2px; margin: 0.5rem 0;">${g.accountNumber}</p>
        <p style="font-size: 0.9rem; opacity: 0.7;">a/n ${g.accountHolder}</p>
      </div>
    `).join('');
  }

  // 5. Gallery
  const polaroidGrid = document.getElementById('polaroid-grid');
  if (data.gallery && polaroidGrid) {
    data.gallery.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = "Boho moment";
      img.loading = "lazy";
      polaroidGrid.appendChild(img);
    });
  }

  // 6. Footer
  safeSet('[data-footer-quote]', data.footer.quote);
  safeSet('[data-footer-verse]', data.footer.verse);
  safeSet('[data-footer-message]', data.footer.message, true);
  safeSet('[data-footer-closing]', data.footer.closing, true);

  // 7. Live Streaming (stays as placeholder until the event date/time arrives)
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

window.initTheme = initTheme;