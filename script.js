// Bonta Supermarket - Advanced Cart + Category Filtering + Checkout Alert

let cartCount = 0;
let cartTotal = 0;

const cartDisplay = document.getElementById('cart-count');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalDisplay = document.getElementById('cart-total');
const emptyCartMsg = document.querySelector('.empty-cart');
const viewCartBtn = document.querySelector('.view-cart-btn');

const addToCartButtons = document.querySelectorAll('.add-to-cart');
const categoryCards = document.querySelectorAll('.category-card');
const allProductCards = document.querySelectorAll('.product-card');

// Category mapping
const categoryMap = {
    'Drinks': ['Coca-Cola (Pack)', 'Orange Juice (Large Carton)'],
    'Groceries': ['Premium Rice (5kg)'],
    'Appliances': ['High-Power Blender', 'Compact Microwave Oven'],
    'Toys': ['Kids Electric Ride-On Car'],
    'Cleaning Supplies': ['Laundry Detergent (Large)'],
    'Toiletries': ['Shampoo & Conditioner Set']
};

// Add to Cart
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPriceText = productCard.querySelector('.price').textContent;
        const productPrice = parseInt(productPriceText.replace('₦', '').replace(',', ''));
        const productImgSrc = productCard.querySelector('img').src;

        cartCount++;
        cartTotal += productPrice;

        cartDisplay.innerHTML = `🛒 Cart (${cartCount})`;
        cartTotalDisplay.textContent = `₦${cartTotal.toLocaleString()}`;

        if (emptyCartMsg) emptyCartMsg.remove();

        const cartItemHTML = `
            <div class="cart-item">
                <img src="${productImgSrc}" alt="${productName}">
                <div class="cart-item-info">
                    <h4>${productName}</h4>
                    <p>${productPriceText}</p>
                </div>
            </div>
        `;
        cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);

        // Button feedback
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.backgroundColor = '#28a745';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '#FF6600';
            button.disabled = false;
        }, 1200);
    });
});

// Category Filtering
let activeCategory = null;

categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const categoryName = card.querySelector('h3').textContent.trim();

        if (activeCategory === categoryName) {
            // Click same category again → show all
            allProductCards.forEach(pc => pc.style.display = 'block');
            activeCategory = null;
            categoryCards.forEach(c => c.style.opacity = '0.8');
        } else {
            // Filter to this category
            allProductCards.forEach(productCard => {
                const productName = productCard.querySelector('h3').textContent;
                if (categoryMap[categoryName].includes(productName)) {
                    productCard.style.display = 'block';
                } else {
                    productCard.style.display = 'none';
                }
            });
            activeCategory = categoryName;
            categoryCards.forEach(c => c.style.opacity = '0.6');
            card.style.opacity = '1';
        }
    });
});

// View Cart Button - Checkout Alert
viewCartBtn.addEventListener('click', () => {
    if (cartCount === 0) {
        alert('Your cart is empty!');
        return;
    }

    alert(
        `Thank you for shopping at Bonta Supermarket!\n\n` +
        `Items in cart: ${cartCount}\n` +
        `Total Amount: ₦${cartTotal.toLocaleString()}\n\n` +
        `Choose your payment method:\n` +
        `• Bank Transfer\n` +
        `• Pay on Delivery (Cash)\n` +
        `• Card Payment\n` +
        `• USSD / Mobile Money\n\n` +
        `Contact us to complete your order:\n` +
        `Phone/WhatsApp: +234 913 899 9084\n` +
        `Email: support@bontasupermarket.com`
    );
});