/* =============================================
   BOOKING PAGE — booking.js
   ============================================= */
'use strict';

/* ---- Footer year ---- */
document.getElementById('footer-year').textContent = new Date().getFullYear();

/* ---- Min dates ---- */
const today = new Date().toISOString().split('T')[0];
document.querySelectorAll('input[type="date"]').forEach(i => i.setAttribute('min', today));

/* ---- Start/end date sync ---- */
const startInput = document.getElementById('bk-start');
const endInput   = document.getElementById('bk-end');
startInput?.addEventListener('change', () => {
  if (endInput && startInput.value) endInput.setAttribute('min', startInput.value);
});

/* =============================================
   PROGRESS BAR
   ============================================= */
const steps = document.querySelectorAll('.bk-step');
const bar   = document.getElementById('bk-progress-bar');
const totalFields = document.querySelectorAll('.bk-form [required]').length;

function updateProgress() {
  const filled = [...document.querySelectorAll('.bk-form [required]')]
    .filter(f => f.type === 'checkbox' ? f.checked : f.value.trim() !== '').length;
  const pct = Math.round((filled / totalFields) * 100);
  if (bar) bar.style.width = pct + '%';
}

document.querySelectorAll('.bk-form input, .bk-form select, .bk-form textarea').forEach(el =>
  el.addEventListener('input', updateProgress)
);

/* =============================================
   LIVE BOOKING SUMMARY
   ============================================= */
function updateSummary() {
  const grid = document.getElementById('bk-summary-grid');
  if (!grid) return;

  const pkg       = document.getElementById('bk-package')?.value;
  const start     = document.getElementById('bk-start')?.value;
  const end       = document.getElementById('bk-end')?.value;
  const adults    = document.getElementById('bk-adults')?.value;
  const children  = document.getElementById('bk-children')?.value;
  const groupType = document.getElementById('bk-group-type')?.value;
  const fname     = document.getElementById('bk-fname')?.value;
  const lname     = document.getElementById('bk-lname')?.value;
  const accom     = document.getElementById('bk-accom')?.value;

  const rows = [
    ['Tour',       pkg || '—'],
    ['Start date', start ? formatDate(start) : '—'],
    ['End date',   end   ? formatDate(end)   : '—'],
    ['Travellers', `${adults || 1} adult(s)${+children > 0 ? `, ${children} child(ren)` : ''}`],
    ['Group type', groupType || '—'],
    ['Client',     (fname || lname) ? `${fname} ${lname}`.trim() : '—'],
    ['Accommodation', accom || '—'],
  ];

  grid.innerHTML = rows.map(([label, val]) =>
    `<span class="bk-s-label">${label}</span><span class="bk-s-val">${val}</span>`
  ).join('');
}

function formatDate(str) {
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}

document.querySelectorAll('.bk-form input, .bk-form select').forEach(el =>
  el.addEventListener('change', updateSummary)
);
updateSummary(); // initial

/* =============================================
   FORM VALIDATION
   ============================================= */
function validate(form) {
  form.querySelectorAll('.fg__err').forEach(e => e.remove());
  form.querySelectorAll('.fg__input').forEach(f => f.style.borderColor = '');

  let ok = true;
  form.querySelectorAll('[required]').forEach(f => {
    const empty = f.type === 'checkbox' ? !f.checked : !f.value.trim();
    if (empty) {
      f.style.borderColor = '#c0392b';
      const err = document.createElement('span');
      err.className = 'fg__err';
      err.textContent = 'Required.';
      err.style.cssText = 'display:block;font-size:.72rem;color:#c0392b;margin-top:.2rem;';
      f.insertAdjacentElement('afterend', err);
      if (ok) { f.focus(); f.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      ok = false;
    }
  });
  return ok;
}

/* =============================================
   BUILD WHATSAPP MESSAGE
   ============================================= */
function buildMessage() {
  const v = id => document.getElementById(id)?.value?.trim() || '';
  const checked = name => [...document.querySelectorAll(`[name="${name}"]:checked`)]
    .map(c => c.value).join(', ') || 'None';

  const lines = [
    '🌍 *TOUR BOOKING REQUEST*',
    '*Shallom Uganda Tours and Travels*',
    '─────────────────────────',
    '',
    '📋 *TOUR DETAILS*',
    `Package: ${v('package')}`,
    `Start date: ${v('start_date') ? formatDate(v('start_date')) : '—'}`,
    `End date: ${v('end_date') ? formatDate(v('end_date')) : '—'}`,
    `Date flexibility: ${v('flexibility')}`,
    '',
    '👥 *TRAVELLERS*',
    `Adults: ${v('adults')}`,
    `Children: ${v('children')}`,
    `Group type: ${v('group_type')}`,
    `Nationality: ${v('nationality')}`,
    '',
    '👤 *CLIENT DETAILS*',
    `Name: ${v('first_name')} ${v('last_name')}`,
    `Email: ${v('email')}`,
    `Phone/WhatsApp: ${v('phone')}`,
    `Country of residence: ${v('country')}`,
    '',
    '🏕️ *PREFERENCES*',
    `Accommodation: ${v('accommodation')}`,
    `Room type: ${v('room_type')}`,
    `Transport: ${v('transport')}`,
    `Dietary requirements: ${checked('dietary')}`,
    `Add-on services: ${checked('addons')}`,
    '',
    '🏃 *HEALTH & SPECIAL REQUIREMENTS*',
    `Fitness level: ${v('fitness')}`,
    v('health')           ? `Medical notes: ${v('health')}`           : '',
    v('special_requests') ? `Special requests: ${v('special_requests')}` : '',
    '',
    v('how_heard') ? `Heard about us via: ${v('how_heard')}` : '',
    '',
    '─────────────────────────',
    `Ref: ${generateRef()}`,
  ].filter(l => l !== null && l !== undefined);

  return lines.join('\n');
}

/* =============================================
   REFERENCE NUMBER
   ============================================= */
function generateRef() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `SUT-${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${Math.floor(1000+Math.random()*9000)}`;
}

/* =============================================
   FORM SUBMIT
   ============================================= */
const form      = document.getElementById('booking-form');
const successEl = document.getElementById('bk-success');
const refEl     = document.getElementById('bk-ref-num');

form?.addEventListener('submit', e => {
  e.preventDefault();
  if (!validate(form)) return;

  const ref = generateRef();
  const msg = buildMessage().replace(/Ref: .*/, `Ref: ${ref}`);

  window.open(`https://wa.me/256772123456?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');

  // Show success state
  form.closest('.bk-main').style.display = 'none';
  if (successEl) {
    successEl.hidden = false;
    if (refEl) refEl.textContent = ref;
    successEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

/* =============================================
   SCROLL REVEAL
   ============================================= */
if ('IntersectionObserver' in window) {
  const style = document.createElement('style');
  style.textContent = `.reveal{opacity:0;transform:translateY(22px);transition:opacity .5s ease,transform .5s ease}.reveal.in-view{opacity:1;transform:none}`;
  document.head.appendChild(style);
  const els = document.querySelectorAll('.bk-step, .bk-sidebar__card');
  els.forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = `${i * 50}ms`; });
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); } });
  }, { threshold: 0.08 });
  els.forEach(el => io.observe(el));
}
