// ==== Dark mode ====
class DarkModeToggle {
    constructor() {
        // lê preferência salva ou usa prefer-color-scheme do sistema como fallback
        const saved = localStorage.getItem('darkMode');
        if (saved === null) {
            this.isDark = window.matchMedia &&
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

            // NOVO: tinta do footer e filtro dos ícones (ícones brancos no dark)
            root.style.setProperty('--footer-ink', 'var(--color-white)');
            root.style.setProperty('--icon-filter', 'invert(1)');
        } else {
            root.style.setProperty('--bg-primary', 'var(--color-white)');
            root.style.setProperty('--bg-secondary', 'var(--color-gray-100)');
            root.style.setProperty('--text-primary', 'var(--color-gray-900)');
            root.style.setProperty('--text-secondary', 'var(--color-gray-600)');
            root.style.setProperty('--border-color', 'var(--color-gray-200)');

            // NOVO: tinta do footer e filtro dos ícones (ícones pretos no claro)
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
        this.reveal(); // primeira checada
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.reveal());
        window.addEventListener('resize', () => this.reveal());
    }

    observe(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.add('scroll-reveal');
            this.elements.push(element);
        });
    }

    reveal() {
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        const revealPoint = 100;

        this.elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollTop - (document.documentElement.clientTop || 0);
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
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // ignora links "#" ou inexistentes
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

// ==== Boot ====
document.addEventListener('DOMContentLoaded', function () {
    // Dark mode
    new DarkModeToggle();

    // Scroll reveal
    const scrollReveal = new ScrollReveal();
    scrollReveal.observe('.section');
    scrollReveal.observe('.card');
    scrollReveal.observe('.skill-item');
    scrollReveal.observe('.experience-item');
    scrollReveal.observe('.contact-item');

    // Smooth scrolling
    initSmoothScrolling();

    // Update idade dinâmica
    const ageElem = document.getElementById('idade');
    if (ageElem) ageElem.textContent = calculateAge('2005-06-09');

    // Fade-in inicial
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ==== Utils (se precisar em algum lugar) ====
const utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};
