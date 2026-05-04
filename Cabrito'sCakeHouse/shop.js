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
})();
