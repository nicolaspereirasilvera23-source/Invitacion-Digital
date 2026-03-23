const sealButton = document.getElementById('seal');
const envelope = document.getElementById('envelope');
const content = document.getElementById('content');
const hint = document.getElementById('hint');

const openLetter = () => {
  if (!envelope || !content) {
    return;
  }

  envelope.classList.add('open');
  content.classList.add('revealed');

  // 🔊 reproducir música
  const music = document.getElementById("music");
  if (music) {
    music.play().catch(() => {});
  }

  if (sealButton) {
    sealButton.setAttribute('aria-pressed', 'true');
  }

  if (hint) {
    hint.style.opacity = '0';
    setTimeout(() => hint.remove(), 300);
  }
};

if (sealButton) {
  sealButton.addEventListener('click', openLetter);
}

const setupQr = () => {
  const img = document.querySelector('[data-qr]');
  const base = document.body.dataset.qrBase || 'http://localhost:8000/generate-qr?url=';
  if (!img) {
    return;
  }
  img.src = `${base}${encodeURIComponent(window.location.href)}`;
};

const setupRsvp = () => {
  const rsvp = document.querySelector('.rsvp[data-phone]');
  const link = document.getElementById('rsvp-link');
  if (!rsvp || !link) {
    return;
  }
  const phone = rsvp.dataset.phone || '';
  const message = rsvp.dataset.message || 'Hola!';
  link.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

const setupCountdown = () => {
  const countdown = document.querySelector('[data-event-date]');
  if (!countdown) {
    return;
  }

  const targetDate = new Date(countdown.dataset.eventDate || '').getTime();
  const daysEl = countdown.querySelector('[data-days]');
  const hoursEl = countdown.querySelector('[data-hours]');
  const minutesEl = countdown.querySelector('[data-minutes]');
  const secondsEl = countdown.querySelector('[data-seconds]');

  const tick = () => {
    const now = Date.now();
    const diff = Math.max(targetDate - now, 0);

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (daysEl) daysEl.textContent = String(days);
    if (hoursEl) hoursEl.textContent = String(hours);
    if (minutesEl) minutesEl.textContent = String(minutes);
    if (secondsEl) secondsEl.textContent = String(seconds);
  };

  tick();
  window.setInterval(tick, 1000);
};

const setupCarousel = () => {
  const root = document.querySelector('.carousel');
  if (!root) {
    return;
  }

  const slides = root.querySelectorAll('.carousel-slide');
  const indicators = root.querySelectorAll('.carousel-indicator');
  const prevBtn = root.querySelector('.carousel-prev');
  const nextBtn = root.querySelector('.carousel-next');

  if (!slides.length) {
    return;
  }

  let index = [...slides].findIndex((el) => el.classList.contains('active'));
  if (index < 0) {
    index = 0;
  }

  const goTo = (i) => {
    const n = slides.length;
    index = ((i % n) + n) % n;
    slides.forEach((el, j) => el.classList.toggle('active', j === index));
    indicators.forEach((el, j) => {
      const on = j === index;
      el.classList.toggle('active', on);
      if (el instanceof HTMLButtonElement) {
        el.setAttribute('aria-current', on ? 'true' : 'false');
      }
    });
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => goTo(index - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goTo(index + 1));
  }

  indicators.forEach((dot, j) => {
    dot.addEventListener('click', () => goTo(j));
  });

  goTo(index);
};

setupQr();
setupRsvp();
setupCountdown();
setupCarousel();


function abrirMapa() {
  const direccion = "Club Nueva Luna, Calle de las Instrucciones 36, esq. calpino, La Paz, Canelones";
  const url = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(direccion);
  window.open(url, "_blank");
}