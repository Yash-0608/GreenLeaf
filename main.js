document.addEventListener('DOMContentLoaded', () => {
    // Sticky Navbar
    const navbar = document.querySelector('.navbar');
    const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');

    const handleScroll = () => {
        if (window.scrollY > 50 || !isHomePage) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call on load

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('ion-icon');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('name', 'close-outline');
            } else {
                icon.setAttribute('name', 'menu-outline');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.querySelector('ion-icon').setAttribute('name', 'menu-outline');
            });
        });
    }

    // Product Filtering
    const filterBtns = document.querySelectorAll('.tab-btn');
    const productCards = document.querySelectorAll('.product-card');

    const filterProducts = (filter) => {
        // Update active button
        filterBtns.forEach(btn => {
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        productCards.forEach(card => {
            const categories = card.getAttribute('data-category')?.split(' ') || [];
            if (filter === 'all' || categories.includes(filter)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterProducts(filter);
        });
    });

    // Handle URL parameters for filtering (e.g., products.html?cat=indoor)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    if (catParam) {
        filterProducts(catParam);
    }

    // Cart State
    let cart = JSON.parse(localStorage.getItem('greenleaf-cart')) || [];
    const CART_PRICE = 99;

    const saveCart = () => {
        localStorage.setItem('greenleaf-cart', JSON.stringify(cart));
        updateCartUI();
    };

    const updateCartUI = () => {
        const cartCount = document.querySelector('.cart-count');
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotalValue = document.querySelector('.cart-total-value');
        
        // Update count
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        if (cartCount) cartCount.textContent = totalQty;

        // Update list
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = cart.length === 0 
                ? '<p class="text-center">Your cart is empty.</p>' 
                : cart.map((item, index) => `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.name}">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>₹${CART_PRICE}</p>
                            <div class="cart-item-qty">
                                <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                                <span>${item.qty}</span>
                                <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                            </div>
                        </div>
                        <div class="remove-item" onclick="removeFromCart(${index})">Remove</div>
                    </div>
                `).join('');
        }

        // Update total
        if (cartTotalValue) {
            cartTotalValue.textContent = `₹${totalQty * CART_PRICE}`;
        }
    };

    // Global cart functions
    window.addToCart = (name, img) => {
        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ name, img, qty: 1 });
        }
        saveCart();
        document.querySelector('.cart-drawer').classList.add('active');
        document.querySelector('.cart-overlay').classList.add('active');
    };

    window.updateQty = (index, delta) => {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
    };

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        saveCart();
    };

    // Cart Toggle
    const cartBtn = document.querySelector('.cart-icon-btn');
    const closeCart = document.querySelector('.close-cart');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartDrawer = document.querySelector('.cart-drawer');
    const checkoutBtn = document.querySelector('.checkout-btn');

    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            cartDrawer.classList.add('active');
            cartOverlay.classList.add('active');
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartDrawer.classList.remove('active');
            cartOverlay.classList.remove('active');
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            cartDrawer.classList.remove('active');
            cartOverlay.classList.remove('active');
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }

    // Initial UI Update
    updateCartUI();

    // Attach Add to Cart buttons
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card');
            const name = card.querySelector('h3').textContent;
            const img = card.querySelector('img').src;
            window.addToCart(name, img);
        });
    });

    // Scroll Reveal Animation (Simple Implementation)
    const revealElements = document.querySelectorAll('.section-header, .about-text, .category-card, .product-card');
    
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < window.innerHeight - elementVisible) {
                el.classList.add('active');
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial styles for reveal elements
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load
});

// CSS Injection for internal animations if needed
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(style);
