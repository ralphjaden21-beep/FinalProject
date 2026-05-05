(function () {
    document.querySelectorAll(".logout-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("cabritoCurrentUser");
            window.location.href = "Login.html";
        });
    });
})();
