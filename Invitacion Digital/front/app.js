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

setupQr();
setupRsvp();
setupCountdown();


function abrirMapa() {
  const direccion = "Club Nueva Luna, Calle de las Instrucciones 36, esq. calpino, La Paz, Canelones";
  const url = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(direccion);
  window.open(url, "_blank");
}