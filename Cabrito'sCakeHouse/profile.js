(function () {
    const form = document.getElementById("profile-form");
    const message = document.getElementById("profile-message");

    function getSavedProfile() {
        try {
            return JSON.parse(localStorage.getItem("cabritoProfile") || "null");
        } catch (error) {
            localStorage.removeItem("cabritoProfile");
            return null;
        }
    }

    const savedProfile = getSavedProfile();

    if (savedProfile) {
        Object.entries(savedProfile).forEach(([key, value]) => {
            if (form.elements[key]) {
                form.elements[key].value = value;
            }
        });
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const profile = {
            name: formData.get("name").trim(),
            phone: formData.get("phone").trim(),
            email: formData.get("email").trim(),
            address: formData.get("address").trim(),
            city: formData.get("city").trim(),
            note: formData.get("note").trim()
        };

        localStorage.setItem("cabritoProfile", JSON.stringify(profile));
        message.textContent = "Profile saved successfully.";
    });
})();
