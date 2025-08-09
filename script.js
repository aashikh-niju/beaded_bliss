// Product data
const products = [
    {
        id: 1,
        name: "Rainbow Spectrum",
        price: 40,
        image: "images/bracelet1.png",
        description: "A vibrant bracelet featuring beads in all colors of the rainbow."
    },
    {
        id: 2,
        name: "Ocean Waves",
        price: 40,
        image: "images/bracelet2.png",
        description: "Shades of blue and turquoise beads that capture the essence of the sea."
    },
    {
        id: 3,
        name: "Rosy Glow",
        price: 40,
        image: "images/bracelet3.png",
        description: "Delicate pink beads with a soft, romantic appearance."
    },
    {
        id: 4,
        name: "Amber Sunset",
        price: 40,
        image: "images/bracelet4.png",
        description: "Rich amber and golden beads that shimmer like a sunset."
    },
    {
        id: 5,
        name: "Lavender Fields",
        price: 40,
        image: "images/bracelet5.png",
        description: "Soothing purple beads reminiscent of blooming lavender."
    },
    {
        id: 6,
        name: "Floral Fantasy",
        price: 40,
        image: "images/bracelet6.png",
        description: "Flower-shaped beads in pastel colors arranged in a rainbow pattern."
    },
    {
        id: 7,
        name: "Midnight Sky",
        price: 40,
        image: "images/bracelet7.png",
        description: "Deep blue beads with silver star accents that twinkle like the night sky."
    },
    {
        id: 8,
        name: "Sweet Treats",
        price: 40,
        image: "images/bracelet8.png",
        description: "Playful beads in bright candy-inspired colors that bring a touch of fun."
    },
    {
        id: 9,
        name: "Forest Walk",
        price: 40,
        image: "images/bracelet9.png",
        description: "Earthy green and brown beads with leaf details reminiscent of a forest path."
    },
    {
        id: 10,
        name: "Flutter By",
        price: 40,
        image: "images/bracelet10.png",
        description: "Light, airy beads with delicate butterfly motifs in pastel colors."
    },
    {
        id: 11,
        name: "Woven Wishes",
        price: 40,
        image: "images/bracelet11.png",
        description: "Intricately woven threads in a traditional friendship bracelet pattern."
    },
    {
        id: 12,
        name: "Diamond Dazzle",
        price: 40,
        image: "images/bracelet12.png",
        description: "Clear crystal-like beads that catch the light and sparkle like diamonds."
    }
];

// DOM Elements
const productContainer = document.getElementById('product-container');
const cartItems = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const cartTotal = document.getElementById('cart-total');
const totalAmount = document.getElementById('total-amount');
const checkoutTotal = document.getElementById('checkout-total');
const cartCount = document.querySelector('.cart-count');
const checkoutForm = document.getElementById('checkout-form');
const reviewForm = document.getElementById('review-form');
const ratingInput = document.querySelector('.rating-input');
const ratingValue = document.getElementById('rating-value');
const finishOrderBtn = document.getElementById('finish-order-btn');

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize reviews from localStorage
let reviews = JSON.parse(localStorage.getItem('reviews')) || {};

// Display products
function displayProducts() {
    productContainer.innerHTML = '';
    
    products.forEach(product => {
        // Get product reviews
        const productReviews = reviews[product.id] || [];
        const reviewCount = productReviews.length;
        
        // Calculate average rating
        let avgRating = 0;
        if (reviewCount > 0) {
            avgRating = productReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount;
        }
        
        // Create rating stars
        let ratingStars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.round(avgRating)) {
                ratingStars += '<i class="fas fa-star"></i>';
            } else {
                ratingStars += '<i class="far fa-star"></i>';
            }
        }
        
        const productCard = document.createElement('div');
        productCard.className = 'col-md-6 col-lg-4 col-xl-3';
        productCard.innerHTML = `
            <div class="product-card">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h5 class="product-title">${product.name}</h5>
                    <p class="product-price">₹${product.price}</p>
                    <div class="product-rating">
                        ${ratingStars}
                        <span class="review-count">(${reviewCount})</span>
                    </div>
                    <button class="btn btn-primary btn-add-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn btn-review" data-id="${product.id}" data-bs-toggle="modal" data-bs-target="#reviewModal">
                        <i class="far fa-comment"></i> Write a Review
                    </button>
                </div>
            </div>
        `;
        
        productContainer.appendChild(productCard);
    });
    
    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Add event listeners to Review buttons
    document.querySelectorAll('.btn-review').forEach(button => {
        button.addEventListener('click', openReviewModal);
    });
}

// Add to cart function
function addToCart(e) {
    const productId = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === productId);
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
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
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart display
    updateCartDisplay();
    
    // Show success message
    showToast(`${product.name} added to cart!`);
}

