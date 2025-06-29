document.addEventListener('DOMContentLoaded', function() {
    // Extended products data
    const allProducts = [
        {
            id: 1,
            name: 'Premium Smartphone X',
            price: 799.99,
            category: 'phones',
            image: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg',
            rating: 4.5
        },
        {
            id: 2,
            name: 'Ultra Slim Laptop Pro',
            price: 1299.99,
            category: 'laptops',
            image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',
            rating: 4.8
        },
        {
            id: 3,
            name: 'Wireless Noise-Canceling Headphones',
            price: 299.99,
            category: 'accessories',
            image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
            rating: 4.7
        },
        {
            id: 4,
            name: 'Smart Watch Series 5',
            price: 249.99,
            category: 'accessories',
            image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
            rating: 4.3
        },
        {
            id: 5,
            name: 'Budget Smartphone Y',
            price: 299.99,
            category: 'phones',
            image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
            rating: 3.9
        },
        {
            id: 6,
            name: 'Gaming Laptop Extreme',
            price: 1899.99,
            category: 'laptops',
            image: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg',
            rating: 4.6
        },
        {
            id: 7,
            name: 'Bluetooth Earbuds',
            price: 99.99,
            category: 'accessories',
            image: 'https://images.pexels.com/photos/1646704/pexels-photo-1646704.jpeg',
            rating: 4.2
        },
        {
            id: 8,
            name: 'Fitness Tracker Pro',
            price: 149.99,
            category: 'accessories',
            image: 'https://images.pexels.com/photos/437038/pexels-photo-437038.jpeg',
            rating: 4.0
        }
    ];

    // Pagination variables
    let currentPage = 1;
    const productsPerPage = 8;
    let filteredProducts = [...allProducts];

    // DOM elements
    const productsContainer = document.getElementById('all-products');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageNumbers = document.getElementById('page-numbers');

    // Initialize the page
    renderProducts();
    updatePagination();
    updateCartCount();

    // Event listeners
    categoryFilter.addEventListener('change', filterProducts);
    sortBy.addEventListener('change', sortProducts);
    prevPageBtn.addEventListener('click', goToPrevPage);
    nextPageBtn.addEventListener('click', goToNextPage);

    // Filter products by category
    function filterProducts() {
        const category = categoryFilter.value;
        
        if (category === 'all') {
            filteredProducts = [...allProducts];
        } else {
            filteredProducts = allProducts.filter(product => product.category === category);
        }
        
        currentPage = 1;
        sortProducts();
    }

    // Sort products
    function sortProducts() {
        const sortValue = sortBy.value;
        
        switch(sortValue) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Default sorting (by ID or original order)
                filteredProducts.sort((a, b) => a.id - b.id);
        }
        
        renderProducts();
        updatePagination();
    }

    // Render products based on current page
    function renderProducts() {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);
        
        productsContainer.innerHTML = productsToShow.map(product => `
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
                const product = allProducts.find(p => p.id === productId);
                addToCart(product);
            });
        });
    }

    // Update pagination controls
    function updatePagination() {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        
        pageNumbers.textContent = `${currentPage} of ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // Go to previous page
    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Go to next page
    function goToNextPage() {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Add to cart function (same as in main.js)
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
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
        showNotification(`${product.name} added to cart!`);
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