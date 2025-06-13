document.addEventListener('DOMContentLoaded', function() {
    const productGrid = document.getElementById('productGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const sortSelect = document.getElementById('sortSelect');
    
    // Sample product data
    const products = [
        {
            id: 1,
            name: 'Wireless Headphones',
            category: 'electronics',
            price: 199.99,
            rating: 4.5,
            image: 'https://via.placeholder.com/300x200?text=Headphones'
        },
        {
            id: 2,
            name: 'Smart Watch',
            category: 'electronics',
            price: 249.99,
            rating: 4.2,
            image: 'https://via.placeholder.com/300x200?text=Smart+Watch'
        },
        {
            id: 3,
            name: 'Cotton T-Shirt',
            category: 'clothing',
            price: 24.99,
            rating: 4.0,
            image: 'https://via.placeholder.com/300x200?text=T-Shirt'
        },
        {
            id: 4,
            name: 'Denim Jeans',
            category: 'clothing',
            price: 59.99,
            rating: 4.3,
            image: 'https://via.placeholder.com/300x200?text=Jeans'
        },
        {
            id: 5,
            name: 'Coffee Table',
            category: 'home',
            price: 149.99,
            rating: 4.7,
            image: 'https://via.placeholder.com/300x200?text=Coffee+Table'
        },
        {
            id: 6,
            name: 'Throw Pillow',
            category: 'home',
            price: 19.99,
            rating: 3.9,
            image: 'https://via.placeholder.com/300x200?text=Pillow'
        },
        {
            id: 7,
            name: 'JavaScript: The Definitive Guide',
            category: 'books',
            price: 39.99,
            rating: 4.8,
            image: 'https://via.placeholder.com/300x200?text=JS+Book'
        },
        {
            id: 8,
            name: 'Python Crash Course',
            category: 'books',
            price: 29.99,
            rating: 4.6,
            image: 'https://via.placeholder.com/300x200?text=Python+Book'
        }
    ];
    
    // Current filter and sort values
    let currentCategory = 'all';
    let currentMaxPrice = 1000;
    let currentSort = 'default';
    
    // Render products based on current filters and sort
    function renderProducts() {
        productGrid.innerHTML = '';
        
        // Filter products
        let filteredProducts = products.filter(product => {
            const categoryMatch = currentCategory === 'all' || product.category === currentCategory;
            const priceMatch = product.price <= currentMaxPrice;
            return categoryMatch && priceMatch;
        });
        
        // Sort products
        filteredProducts = sortProducts(filteredProducts, currentSort);
        
        // Display products or "no products" message
        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<div class="no-products">No products match your filters.</div>';
        } else {
            filteredProducts.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <span class="product-category">${product.category}</span>
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <div class="product-rating">
                            <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
                            <span>${product.rating.toFixed(1)}</span>
                        </div>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                `;
                productGrid.appendChild(productCard);
            });
        }
    }
    
    // Sort products based on selected option
    function sortProducts(products, sortOption) {
        switch (sortOption) {
            case 'price-asc':
                return [...products].sort((a, b) => a.price - b.price);
            case 'price-desc':
                return [...products].sort((a, b) => b.price - a.price);
            case 'rating-desc':
                return [...products].sort((a, b) => b.rating - a.rating);
            case 'name-asc':
                return [...products].sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return [...products].sort((a, b) => b.name.localeCompare(a.name));
            default:
                return products;
        }
    }
    
    // Event listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderProducts();
        });
    });
    
    priceRange.addEventListener('input', function() {
        currentMaxPrice = parseInt(this.value);
        priceValue.textContent = `Up to $${currentMaxPrice}`;
        renderProducts();
    });
    
    sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        renderProducts();
    });
    
    // Initial render
    renderProducts();
});