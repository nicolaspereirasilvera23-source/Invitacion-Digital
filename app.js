const sealButton = document.getElementById('seal');
const envelope = document.getElementById('envelope');
const content = document.getElementById('content');
const hint = document.getElementById('hint');
const music = document.getElementById('bg-music');

const reproducirMusica = () => {
  if (!music) {
    return;
  }
  if (music.paused) {
    music.volume = 0.6;
    const playPromise = music.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  }
};

const openLetter = () => {
  if (!envelope || !content) {
    return;
  }
  envelope.classList.add('open');
  content.classList.add('revealed');
  reproducirMusica();
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
  const carousel = document.querySelector('.carousel');
  if (!carousel) {
    return;
  }

  const container = carousel.querySelector('.carousel-container');
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const prev = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  let indicators = Array.from(carousel.querySelectorAll('.carousel-indicator'));

  if (!container || slides.length === 0) {
    return;
  }

  const indicatorsWrap = carousel.querySelector('.carousel-indicators');
  if (indicatorsWrap && indicators.length !== slides.length) {
    indicatorsWrap.innerHTML = '';
    indicators = slides.map((_, index) => {
      const dot = document.createElement('span');
      dot.className = 'carousel-indicator';
      dot.setAttribute('data-index', String(index));
      indicatorsWrap.appendChild(dot);
      return dot;
    });
  }

  let current = 0;

  const update = (index) => {
    current = (index + slides.length) % slides.length;
    container.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === current);
    });
    indicators.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === current);
    });
  };

  if (prev) {
    prev.addEventListener('click', () => update(current - 1));
  }

  if (next) {
    next.addEventListener('click', () => update(current + 1));
  }

  indicators.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => update(dotIndex));
  });

  let startX = 0;
  let currentX = 0;
  let isSwiping = false;

  container.addEventListener(
    'touchstart',
    (event) => {
      if (!event.touches || event.touches.length !== 1) {
        return;
      }
      startX = event.touches[0].clientX;
      currentX = startX;
      isSwiping = true;
    },
    { passive: true },
  );

  container.addEventListener(
    'touchmove',
    (event) => {
      if (!isSwiping) {
        return;
      }
      currentX = event.touches[0].clientX;
    },
    { passive: true },
  );

  container.addEventListener('touchend', () => {
    if (!isSwiping) {
      return;
    }
    const delta = currentX - startX;
    if (Math.abs(delta) > 50) {
      update(delta < 0 ? current + 1 : current - 1);
    }
    isSwiping = false;
  });

  update(current);
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
