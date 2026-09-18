// Bump this string to invalidate all auto-modal cookies site-wide (e.g. when pushing a new promo).
// Format: 'vN' — e.g. 'v1', 'v2', 'v3'
const APP_VERSION = 'v2';

// Global Selectors across both pages
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menu-toggle');
const mobileOverlay = document.getElementById('mobile-overlay');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Add this window layout observer immediately under your Global Selectors at the very top of app.js
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        if (mobileOverlay && mobileOverlay.classList.contains('active')) {
            // Instantly wipe active layout tokens from active states
            menuToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');

            // Restore document body layout scrolling vectors
            document.body.style.overflow = 'auto';

            // Drop visibility definitions down out of processing loops
            mobileOverlay.style.display = 'none';
        }
    }
});

// 1. Sleek Scroll Navigation Handling (Applies across all environments)
window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        // Only strip the background scroll cover if it's NOT the menu.html page structure
        if (!navbar.classList.contains('force-scrolled')) {
            navbar.classList.remove('scrolled');
        }
    }
});

// 2. Open / Close Mobile Takeover Menu Panel (With Explicit Layout State Interceptions)
function toggleMenu() {
    if (!menuToggle || !mobileOverlay) return;
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

    if (!isExpanded) {
        // Turning ON: Force display layout engine to render before CSS transforms fire
        mobileOverlay.style.display = 'flex';

        // Minor browser cycle pause to ensure transition animation properties animate correctly
        setTimeout(() => {
            menuToggle.classList.add('active');
            mobileOverlay.classList.add('active');
        }, 10);
    } else {
        // Turning OFF: Pull out class coordinates first to allow slide animations to finish
        menuToggle.classList.remove('active');
        mobileOverlay.classList.remove('active');

        // Drop layout definitions completely back down to none once hidden out of view
        setTimeout(() => {
            if (!mobileOverlay.classList.contains('active')) {
                mobileOverlay.style.display = 'none';
            }
        }, 400); // Symmetrically matches the 0.4s transition duration in styles.css
    }

    menuToggle.setAttribute('aria-expanded', !isExpanded);

    // UI Override: Block body-scroll stream behind open menu drawer panels
    document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
}

if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}

// 3. Smooth Auto-Collapse when clicking individual mobile section links
mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Only trigger toggle animation loops on structural anchors targeted to local coordinates
        if (href && href.startsWith('#')) {
            if (mobileOverlay && mobileOverlay.classList.contains('active')) {
                toggleMenu();
            }
        }
    });
});

