function initTheme(data) {
  // 1. Data Mapping
  const setText = (selector, text) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  };

  setText('[data-tagline]', data.tagline);
  setText('[data-date-str]', data.dateStr);
  setText('[data-groom-short]', data.groom.name.split(',')[0]);
  setText('[data-bride-short]', data.bride.name.split(',')[0]);
  setText('[data-groom]', data.groom.name);
  setText('[data-bride]', data.bride.name);
  setText('[data-groom-parent]', data.groom.parent);
  setText('[data-bride-parent]', data.bride.parent);

  if (data.gallery && data.gallery.length > 0) {
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) heroBg.style.backgroundImage = `url('${data.gallery[0]}')`;
    document.getElementById('groom-img').src = data.gallery[1] || data.gallery[0];
    document.getElementById('bride-img').src = data.gallery[2] || data.gallery[0];
  }

  // 2. Spawn Animasi Bunga
  spawnFlowers();

  // 3. Tambahkan Efek Scroll Reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section').forEach(section => {
    section.classList.add('reveal');
    observer.observe(section);
  });
}

function spawnFlowers() {
  const container = document.getElementById('heart-container');
  if (!container) return;

  // Gunakan variasi warna hijau sage
  const colors = ['#a3b18a', '#588157', '#dad7cd'];
  const symbols = ['❀', '✿', '🍃', '🌿', '🌱'];

  for (let i = 0; i < 20; i++) {
    const petal = document.createElement('div');
    petal.className = 'flower-particle';
    petal.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
    
    petal.style.left = Math.random() * 100 + '%';
    petal.style.top = Math.random() * 100 + '%';
    petal.style.color = colors[Math.floor(Math.random() * colors.length)];
    petal.style.fontSize = (12 + Math.random() * 20) + 'px';
    
    // Animasi acak
    const duration = 10 + Math.random() * 15;
    petal.style.animation = `floatLeaf ${duration}s infinite linear`;
    petal.style.animationDelay = `-${Math.random() * duration}s`;
    
    container.appendChild(petal);
  }
}

window.initTheme = initTheme;