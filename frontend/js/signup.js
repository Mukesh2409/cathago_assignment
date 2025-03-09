document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const name = document.getElementById('name').value
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    console.log(username, name, password)

    if (password !== confirmPassword) {
        document.getElementById("signupErrorMessage").textContent = "Passwords do not match.";
        return;
    }

    try {
        const response = await fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, name }),
        });

        const data = await response.json();
        if (response.ok) {
            window.location.href = "login.html"; 
        } else {
            document.getElementById("signupErrorMessage").textContent = data.error || "Signup failed";
        }
    } catch (error) {
        document.getElementById("signupErrorMessage").textContent = "An error occurred. Please try again.";
    }
});