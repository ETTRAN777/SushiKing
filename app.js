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
            let itemsMarkup = currentData.items.map(item => `
        <div class="menu-card animate-fade-in">
            <div class="menu-card-header">
                <h3>${item.name}</h3>
                <div class="menu-item-info-row">
                <button class="add-to-cart-btn" data-name="${item.name}" data-price="${item.price}">+ Add</button>
            </div>
        </div>
            ${item.description ? `<p class="menu-item-description">${item.description}</p>` : '<br><br>'}
            <span class="price-tag">$${item.price.toFixed(2)}</span>
        </div>
    `).join('');

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
                            <ul>${currentData.structure.step1_base.map(x => `<li>${x}</li>`).join('')}</ul>
                        </div>
                        <div class="poke-step-col">
                            <h5><span>2</span> Choose Protein</h5>
                            <ul>${currentData.structure.step2_protein.map(x => `<li>${x}</li>`).join('')}</ul>
                        </div>
                        <div class="poke-step-col">
                            <h5><span>3</span> Mix-ins & Toppings</h5>
                            <div class="pill-cloud">${currentData.structure.step3_toppings.map(x => `<span>${x}</span>`).join('')}</div>
                        </div>
                        <div class="poke-step-col">
                            <h5><span>4</span> Select Sauces</h5>
                            <div class="pill-cloud sauces">${currentData.structure.step4_sauces.map(x => `<span>${x}</span>`).join('')}</div>
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
            // Optional: Uncomment the line below to test an unprompted automated popup notice
            // initiateSystemTriggers('flashSale', 4000);
        })
        .catch(err => console.error('Dynamic Modal Engine failed to fetch database config profile:', err));

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
        close: () => {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            setTimeout(() => { container.innerHTML = ''; }, 300); // Flush cache variables after exit animations end
        }
    };

    // 4. Global Event Handlers Delegation Loop
    document.body.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('[data-modal-target]');
        if (targetBtn) {
            e.preventDefault();
            const targetTypeToken = targetBtn.getAttribute('data-modal-target');
            const targetElevationId = targetBtn.getAttribute('data-modal-elevate');
            
            window.UniversalModalEngine.open(targetTypeToken, targetElevationId);
        }
    });

    // Implicit System Timer Configuration Engine Utility
    function initiateSystemTriggers(typeToken, delay) {
        setTimeout(() => {
            if (!overlay.classList.contains('active')) {
                window.UniversalModalEngine.open(typeToken);
            }
        }, delay);
    }

    // Dismissal triggers wire-ups
    closeBtn.addEventListener('click', window.UniversalModalEngine.close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) window.UniversalModalEngine.close(); });
});