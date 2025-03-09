document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("document");
    const file = fileInput.files[0];

    if (!file) {
        document.getElementById("message").textContent = "Please select a file.";
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("/user/scan", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById("message").textContent = data.message || "Upload successful!";
        } else {
            document.getElementById("message").textContent = data.error || "Upload failed.";
        }
    } catch (error) {
        document.getElementById("message").textContent = "An error occurred. Please try again.";
    }
});