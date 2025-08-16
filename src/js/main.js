// === Caminho robusto pros ícones (usa <base> se existir) ===
const ICONS = ['not_icon.png','off_icon.png','n8n_icon.png','py_icon.png']
  .map(n => new URL(`src/images/${n}`, document.baseURI).href)

// ==== Dark mode ====
class DarkModeToggle {
  constructor() {
    const saved = localStorage.getItem('darkMode');
    if (saved === null) {
      this.isDark =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      this.isDark = (saved === 'true');
    }
    this.init();
  }

  init() {
    this.createToggleButton();
    this.applyTheme();
    this.bindEvents();
  }

  createToggleButton() {
    const toggle = document.createElement('button');
    toggle.className = 'dark-mode-toggle';
    toggle.innerHTML = this.isDark ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', 'Alternar tema (claro/escuro)');
    document.body.appendChild(toggle);
    this.toggleButton = toggle;
  }

  bindEvents() {
    this.toggleButton.addEventListener('click', () => this.toggle());
  }

  toggle() {
    this.isDark = !this.isDark;
    this.applyTheme();
    localStorage.setItem('darkMode', this.isDark);
  }

  applyTheme() {
    const root = document.documentElement;

    if (this.isDark) {
      // 🌙 Tema Dark
      root.style.setProperty('--bg-primary',   'var(--color-gray-900)');
      root.style.setProperty('--bg-secondary', 'var(--color-gray-800)');
      root.style.setProperty('--text-primary', 'var(--color-gray-100)');
      root.style.setProperty('--text-secondary','var(--color-gray-300)');
      root.style.setProperty('--border-color', 'var(--color-gray-700)');
      root.style.setProperty('--footer-ink',   'var(--color-white)');
      root.style.setProperty('--icon-filter',  'invert(1)');
      root.style.setProperty('--stack-filter-base', 'invert(1) brightness(1)');

      // 🔵 Splash no Dark
      root.style.setProperty('--splash-bg', 'var(--brand-navy-900)');
      root.style.setProperty('--splash-icon-filter', 'none');

    } else {
      // ☀️ Tema Light
      root.style.setProperty('--bg-primary',   'var(--color-white)');
      root.style.setProperty('--bg-secondary', 'var(--color-gray-100)');
      root.style.setProperty('--text-primary', 'var(--color-gray-900)');
      root.style.setProperty('--text-secondary','var(--color-gray-600)');
      root.style.setProperty('--border-color', 'var(--color-gray-200)');
      root.style.setProperty('--footer-ink',   'var(--color-black)');
      root.style.setProperty('--icon-filter',  'invert(0)');
      root.style.setProperty('--stack-filter-base', 'brightness(0)');

      // ⚪ Splash no Light
      root.style.setProperty('--splash-bg', 'var(--color-white)');
      root.style.setProperty('--splash-icon-filter', 'invert(1)');
    }

    if (this.toggleButton) {
      this.toggleButton.innerHTML = this.isDark ? '☀️' : '🌙';
    }
  }
}


// ==== Scroll reveal ====
class ScrollReveal {
  constructor() {
    this.elements = [];
    this.init();
  }

  init() {
    this.bindEvents();
    this.reveal();
  }

  bindEvents() {
    window.addEventListener('scroll', () => this.reveal());
    window.addEventListener('resize', () => this.reveal());
  }

  observe(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      el.classList.add('scroll-reveal');
      this.elements.push(el);
    });
  }

  reveal() {
    const windowHeight = window.innerHeight;
    const scrollTop = window.pageYOffset;
    const revealPoint = 100;

    this.elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const elementTop =
        rect.top + scrollTop - (document.documentElement.clientTop || 0);
      const elementHeight = element.offsetHeight;

      if (
        scrollTop + windowHeight - revealPoint > elementTop &&
        scrollTop < elementTop + elementHeight
      ) {
        element.classList.add('revealed');
      }
    });
  }
}

