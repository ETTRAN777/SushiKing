(function () {
    if (!window.SushiKingLunchMode) return;

    const storedOverride = window.SushiKingLunchMode.getStoredOverride();
    window.SushiKingLunchMode.storedOverride = storedOverride;

    const lunchModeActive = storedOverride === 'true'
        ? true
        : storedOverride === 'false'
            ? false
            : window.SushiKingLunchMode.isLunchTime();

    // Applied immediately (before first paint) to avoid a flash of the wrong
    // theme — styles.css keys off this class via `:root.lunch-mode` overrides.
    document.documentElement.classList.toggle('lunch-mode', lunchModeActive);
})();
