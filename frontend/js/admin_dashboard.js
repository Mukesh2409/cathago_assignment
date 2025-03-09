document.addEventListener("DOMContentLoaded", async () => {
    try {
      
        const creditRequestsResponse = await fetch("/admin/pendingreq");
        const creditRequestsData = await creditRequestsResponse.json();
        if (!creditRequestsResponse.ok) {
            throw new Error(creditRequestsData.error || "Failed to fetch credit requests");
            console.log("inside not ok")
        }

    
        const creditRequestsTable = document.querySelector(".credit-requests-table tbody");
        creditRequestsTable.innerHTML = creditRequestsData
            .map(
                (request) => `
                <tr>
                    <td>${request.id}</td>
                    <td>${request.credits}</td>
                    <td>${request.status}</td>
                    <td>
                        <button class="approve-btn" data-request-id="${request.id}">Approve</button>
                        <button class="deny-btn" data-request-id="${request.id}">Deny</button>
                    </td>
                </tr>
            `
            )
            .join("");

       
        creditRequestsTable.querySelectorAll(".approve-btn").forEach((button) => {
            button.addEventListener("click", handleApproveDeny);
        });
        creditRequestsTable.querySelectorAll(".deny-btn").forEach((button) => {
            button.addEventListener("click", handleApproveDeny);
        });

     
        const analyticsResponse = await fetch("/admin/analytics");
        const analyticsData = await analyticsResponse.json();
        if (!analyticsResponse.ok) {
            throw new Error(analyticsData.error || "Failed to fetch analytics");
        }

    
        const analyticsSection = document.querySelector(".container h3 + p");
        analyticsSection.textContent = `
            Total Users: ${analyticsData.totalUsers} | 
            Total Scans: ${analyticsData.totalScans} | 
            Pending Credit Requests: ${analyticsData.pendingCreditRequests}
        `;
    } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
    }
});


async function handleApproveDeny(event) {
    const requestId = event.target.getAttribute("data-request-id");
    const action = event.target.classList.contains("approve-btn") ? "Approved" : "Rejected";

    try {
        const response = await fetch("/admin/credits/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestId, status: action }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(`Credit request ${action.toLowerCase()} successfully.`);
            location.reload(); 
        } else {
            alert(data.error || "Failed to process request.");
        }
    } catch (error) {
        alert("An error occurred. Please try again.");
    }
}   