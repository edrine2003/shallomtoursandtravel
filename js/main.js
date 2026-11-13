/* =============================================
   SHALLOM UGANDA TOURS AND TRAVELS — main.js
   ============================================= */
'use strict';

/* =============================================
   PAGE LOAD FADE-IN
   ============================================= */
window.addEventListener('load', () => document.body.classList.add('loaded'));

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
mainNav?.querySelectorAll('.nav__link:not(.nav__drop-btn)').forEach(l =>
  l.addEventListener('click', closeNav)
);
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeNav(); } });

/* Mobile dropdown toggles */
mainNav?.querySelectorAll('.nav__drop-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.nav__item--drop');
    const isOpen = item.classList.contains('open');
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
      : '0 2px 20px rgba(0,0,0,.18)';
  }).observe(sentinel);
}

/* =============================================
   SCROLL SPY — active nav link
   ============================================= */
const navSections = ['destinations','packages','about','reviews','contact','services','visa'];
const navLinks = [...(mainNav?.querySelectorAll('.nav__link:not(.nav__drop-btn)') || [])];

function updateActiveNav() {
  let current = '';
  navSections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  navLinks.forEach(link => {
    link.classList.remove('nav__link--active');
    if (current && link.getAttribute('href') === `#${current}`) {
      link.classList.add('nav__link--active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });

/* =============================================
   BACK TO TOP
   ============================================= */
const btt = document.getElementById('back-to-top');
if (btt) {
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    btt.hidden = !show;
  }, { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
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
  new MutationObserver(() => { if (el.hidden) el.removeEventListener('keydown', h); })
    .observe(el, { attributes: true, attributeFilter: ['hidden'] });
}

/* =============================================
   WHATSAPP FORM SUBMISSION
   ============================================= */
const WA = '256772123456';
const waUrl = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

function validate(form) {
  form.querySelectorAll('.fg__err').forEach(e => e.remove());
  form.querySelectorAll('.fg__input').forEach(f => {
    f.classList.remove('is-valid','is-invalid');
    f.style.borderColor = '';
  });
  let ok = true;
  form.querySelectorAll('[required]').forEach(f => {
    if (!f.value.trim()) {
      f.classList.add('is-invalid');
      const err = Object.assign(document.createElement('span'), {
        className: 'fg__err',
        textContent: 'This field is required.',
      });
      err.style.cssText = 'display:block;font-size:.72rem;color:#c0392b;margin-top:.25rem;';
      f.insertAdjacentElement('afterend', err);
      if (ok) f.focus();
      ok = false;
    } else {
      f.classList.add('is-valid');
    }
  });
  return ok;
}

/* Live validation feedback on blur */
document.querySelectorAll('.fg__input[required]').forEach(input => {
  input.addEventListener('blur', () => {
    input.classList.remove('is-valid','is-invalid');
    if (input.value.trim()) {
      input.classList.add('is-valid');
    } else {
      input.classList.add('is-invalid');
    }
  });
  input.addEventListener('input', () => {
    if (input.value.trim()) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    }
  });
});

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
   ANIMATED COUNTERS
   ============================================= */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const isDecimal = target % 1 !== 0;
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;
    el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isDecimal ? target.toFixed(1) : target;
  }
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-item__num');
if ('IntersectionObserver' in window && statNums.length) {
  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNums.forEach(el => animateCounter(el));
        statsObs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  const statsSection = document.querySelector('.stats');
  if (statsSection) statsObs.observe(statsSection);
}

/* =============================================
   REVIEW SLIDER
   ============================================= */
const slides = [...document.querySelectorAll('.review-slide')];
const dots   = [...document.querySelectorAll('.review-dot')];
let current  = 0, autoTimer;

function showSlide(idx) {
  slides.forEach((s, i) => s.classList.toggle('active', i === idx));
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
   GALLERY ARROWS
   ============================================= */
const galPrev  = document.getElementById('gal-prev');
const galNext  = document.getElementById('gal-next');
const galItems = [...document.querySelectorAll('.gallery-strip__item')];
let galIdx = 0;

function highlightGal(idx) {
  galItems.forEach((el, i) => {
    el.style.opacity   = i === idx ? '1' : '0.6';
    el.style.transform = i === idx ? 'scale(1.1)' : '';
    el.style.outline   = i === idx ? `2px solid var(--orange)` : '';
  });
  galIdx = idx;
}

galPrev?.addEventListener('click', () => highlightGal((galIdx - 1 + galItems.length) % galItems.length));
galNext?.addEventListener('click', () => highlightGal((galIdx + 1) % galItems.length));

/* =============================================
   SCROLL REVEAL ANIMATIONS
   ============================================= */
if ('IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll(
    '.dest-card, .pkg-card, .svc-card, .why-item, .stat-item, .contact__form-wrap, .contact__info'
  );

  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
  });

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealTargets.forEach(el => revealObs.observe(el));
}

/* =============================================
   DESTINATION DETAIL ACCORDIONS
   ============================================= */
document.querySelectorAll('.dest-detail__header').forEach(btn => {
  btn.addEventListener('click', () => {
    const detail = btn.closest('.dest-detail');
    const isOpen = detail.classList.contains('open');
    document.querySelectorAll('.dest-detail.open').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.dest-detail__header').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      detail.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* Open accordion from card link */
document.querySelectorAll('[data-dest-link]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.getElementById(link.dataset.destLink);
    if (target) {
      target.classList.add('open');
      target.querySelector('.dest-detail__header').setAttribute('aria-expanded', 'true');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});

/* =============================================
   LIGHTBOX GALLERY
   ============================================= */
const lightboxImages = [
  { src: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Mountain_gorilla_%28Gorilla_beringei_beringei%29_female_eating_root.jpg', label: 'Mountain gorilla — Bwindi Impenetrable Forest' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Murchison_Falls_-_by_Boschlech.jpg', label: 'Murchison Falls — the Nile River exploding through a narrow gorge' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/African_elephant.jpg', label: 'African elephant — Uganda wildlife' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Zanzibar_Sunset.jpg', label: 'Zanzibar sunset — Indian Ocean coastline' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Lake_Bunyonyi_%288146148093%29.jpg', label: 'Lake Bunyonyi — Place of Many Little Birds' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Hippopotami_in_the_Kazinga_Channel%2C_Queen_Elizabeth_National_Park.jpg', label: 'Hippos in the Kazinga Channel — Queen Elizabeth NP' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Tree_lion_2.jpg', label: 'Tree-climbing lion — Queen Elizabeth NP, Ishasha sector' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Bwindi_mountains.jpg', label: 'Bwindi mountains — misty rainforest landscape' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Kendwa_Beach_%28Sunset_Kendwa_Hotel%29.JPG', label: 'Kendwa Beach — Zanzibar' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Uganda-Kob.jpg', label: 'Uganda Kob — Queen Elizabeth NP' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Crater_lake_in_Queen_Elizabeth_National_Park.jpg', label: 'Crater lake — Queen Elizabeth NP' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Punishment_Island.jpg', label: 'Punishment Island — Lake Bunyonyi' },
];

let lbIndex = 0;
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbCaption = document.getElementById('lightbox-caption');
const lbCounter = document.getElementById('lightbox-counter');

function openLightbox(idx) {
  lbIndex = idx;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const item = lightboxImages[lbIndex];
  if (!item) return;
  lbImg.src = item.src;
  lbImg.alt = item.label;
  lbCaption.textContent = item.label;
  lbCounter.textContent = `${lbIndex + 1} / ${lightboxImages.length}`;
}

function lbNext() { lbIndex = (lbIndex + 1) % lightboxImages.length; updateLightbox(); }
function lbPrev() { lbIndex = (lbIndex - 1 + lightboxImages.length) % lightboxImages.length; updateLightbox(); }

document.getElementById('lb-close')?.addEventListener('click', closeLightbox);
document.getElementById('lb-next')?.addEventListener('click', lbNext);
document.getElementById('lb-prev')?.addEventListener('click', lbPrev);
lightbox?.querySelector('.lightbox__bg')?.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => {
  if (!lightbox?.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') lbNext();
  if (e.key === 'ArrowLeft') lbPrev();
});

/* Gallery strip items → open lightbox */
document.querySelectorAll('.gallery-strip__item').forEach((el, i) => {
  el.addEventListener('click', () => openLightbox(i));
});

/* Full gallery items → open lightbox */
document.querySelectorAll('.gallery-full__item').forEach(el => {
  el.addEventListener('click', () => {
    const idx = parseInt(el.dataset.lbIndex, 10) || 0;
    openLightbox(idx);
  });
});

/* =============================================
   PACKAGE DETAIL MODALS
   ============================================= */
document.querySelectorAll('[data-pkg-detail]').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = document.getElementById(btn.dataset.pkgDetail);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});

document.querySelectorAll('.pkg-modal__close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.pkg-modal').classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.querySelectorAll('.pkg-modal__bg').forEach(bg => {
  bg.addEventListener('click', () => {
    bg.closest('.pkg-modal').classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.pkg-modal.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});
