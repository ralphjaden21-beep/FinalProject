(function () {
    const requiredRole = document.body.dataset.requiredRole;

    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem("cabritoCurrentUser") || "null");
        } catch (error) {
            localStorage.removeItem("cabritoCurrentUser");
            return null;
        }
    }

    const user = getCurrentUser();

    if (!requiredRole) {
        return;
    }

    if (!user || user.role !== requiredRole) {
        window.location.href = "Login.html";
    }
})();
