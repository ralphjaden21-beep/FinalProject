(function () {
    const historyList = document.getElementById("history-list");

    function getOrders() {
        try {
            const stored = JSON.parse(localStorage.getItem("cabritoOrders") || "[]");
            if (!Array.isArray(stored)) {
                localStorage.removeItem("cabritoOrders");
                return [];
            }

            let changed = false;
            const normalized = stored.map((order) => {
                if (!order || typeof order !== 'object') {
                    return null;
                }
                if (!order.id) {
                    changed = true;
                    return { ...order, id: Date.now() + Math.random() };
                }
                return order;
            }).filter(Boolean);

            if (changed) {
                saveOrders(normalized);
            }

            return normalized;
        } catch (error) {
            localStorage.removeItem("cabritoOrders");
            return [];
        }
    }

    function saveOrders(orders) {
        localStorage.setItem("cabritoOrders", JSON.stringify(orders));
    }

    function escapeHtml(value) {
        return String(value || "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function renderOrders() {
        const orders = getOrders();

        if (!orders.length) {
            historyList.innerHTML = `
                <article class="history-card">
                    <div>
                        <h2>No orders yet</h2>
                        <p>Your completed orders will show here after you place one.</p>
                    </div>
                    <div class="history-meta">
                        <a href="Shop.html">Start ordering</a>
                    </div>
                </article>
            `;
            return;
        }

        historyList.innerHTML = orders.map((order) => {
            const statusLabel = escapeHtml(order.status || "Pending");
            const isCancellable = statusLabel.toLowerCase() === "pending";
            return `
                <article class="history-card">
                    <div>
                        <div class="order-status ${statusLabel.toLowerCase()}">${statusLabel}</div>
                        <h2>${escapeHtml(order.product)}</h2>
                        <p>${escapeHtml(order.size)} size, ${Number(order.quantity) || 1} item(s)</p>
                        <p>Needed on: ${escapeHtml(order.date || "Not specified")}</p>
                        <p>${escapeHtml(order.instructions || "No special instructions")}</p>
                    </div>
                    <div class="history-meta">
                        <strong>PHP ${Number(order.total).toLocaleString()}</strong>
                        <span>${escapeHtml(order.orderedAt)}</span>
                        ${isCancellable ? `<button class="cancel-order" data-id="${order.id}">Cancel order</button>` : ''}
                    </div>
                </article>
            `;
        }).join("");

        document.querySelectorAll('.cancel-order').forEach((button) => {
            button.addEventListener('click', () => {
                const orderId = Number(button.dataset.id);
                if (!confirm('Cancel this order?')) {
                    return;
                }
                const currentOrders = getOrders();
                const updatedOrders = currentOrders.filter((order) => Number(order.id) !== orderId);
                saveOrders(updatedOrders);
                renderOrders();
            });
        });
    }

    renderOrders();
})();
