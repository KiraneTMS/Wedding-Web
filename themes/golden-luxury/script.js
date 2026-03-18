function initTheme(data) {
  // Data Mapping
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

  // Visual Effects
  spawnCrystals();
}

function spawnCrystals() {
  const container = document.getElementById('heart-container');
  if (!container) return;

  // Membuat partikel kristal berkilau
  for (let i = 0; i < 40; i++) {
    const crystal = document.createElement('div');
    crystal.className = 'crystal';
    
    const size = Math.random() * 4 + 1;
    crystal.style.width = size + 'px';
    crystal.style.height = size + 'px';
    
    crystal.style.left = Math.random() * 100 + '%';
    crystal.style.top = Math.random() * 100 + '%';
    
    crystal.style.animationDelay = Math.random() * 5 + 's';
    crystal.style.animationDuration = (2 + Math.random() * 3) + 's';
    
    // Memberikan rona emas tipis pada beberapa kristal
    if (Math.random() > 0.7) {
      crystal.style.backgroundColor = '#d4af37';
      crystal.style.boxShadow = '0 0 10px 2px rgba(212, 175, 55, 0.8)';
    }

    container.appendChild(crystal);
  }
}

window.initTheme = initTheme;