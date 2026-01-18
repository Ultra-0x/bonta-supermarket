// Bonta Supermarket - Cart + Category Filtering + Search + Checkout Alert

let cart = [];

const cartDisplay = document.getElementById('cart-count');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalDisplay = document.getElementById('cart-total');
const emptyCartMsg = document.querySelector('.empty-cart');
const viewCartBtn = document.querySelector('.view-cart-btn');

const addToCartButtons = document.querySelectorAll('.add-to-cart');
const categoryCards = document.querySelectorAll('.category-card');
const allProductCards = document.querySelectorAll('.product-card');

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

const categoryMap = {
    'Drinks': ['Coca-Cola (Pack)', 'Orange Juice (Large Carton)'],
    'Groceries': ['Premium Rice (5kg)'],
    'Appliances': ['High-Power Blender', 'Compact Microwave Oven'],
    'Toys': ['Kids Electric Ride-On Car'],
    'Cleaning Supplies': ['Laundry Detergent (Large)'],
    'Toiletries': ['Shampoo & Conditioner Set']
};

// Update Cart Display
function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartDisplay.innerHTML = `🛒 Cart (${totalItems})`;
    cartTotalDisplay.textContent = `₦${totalPrice.toLocaleString()}`;

    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }

    cart.forEach((item, index) => {
        const itemHTML = `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${'₦' + item.price.toLocaleString()}</p>
                    <div class="cart-item-controls">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                        <button class="delete-item" data-index="${index}">×</button>
                    </div>
                </div>
            </div>
        `;
        cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
    });

    attachQuantityListeners();
}

// Quantity & Delete Listeners
function attachQuantityListeners() {
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.onclick = () => {
            const i = btn.dataset.index;
            cart[i].quantity++;
            updateCartDisplay();
        };
    });

    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.onclick = () => {
            const i = btn.dataset.index;
            if (cart[i].quantity > 1) {
                cart[i].quantity--;
            } else {
                cart.splice(i, 1);
            }
            updateCartDisplay();
        };
    });

    document.querySelectorAll('.delete-item').forEach(btn => {
        btn.onclick = () => {
            cart.splice(btn.dataset.index, 1);
            updateCartDisplay();
        };
    });
}

// Add to Cart
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.product-card');
        const name = card.querySelector('h3').textContent;
        const priceText = card.querySelector('.price').textContent;
        const price = parseInt(priceText.replace('₦', '').replace(',', ''));
        const img = card.querySelector('img').src;

        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ name, price, quantity: 1, img });
        }

        updateCartDisplay();

        // Button feedback
        const orig = button.textContent;
        button.textContent = 'Added!';
        button.style.backgroundColor = '#28a745';
        button.disabled = true;
        setTimeout(() => {
            button.textContent = orig;
            button.style.backgroundColor = '#FF6600';
            button.disabled = false;
        }, 1200);
    });
});

// Search Functionality
const performSearch = () => {
    const query = searchInput.value.trim().toLowerCase();
    allProductCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = name.includes(query) || query === '' ? 'block' : 'none';
    });
};

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keyup', e => {
    if (e.key === 'Enter') performSearch();
    else performSearch(); // Live search as you type
});

// Category Filtering
let activeCategory = null;
categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const cat = card.querySelector('h3').textContent.trim();
        if (activeCategory === cat) {
            allProductCards.forEach(pc => pc.style.display = 'block');
            activeCategory = null;
            categoryCards.forEach(c => c.style.opacity = '0.8');
        } else {
            allProductCards.forEach(pc => {
                const name = pc.querySelector('h3').textContent;
                pc.style.display = categoryMap[cat].includes(name) ? 'block' : 'none';
            });
            activeCategory = cat;
            categoryCards.forEach(c => c.style.opacity = '0.6');
            card.style.opacity = '1';
        }
    });
});

// View Cart Alert
viewCartBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    let msg = `Thank you for shopping at Bonta Supermarket!\n\nItems:\n`;
    cart.forEach(item => {
        msg += `• ${item.name} × ${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}\n`;
    });
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    msg += `\nTotal: ₦${total.toLocaleString()}\n\nPayment options:\n• Bank Transfer\n• Pay on Delivery\n• Card\n• USSD\n\nContact:\nBontasupermarket@gmail.com\n+234 913 899 9084`;
    alert(msg);
});
