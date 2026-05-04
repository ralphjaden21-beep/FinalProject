(function () {
    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem("cabritoCurrentUser") || "null");
        } catch (error) {
            localStorage.removeItem("cabritoCurrentUser");
            return null;
        }
    }

    const user = getCurrentUser();
    const loginLinks = document.querySelectorAll(".login-btn");

    loginLinks.forEach((link) => {
        if (!user) {
            link.textContent = "Login";
            link.href = "Login.html";
            return;
        }

        link.textContent = user.role === "admin" ? "Admin" : `Hi, ${user.name.split(" ")[0]}`;
        link.href = user.role === "admin" ? "Admin.html" : "User.html";
    });
})();
