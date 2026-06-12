// ==========================================================================
// CLIENT CART INTERACTIVE ENGINE & SYNC DEEP-LINK LOGIC
// ==========================================================================
let clientBasket = [];

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

    // Event Delegations for dynamically generated Add Buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            
            addToBasket(name, price);
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

    window.removeItemFromBasket = function(name) {
        clientBasket = clientBasket.filter(i => i.name !== name);
        syncCartState();
    };

    function syncCartState() {
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
                    <h4>${item.name} (x${item.quantity})</h4>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <button class="remove-item-trigger" onclick="removeItemFromBasket('${item.name}')">Remove</button>
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