// ==== Smooth scrolling para âncoras ====
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ==== Cálculo de idade ====
function calculateAge(birthDateString) {
  const birth = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// ==== Boot + Menu/Gooey ====
document.addEventListener('DOMContentLoaded', () => {
  // Dark mode
  new DarkModeToggle();

  // Scroll reveal
  const sr = new ScrollReveal();
  sr.observe('.section');
  sr.observe('.card');
  sr.observe('.skill-item');
  sr.observe('.experience-item');
  sr.observe('.contact-item');

  // Smooth anchors
  initSmoothScrolling();

  // Idade dinâmica
  const ageElem = document.getElementById('idade');
  if (ageElem) ageElem.textContent = calculateAge('2005-06-09');

  // Fade-in inicial
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);

  // ===== Menu lateral (um único controlador) =====
  // move o botão de tema para junto do menu
  const actions = document.querySelector('.site-menu-actions');
  const darkBtn = document.querySelector('.dark-mode-toggle');
  if (actions && darkBtn && darkBtn.parentElement !== actions) {
    actions.prepend(darkBtn);
  }

  const menuCb    = document.getElementById('site-menu-toggle');
  const menuBtn   = document.querySelector('label.site-menu-btn');
  const menuPanel = document.getElementById('site-menu-panel');

  const gooCb       = document.getElementById('goo-open');               // checkbox do contatos
  const gooContainer= document.querySelector('.site-menu-contact');      // <li> do contatos

  if (!menuCb || !menuBtn || !menuPanel) return;

  const syncAria = () => {
    const open = menuCb.checked;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuPanel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (!open && gooCb) gooCb.checked = false; // fechar contatos ao fechar menu
  };
  syncAria();
  menuCb.addEventListener('change', syncAria);

  // ESC fecha tudo
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (gooCb) gooCb.checked = false;
    if (menuCb.checked) menuCb.checked = false;
    syncAria();
  });

  // Clique fora: fecha menu; se o menu continuar aberto, clique fora do bloco "contatos" fecha os ícones
  document.addEventListener('click', (e) => {
    const insideActions = e.target.closest('.site-menu-actions');
    const insideCard    = e.target.closest('.site-menu-card');

    // fecha o menu quando clicar fora de tudo
    if (!insideActions && !insideCard && menuCb.checked) {
      menuCb.checked = false;
      if (gooCb) gooCb.checked = false;
      syncAria();
      return;
    }

    // se o menu está aberto e os contatos também, clicar fora do bloco de contatos fecha só os contatos
    if (menuCb.checked && gooCb && gooCb.checked) {
      const insideGoo = e.target.closest('.site-menu-contact');
      if (!insideGoo) gooCb.checked = false;
    }
  });
});

// Evita seleção visual ao clicar rápido nos contatos
document.querySelectorAll('.site-menu-contact a.goo-item').forEach(a => {
  // remove qualquer seleção residual no clique/duplo-clique
  a.addEventListener('click', () => {
    const sel = window.getSelection && window.getSelection();
    if (sel && sel.removeAllRanges) sel.removeAllRanges();
  });
  a.addEventListener('dblclick', () => {
    const sel = window.getSelection && window.getSelection();
    if (sel && sel.removeAllRanges) sel.removeAllRanges();
  });
});

// ===== Copiar e-mail para a área de transferência =====
(function setupCopyEmail(){
  const EMAIL_SELECTOR = 'a.copy-email';
  const EMAIL_FALLBACK = 'kauahenriquepessoal@gmail.com';

  // Cria o toast (uma vez)
  let toast = document.querySelector('.clipboard-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'clipboard-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = 'Copiado';
    document.body.appendChild(toast);
  }

  function showToast(msg){
    toast.textContent = msg || 'Copiado';
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 1500);
  }

  async function copyText(text){
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch(_) {}
    // Fallback velho (iOS/Android antigos e desktop legacy)
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch(_) { /* ignore */ }
    document.body.removeChild(ta);
    return true;
  }

  function handlerClick(e){
    // Se usuário segurar Ctrl/Cmd/Shift/Alt, deixamos abrir o mailto
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    const a = e.currentTarget;
    const text = a.getAttribute('data-copy') || EMAIL_FALLBACK;

    copyText(text).then(() => showToast('E-mail copiado'));
  }

  // Liga os handlers (também funciona se você chamar de novo após trocar HTML)
  function bindAll(){
    document.querySelectorAll(EMAIL_SELECTOR).forEach(a => {
      if (!a._copyBound) {
        a.addEventListener('click', handlerClick);
        a._copyBound = true;
      }
    });
  }

  /* ===== Gooey/Contato: posicionamento robusto (mobile e desktop) ===== */
function positionGoo(){
  const menuToggle = document.getElementById('site-menu-toggle');
  const gooToggle  = document.getElementById('goo-open');
  const trigger    = document.querySelector('.goo-trigger');
  const bar        = document.querySelector('.goo-toolbar');
  if (!trigger || !bar || !gooToggle) return;

  // Só posiciona quando o menu estiver aberto
  if (menuToggle && !menuToggle.checked) return;

  const tr  = trigger.getBoundingClientRect();
  const gap = 12; // ajuste fino da distância entre o botão e a barra

  // Ancoragem: colocamos a barra com "left" no lado esquerdo do gatilho
  // e a transform (CSS) empurra -100% da própria largura, dispensando medir width.
  bar.style.left = (tr.left - gap) + 'px';
  bar.style.top  = (tr.top + tr.height / 2) + 'px';

  // Garante que está visível quando o toggle estiver marcado (defensivo)
  if (gooToggle.checked){
    bar.style.opacity = '1';
    bar.style.pointerEvents = 'auto';
  }
}

  function bindGoo(){
    const menuToggle = document.getElementById('site-menu-toggle');
    const gooToggle  = document.getElementById('goo-open');
    const trigger    = document.querySelector('.goo-trigger');
    const bar        = document.querySelector('.goo-toolbar');
    if (!trigger || !bar || !gooToggle) return;

    // evita que o clique no ícone "Contato" feche o menu por engano
    trigger.addEventListener('click', (e)=> e.stopPropagation());

    if (menuToggle) {
      menuToggle.addEventListener('change', () => {
        if (menuToggle.checked) setTimeout(positionGoo, 0);
      });
    }
    gooToggle.addEventListener('change', () => {
      if (gooToggle.checked) setTimeout(positionGoo, 0);
    });

    window.addEventListener('resize', positionGoo, { passive: true });
    window.addEventListener('scroll',  positionGoo, { passive: true });
  }

  // Bind inicial
  document.addEventListener('DOMContentLoaded', () => {
    bindAll();
    bindGoo();
  });
})();

