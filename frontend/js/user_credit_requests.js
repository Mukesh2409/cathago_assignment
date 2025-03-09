document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/user/credits/report");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch credit requests");
 
        const tableBody = document.getElementById("requestHistory");
        tableBody.innerHTML = data
            .map(
                (request) => `
                <tr>
                    <td>${request.id}</td>
                    <td>${request.credits}</td>
                    <td>${request.status}</td>
                </tr>
               `  
            )
            .join("");
    } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
    }
});

document.getElementById("creditRequestForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const credits = document.getElementById("credits").value;

    try {
        const response = await fetch("user/credits/request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credits }),
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById("requestStatus").textContent = data.message || "Credit request submitted.";
            alert('Your Request Submitted')
            location.reload(); 
            document.getElementById("requestStatus").textContent = data.error || "Failed to submit request.";
        }
    } catch (error) {
        document.getElementById("requestStatus").textContent = "An error occurred. Please try again.";
    }
});