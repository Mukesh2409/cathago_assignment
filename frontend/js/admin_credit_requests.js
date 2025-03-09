document.addEventListener("DOMContentLoaded", async () => {
    try {
  
        const response = await fetch("/admin/creditAnalytics");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch credit requests");
   
       
        const tableBody = document.getElementById("creditRequestsTable");
        tableBody.innerHTML = data
            .map(
                (request) => `
                <tr>
                    <td>${request.id}</td>
                    <td>${request.userId}</td>
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

