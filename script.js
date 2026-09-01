const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const menu = $('.menu');
menu.addEventListener('click', () => {
  const header = $('.site-header');
  header.classList.toggle('open');
  menu.setAttribute('aria-expanded', header.classList.contains('open'));
});
$$('.site-header a').forEach(link => link.addEventListener('click', () => $('.site-header').classList.remove('open')));

const audienceToggle = $('.audience-toggle');
const schoolCopy = {
  'eyebrow-text': 'Build Day for Schools · Online learning event',
  'hero-title': 'LEARN IT.<br><span class="outline">DESIGN IT.</span><br><em>BUILD IT.</em>',
  'hero-intro': 'A structured, one-day learning experience that helps students apply coding, design thinking, and collaboration in Roblox Studio.',
  'hero-cta': 'Register your school',
  'hero-secondary': 'View the school program',
  'about-title': 'BRING CREATIVE<br>COMPUTING INTO THE <span>CLASSROOM.</span>',
  'about-copy': 'Build Day for Schools is a free online hackathon designed for teacher-led participation. Students work in supervised teams, attend live workshops, and apply computing concepts by creating a functional interactive experience.',
  'how-title': 'ONE DAY.<br>FROM LESSON<br><span>TO LIVE PROJECT.</span>',
  'how-copy': 'Schools receive a preparation pack, learning objectives, safeguarding guidance, and a complete schedule for supervised participation.',
  'skills-tag': '03 / Curriculum outcomes',
  'skills-title': 'PRACTICAL SKILLS.<br>MEASURABLE <span>OUTCOMES.</span>',
  'skills-copy': 'Students strengthen computational thinking, digital design, collaboration, testing, and presentation skills through a complete project cycle.',
  'skills-cta': 'Enroll your class',
  'rules-title': 'SCHOOL PROJECTS.<br><span>CLEAR SAFEGUARDING.</span>',
  'rules-copy': 'Teacher supervision, age-appropriate participation, and Roblox Community Standards apply throughout the event.',
  'signup-tag': '05 / School registration',
  'signup-title': 'BRING BUILD DAY<br>TO YOUR <span>SCHOOL.</span>',
  'signup-copy': 'Register your interest as an educator. Participation and classroom resources are free.',
  'name-label': 'Educator name',
  'level-label': 'Class experience with Roblox Studio',
  'form-cta': 'Register school interest',
  'form-note': 'We will only send program, safeguarding, and event access information.'
};
const individualCopy = Object.fromEntries(Object.keys(schoolCopy).map(id => [id, document.getElementById(id).innerHTML]));

audienceToggle.addEventListener('click', () => {
  const schoolMode = !document.body.classList.contains('school-mode');
  document.body.classList.toggle('school-mode', schoolMode);
  audienceToggle.setAttribute('aria-pressed', schoolMode);
  $('.toggle-label').textContent = schoolMode ? 'For individuals' : 'For schools';
  Object.entries(schoolMode ? schoolCopy : individualCopy).forEach(([id, value]) => document.getElementById(id).innerHTML = value);
  document.title = schoolMode ? 'Build Day for Schools — Roblox Studio Hackathon' : 'Build Day — A Roblox Creator Hackathon';
});

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
