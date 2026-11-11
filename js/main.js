/* =============================================
   SHALLOM UGANDA TOURS AND TRAVELS — main.js
   ============================================= */
'use strict';

/* ---- Footer year ---- */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---- Min date on date inputs ---- */
const today = new Date().toISOString().split('T')[0];
document.querySelectorAll('input[type="date"]').forEach(i => i.setAttribute('min', today));

/* =============================================
   MOBILE NAVIGATION
   ============================================= */
const navToggle = document.getElementById('nav-toggle');
const mainNav   = document.getElementById('main-nav');

// Overlay
const navOvl = document.createElement('div');
Object.assign(navOvl.style, {
  position:'fixed', inset:'0', background:'rgba(0,0,0,.35)',
  zIndex:'399', display:'none'
});
document.body.appendChild(navOvl);

function openNav() {
  mainNav.classList.add('is-open');
  navToggle.setAttribute('aria-expanded','true');
  navOvl.style.display = 'block';
  document.body.style.overflow = 'hidden';
  const bars = navToggle.querySelectorAll('span');
  bars[0].style.transform = 'translateY(7px) rotate(45deg)';
  bars[1].style.opacity   = '0';
  bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
}

function closeNav() {
  mainNav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded','false');
  navOvl.style.display = 'none';
  document.body.style.overflow = '';
  const bars = navToggle.querySelectorAll('span');
  bars[0].style.transform = '';
  bars[1].style.opacity   = '';
  bars[2].style.transform = '';
}

navToggle?.addEventListener('click', () =>
  mainNav.classList.contains('is-open') ? closeNav() : openNav()
);
navOvl.addEventListener('click', closeNav);
mainNav?.querySelectorAll('.nav__link:not(.nav__drop-btn)').forEach(l => l.addEventListener('click', closeNav));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

/* Mobile dropdown toggles */
mainNav?.querySelectorAll('.nav__drop-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.nav__item--drop');
    const isOpen = item.classList.contains('open');
    // close all others
    mainNav.querySelectorAll('.nav__item--drop.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
});

/* =============================================
   STICKY HEADER SHADOW
   ============================================= */
const header = document.querySelector('.header');
if (header) {
  const sentinel = document.createElement('div');
  document.body.prepend(sentinel);
  new IntersectionObserver(([e]) => {
    header.style.boxShadow = e.isIntersecting
      ? '0 2px 10px rgba(0,0,0,.06)'
      : '0 2px 20px rgba(0,0,0,.14)';
  }).observe(sentinel);
}

/* =============================================
   SEARCH → FILTER PACKAGES
   ============================================= */
const searchForm = document.getElementById('search-form');
const pkgGrid    = document.getElementById('pkg-grid');
const pkgNoRes   = document.getElementById('pkg-no-result');

searchForm?.addEventListener('submit', e => {
  e.preventDefault();
  const dest = e.target.destination.value;

  // Show all if no destination
  if (!dest) {
    pkgGrid?.querySelectorAll('.pkg-card').forEach(c => c.style.display = '');
    if (pkgNoRes) pkgNoRes.hidden = true;
    return;
  }

  document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  setTimeout(() => {
    let count = 0;
    pkgGrid?.querySelectorAll('.pkg-card').forEach(c => {
      const show = c.dataset.dest === dest;
      c.style.display = show ? '' : 'none';
      if (show) count++;
    });
    if (pkgNoRes) pkgNoRes.hidden = count > 0;
  }, 420);
});

/* =============================================
   MODALS
   ============================================= */
let _lastFocus = null;

function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  _lastFocus = document.activeElement;
  m.hidden = false;
  document.body.style.overflow = 'hidden';
  const first = m.querySelector('input,select,textarea') || m.querySelector('button');
  first?.focus();
  trapFocus(m);
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.hidden = true;
  document.body.style.overflow = '';
  _lastFocus?.focus();
}

document.querySelectorAll('.modal__close').forEach(btn =>
  btn.addEventListener('click', () => closeModal(btn.dataset.modal))
);
document.querySelectorAll('.modal__bg').forEach(bg =>
  bg.addEventListener('click', () => {
    const m = bg.closest('.modal');
    if (m) closeModal(m.id);
  })
);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape')
    document.querySelectorAll('.modal:not([hidden])').forEach(m => closeModal(m.id));
});

document.getElementById('btn-book-header')?.addEventListener('click', () => openModal('modal-book'));
document.getElementById('btn-visa')?.addEventListener('click', () => openModal('modal-visa'));

// Global: called by inline onclick on package cards
window.openBookModal = function(btn) {
  openModal('modal-book');
  const pkg = btn?.dataset?.package;
  if (pkg) {
    const sel = document.getElementById('bk-pkg');
    if (sel) sel.value = pkg;
  }
};

