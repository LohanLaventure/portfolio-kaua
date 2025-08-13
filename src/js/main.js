// ==== Dark mode ====
class DarkModeToggle {
  constructor() {
    const saved = localStorage.getItem('darkMode');
    if (saved === null) {
      this.isDark =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      this.isDark = saved === 'true';
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
      root.style.setProperty('--bg-primary', 'var(--color-gray-900)');
      root.style.setProperty('--bg-secondary', 'var(--color-gray-800)');
      root.style.setProperty('--text-primary', 'var(--color-gray-100)');
      root.style.setProperty('--text-secondary', 'var(--color-gray-300)');
      root.style.setProperty('--border-color', 'var(--color-gray-700)');
      root.style.setProperty('--footer-ink', 'var(--color-white)');
      root.style.setProperty('--icon-filter', 'invert(1)');
    } else {
      root.style.setProperty('--bg-primary', 'var(--color-white)');
      root.style.setProperty('--bg-secondary', 'var(--color-gray-100)');
      root.style.setProperty('--text-primary', 'var(--color-gray-900)');
      root.style.setProperty('--text-secondary', 'var(--color-gray-600)');
      root.style.setProperty('--border-color', 'var(--color-gray-200)');
      root.style.setProperty('--footer-ink', 'var(--color-black)');
      root.style.setProperty('--icon-filter', 'invert(0)');
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