/* ===== HERO: typewriter + burst + revelar b2 + ícones flutuantes ===== */

// Typewriter util (uma única versão)
function typeIt(el, text, speed = 42, delayBefore = 0){
  return new Promise(resolve => {
    if (!el || !text) return resolve();
    setTimeout(() => {
      el.classList.add('typing');
      el.textContent = "";
      let i = 0;
      (function tick(){
        el.textContent += text.charAt(i++);
        if (i < text.length) setTimeout(tick, speed);
        else { el.classList.remove('typing'); resolve(); }
      })();
    }, delayBefore);
  });
}

// Digita título e a frase (liga o sublinhado só quando entra no .hl)
function startTypewriter(){
  return new Promise((resolve) => {
    const t1 = document.querySelector('.t1 .typewrite');
    const parts = Array.from(document.querySelectorAll('.t2 .typewrite'));
    const hl = document.querySelector('.t2 .hl');
    const t1Text = t1?.dataset.text || "";

    typeIt(t1, t1Text, 34).then(async () => {
      for (let i = 0; i < parts.length; i++){
        const el  = parts[i];
        const txt = el.dataset.text || "";
        if (hl && hl.contains(el)) hl.classList.add('hl-on');
        const speed = (hl && hl.contains(el)) ? 46 : 40;
        const delay = i === 0 ? 120 : 60;
        await typeIt(el, txt, speed, delay);
      }
      resolve();
    });
  });
}

// “Chuva” de ícones (todos juntos, em volume)
function runIconBurst({
  countDesktop = 34,
  countMobile  = 18,
  density      = 2.4,   // densidade do burst
  maxDelay     = 0.22,  // atraso máximo por ícone (seg)
} = {}){
  return new Promise((resolve) => {
    const delayBotoesMs = 3000;

    // helper: revela b2 e, depois de 3s, os botões
    const revelarB2eBotoes = (afterMs = 0) => {
      const b2reveal = document.querySelector('.b2.reveal-late, .b2');
      if (!b2reveal) return;
      setTimeout(() => {
        b2reveal.classList.add('show');
        setTimeout(() => {
          const botoes = document.getElementById('botoes-bloco2');
          if (botoes) {
            botoes.classList.remove('hidden');
            botoes.classList.add('show');
          }
        }, delayBotoesMs);
      }, Math.max(0, Math.floor(afterMs)));
    };

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stage = document.querySelector('.icon-stage');

    // Sem palco ou com motion reduzido: só revela b2 e os botões (sem animação)
    if (prefersReduced || !stage) {
      revelarB2eBotoes(0);
      return resolve();
    }

    // cobre o viewport durante o burst
    stage.classList.add('burst-fixed');

    const base    = window.innerWidth < 700 ? countMobile : countDesktop;
    const total   = Math.max(1, Math.floor(base * density));
    const pending = new Set();
    const bailout = setTimeout(() => {
      stage.classList.remove('burst-fixed');
      resolve();
    }, 3500);

    // --- plano de cruzamento = topo do .b2 na tela (clampado ao viewport) ---
    const b2 = document.querySelector('.b2');
    let planeY = b2 ? b2.getBoundingClientRect().top : window.innerHeight; // px
    planeY = Math.min(Math.max(0, planeY), window.innerHeight - 1);

    // movimento: nasce em 110% da tela e sobe -150vh
    const vh        = window.innerHeight;
    const startYpx  = 1.10 * vh;      // top: 110%
    const travelPx  = 1.50 * vh;      // -150vh
    const fracCross = Math.min(1, Math.max(0, (startYpx - planeY) / travelPx)); // 0..1

    let earliestMs = Infinity;

    // cria tudo em lote (perf)
    const frag = document.createDocumentFragment();

    for (let i = 0; i < total; i++){
      const img = document.createElement('img');
      img.className = 'icon-seq';
      img.src = ICONS[i % ICONS.length];
      img.alt = '';

      const top   = '110%';
      const left  = (3 + Math.random()*94).toFixed(1) + '%';
      const dur   = (0.85 + Math.random()*0.55).toFixed(2);  // s
      const delay = (Math.random()*maxDelay).toFixed(2);      // s

      img.style.setProperty('--top', top);
      img.style.setProperty('--left', left);
      img.style.setProperty('--dur',  dur + 's');
      img.style.setProperty('--delay', delay + 's');

      // quando termina, limpa e resolve
      pending.add(img);
      img.addEventListener('animationend', () => {
        pending.delete(img);
        img.remove();
        if (pending.size === 0){
          clearTimeout(bailout);
          stage.classList.remove('burst-fixed');
          resolve();
        }
      }, { once: true });

      // calcula o instante em que ESTE ícone cruza o plano do .b2
      const crossMs = (parseFloat(delay) * 1000) + (fracCross * parseFloat(dur) * 1000);
      if (crossMs < earliestMs) earliestMs = crossMs;

      frag.appendChild(img);
    }

    stage.appendChild(frag);
    // dispara as animações em lote
    stage.querySelectorAll('.icon-seq').forEach(el => { void el.offsetWidth; el.classList.add('fly'); });

    // revela o bloco 2 exatamente na 1ª passagem e agenda os botões
    revelarB2eBotoes(earliestMs);
  });
}