// ==========================================================================
// PORTFOLIO GENERATION SYSTEM (Runs explicitly on menu.html initialization)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const tabsContainer = document.getElementById("menu-tabs");
    const cardsArena = document.getElementById("menu-cards-arena");

    // Gracefully exit routine if user is currently on the index.html page layout
    if (!tabsContainer || !cardsArena || typeof sushiKingMenu === "undefined") return;

    let activeCategoryIndex = 0; // Tracks active user selection index filter layout

    // Method A: Render Horizontal Slide Filtering Controls Track
    function renderCategoryTabs() {
        tabsContainer.innerHTML = sushiKingMenu.map((cat, idx) => `
            <button class="menu-tab-btn ${idx === activeCategoryIndex ? 'active' : ''}" data-index="${idx}">
                ${cat.category}
            </button>
        `).join('');

        // Attach layout filters listeners onto tab trigger clicks
        document.querySelectorAll(".menu-tab-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                activeCategoryIndex = parseInt(e.target.getAttribute("data-index"));
                renderCategoryTabs();
                renderMenuArena();
            });
        });
    }

    function renderPill(x) {
        const isPopular = typeof x === 'object' && x.popular;
        const label = typeof x === 'object' ? x.name : x;
        return `<span class="${isPopular ? 'popular' : ''}">${label}</span>`;
    }

    // Method B: Generate and Inject Dynamic Content Component Elements
    function renderMenuArena() {
        const currentData = sushiKingMenu[activeCategoryIndex];
        cardsArena.innerHTML = ""; // Clear card field down

        // ==========================================================================
        // RENDER ENGINE: Context 1 (Standard items loop + Optional Subtitle Callouts)
        // ==========================================================================
        if (currentData.items) {
            // 1. Check for a schedule field on the category and render it as a subtitle
            let subtitleMarkup = "";
            if (currentData.schedule) {
                subtitleMarkup = `
            <div class="category-meta-header">
                <p class="category-clean-subtitle">${currentData.schedule}</p>
            </div>
        `;
            }

            // 2. Generate standard food item cards loop
            let itemsMarkup = currentData.items.map(item => {
                // Use the cart-sync helper if available so a card that's already
                // in the basket renders with its [ - qty + ] stepper + trash icon
                // instead of resetting back to "+ Add" on every tab switch.
                return `
<div class="menu-card animate-fade-in">
    <div class="menu-card-header">
        <h3>${item.name}</h3>
        <span class="price-tag">$${item.price.toFixed(2)}</span>
    </div>
    ${item.description ? `<p class="menu-item-description">${item.description}</p>` : '<br><br>'}
</div>
    `;
            }).join('');

            // 3. Append selection pool grids if present (e.g., special roll lists)
            if (currentData.selectionList) {
                itemsMarkup += `
            <div class="special-info-block full-width-card animate-fade-in">
                <h4>Lunch Selection Pool options:</h4>
                <div class="selection-pool-grid">
                    ${currentData.selectionList.map(roll => `<span>${roll}</span>`).join('')}
                </div>
            </div>
        `;
            }

            // 4. Paint layout to DOM, combining our subtitle block and the items grid container
            cardsArena.className = "menu-grid-container standard-grid";
            cardsArena.innerHTML = subtitleMarkup + itemsMarkup;

            // Context 2: Category uses dynamic layout blueprint mapping matrices (Poke Bowls builder dashboards)
        } else if (currentData.structure) {
            cardsArena.className = "menu-grid-container layout-flex-vertical";
            cardsArena.innerHTML = `
                <div class="poke-builder-showcase animate-fade-in">
                    <div class="poke-hero-meta">
                        <h3>Build Your Custom Masterpiece</h3>
                        <span class="price-tag">Starting at $${currentData.basePrice.toFixed(2)}</span>
                        <p class="poke-subtitle">+ Extra Protein Selections for $${currentData.extraProteinPrice.toFixed(2)}</p>
                    </div>
                    
                    <div class="poke-steps-grid">
                        <div class="poke-step-col">
                            <h5><span>1</span> Choose Base</h5>
                            <div class="pill-cloud">${currentData.structure.step1_base.map(renderPill).join('')}</div>
                        </div>
                        <div class="poke-step-col">
                            <h5><span>2</span> Choose Protein</h5>
                            <div class="pill-cloud">${currentData.structure.step2_protein.map(renderPill).join('')}</div>
                        </div>
                        <div class="poke-step-col">
                            <h5><span>3</span> Mix-ins & Toppings</h5>
                            <div class="pill-cloud">${currentData.structure.step3_toppings.map(renderPill).join('')}</div>
                        </div>
                        <div class="poke-step-col">
                            <h5><span>4</span> Select Sauces</h5>
                            <div class="pill-cloud">${currentData.structure.step4_sauces.map(renderPill).join('')}</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Launch operational initialization sequences
    renderCategoryTabs();
    renderMenuArena();
    if (tabsContainer) {
        tabsContainer.addEventListener('wheel', (e) => {
            const isTrackpadHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);

            if (isTrackpadHorizontal) {
                // Trackpad horizontal swipe: take over and scroll the tab strip sideways
                e.preventDefault();
                tabsContainer.scrollLeft += e.deltaX;
            } else {
                // Mouse wheel or trackpad vertical scroll: redirect deltaY into horizontal
                // but only if the tab strip itself still has room to scroll, otherwise
                // let the event bubble up so the page scrolls normally
                const canScrollLeft = tabsContainer.scrollLeft > 0;
                const canScrollRight = tabsContainer.scrollLeft < (tabsContainer.scrollWidth - tabsContainer.clientWidth - 1);

                if ((e.deltaY < 0 && canScrollLeft) || (e.deltaY > 0 && canScrollRight)) {
                    e.preventDefault();
                    tabsContainer.scrollLeft += e.deltaY;
                }
                // If the strip is already at its scroll limit, do nothing —
                // the event bubbles and the page scrolls vertically as expected
            }
        }, { passive: false });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const track = document.getElementById('reviews-track');
        if (!track) return;

        track.addEventListener('wheel', (e) => {
            const isTrackpadHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);

            if (isTrackpadHorizontal) {
                e.preventDefault();
                track.scrollLeft += e.deltaX;
            } else {
                const canScrollLeft = track.scrollLeft > 0;
                const canScrollRight = track.scrollLeft < (track.scrollWidth - track.clientWidth - 1);

                if ((e.deltaY < 0 && canScrollLeft) || (e.deltaY > 0 && canScrollRight)) {
                    e.preventDefault();
                    track.scrollLeft += e.deltaY;
                }
            }
        }, { passive: false });
    });
});

// ==========================================================================
// UNIVERSAL ABSTRACT MODAL ENGINE
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('universal-modal');
    const container = document.getElementById('uni-modal-runtime-content');
    const wrapper = overlay?.querySelector('.uni-modal-wrapper');
    const closeBtn = document.getElementById('close-uni-modal');

    let modalDatabase = null;

    if (!overlay || !container || !wrapper || !closeBtn) return;

    // 1. Fetch dynamic config JSON blueprint architecture
    fetch('modal-config.json')
        .then(res => { if (!res.ok) throw new Error(); return res.json(); })
        .then(data => {
            modalDatabase = data;

            // Kick off the queue — each modal fires its own delay after the previous
            // one is dismissed. The queue reference is stored on window so close()
            // can advance it after each dismissal.
            window._autoModalQueue = buildAutoQueue();
            window._autoModalQueueIndex = 0;
            advanceModalQueue();
        })
        .catch(err => console.error('Dynamic Modal Engine failed to fetch database config profile:', err));

    // Helper utility to read a specific cookie value by its key name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // 🚀 AUTO-MODAL QUEUE BUILDER
    // Collects all [data-auto-modal] markers on the page, cross-references
    // each against the config database, optionally filters out already-seen
    // modals, then sorts by firingOrder (lowest first) to build a priority queue.
    // Pass skipSeen=false to get every auto-modal on the page regardless of cookies.
    function buildAutoQueue(skipSeen = true) {
        return Array.from(document.querySelectorAll('[data-auto-modal]'))
            .map(marker => {
                const typeToken = marker.getAttribute('data-auto-modal');
                const config = modalDatabase?.[typeToken];

                // Skip if no config entry or no autoTrigger block defined
                if (!config || !config.autoTrigger) return null;

                // Skip if user has already seen this version
                if (skipSeen && getCookie(`promo_shown_${typeToken}`) === APP_VERSION) return null;

                return {
                    typeToken,
                    firingOrder: config.autoTrigger.firingOrder ?? 99,
                    delay: config.autoTrigger.delay ?? 1500,
                    cookieMaxAge: config.autoTrigger.cookieMaxAge ?? 86400
                };
            })
            .filter(Boolean)
            .sort((a, b) => a.firingOrder - b.firingOrder);
    }

    // Fires the next modal in the auto queue, if any remain.
    // { immediate: true } skips the configured delay for the first modal (used by the
    // footer "Show Promotions" button, where the visitor just asked to see it).
    function advanceModalQueue({ immediate = false } = {}) {
        const queue = window._autoModalQueue;
        const idx = window._autoModalQueueIndex;

        if (!queue || idx >= queue.length) return;

        const next = queue[idx];
        const fireDelay = immediate ? 0 : (idx === 0 ? next.delay : Math.floor(next.delay / 2));

        setTimeout(() => {
            // Only open if no modal is currently active (e.g. user manually opened one)
            if (!overlay.classList.contains('active')) {
                window.UniversalModalEngine.open(next.typeToken);

                // Stage the pending cookie for this modal — committed on dismiss
                window._pendingPromoCoookie = {
                    name: `promo_shown_${next.typeToken}`,
                    value: APP_VERSION,
                    maxAge: next.cookieMaxAge
                };
            }
        }, fireDelay);
    }

    // 2. Abstract Action Component Generator Matrix
    const renderActionButtons = (actions, elevatedId) => {
        if (!actions || !actions.length) return '';

        return actions.map(act => {
            // ELEMENT CLASS A: Option Rows Layout Schema (Catering Model)
            if (act.type === 'row-item') {
                const isElevated = (act.id === elevatedId);
                const visualClass = isElevated ? 'accented' : 'neutral';

                return `
                    <a href="${act.link}" class="modal-row-link ${visualClass}">
                        <span class="modal-row-icon">${act.icon || '🔗'}</span>
                        <div class="modal-row-text">
                            <strong>${act.label}</strong>
                            <span>${act.sublabel || ''}</span>
                        </div>
                    </a>
                `;
            }

            // ELEMENT CLASS B: Horizontal Newsletter Inline Form Layout Schema
            if (act.type === 'inline-form') {
                return `
                    <form class="modal-inline-form" onsubmit="event.preventDefault(); alert('Thank you for subscribing!'); window.UniversalModalEngine.close();">
                        <input type="email" placeholder="${act.placeholder}" required class="modal-form-input">
                        <button type="submit" class="modal-form-btn">${act.label}</button>
                    </form>
                `;
            }

            // ELEMENT CLASS C: Large Standard Call to Action Block Layout Schema
            if (act.type === 'promo-cta') {
                return `<a href="${act.link}" class="modal-promo-cta">${act.label}</a>`;
            }

            // ELEMENT CLASS D: Generic Direct Close Dismiss Button
            if (act.type === 'dismiss-btn') {
                return `<button class="modal-dismiss-btn" onclick="window.UniversalModalEngine.close()">${act.label}</button>`;
            }
            return '';
        }).join('');
    };

    // 3. Global Window Control API Exposure Vector
    window.UniversalModalEngine = {
        open: (type, elevatedId = null) => {
            if (!modalDatabase || !modalDatabase[type]) {
                console.warn(`Modal Engine Error: Requested config type token "${type}" does not exist inside JSON registry.`);
                return;
            }

            const profile = modalDatabase[type];

            // Attach specific unique class look modifier pattern to wrapper box
            wrapper.className = 'uni-modal-wrapper ' + profile.layoutType;

            // Re-render HTML nodes inside memory instantly
            container.innerHTML = `
                <span class="modal-dynamic-badge">${profile.badgeText}</span>
                <h3 class="modal-dynamic-title">${profile.title}</h3>
                <p class="modal-dynamic-desc">${profile.description}</p>
                
                <div class="modal-action-wrapper-container">
                    ${renderActionButtons(profile.actions, elevatedId)}
                </div>
                
                ${profile.metaText ? `<span class="uni-modal-meta-text">${profile.metaText}</span>` : ''}
            `;

            // Paint layout visible
            overlay.classList.add('active');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Freeze frame scroll positioning
        },
        // Footer "Show Promotions" button: forgets that the visitor dismissed anything and
        // replays every auto-modal referenced on this page via <div data-auto-modal="...">
        // (anything with an autoTrigger in modal-config.json), in firingOrder. Each one
        // re-stamps its own seen-cookie when dismissed, exactly like a normal auto-popup.
        showPromotions: () => {
            if (!modalDatabase) return;

            const queue = buildAutoQueue(false);
            if (!queue.length) {
                console.warn('Modal Engine: no [data-auto-modal] markers with an autoTrigger on this page.');
                return;
            }

            // Expire every seen-cookie (attributes must match how they were set: path=/)
            queue.forEach(({ typeToken }) => {
                document.cookie = `promo_shown_${typeToken}=; max-age=0; path=/; SameSite=Strict`;
            });

            window._autoModalQueue = queue;
            window._autoModalQueueIndex = 0;
            advanceModalQueue({ immediate: true });
        },
        close: () => {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            setTimeout(() => { container.innerHTML = ''; }, 300);

            // 🕒 Commit the seen-cookie for the modal that was just dismissed,
            // using its own configured expiry (e.g. 1hr for hoursAlert, 24hr for flashSale).
            if (window._pendingPromoCoookie) {
                const { name, value, maxAge } = window._pendingPromoCoookie;
                document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; SameSite=Strict`;
                window._pendingPromoCoookie = null;
            }

            // Advance the queue — fire the next auto-modal if one is waiting
            window._autoModalQueueIndex = (window._autoModalQueueIndex ?? 0) + 1;
            advanceModalQueue();
        }
    };

    // 4. Global Event Handlers Delegation Loop
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('[data-show-promotions]')) {
            window.UniversalModalEngine.showPromotions();
            return;
        }

        const targetBtn = e.target.closest('[data-modal-target]');
        if (targetBtn) {
            e.preventDefault();
            const targetTypeToken = targetBtn.getAttribute('data-modal-target');
            const targetElevationId = targetBtn.getAttribute('data-modal-elevate');

            window.UniversalModalEngine.open(targetTypeToken, targetElevationId);
        }
    });

    // Dismissal triggers wire-ups
    closeBtn.addEventListener('click', window.UniversalModalEngine.close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) window.UniversalModalEngine.close(); });
});

