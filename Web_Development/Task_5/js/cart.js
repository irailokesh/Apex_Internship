document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutSubtotalElement = document.getElementById('checkout-subtotal');
    const checkoutShippingElement = document.getElementById('checkout-shipping');
    const checkoutTotalElement = document.getElementById('checkout-total');
    
    // Load cart and render
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    renderCart(cart);
    updateCartSummary(cart);
    updateCartCount();
    
    // Event delegation for quantity changes and remove buttons
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', function(e) {
            const target = e.target;
            const cartItem = target.closest('.cart-item');
            
            if (!cartItem) return;
            
            const productId = parseInt(cartItem.getAttribute('data-id'));
            
            // Increase quantity
            if (target.classList.contains('increase')) {
                updateQuantity(productId, 1);
            }
            
            // Decrease quantity
            if (target.classList.contains('decrease')) {
                updateQuantity(productId, -1);
            }
            
            // Remove item
            if (target.classList.contains('cart-item-remove')) {
                removeItem(productId);
            }
        });
        
        // Handle direct quantity input
        cartItemsContainer.addEventListener('change', function(e) {
            if (e.target.classList.contains('quantity-input')) {
                const cartItem = e.target.closest('.cart-item');
                const productId = parseInt(cartItem.getAttribute('data-id'));
                const newQuantity = parseInt(e.target.value);
                
                if (newQuantity > 0) {
                    updateQuantity(productId, newQuantity, true);
                } else {
                    removeItem(productId);
                }
            }
        });
    }
    
    // Checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, you would process the payment here
            alert('Order placed successfully! Thank you for your purchase.');
            localStorage.removeItem('cart');
            window.location.href = 'index.html';
        });
    }
    
    // Render cart items
    function renderCart(cart) {
        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is empty. <a href="products.html">Continue shopping</a></p>';
                return;
            }
            
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                    </div>
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="decrease">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                            <button class="increase">+</button>
                        </div>
                        <div class="cart-item-remove">Remove</div>
                    </div>
                    <div class="cart-item-total">
                        $${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            `).join('');
        }
        
        // Render checkout items if on checkout page
        if (checkoutItemsContainer) {
            checkoutItemsContainer.innerHTML = cart.map(item => `
                <div class="order-item">
                    <span>${item.name} × ${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');
        }
    }
    
    // Update cart summary
    function updateCartSummary(cart) {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
        const total = subtotal + shipping;
        
        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
        
        if (checkoutSubtotalElement) checkoutSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (checkoutShippingElement) checkoutShippingElement.textContent = `$${shipping.toFixed(2)}`;
        if (checkoutTotalElement) checkoutTotalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    // Update quantity of an item
    function updateQuantity(productId, change, setAbsolute = false) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            if (setAbsolute) {
                cart[itemIndex].quantity = change;
            } else {
                cart[itemIndex].quantity += change;
            }
            
            // Remove if quantity is 0 or less
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart(cart);
            updateCartSummary(cart);
            updateCartCount();
        }
    }
    
    // Remove an item from cart
    function removeItem(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart(cart);
        updateCartSummary(cart);
        updateCartCount();
        
        showNotification('Item removed from cart');
    }
    
    // Update cart count (same as in main.js)
    function updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }
    
    // Show notification (same as in main.js)
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
});