// Ícones flutuantes de fundo (contínuos)
function startFloatingIcons(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // evita duplicar se recarregar/Hot Reload
  document.querySelectorAll('.float-wrap').forEach(n => n.remove());

  const COUNT = window.innerWidth < 700 ? 18 : 36; // densidade
  for (let i = 0; i < COUNT; i++){
    const wrap = document.createElement('div');
    wrap.className = 'float-wrap';

    const img = document.createElement('img');
    img.className = 'float-icon';
    img.src = ICONS[i % ICONS.length];
    img.alt = '';

    // randomização
    const left  = (Math.random() * 100).toFixed(2) + 'vw';
    const size  = (24 + Math.random()*32).toFixed(0) + 'px';
    const dur   = (12 + Math.random()*18).toFixed(1) + 's';
    const sway  = (2.2 + Math.random()*3.8).toFixed(1) + 's';
    const amp   = (10 + Math.random()*30).toFixed(0) + 'px';
    const delay = (-Math.random()*14).toFixed(1) + 's';

    wrap.style.left = left;
    wrap.style.setProperty('--dur',   dur);
    wrap.style.setProperty('--delay', delay);
    img.style.setProperty('--size', size);
    img.style.setProperty('--sway', sway);
    img.style.setProperty('--amp',  amp);

    wrap.appendChild(img);
    document.body.appendChild(wrap);
  }
}

// --- HOME ONLY: roda só se existir .icon-stage (apenas na homepage) ---
(() => {
  const isHome = !!document.querySelector('.icon-stage');
  if (!isHome) return;

  const hasSplash = document.getElementById('splash');

  // aplica estado “já concluído” (pula animações) quando a intro já tocou
  function aplicarEstadoInstantaneoDoHero() {
    // preenche os textos do typewriter
    const t1 = document.querySelector('.t1 .typewrite');
    if (t1 && t1.dataset.text) t1.textContent = t1.dataset.text;

    const parts = document.querySelectorAll('.t2 .typewrite');
    parts.forEach(el => { if (el.dataset.text) el.textContent = el.dataset.text; });

    // liga o destaque
    const hl = document.querySelector('.t2 .hl');
    if (hl) hl.classList.add('hl-on');

    // revela o bloco 2
    const b2 = document.querySelector('.b2.reveal-late, .b2');
    if (b2) b2.classList.add('show');

    // mostra os botões (se existirem)
    const botoes = document.getElementById('botoes-bloco2');
    if (botoes) { botoes.classList.remove('hidden'); botoes.classList.add('show'); }

    // remove o splash
    const splash = document.getElementById('splash');
    if (splash) splash.remove();

    // mantém os ícones flutuantes
    startFloatingIcons();
  }

  // toca a intro (typewriter + burst + float) e marca a sessão
  async function tocarIntro() {
    await startTypewriter();
    await runIconBurst();   // já agenda a revelação do b2 e dos botões
    startFloatingIcons();
    sessionStorage.setItem('heroIntroPlayed', '1');
  }

  // decide: tocar (primeira vez na aba) ou pular (reload/volta pra home)
  const jaTocou = sessionStorage.getItem('heroIntroPlayed') === '1';
  if (!jaTocou) {
    if (hasSplash) {
      setTimeout(() => { tocarIntro(); }, 1650);
    } else {
      tocarIntro();
    }
  } else {
    aplicarEstadoInstantaneoDoHero();
  }
})();
