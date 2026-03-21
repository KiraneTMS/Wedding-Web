function initTheme(data) {
  const safeSetText = (selector, text) => {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = text || "";
  };

  // 1. Text Mapping
  safeSetText('[data-tagline]', data.tagline);
  safeSetText('[data-date-str]', data.dateStr);
  safeSetText('[data-groom-short]', data.groom.name.split(',')[0]);
  safeSetText('[data-bride-short]', data.bride.name.split(',')[0]);
  safeSetText('[data-groom]', data.groom.name);
  safeSetText('[data-bride]', data.bride.name);
  safeSetText('[data-groom-parent]', data.groom.parent);
  safeSetText('[data-bride-parent]', data.bride.parent);

  // 2. Events Mapping
  ['ceremony', 'reception'].forEach(key => {
    safeSetText(`[data-${key}-title]`, data[key].title);
    safeSetText(`[data-${key}-venue]`, data[key].venue);
    safeSetText(`[data-${key}-address]`, data[key].address);
    safeSetText(`[data-${key}-time]`, data[key].time);
    safeSetText(`[data-${key}-note]`, data[key].note);
    const map = document.getElementById(`${key}-maps`);
    if (map) map.href = data[key].mapsUrl;
  });

  // 3. Story Mapping
  const storyCont = document.getElementById('story-container');
  if (storyCont) {
    storyCont.innerHTML = data.story.map(item => `
      <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
        <div class="flex items-center justify-center w-10 h-10 rounded-full bg-rose-200 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-xs font-bold">${item.date}</div>
        <div class="w-[calc(100%-4rem)] md:w-[45%] p-6 rounded-2xl bg-rose-50 border border-rose-100 shadow-sm">
          <h4 class="font-bold text-rose-500">${item.title}</h4>
          <p class="text-slate-600 text-sm">${item.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // 4. Gift Mapping
  const giftCont = document.getElementById('gift-container');
  if (giftCont) {
    giftCont.innerHTML = data.gift.map(g => `
      <div class="p-6 bg-rose-50 rounded-2xl border-2 border-dashed border-rose-200">
        <p class="font-bold text-rose-600">${g.bank}</p>
        <p class="text-xl tracking-widest my-2">${g.accountNumber}</p>
        <p class="text-xs text-slate-500 uppercase">a/n ${g.accountHolder}</p>
      </div>
    `).join('');
  }

  // 5. Footer & Images
  safeSetText('[data-footer-quote]', data.footer.quote);
  safeSetText('[data-footer-verse]', data.footer.verse);
  safeSetText('[data-footer-message]', data.footer.message);
  safeSetText('[data-footer-closing]', data.footer.closing);

  if (data.gallery?.length > 0) {
    document.getElementById('hero-bg').style.backgroundImage = `url('${data.gallery[0]}')`;
    document.getElementById('groom-img').src = data.gallery[1] || data.gallery[0];
    document.getElementById('bride-img').src = data.gallery[2] || data.gallery[0];
  }

  // 6. Countdown & Hearts
  startCountdown(data.dateISO);
  spawnHearts();
}

function startCountdown(dateISO) {
  const target = new Date(dateISO).getTime();
  setInterval(() => {
    const d = target - new Date().getTime();
    if (d < 0) return;
    document.getElementById('days').innerText = Math.floor(d / 864e5);
    document.getElementById('hours').innerText = Math.floor((d % 864e5) / 36e5);
    document.getElementById('minutes').innerText = Math.floor((d % 36e5) / 6e4);
    document.getElementById('seconds').innerText = Math.floor((d % 6e4) / 1000);
  }, 1000);
}

function spawnHearts() {
  const container = document.getElementById('heart-container');
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤';
    heart.style.cssText = `position:absolute; color:#fda4af; opacity:0.4; left:${Math.random()*100}%; top:${Math.random()*100}%; font-size:${15+Math.random()*20}px; animation:float ${3+Math.random()*5}s infinite ease-in-out`;
    container.appendChild(heart);
  }
}

window.initTheme = initTheme;