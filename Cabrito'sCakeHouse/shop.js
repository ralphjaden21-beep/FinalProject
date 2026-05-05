(function () {
    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem("cabritoCurrentUser") || "null");
        } catch (error) {
            localStorage.removeItem("cabritoCurrentUser");
            return null;
        }
    }

    function loadProductsFromStorage() {
        const stored = localStorage.getItem('cabritoProducts');
        if (!stored) {
            return [];
        }

        try {
            return JSON.parse(stored) || [];
        } catch (error) {
            localStorage.removeItem('cabritoProducts');
            return [];
        }
    }

    function saveProducts(products) {
        localStorage.setItem('cabritoProducts', JSON.stringify(products));
    }

    const defaultProducts = [
        { id: 1, name: 'Black Forest Cake', description: 'Chocolate sponge, whipped cream, and tart cherries in every slice.', price: 850, image: 'blackforrest.jpeg', category: 'cake' },
        { id: 2, name: 'Coffee and Walnut Cake', description: 'Espresso sponge with walnuts and smooth buttercream.', price: 780, image: 'cake2.jpeg', category: 'cake' },
        { id: 3, name: 'Red Velvet Cake', description: 'Moist red velvet layers covered with cream cheese frosting and coconut flakes.', price: 900, image: 'cake3.jpeg', category: 'cake' },
        { id: 4, name: 'Classic Chocolate Cake', description: 'Rich chocolate cake topped with smooth frosting and chocolate shavings.', price: 820, image: 'cake4.jpeg', category: 'cake' },
        { id: 5, name: 'Cherry Cake', description: 'Light sponge layered with cherry filling and sweet cream.', price: 760, image: 'cherrycake.jpeg', category: 'cake' },
        { id: 6, name: 'Chocolate Celebration Cake', description: 'A party-ready chocolate cake with a smooth, glossy finish.', price: 950, image: 'Chocolatecake.jpeg', category: 'cake' },
        { id: 7, name: 'Red Velvet Walnut Cake', description: 'Layered red velvet cake with cream cheese frosting and crunchy walnuts.', price: 950, image: 'carousel2.jpeg', category: 'cake' },
        { id: 8, name: 'Iced Tea', description: 'Refreshing chilled tea served with lemon and mint for a light, sweet finish.', price: 120, image: 'iced tea.jpeg', category: 'drink' },
        { id: 9, name: 'Coca-Cola', description: 'Cold and fizzy classic soda to pair perfectly with your cake.', price: 90, image: 'coke.jpeg', category: 'drink' },
        { id: 10, name: 'Pineapple Cooler', description: 'Sweet pineapple drink with fresh tropical flavor.', price: 110, image: 'pineapple.jpeg', category: 'drink' }
    ];

    const currentUser = getCurrentUser();

    function orderUrl(productName, price) {
        const product = encodeURIComponent(productName || "Custom Order");
        const productPrice = encodeURIComponent(price || "0");
        return `Order.html?product=${product}&price=${productPrice}`;
    }

    function goToLogin(productName, price) {
        const redirect = encodeURIComponent(orderUrl(productName, price));
        const item = encodeURIComponent(productName || "Order");
        window.location.href = `Login.html?redirect=${redirect}&item=${item}`;
    }

    function handleOrder(productName, price) {
        if (!currentUser) {
            goToLogin(productName, price);
            return;
        }

        if (currentUser.role === "admin") {
            alert("Admin accounts manage the shop from the admin dashboard.");
            window.location.href = "Admin.html";
            return;
        }

        window.location.href = orderUrl(productName, price);
    }

    function openCustomizeModal(productName, basePrice) {
        if (!currentUser) {
            goToLogin(productName, basePrice);
            return;
        }

        if (currentUser.role === "admin") {
            alert("Admin accounts manage the shop from the admin dashboard.");
            window.location.href = "Admin.html";
            return;
        }

        const modal = document.getElementById('customize-modal');
        document.getElementById('cake-name').value = productName;
        document.getElementById('base-price').textContent = `PHP ${basePrice}`;
        
        // Reset form
        document.getElementById('customize-form').reset();
        document.getElementById('frosting-flavor').value = 'original';
        document.getElementById('filling-flavor').value = 'original';
        document.getElementById('decorations').value = 'basic';
        document.getElementById('cake-size').value = 'medium';
        document.getElementById('message').value = '';
        
        // Store base price for calculation
        modal.dataset.basePrice = basePrice;
        modal.dataset.productName = productName;
        
        updateCustomizationTotal();
        modal.style.display = 'block';
    }

    function updateCustomizationTotal() {
        const modal = document.getElementById('customize-modal');
        const basePrice = parseInt(modal.dataset.basePrice) || 0;
        
        let customCharge = 0;
        
        // Frosting charge
        const frostingValue = document.getElementById('frosting-flavor').value;
        if (frostingValue && frostingValue !== 'original') {
            customCharge += 100;
        }
        
        // Filling charge
        const fillingValue = document.getElementById('filling-flavor').value;
        if (fillingValue && fillingValue !== 'original') {
            customCharge += 80;
        }
        
        // Decorations charge
        const decorValue = document.getElementById('decorations').value;
        if (decorValue && decorValue !== 'basic') {
            customCharge += 150;
        }
        
        // Message charge
        const message = document.getElementById('message').value;
        if (message && message.trim()) {
            customCharge += 50;
        }
        
        // Size charge
        const sizeValue = document.getElementById('cake-size').value;
        if (sizeValue === 'small') {
            customCharge += 100;
        } else if (sizeValue === 'large') {
            customCharge += 200;
        }
        
        const total = basePrice + customCharge;
        document.getElementById('custom-charge').textContent = `PHP ${customCharge}`;
        document.getElementById('custom-total').textContent = `PHP ${total}`;
    }

    function loadProducts() {
        let products = loadProductsFromStorage();
        if (products.length === 0) {
            products = defaultProducts;
            saveProducts(products);
        }

        const drinkProducts = defaultProducts.filter(p => p.category === 'drink');
        const hasDrink = products.some(p => p.category === 'drink');
        if (!hasDrink) {
            drinkProducts.forEach((drink) => {
                if (!products.some(p => p.name === drink.name)) {
                    products.push(drink);
                }
            });
            saveProducts(products);
        }

        const cakesGrid = document.getElementById('cakes-grid');
        const drinksGrid = document.getElementById('drinks-grid');

        if (!cakesGrid || !drinksGrid) return;

        cakesGrid.innerHTML = '';
        drinksGrid.innerHTML = '';

        products.forEach(product => {
            const card = document.createElement('article');
            card.className = 'shop-card';
            
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="shop-card-body">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="shop-card-footer">
                        <span>PHP ${product.price}</span>
                        <button type="button" class="order-btn" data-product="${product.name}" data-price="${product.price}">Order</button>
                    </div>
                </div>
            `;

            if (product.category === 'cake') {
                cakesGrid.appendChild(card);
            } else if (product.category === 'drink') {
                drinksGrid.appendChild(card);
            }
        });

        const orderButtons = document.querySelectorAll(".order-btn");
        orderButtons.forEach((button) => {
            button.addEventListener("click", () => {
                handleOrder(button.dataset.product, button.dataset.price);
            });
        });
    }

    loadProducts();

    // Modal event listeners
    const customizeModal = document.getElementById('customize-modal');
    const customizeForm = document.getElementById('customize-form');
    const customizeCloseBtn = document.getElementById('customize-close');
    const customizeCancelBtn = document.getElementById('customize-cancel');
    const customOrderBtn = document.getElementById('custom-order-btn');

    // Handle Custom Order button
    if (customOrderBtn) {
        customOrderBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCustomizeModal('Custom Cake', 780); // Default base price
        });
    }

    // Close modal
    function closeCustomizeModal() {
        customizeModal.style.display = 'none';
    }

    customizeCloseBtn.addEventListener('click', closeCustomizeModal);
    customizeCancelBtn.addEventListener('click', closeCustomizeModal);

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === customizeModal) {
            closeCustomizeModal();
        }
    });

    // Update total when customization options change
    document.getElementById('frosting-flavor').addEventListener('change', updateCustomizationTotal);
    document.getElementById('filling-flavor').addEventListener('change', updateCustomizationTotal);
    document.getElementById('decorations').addEventListener('change', updateCustomizationTotal);
    document.getElementById('cake-size').addEventListener('change', updateCustomizationTotal);
    document.getElementById('message').addEventListener('input', updateCustomizationTotal);

    // Handle form submission
    customizeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const productName = document.getElementById('cake-name').value;
        const basePrice = parseInt(customizeModal.dataset.basePrice);
        const frosting = document.getElementById('frosting-flavor').value;
        const filling = document.getElementById('filling-flavor').value;
        const decorations = document.getElementById('decorations').value;
        const message = document.getElementById('message').value;
        const size = document.getElementById('cake-size').value;
        
        let customCharge = 0;
        if (frosting && frosting !== 'original') customCharge += 100;
        if (filling && filling !== 'original') customCharge += 80;
        if (decorations && decorations !== 'basic') customCharge += 150;
        if (message && message.trim()) customCharge += 50;
        if (size === 'small') customCharge += 100;
        else if (size === 'large') customCharge += 200;
        
        const totalPrice = basePrice + customCharge;
        
        // Create customization details string
        const customizationDetails = [
            `Frosting: ${frosting}`,
            `Filling: ${filling}`,
            `Decorations: ${decorations}`,
            `Size: ${size}`,
            message ? `Message: "${message}"` : '',
            `Customization Charge: +PHP ${customCharge}`
        ].filter(d => d).join(' | ');
        
        const productNameWithCustom = `${productName} (Customized)`;
        const redirect = encodeURIComponent(`Order.html?product=${encodeURIComponent(productNameWithCustom)}&price=${totalPrice}&customization=${encodeURIComponent(customizationDetails)}`);
        
        if (!currentUser) {
            const item = encodeURIComponent(productNameWithCustom);
            window.location.href = `Login.html?redirect=${redirect}&item=${item}`;
            return;
        }
        
        window.location.href = `Order.html?product=${encodeURIComponent(productNameWithCustom)}&price=${totalPrice}&customization=${encodeURIComponent(customizationDetails)}`;
    });
})();
