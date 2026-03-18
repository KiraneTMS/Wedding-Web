// Hapus 'async' jika tidak ada await agar lebih stabil di beberapa browser
function initTheme(data) {
  console.log("Memulai tema...");

  // 1. Mapping Data Teks
  const safeSetText = (selector, text) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  };

  safeSetText('[data-tagline]', data.tagline);
  safeSetText('[data-date-str]', data.dateStr);
  safeSetText('[data-groom-short]', data.groom.name.split(',')[0]);
  safeSetText('[data-bride-short]', data.bride.name.split(',')[0]);
  safeSetText('[data-groom]', data.groom.name);
  safeSetText('[data-bride]', data.bride.name);
  safeSetText('[data-groom-parent]', data.groom.parent);
  safeSetText('[data-bride-parent]', data.bride.parent);

  // 2. Background & Profile Images
  if (data.gallery && data.gallery.length > 0) {
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) heroBg.style.backgroundImage = `url('${data.gallery[0]}')`;
    
    const gImg = document.getElementById('groom-img');
    if (gImg) gImg.src = data.gallery[1] || data.gallery[0];
    
    const bImg = document.getElementById('bride-img');
    if (bImg) bImg.src = data.gallery[2] || data.gallery[0];
  }

  // 3. Countdown Timer
  if (data.dateISO) {
    const targetDate = new Date(data.dateISO).getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const d = targetDate - now;
      if (d < 0) return clearInterval(timer);
      
      if (document.getElementById('days')) document.getElementById('days').innerText = Math.floor(d / 864e5);
      if (document.getElementById('hours')) document.getElementById('hours').innerText = Math.floor((d % 864e5) / 36e5);
      if (document.getElementById('minutes')) document.getElementById('minutes').innerText = Math.floor((d % 36e5) / 6e4);
      if (document.getElementById('seconds')) document.getElementById('seconds').innerText = Math.floor((d % 6e4) / 1000);
    }, 1000);
  }

  // 4. Jalankan Fungsi Hati
  spawnHearts();
}

function spawnHearts() {
  const container = document.getElementById('heart-container');
  if (!container) {
    console.error("Elemen heart-container tidak ditemukan!");
    return;
  }
  
  // Bersihkan container sebelum mengisi
  container.innerHTML = '';
  
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤';
    // Gunakan gaya langsung (inline style) agar pasti muncul tanpa tergantung CSS luar
    heart.style.position = 'absolute';
    heart.style.color = '#fda4af'; 
    heart.style.opacity = '0.4';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.top = Math.random() * 100 + '%';
    heart.style.fontSize = (15 + Math.random() * 20) + 'px';
    heart.style.pointerEvents = 'none';
    heart.style.animation = `float ${3 + Math.random() * 5}s infinite ease-in-out`;
    container.appendChild(heart);
  }
}

// Pastikan fungsi ini tersedia secara global
window.initTheme = initTheme;