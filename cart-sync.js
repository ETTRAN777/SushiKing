// ==========================================================================
// CLIENT CART INTERACTIVE ENGINE & SYNC DEEP-LINK LOGIC
// ==========================================================================
let clientBasket = [];

// Maximum quantity allowed per line item (applies to + button and direct edits)
const MAX_ITEM_QUANTITY = 9999999;

// Simple SVG trash icon used across cart sidebar + menu card controls
const TRASH_ICON_SVG = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
    </svg>
`;

// Builds a [ - qty + ] stepper control block, with optional trailing trash icon
function buildStepperMarkup(item, { withTrash = false, size = 'normal' } = {}) {
    const sizeClass = size === 'compact' ? 'qty-stepper-compact' : '';

    return `
        <div class="qty-stepper ${sizeClass}">
            <button class="qty-decrement-btn" data-name="${item.name}" aria-label="Decrease quantity of ${item.name}">&minus;</button>
            <input
                class="qty-value-input"
                type="number"
                inputmode="numeric"
                min="0"
                max="${MAX_ITEM_QUANTITY}"
                step="1"
                value="${item.quantity}"
                data-name="${item.name}"
                data-price="${item.price}"
                aria-label="Quantity of ${item.name}"
            >
            <button class="qty-increment-btn" data-name="${item.name}" data-price="${item.price}" aria-label="Increase quantity of ${item.name}">+</button>
        </div>
        ${withTrash ? `
        <button class="remove-item-trigger" data-name="${item.name}" aria-label="Remove ${item.name} from order">
            ${TRASH_ICON_SVG}
        </button>` : ''}
    `;
}

// Shared helper so app.js can render the correct control state (Add btn vs Stepper)
// when it (re)builds menu cards, e.g. on category tab switches.
// Defined at top-level (not inside initCartEngine) so it's available synchronously
// as soon as this script is parsed -- before app.js's DOMContentLoaded handler runs.
window.getMenuItemControlMarkup = function(name, price) {
    const basketItem = clientBasket.find(i => i.name === name);
    if (!basketItem) {
        return `<button class="add-to-cart-btn" data-name="${name}" data-price="${price}">+ Add</button>`;
    }
    return buildStepperMarkup(basketItem, { withTrash: true, size: 'compact' });
};

function initCartEngine() {
    const floatingBar = document.getElementById('cart-floating-bar');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const itemsWrapper = document.getElementById('cart-items-wrapper');
    
    // UI Counter Display Hooks
    const itemCountText = document.getElementById('cart-item-count');
    const subtotalDisplay = document.getElementById('cart-subtotal-display');
    const totalDisplay = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-pos-btn');

    // Event Delegations for dynamically generated Add Buttons + Steppers
    document.addEventListener('click', (e) => {
        // Initial "+ Add" trigger on a menu card (item not yet in basket)
        const addBtn = e.target.closest('.add-to-cart-btn');
        if (addBtn) {
            const name = addBtn.getAttribute('data-name');
            const price = parseFloat(addBtn.getAttribute('data-price'));
            addToBasket(name, price);
            return;
        }

        // Stepper increment trigger (cart sidebar OR menu card)
        const incBtn = e.target.closest('.qty-increment-btn');
        if (incBtn) {
            const name = incBtn.getAttribute('data-name');
            const price = parseFloat(incBtn.getAttribute('data-price'));
            incrementItem(name, price);
            return;
        }

        // Stepper decrement trigger (cart sidebar OR menu card)
        const decBtn = e.target.closest('.qty-decrement-btn');
        if (decBtn) {
            const name = decBtn.getAttribute('data-name');
            decrementItem(name);
            return;
        }

        // Trash / full remove trigger (cart sidebar OR menu card)
        const trashBtn = e.target.closest('.remove-item-trigger');
        if (trashBtn) {
            const name = trashBtn.getAttribute('data-name');
            removeItemFromBasket(name);
            return;
        }
    });

    // Select-all on focus so typing immediately replaces the current value
    document.addEventListener('focus', (e) => {
        if (e.target.classList && e.target.classList.contains('qty-value-input')) {
            e.target.select();
        }
    }, true);

    // Commit the new quantity when the input loses focus
    document.addEventListener('blur', (e) => {
        if (e.target.classList && e.target.classList.contains('qty-value-input')) {
            const input = e.target;
            const name = input.getAttribute('data-name');
            const price = parseFloat(input.getAttribute('data-price'));
            setItemQuantity(name, price, input.value);
        }
    }, true);

    // Commit on Enter (and let it blur), ignore other keys
    document.addEventListener('keydown', (e) => {
        if (e.target.classList && e.target.classList.contains('qty-value-input')) {
            if (e.key === 'Enter') {
                e.target.blur();
            }
        }
    });

    // Panel Window Open/Close Toggles
    document.getElementById('open-cart-btn').addEventListener('click', () => toggleDrawer(true));
    document.getElementById('close-cart-btn').addEventListener('click', () => toggleDrawer(false));
    cartOverlay.addEventListener('click', () => toggleDrawer(false));

    function toggleDrawer(openState) {
        if(openState) {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('open');
        } else {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('open');
        }
    }

    function addToBasket(name, price) {
        const matchingNode = clientBasket.find(i => i.name === name);
        if (matchingNode) {
            matchingNode.quantity += 1;
        } else {
            clientBasket.push({ name, price, quantity: 1 });
        }
        syncCartState();
    }

    function incrementItem(name, price) {
        const matchingNode = clientBasket.find(i => i.name === name);
        if (matchingNode) {
            matchingNode.quantity = Math.min(matchingNode.quantity + 1, MAX_ITEM_QUANTITY);
        } else {
            clientBasket.push({ name, price, quantity: 1 });
        }
        syncCartState();
    }

    function decrementItem(name) {
        const matchingNode = clientBasket.find(i => i.name === name);
        if (!matchingNode) return;

        matchingNode.quantity -= 1;
        if (matchingNode.quantity <= 0) {
            clientBasket = clientBasket.filter(i => i.name !== name);
        }
        syncCartState();
    }

    // Sets an item's quantity directly (used by the editable qty input).
    // A quantity of 0 (or invalid input) removes the item entirely.
    // Values above MAX_ITEM_QUANTITY are clamped down to the cap.
    function setItemQuantity(name, price, rawValue) {
        let qty = parseInt(rawValue, 10);

        if (isNaN(qty) || qty <= 0) {
            clientBasket = clientBasket.filter(i => i.name !== name);
            syncCartState();
            return;
        }

        qty = Math.min(qty, MAX_ITEM_QUANTITY);

        const matchingNode = clientBasket.find(i => i.name === name);
        if (matchingNode) {
            matchingNode.quantity = qty;
        } else {
            clientBasket.push({ name, price, quantity: qty });
        }
        syncCartState();
    }

    function removeItemFromBasket(name) {
        clientBasket = clientBasket.filter(i => i.name !== name);
        syncCartState();
    }
    // Exposed globally for any inline-onclick fallbacks
    window.removeItemFromBasket = removeItemFromBasket;
    window.incrementItem = incrementItem;
    window.decrementItem = decrementItem;
    window.setItemQuantity = setItemQuantity;

    // Refreshes the inline controls on each menu card so they reflect basket state
    function syncMenuCardControls() {
        document.querySelectorAll('.menu-item-info-row').forEach(row => {
            const name = row.getAttribute('data-item-name');
            const price = row.getAttribute('data-item-price');
            if (!name) return;

            row.innerHTML = window.getMenuItemControlMarkup(name, price);
        });
    }

    function syncCartState() {
        // Always refresh the menu card controls so item-level steppers stay accurate
        syncMenuCardControls();

        if (clientBasket.length === 0) {
            floatingBar.classList.add('hidden');
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('open');
            itemsWrapper.innerHTML = `<p class="empty-cart-msg">Your basket is currently empty.</p>`;
            checkoutBtn.disabled = true;
            return;
        }

        // Compute pricing aggregates
        const totalItems = clientBasket.reduce((sum, i) => sum + i.quantity, 0);
        const subtotalSum = clientBasket.reduce((sum, i) => sum + (i.price * i.quantity), 0);

        // Update Text Indicators
        itemCountText.textContent = `${totalItems} Item${totalItems > 1 ? 's' : ''} Selected`;
        subtotalDisplay.textContent = `$${subtotalSum.toFixed(2)}`;
        totalDisplay.textContent = `$${subtotalSum.toFixed(2)}`;
        
        floatingBar.classList.remove('hidden');
        checkoutBtn.disabled = false;

        // Render Active List Nodes
        itemsWrapper.innerHTML = clientBasket.map(item => `
            <div class="cart-item-node">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div class="cart-item-controls">
                    ${buildStepperMarkup(item, { withTrash: true })}
                </div>
            </div>
        `).join('');
    }

    // CRITICAL: Construct Deep-Link Handshake to pass data over to checkout
    checkoutBtn.addEventListener('click', () => {
        // Formats data payload safely for URL query ingestion
        const basketPayload = encodeURIComponent(JSON.stringify(clientBasket));
        
        // Base Checkout Root URL Target 
        // This attaches the cart data array as an unambiguous parameter string
        const targetCheckoutUrl = `https://order.sushikingmi.com/?prefilledCart=${basketPayload}`;
        
        // Transfer the user instantly to the processing page with order filled
        window.location.href = targetCheckoutUrl;
    });
}

// Make sure to execute the controller loop alongside your tab rendering sequences at the top of your script block
setTimeout(initCartEngine, 300);