// Global Emergency Notice Banner Dismissal
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('global-alert-banner');
    const closeBtn = document.getElementById('close-banner-btn');

    if (banner && closeBtn) {
        closeBtn.addEventListener('click', () => {
            banner.classList.add('hidden');
        });
    }
});

// ==========================================================================
// INTERSECTION OBSERVER: PREMIUM ENTRY ANIMATION ROUTINE
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const revealTargets = document.querySelectorAll('.reveal-on-scroll');

    const observerOptions = {
        root: null,         // Uses the natural browser viewport profile
        rootMargin: '0px',
        threshold: 0.08     // Fires the moment 8% of the target breaks the viewport boundary
    };

    const scrollRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Unobserve prevents the browser from recycling animations if a user scrolls back up
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealTargets.forEach(target => scrollRevealObserver.observe(target));
});


document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.getElementById('hero-video');
    if (!heroVideo) return;

    const playlist = [
        'assets/8902084-hd_1920_1080_25fps.mp4', // garnishing (starting clip)
        'assets/8901916-hd_1920_1080_25fps.mp4', // slicing salmon
        'assets/8901999-hd_1920_1080_25fps.mp4'  // topping sushi
    ];
    let index = 0; // hero starts on the garnish clip already loaded via src above

    heroVideo.addEventListener('ended', () => {
        heroVideo.classList.add('fading');

        setTimeout(() => {
            index = (index + 1) % playlist.length;
            heroVideo.src = playlist[index];
            heroVideo.play();
            heroVideo.classList.remove('fading');
        }, 600); // matches the CSS transition duration
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('reviews-track');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    if (!track || !prevBtn || !nextBtn) return;

    const AUTO_ROTATE_DELAY = 4500; // ms between automatic slides
    let autoRotateTimer = null;

    function cardScrollDistance() {
        const card = track.querySelector('.review-card');
        if (!card) return 320;
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.columnGap || style.gap || 30);
        return card.getBoundingClientRect().width + gap;
    }

    function isAtStart() {
        return track.scrollLeft <= 2;
    }

    function isAtEnd() {
        return track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    }

    function goNext() {
        if (isAtEnd()) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: cardScrollDistance(), behavior: 'smooth' });
        }
    }

    function goPrev() {
        if (isAtStart()) {
            track.scrollTo({ left: track.scrollWidth - track.clientWidth, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: -cardScrollDistance(), behavior: 'smooth' });
        }
    }

    function startAutoRotate() {
        stopAutoRotate();
        autoRotateTimer = setInterval(goNext, AUTO_ROTATE_DELAY);
    }

    function stopAutoRotate() {
        if (autoRotateTimer) clearInterval(autoRotateTimer);
    }

    function restartAutoRotate() {
        // Called after a manual interaction — pause briefly, then resume auto-play
        startAutoRotate();
    }

    prevBtn.addEventListener('click', () => {
        goPrev();
        restartAutoRotate();
    });

    nextBtn.addEventListener('click', () => {
        goNext();
        restartAutoRotate();
    });

    // Pause while the user is actively looking (hover on desktop, touch on mobile)
    track.addEventListener('pointerenter', stopAutoRotate);
    track.addEventListener('pointerleave', startAutoRotate);
    track.addEventListener('touchstart', stopAutoRotate, { passive: true });
    track.addEventListener('touchend', () => setTimeout(startAutoRotate, AUTO_ROTATE_DELAY), { passive: true });

    startAutoRotate();

    // Only show "Read more" on quotes that actually got clamped
    track.querySelectorAll('.review-quote').forEach(quote => {
        if (quote.scrollHeight > quote.clientHeight + 1) {
            const toggle = quote.nextElementSibling;
            if (toggle && toggle.classList.contains('review-quote-toggle')) {
                toggle.style.display = 'inline-block';
            }
        }
    });

    track.addEventListener('click', (e) => {
        const quoteToggle = e.target.closest('.review-quote-toggle');
        if (quoteToggle) {
            e.preventDefault();
            e.stopPropagation();
            const quote = quoteToggle.previousElementSibling;
            const expanded = quote.classList.toggle('expanded');
            quoteToggle.textContent = expanded ? 'Show less' : 'Read more';
            return;
        }

        const replyToggle = e.target.closest('.review-owner-reply-toggle');
        if (replyToggle) {
            e.preventDefault();
            e.stopPropagation();
            replyToggle.closest('.review-owner-reply').classList.toggle('open');
        }
    });
});