document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("dark-mode-toggle");

    toggleButton.addEventListener("click", async () => {
        const response = await fetch("/toggle-dark-mode");
        const data = await response.json();

        if (data.darkMode) {
            document.body.classList.add("dark-mode");
            toggleButton.textContent = "Light Mode";
        } else {
            document.body.classList.remove("dark-mode");
            toggleButton.textContent = "Dark Mode";
        }
    });
});