function trapFocus(el) {
  const sel = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const nodes = [...el.querySelectorAll(sel)];
  const first = nodes[0], last = nodes[nodes.length - 1];
  function h(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
    else             { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
  }
  el.addEventListener('keydown', h);
  new MutationObserver(() => { if (el.hidden) { el.removeEventListener('keydown', h); } })
    .observe(el, { attributes: true, attributeFilter: ['hidden'] });
}

/* =============================================
   WHATSAPP FORM SUBMISSION
   ============================================= */
const WA = '256772123456';
const waUrl = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

function validate(form) {
  form.querySelectorAll('.fg__err').forEach(e => e.remove());
  form.querySelectorAll('.fg__input--err').forEach(e => e.classList.remove('fg__input--err'));
  let ok = true;
  form.querySelectorAll('[required]').forEach(f => {
    if (!f.value.trim()) {
      f.classList.add('fg__input--err');
      f.style.borderColor = '#c0392b';
      const err = Object.assign(document.createElement('span'), {
        className: 'fg__err',
        textContent: 'Required.',
        style: 'display:block;font-size:.72rem;color:#c0392b;margin-top:.2rem;'
      });
      f.insertAdjacentElement('afterend', err);
      if (ok) f.focus();
      ok = false;
    }
  });
  return ok;
}

/* Enquiry form */
document.getElementById('enquiry-form')?.addEventListener('submit', e => {
  e.preventDefault();
  if (!validate(e.target)) return;
  const d = new FormData(e.target);
  const lines = [
    '*New Enquiry — Shallom Uganda Tours*',
    `Name: ${d.get('name')}`,
    `Phone: ${d.get('phone')}`,
    `Interest: ${d.get('interest')}`,
    d.get('message') ? `Message: ${d.get('message')}` : ''
  ].filter(Boolean);
  window.open(waUrl(lines.join('\n')), '_blank', 'noopener');
});

/* Book form */
document.getElementById('book-form')?.addEventListener('submit', e => {
  e.preventDefault();
  if (!validate(e.target)) return;
  const d = new FormData(e.target);
  const lines = [
    '*Booking Request — Shallom Uganda Tours*',
    `Name: ${d.get('name')}`,
    `Package: ${d.get('package')}`,
    d.get('date')       ? `Date: ${d.get('date')}` : '',
    d.get('travellers') ? `Travellers: ${d.get('travellers')}` : ''
  ].filter(Boolean);
  window.open(waUrl(lines.join('\n')), '_blank', 'noopener');
  closeModal('modal-book');
});

/* Visa form */
document.getElementById('visa-form')?.addEventListener('submit', e => {
  e.preventDefault();
  if (!validate(e.target)) return;
  const d = new FormData(e.target);
  const lines = [
    '*Visa Enquiry — Shallom Uganda Tours*',
    `Name: ${d.get('name')}`,
    `Destination: ${d.get('destination')}`,
    `Visa type: ${d.get('visa_type')}`,
    d.get('message') ? `Details: ${d.get('message')}` : ''
  ].filter(Boolean);
  window.open(waUrl(lines.join('\n')), '_blank', 'noopener');
  closeModal('modal-visa');
});

/* =============================================
   REVIEW SLIDER
   ============================================= */
const slides = [...document.querySelectorAll('.review-slide')];
const dots   = [...document.querySelectorAll('.review-dot')];
let current  = 0, autoTimer;

function showSlide(idx) {
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === idx);
  });
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === idx);
    d.setAttribute('aria-selected', String(i === idx));
  });
  current = idx;
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(autoTimer);
    showSlide(+dot.dataset.idx);
    autoTimer = setInterval(() => showSlide((current + 1) % slides.length), 5000);
  });
});

if (slides.length > 1) {
  autoTimer = setInterval(() => showSlide((current + 1) % slides.length), 5000);
}

/* =============================================
   GALLERY ARROWS (decorative — grid doesn't scroll,
   arrows cycle highlight)
   ============================================= */
const galPrev  = document.getElementById('gal-prev');
const galNext  = document.getElementById('gal-next');
const galItems = [...document.querySelectorAll('.gallery-strip__item')];
let galIdx = 0;

function highlightGal(idx) {
  galItems.forEach((el, i) => {
    el.style.opacity  = i === idx ? '1' : '0.65';
    el.style.transform = i === idx ? 'scale(1.08)' : '';
  });
  galIdx = idx;
}

galPrev?.addEventListener('click', () => highlightGal((galIdx - 1 + galItems.length) % galItems.length));
galNext?.addEventListener('click', () => highlightGal((galIdx + 1) % galItems.length));

/* =============================================
   SCROLL FADE-IN ANIMATIONS
   ============================================= */
if ('IntersectionObserver' in window) {
  const style = document.createElement('style');
  style.textContent = `
    .fade-up { opacity:0; transform:translateY(22px); transition: opacity .5s ease, transform .5s ease; }
    .fade-up.visible { opacity:1; transform:none; }
  `;
  document.head.appendChild(style);

  document.querySelectorAll(
    '.dest-card,.pkg-card,.svc-card,.why-item,.review-slide.active,.gallery-strip__item'
  ).forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${(i % 5) * 65}ms`;
  });

  new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); } });
  }, { threshold: 0.12 }).observe(...(document.querySelectorAll('.fade-up').length
    ? [document.querySelectorAll('.fade-up')[0]]
    : [document.body]));

  // Re-observe all
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
}
