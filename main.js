/* =========================================================
   VELMORA SERVICES — SITE BEHAVIOUR
   ========================================================= */

// ---------- Book cover rendering ----------
// Renders either the real product image (if a URL is configured)
// or a clean CSS 3D book mockup fallback.
function renderBookCover(el){
  const imgUrl = el.getAttribute('data-img');
  const title = el.getAttribute('data-title');
  const number = el.getAttribute('data-number');

  el.classList.add('book');
  el.innerHTML = `
    <div class="book-spine"></div>
    <div class="book-pages"></div>
    ${
      imgUrl && imgUrl.trim() !== ''
      ? `<img src="${imgUrl}" alt="${title} cover" onerror="this.remove();">`
      : `<div class="book-cover">
           <div class="bc-top">VELMORA SERVICES</div>
           <div>
             <div class="bc-num">${number}</div>
             <div class="bc-title">${title}</div>
           </div>
           <div class="bc-bottom">DIGITAL PDF COLLECTION</div>
         </div>`
    }
  `;
}

function initBookCovers(){
  document.querySelectorAll('[data-book]').forEach(renderBookCover);
}

// ---------- Countdown ----------
function initCountdown(){
  const el = document.querySelector('[data-countdown]');
  if(!el) return;
  const expiry = new Date(VELMORA_CONFIG.OFFER_EXPIRY_DATE).getTime();
  const dEl = el.querySelector('[data-cd-days]');
  const hEl = el.querySelector('[data-cd-hours]');
  const mEl = el.querySelector('[data-cd-mins]');
  const sEl = el.querySelector('[data-cd-secs]');
  const endedEl = el.querySelector('[data-cd-ended]');
  const gridEl = el.querySelector('[data-cd-grid]');

  function pad(n){ return String(n).padStart(2,'0'); }

  function tick(){
    const now = Date.now();
    const diff = expiry - now;
    if(isNaN(expiry) || diff <= 0){
      if(gridEl) gridEl.style.display = 'none';
      if(endedEl) endedEl.style.display = 'block';
      clearInterval(timer);
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const mins = Math.floor((diff / (1000*60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    if(dEl) dEl.textContent = pad(days);
    if(hEl) hEl.textContent = pad(hours);
    if(mEl) mEl.textContent = pad(mins);
    if(sEl) sEl.textContent = pad(secs);
  }
  tick();
  const timer = setInterval(tick, 1000);
}

// ---------- Mobile menu ----------
function initMobileMenu(){
  const btn = document.querySelector('[data-hamburger]');
  const menu = document.querySelector('[data-mobile-menu]');
  if(!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
}

// ---------- FAQ accordion ----------
function initFaq(){
  document.querySelectorAll('[data-faq-item]').forEach(item => {
    const q = item.querySelector('[data-faq-q]');
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('[data-faq-item]').forEach(i => i.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });
}

// ---------- Reveal on scroll ----------
function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    items.forEach(i => i.classList.add('in'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(i => obs.observe(i));
}

// ---------- Wire up payment / download links from config ----------
function initLinks(){
  document.querySelectorAll('[data-link]').forEach(el => {
    const key = el.getAttribute('data-link');
    if(VELMORA_CONFIG[key]){
      el.setAttribute('href', VELMORA_CONFIG[key]);
    }
  });
  document.querySelectorAll('[data-support-email]').forEach(el => {
    el.textContent = VELMORA_CONFIG.SUPPORT_EMAIL;
  });
  document.querySelectorAll('[data-support-mailto]').forEach(el => {
    el.setAttribute('href', 'mailto:' + VELMORA_CONFIG.SUPPORT_EMAIL);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initBookCovers();
  initCountdown();
  initMobileMenu();
  initFaq();
  initReveal();
  initLinks();
});
