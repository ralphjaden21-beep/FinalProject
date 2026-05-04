(function () {
    const params = new URLSearchParams(window.location.search);
    const product = params.get("product") || "Custom Order";
    const basePrice = Number(params.get("price") || 0);
    const form = document.getElementById("order-form");
    const productTitle = document.getElementById("order-product");
    const priceText = document.getElementById("order-price");
    const totalText = document.getElementById("order-total");
    const dateInput = form.elements.date;

    const sizeMultiplier = {
        Small: 1,
        Medium: 1.25,
        Large: 1.5
    };

    function peso(amount) {
        return `PHP ${Math.round(amount).toLocaleString()}`;
    }

    function calculateTotal() {
        const formData = new FormData(form);
        const size = formData.get("size");
        const quantity = Number(formData.get("quantity") || 1);
        return basePrice * sizeMultiplier[size] * quantity;
    }

    function updateTotal() {
        totalText.textContent = peso(calculateTotal());
    }

    function getOrders() {
        try {
            return JSON.parse(localStorage.getItem("cabritoOrders") || "[]");
        } catch (error) {
            localStorage.removeItem("cabritoOrders");
            return [];
        }
    }

    productTitle.textContent = product;
    priceText.textContent = basePrice ? `Base price: ${peso(basePrice)}` : "Price will be confirmed for custom orders.";
    dateInput.min = new Date().toISOString().split("T")[0];
    updateTotal();

    form.addEventListener("input", updateTotal);
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const orders = getOrders();
        const order = {
            id: Date.now(),
            product,
            basePrice,
            size: formData.get("size"),
            quantity: Number(formData.get("quantity")),
            date: formData.get("date"),
            instructions: formData.get("instructions").trim(),
            total: Math.round(calculateTotal()),
            orderedAt: new Date().toLocaleString(),
            status: "Pending"
        };

        orders.unshift(order);
        localStorage.setItem("cabritoOrders", JSON.stringify(orders));
        window.location.href = "PurchaseHistory.html";
    });
})();
