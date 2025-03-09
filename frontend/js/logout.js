document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/auth/logout", { method: "POST" });
        if (response.ok) {
            setTimeout(() => {
                window.location.href = "login.html"; 
            }, 3000);
        } else {
            alert("Failed to logout. Please try again.");
        }
    } catch (error) {
        alert("An error occurred. Please try again.");
    }
});