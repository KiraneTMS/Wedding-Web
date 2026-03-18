function initTheme(data) {
  // Mapping Data
  document.querySelector('[data-tagline]').textContent = data.tagline;
  document.querySelector('[data-date-str]').textContent = data.dateStr;
  document.querySelector('[data-groom-short]').textContent = data.groom.name.split(',')[0];
  document.querySelector('[data-bride-short]').textContent = data.bride.name.split(',')[0];
  document.querySelector('[data-groom]').textContent = data.groom.name;
  document.querySelector('[data-bride]').textContent = data.bride.name;
  document.querySelector('[data-groom-parent]').textContent = data.groom.parent;
  document.querySelector('[data-bride-parent]').textContent = data.bride.parent;

  if (data.gallery && data.gallery.length > 0) {
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) heroBg.style.backgroundImage = `url('${data.gallery[0]}')`;
    document.getElementById('groom-img').src = data.gallery[1] || data.gallery[0];
    document.getElementById('bride-img').src = data.gallery[2] || data.gallery[0];
  }

  // Countdown
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