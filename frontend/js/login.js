document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
          
            if (data.role === "admin") {
                window.location.href = "admin_dashboard.html"; 
            } else {
                window.location.href = "dashboard.html"; 
            }
        } else {
            document.getElementById("errorMessage").textContent = data.error || "Login failed";
        }
    } catch (error) {
        document.getElementById("errorMessage").textContent = "An error occurred. Please try again.";
    }
});