(function () {
    function loadUsers() {
        let stored = localStorage.getItem('cabritoUsers');
        if (!stored) {
            return [];
        }

        try {
            const parsed = JSON.parse(stored);
            if (!Array.isArray(parsed)) {
                localStorage.removeItem('cabritoUsers');
                return [];
            }

            return parsed.filter(user => {
                return user && typeof user.username === 'string' && typeof user.password === 'string' && typeof user.role === 'string';
            });
        } catch (err) {
            localStorage.removeItem('cabritoUsers');
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem('cabritoUsers', JSON.stringify(users));
    }

    const defaultUsers = [
        { id: 1, name: 'user', username: 'user', password: 'user123', role: 'user' },
        { id: 2, name: 'Admin', username: 'admin', password: 'admin123', role: 'admin' }
    ];

    let users = loadUsers();
    const needsReset = !users.some(u => u.role === 'user' && u.username.toLowerCase() === 'user' && u.password === 'user123') || !users.some(u => u.role === 'admin' && u.username.toLowerCase() === 'admin');

    if (users.length === 0 || needsReset) {
        users = defaultUsers;
        saveUsers(users);
    }

    const loginForm = document.getElementById("login-form");
    const message = document.getElementById("auth-message");
    const params = new URLSearchParams(window.location.search);

    function showMessage(text, type) {
        if (message) {
            message.textContent = text;
            message.dataset.type = type;
        } else {
            console.warn('Auth message element not found:', text);
        }
    }

    function loginAccount(account) {
        localStorage.setItem("cabritoCurrentUser", JSON.stringify({
            name: account.name,
            username: account.username,
            role: account.role
        }));

        setTimeout(() => {
            if (account.role === "admin") {
                window.location.href = "Admin.html";
                return;
            }

            window.location.href = params.get("redirect") || "User.html";
        }, 400);
    }

    if (!loginForm) {
        console.error('Login form not found on page.');
        return;
    }

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const role = formData.get("role");
        const username = formData.get("username").trim().toLowerCase();
        const password = formData.get("password");

        const account = users.find(u => u.username.toLowerCase() === username && u.password === password && u.role === role);

        if (!account) {
            if (!users.some(u => u.role === role && u.username.toLowerCase() === username)) {
                console.warn('No matching user record found for', role, username);
            }
            showMessage(`Wrong ${role} username or password.`, "error");
            return;
        }

        showMessage(`${role === "admin" ? "Admin" : "User"} login successful.`, "success");
        loginAccount(account);
    });
})();
