const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const menu = $('.menu');
menu.addEventListener('click', () => {
  const header = $('.site-header');
  header.classList.toggle('open');
  menu.setAttribute('aria-expanded', header.classList.contains('open'));
});
$$('.site-header a').forEach(link => link.addEventListener('click', () => $('.site-header').classList.remove('open')));

document.addEventListener('pointermove', event => {
  const glow = $('.cursor-glow');
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    if (entry.target.classList.contains('stats')) animateCounts();
    observer.unobserve(entry.target);
  });
}, { threshold: .15 });
$$('.reveal').forEach(el => observer.observe(el));

let counted = false;
function animateCounts() {
  if (counted) return;
  counted = true;
  $$('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / 900, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

const eventDate = new Date('2027-06-14T10:00:00-07:00');
function updateCountdown() {
  const distance = Math.max(eventDate - new Date(), 0);
  $('#days').textContent = Math.floor(distance / 86400000);
  $('#hours').textContent = String(Math.floor(distance / 3600000) % 24).padStart(2, '0');
  $('#minutes').textContent = String(Math.floor(distance / 60000) % 60).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 60000);

const form = $('.signup-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  $$('.field', form).forEach(field => field.classList.remove('invalid'));
  let valid = true;
  $$('input:not([type="checkbox"]), select', form).forEach(input => {
    if (!input.checkValidity()) {
      input.closest('.field').classList.add('invalid');
      valid = false;
    }
  });
  const consent = $('input[type="checkbox"]', form);
  if (!consent.checked) {
    consent.closest('.check').style.outline = '1px solid #ff6e6e';
    valid = false;
  } else consent.closest('.check').style.outline = '';
  if (!valid) return;
  form.style.display = 'none';
  $('.success').classList.add('show');
});

$('.reset').addEventListener('click', () => {
  form.reset();
  form.style.display = 'block';
  $('.success').classList.remove('show');
});
