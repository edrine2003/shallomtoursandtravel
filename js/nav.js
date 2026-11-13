/* =============================================
   SHARED NAVIGATION — nav.js
   Used by all pages (destinations, packages,
   services, gallery, contact)
   ============================================= */
'use strict';

(function () {
  const navToggle = document.getElementById('nav-toggle');
  const mainNav   = document.getElementById('main-nav');
  const yearEl    = document.getElementById('footer-year');

  /* Footer year */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Mobile nav overlay */
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:399;display:none;';
  document.body.appendChild(overlay);

  function openNav() {
    mainNav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    const bars = navToggle.querySelectorAll('span');
    if (bars[0]) { bars[0].style.transform = 'translateY(7px) rotate(45deg)'; bars[1].style.opacity = '0'; bars[2].style.transform = 'translateY(-7px) rotate(-45deg)'; }
  }

  function closeNav() {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    const bars = navToggle.querySelectorAll('span');
    if (bars[0]) { bars[0].style.transform = ''; bars[1].style.opacity = ''; bars[2].style.transform = ''; }
  }

  navToggle?.addEventListener('click', () =>
    mainNav.classList.contains('is-open') ? closeNav() : openNav()
  );
  overlay.addEventListener('click', closeNav);
  mainNav?.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

  /* Sticky header shadow */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 20px rgba(0,0,0,.18)'
        : '0 2px 10px rgba(0,0,0,.06)';
    }, { passive: true });
  }

  /* Smooth scroll for pill nav links */
  document.querySelectorAll('.dest-pill[href^="#"]').forEach(pill => {
    pill.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(pill.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* Scroll reveal */
  if ('IntersectionObserver' in window) {
    const style = document.createElement('style');
    style.textContent = '.reveal{opacity:0;transform:translateY(24px);transition:opacity .5s ease,transform .5s ease}.reveal.in-view{opacity:1;transform:none}';
    document.head.appendChild(style);
    const targets = document.querySelectorAll('.dest-section, .pkg-full, .svc-full-card, .gal-item, .contact-card, .pkg-combo__card');
    targets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 4) * 60}ms`;
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); } });
    }, { threshold: 0.08 });
    targets.forEach(el => io.observe(el));
  }

  /* Page load fade-in */
  window.addEventListener('load', () => document.body.classList.add('loaded'));

})();
