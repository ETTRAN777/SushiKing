(function () {
    if (!window.SushiKingLunchMode) return;

    const themeLink = document.getElementById('main-theme');
    const storedOverride = window.SushiKingLunchMode.getStoredOverride();
    window.SushiKingLunchMode.storedOverride = storedOverride;

    const lunchModeActive = storedOverride === 'true'
        ? true
        : storedOverride === 'false'
            ? false
            : window.SushiKingLunchMode.isLunchTime();

    if (!themeLink) return;

    themeLink.setAttribute('href', lunchModeActive ? 'altStyles.css' : 'styles.css');
    document.documentElement.classList.toggle('lunch-mode', lunchModeActive);
})();
