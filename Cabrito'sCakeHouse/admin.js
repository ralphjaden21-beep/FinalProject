(function () {
    // Initialize data
    let users = JSON.parse(localStorage.getItem('cabritoUsers') || '[]');
    let products = JSON.parse(localStorage.getItem('cabritoProducts') || '[]');

    // Default users if none exist
    if (users.length === 0) {
        users = [
            { id: 1, name: 'user', username: 'user', password: 'user123', role: 'user' },
            { id: 2, name: 'Admin', username: 'admin', password: 'admin123', role: 'admin' }
        ];
        localStorage.setItem('cabritoUsers', JSON.stringify(users));
    }

    // Default products if none exist
    if (products.length === 0) {
        products = [
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
        localStorage.setItem('cabritoProducts', JSON.stringify(products));
    }

    // DOM elements
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.admin-section');
    const userTableBody = document.getElementById('user-table-body');
    const productTableBody = document.getElementById('product-table-body');
    const totalUsersEl = document.getElementById('total-users');
    const totalProductsEl = document.getElementById('total-products');

    // Modals
    const userModal = document.getElementById('user-modal');
    const productModal = document.getElementById('product-modal');
    const userForm = document.getElementById('user-form');
    const productForm = document.getElementById('product-form');

    // Buttons
    const addUserBtn = document.getElementById('add-user-btn');
    const addProductBtn = document.getElementById('add-product-btn');
    const cancelUserBtn = document.getElementById('cancel-user-btn');
    const cancelProductBtn = document.getElementById('cancel-product-btn');

    let editingUser = null;
    let editingProduct = null;

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.dataset.section;
            showSection(section);
        });
    });

    function showSection(sectionName) {
        sections.forEach(section => section.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));
        document.getElementById(sectionName).classList.add('active');
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    }

    // Load data
    function loadUsers() {
        userTableBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>
                    <button class="btn btn-primary" onclick="editUser(${user.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
        totalUsersEl.textContent = users.length;
    }

    function loadProducts() {
        productTableBody.innerHTML = '';
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                <td>${product.name}</td>
                <td>${product.description.substring(0, 50)}...</td>
                <td>PHP ${product.price}</td>
                <td>${product.category}</td>
                <td>
                    <button class="btn btn-primary" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            `;
            productTableBody.appendChild(row);
        });
        totalProductsEl.textContent = products.length;
    }

    // User management
    addUserBtn.addEventListener('click', () => {
        editingUser = null;
        document.getElementById('user-modal-title').textContent = 'Add New User';
        userForm.reset();
        userModal.classList.add('show');
    });

    cancelUserBtn.addEventListener('click', () => {
        userModal.classList.remove('show');
    });

    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(userForm);
        const userData = {
            name: document.getElementById('user-name').value,
            username: document.getElementById('user-username').value,
            password: document.getElementById('user-password').value,
            role: document.getElementById('user-role').value
        };

        if (editingUser) {
            // Update existing user
            const index = users.findIndex(u => u.id === editingUser.id);
            users[index] = { ...users[index], ...userData };
        } else {
            // Add new user
            const newId = Math.max(...users.map(u => u.id), 0) + 1;
            users.push({ id: newId, ...userData });
        }

        localStorage.setItem('cabritoUsers', JSON.stringify(users));
        loadUsers();
        userModal.classList.remove('show');
    });

    window.editUser = function(id) {
        editingUser = users.find(u => u.id === id);
        if (editingUser) {
            document.getElementById('user-modal-title').textContent = 'Edit User';
            document.getElementById('user-name').value = editingUser.name;
            document.getElementById('user-username').value = editingUser.username;
            document.getElementById('user-password').value = editingUser.password;
            document.getElementById('user-role').value = editingUser.role;
            userModal.classList.add('show');
        }
    };

    window.deleteUser = function(id) {
        if (confirm('Are you sure you want to delete this user?')) {
            users = users.filter(u => u.id !== id);
            localStorage.setItem('cabritoUsers', JSON.stringify(users));
            loadUsers();
        }
    };

    // Product management
    addProductBtn.addEventListener('click', () => {
        editingProduct = null;
        document.getElementById('product-modal-title').textContent = 'Add New Product';
        productForm.reset();
        productModal.classList.add('show');
    });

    cancelProductBtn.addEventListener('click', () => {
        productModal.classList.remove('show');
    });

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const productData = {
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            price: parseFloat(document.getElementById('product-price').value),
            image: document.getElementById('product-image').value,
            category: document.getElementById('product-category').value
        };

        if (editingProduct) {
            // Update existing product
            const index = products.findIndex(p => p.id === editingProduct.id);
            products[index] = { ...products[index], ...productData };
        } else {
            // Add new product
            const newId = Math.max(...products.map(p => p.id), 0) + 1;
            products.push({ id: newId, ...productData });
        }

        localStorage.setItem('cabritoProducts', JSON.stringify(products));
        loadProducts();
        productModal.classList.remove('show');
    });

    window.editProduct = function(id) {
        editingProduct = products.find(p => p.id === id);
        if (editingProduct) {
            document.getElementById('product-modal-title').textContent = 'Edit Product';
            document.getElementById('product-name').value = editingProduct.name;
            document.getElementById('product-description').value = editingProduct.description;
            document.getElementById('product-price').value = editingProduct.price;
            document.getElementById('product-image').value = editingProduct.image;
            document.getElementById('product-category').value = editingProduct.category;
            productModal.classList.add('show');
        }
    };

    window.deleteProduct = function(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id !== id);
            localStorage.setItem('cabritoProducts', JSON.stringify(products));
            loadProducts();
        }
    };

    // Initialize
    loadUsers();
    loadProducts();
})();