// Update cart display
function updateCartDisplay() {
    // Update cart count
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Check if cart is empty
    if (cart.length === 0) {
        cartEmpty.classList.remove('d-none');
        cartItems.innerHTML = '';
        cartTotal.classList.add('d-none');
        document.getElementById('checkout-btn').disabled = true;
        return;
    }
    
    // Hide empty cart message and show total
    cartEmpty.classList.add('d-none');
    cartTotal.classList.remove('d-none');
    document.getElementById('checkout-btn').disabled = false;
    
    // Display cart items
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h5 class="cart-item-title">${item.name}</h5>
                <p class="cart-item-price">₹${item.price}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}" readonly>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item-btn" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Update total amount
    totalAmount.textContent = `₹${total}`;
    checkoutTotal.textContent = `₹${total}`;
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.quantity-btn.increase').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', removeItem);
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', updateQuantity);
    });
}

// Decrease quantity
function decreaseQuantity(e) {
    const productId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        removeItem(e);
        return;
    }
    
    saveCart();
    updateCartDisplay();
}

// Increase quantity
function increaseQuantity(e) {
    const productId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    
    item.quantity += 1;
    
    saveCart();
    updateCartDisplay();
}

// Update quantity
function updateQuantity(e) {
    const productId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    const newQuantity = parseInt(e.target.value);
    
    if (newQuantity > 0) {
        item.quantity = newQuantity;
    } else {
        item.quantity = 1;
    }
    
    saveCart();
    updateCartDisplay();
}

// Remove item from cart
function removeItem(e) {
    const productId = parseInt(e.target.closest('[data-id]').dataset.id);
    cart = cart.filter(item => item.id !== productId);
    
    saveCart();
    updateCartDisplay();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Open review modal
function openReviewModal(e) {
    const productId = parseInt(e.target.closest('[data-id]').dataset.id);
    document.getElementById('review-product-id').value = productId;
    
    // Reset form
    reviewForm.reset();
    document.querySelectorAll('.rating-input i').forEach(star => {
        star.className = 'far fa-star';
    });
    ratingValue.value = 0;
}

// Handle star rating
ratingInput.addEventListener('click', function(e) {
    if (e.target.tagName === 'I') {
        const rating = parseInt(e.target.dataset.rating);
        ratingValue.value = rating;
        
        // Update stars
        document.querySelectorAll('.rating-input i').forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            if (starRating <= rating) {
                star.className = 'fas fa-star';
            } else {
                star.className = 'far fa-star';
            }
        });
    }
});

// Submit review
reviewForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const productId = parseInt(document.getElementById('review-product-id').value);
    const rating = parseInt(ratingValue.value);
    const reviewerName = document.getElementById('reviewer-name').value;
    const reviewText = document.getElementById('review-text').value;
    
    if (rating === 0) {
        alert('Please select a rating');
        return;
    }
    
    // Create review object
    const review = {
        rating,
        name: reviewerName,
        text: reviewText,
        date: new Date().toISOString()
    };
    
    // Add review to product
    if (!reviews[productId]) {
        reviews[productId] = [];
    }
    
    reviews[productId].push(review);
    
    // Save reviews to localStorage
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('reviewModal'));
    modal.hide();
    
    // Refresh products display
    displayProducts();
    
    // Show success message
    showToast('Thank you for your review!');
});

// Checkout form submission
checkoutForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const upiRef = document.getElementById('upi-ref').value;
    const message = document.getElementById('message').value;
    
    // Create order object
    const order = {
        name,
        address,
        upiRef,
        message,
        items: cart,
        total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        date: new Date().toISOString()
    };
    
    // Save order to localStorage (for demo purposes)
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Send order to Google Sheet (would be implemented with actual API)
    sendOrderToGoogleSheet(order);
    
    // Close checkout modal
    const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
    checkoutModal.hide();
    
    // Show confirmation modal
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    confirmationModal.show();
});

// Clear cart after order completion
finishOrderBtn.addEventListener('click', function() {
    // Clear cart
    cart = [];
    saveCart();
    updateCartDisplay();
});

// Function to send order to Google Sheet
function sendOrderToGoogleSheet(order) {
    // Replace 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL' with your actual Google Apps Script web app URL
    const googleScriptURL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL';
    
    // Check if URL has been updated
    if (googleScriptURL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL') {
        console.warn('Google Script URL not configured');
        showToast('Google Sheet integration not configured. Please update the URL in script.js');
        return;
    }
    
    console.log('Sending order to Google Sheet:', order);
    
    fetch(googleScriptURL, {
        method: 'POST',
        mode: 'no-cors', // This helps with CORS issues
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
    })
    .then(response => {
        console.log('Response received:', response);
        // With no-cors mode, we can't read the response, so we assume success
        showToast('Order sent to Google Sheet!');
    })
    .catch(error => {
        console.error('Error sending order:', error);
        showToast('Error sending order to Google Sheet. Please check your setup.');
    });

}

// Show toast message
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Add toast styles
const style = document.createElement('style');
style.textContent = `
    .toast-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary);
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .toast-notification.show {
        transform: translateY(0);
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Display products
    displayProducts();
    
    // Update cart display
    updateCartDisplay();
});