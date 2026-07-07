(function () {
    const LUNCH_MODE_KEY = 'sushiKingLunchModeOverride';
    const LUNCH_TIMEZONE = 'America/Detroit';
    const LUNCH_HOUR_START = 11;
    const LUNCH_HOUR_END = 15;

    function currentHour() {
        return parseInt(new Intl.DateTimeFormat('en-US', {
            timeZone: LUNCH_TIMEZONE,
            hour: 'numeric',
            hour12: false
        }).format(new Date()), 10);
    }

    function isLunchTime() {
        const hour = currentHour();
        return hour >= LUNCH_HOUR_START && hour < LUNCH_HOUR_END;
    }

    function normalizeOverride(value) {
        return value ? String(value).trim().toLowerCase() : null;
    }

    function getStoredOverride() {
        try {
            return normalizeOverride(localStorage.getItem(LUNCH_MODE_KEY));
        } catch (error) {
            return null;
        }
    }

    function setStoredOverride(value) {
        try {
            localStorage.setItem(LUNCH_MODE_KEY, String(value));
        } catch (error) {
            // ignore storage failures
        }
    }

    window.SushiKingLunchMode = window.SushiKingLunchMode || {};
    window.SushiKingLunchMode.LUNCH_MODE_KEY = LUNCH_MODE_KEY;
    window.SushiKingLunchMode.LUNCH_TIMEZONE = LUNCH_TIMEZONE;
    window.SushiKingLunchMode.LUNCH_HOUR_START = LUNCH_HOUR_START;
    window.SushiKingLunchMode.LUNCH_HOUR_END = LUNCH_HOUR_END;
    window.SushiKingLunchMode.currentHour = currentHour;
    window.SushiKingLunchMode.isLunchTime = isLunchTime;
    window.SushiKingLunchMode.normalizeOverride = normalizeOverride;
    window.SushiKingLunchMode.getStoredOverride = getStoredOverride;
    window.SushiKingLunchMode.setStoredOverride = setStoredOverride;
})();
