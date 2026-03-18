function initTheme(data) {
  document.querySelector('[data-groom]').textContent = data.groom.name;
  document.querySelector('[data-bride]').textContent = data.bride.name;
  document.querySelector('[data-date-str]').textContent = data.dateStr;
  document.querySelector('[data-tagline]').textContent = data.tagline;

  document.querySelector('[data-ceremony-title]').textContent = data.ceremony.title;
  document.querySelector('[data-ceremony-venue]').textContent = data.ceremony.venue;
  document.querySelector('[data-ceremony-address]').innerHTML = data.ceremony.address;
  document.querySelector('[data-ceremony-time]').textContent = data.ceremony.time;

  document.querySelector('[data-reception-title]').textContent = data.reception.title;
  document.querySelector('[data-reception-venue]').textContent = data.reception.venue;
  document.querySelector('[data-reception-address]').innerHTML = data.reception.address;
  document.querySelector('[data-reception-time]').textContent = data.reception.time;

  // Gallery (polaroid style)
    const polaroidGrid = document.getElementById('polaroid-grid');
    if (data.gallery && data.gallery.length > 0) {
    data.gallery.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = "Boho moment";
        img.loading = "lazy";
        polaroidGrid.appendChild(img);
    });
    }

  document.querySelector('[data-footer-message]').innerHTML = data.footer.message;
  document.querySelector('[data-footer-closing]').innerHTML = data.footer.closing;
}

window.initTheme = initTheme;