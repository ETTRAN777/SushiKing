// ==========================================================================
// SUSHI KING — LUNCH MODE CONTROLLER
// Controls lunch-mode override and logo behavior.
// Theme colors now live entirely in styles.css as CSS variables, switched
// via the "lunch-mode" class on <html> — no separate stylesheet to swap.
// ==========================================================================
(function () {
    const LUNCH_MODE_KEY = 'sushiKingLunchModeOverride';
    const LOGO_LIGHT = 'assets/horizontalVerWhite.png';
    const LOGO_DARK = 'assets/horizontalVerBlack.png';

    function isLunchTime() {
        if (typeof window !== 'undefined' && window.SushiKingLunchMode && typeof window.SushiKingLunchMode.isLunchTime === 'function') {
            return window.SushiKingLunchMode.isLunchTime();
        }

        // Fallback only if shared lunch-mode config isn't loaded.
        return false;
    }

    function getLunchModeOverride() {
        try {
            if (typeof window !== 'undefined' && window.SushiKingLunchMode) {
                return window.SushiKingLunchMode.storedOverride || window.SushiKingLunchMode.getStoredOverride();
            }

            return null;
        } catch (error) {
            return null;
        }
    }

    function setLunchModeOverride(value) {
        try {
            if (typeof window !== 'undefined' && window.SushiKingLunchMode && typeof window.SushiKingLunchMode.setStoredOverride === 'function') {
                window.SushiKingLunchMode.setStoredOverride(value);
                return;
            }

            localStorage.setItem(LUNCH_MODE_KEY, String(value));
        } catch (error) {
            // ignore storage failures
        }
    }

    function isLunchModeActive() {
        const override = getLunchModeOverride();
        const lunchTime = isLunchTime();

        // During lunch hours, time takes priority over a stored "off" override.
        if (lunchTime) return true;
        if (override === 'true') return true;
        return false;
    }

    function isMenuPage() {
        if (typeof window === 'undefined' || !window.location || !window.location.pathname) return false;
        const currentPage = window.location.pathname.split('/').pop().toLowerCase();
        return currentPage === 'menu.html';
    }

    function updateLogo(navLogo, navbar) {
        if (!navLogo || !navbar) return;

        if (!document.documentElement.classList.contains('lunch-mode')) {
            navLogo.src = LOGO_LIGHT;
            return;
        }

        if (isMenuPage()) {
            navLogo.src = LOGO_DARK;
            return;
        }

        navLogo.src = navbar.classList.contains('scrolled') ? LOGO_DARK : LOGO_LIGHT;
    }

    function setToggleState(isLunchMode, themeToggle, toggleThumb) {
        if (!themeToggle || !toggleThumb) return;

        themeToggle.setAttribute('aria-pressed', isLunchMode ? 'true' : 'false');
        toggleThumb.style.transform = isLunchMode
            ? 'translate(34px, -50%)'
            : 'translateY(-50%)';
    }

    function applyLunchMode(isLunchMode, navLogo, navbar, themeToggle, toggleThumb) {
        document.documentElement.classList.toggle('lunch-mode', isLunchMode);
        setToggleState(isLunchMode, themeToggle, toggleThumb);
        updateLogo(navLogo, navbar);
    }

    function initializeLunchMode() {
        const themeToggle = document.getElementById('theme-toggle');
        const toggleThumb = document.getElementById('toggle-thumb');
        const navLogo = document.querySelector('.nav-brand-logo');
        const navbar = document.getElementById('navbar');

        if (!navLogo || !navbar) return;

        const lunchModeActive = isLunchModeActive();
        applyLunchMode(lunchModeActive, navLogo, navbar, themeToggle, toggleThumb);

        window.addEventListener('scroll', () => {
            if (document.documentElement.classList.contains('lunch-mode')) {
                updateLogo(navLogo, navbar);
            }
        }, { passive: true });

        if (themeToggle && toggleThumb) {
            themeToggle.addEventListener('click', () => {
                const nextLunchMode = !document.documentElement.classList.contains('lunch-mode');
                setLunchModeOverride(nextLunchMode);
                applyLunchMode(nextLunchMode, navLogo, navbar, themeToggle, toggleThumb);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLunchMode);
    } else {
        initializeLunchMode();
    }
})();
