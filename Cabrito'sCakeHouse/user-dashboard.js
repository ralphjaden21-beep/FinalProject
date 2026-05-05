(function () {
    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem("cabritoCurrentUser") || "null");
        } catch (error) {
            localStorage.removeItem("cabritoCurrentUser");
            return null;
        }
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name;
    }

    // Mock data for demonstration
    // In a real app, this would come from a backend
    const mockStats = {
        totalOrders: 5,
        pendingOrders: 1,
        favoriteCake: 'Black Forest Cake'
    };

    document.getElementById('total-orders').textContent = mockStats.totalOrders;
    document.getElementById('pending-orders').textContent = mockStats.pendingOrders;
    document.getElementById('favorite-cake').textContent = mockStats.favoriteCake;

    // Mock recent orders
    const recentOrders = [
        { id: 1, product: 'Black Forest Cake', date: '2024-05-01', status: 'completed' },
        { id: 2, product: 'Iced Tea', date: '2024-04-28', status: 'completed' },
        { id: 3, product: 'Red Velvet Cake', date: '2024-04-25', status: 'pending' }
    ];

    const orderList = document.getElementById('recent-orders-list');
    if (recentOrders.length > 0) {
        orderList.innerHTML = recentOrders.map(order => `
            <div class="order-item">
                <div class="order-info">
                    <h4>${order.product}</h4>
                    <p>Ordered on ${new Date(order.date).toLocaleDateString()}</p>
                </div>
                <span class="order-status status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </div>
        `).join('');
    }
})();