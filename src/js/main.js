// Dark mode functionality
class DarkModeToggle {
    constructor() {
        this.isDark = localStorage.getItem('darkMode') === 'true';
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
        toggle.setAttribute('aria-label', 'Toggle dark mode');
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
        if (this.isDark) {
            document.documentElement.style.setProperty('--bg-primary', 'var(--color-gray-900)');
            document.documentElement.style.setProperty('--bg-secondary', 'var(--color-gray-800)');
            document.documentElement.style.setProperty('--text-primary', 'var(--color-gray-100)');
            document.documentElement.style.setProperty('--text-secondary', 'var(--color-gray-300)');
            document.documentElement.style.setProperty('--border-color', 'var(--color-gray-700)');
        } else {
            document.documentElement.style.setProperty('--bg-primary', 'var(--color-white)');
            document.documentElement.style.setProperty('--bg-secondary', 'var(--color-gray-100)');
            document.documentElement.style.setProperty('--text-primary', 'var(--color-gray-900)');
            document.documentElement.style.setProperty('--text-secondary', 'var(--color-gray-600)');
            document.documentElement.style.setProperty('--border-color', 'var(--color-gray-200)');
        }
        if (this.toggleButton) {
            this.toggleButton.innerHTML = this.isDark ? '☀️' : '🌙';
        }
    }
}

// Scroll reveal animation
class ScrollReveal {
    constructor() {
        this.elements = [];
        this.init();
    }
    init() {
        this.bindEvents();
        this.reveal(); // Initial check
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
        this.elements.forEach(element => {
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;
            const revealPoint = 100;
            if (
                scrollTop + windowHeight - revealPoint > elementTop &&
                scrollTop < elementTop + elementHeight
            ) {
                element.classList.add('revealed');
            }
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ==== Age calculation ====
function calculateAge(birthDateString) {
    const birth = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Initialize everything when DOM is loaded
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

    // Update dynamic age
    const ageElem = document.getElementById('idade');
    if (ageElem) {
        ageElem.textContent = calculateAge('2005-06-09');
    }

    // Loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Utility functions
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
