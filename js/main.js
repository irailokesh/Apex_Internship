document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
    
    // Load featured products
    loadFeaturedProducts();
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            // In a real app, you would send this to your server
            alert(`Thank you for subscribing with ${email}!`);
            this.reset();
        });
    }
    
    // Update cart count
    updateCartCount();
});

// Featured products data
const products = [
    {
        id: 1,
        name: 'Premium Smartphone X',
        price: 799.99,
        category: 'phones',
        image: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg',
        rating: 4.5,
        featured: true
    },
    {
        id: 2,
        name: 'Ultra Slim Laptop Pro',
        price: 1299.99,
        category: 'laptops',
        image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',
        rating: 4.8,
        featured: true
    },
    {
        id: 3,
        name: 'Wireless Noise-Canceling Headphones',
        price: 299.99,
        category: 'accessories',
        image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
        rating: 4.7,
        featured: true
    },
    {
        id: 4,
        name: 'Smart Watch Series 5',
        price: 249.99,
        category: 'accessories',
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
        rating: 4.3,
        featured: true
    }
];

function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    
    if (!featuredProductsContainer) return;
    
    const featuredProducts = products.filter(product => product.featured);
    
    featuredProductsContainer.innerHTML = featuredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-rating">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</div>
                <button class="btn btn-primary add-to-cart">Add to Cart</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.closest('.product-card').getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            addToCart(product);
        });
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

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

// Add notification styles dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
.notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--success-color);
    color: white;
    padding: 15px 25px;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
}
.notification.show {
    opacity: 1;
}
`;
document.head.appendChild(notificationStyles);