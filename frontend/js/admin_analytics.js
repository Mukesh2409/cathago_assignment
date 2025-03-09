document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/admin/analytics");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch analytics");

        const analyticsCards = document.querySelectorAll(".analytics-card p");
        analyticsCards[0].textContent = data.totalUsers;
        analyticsCards[1].textContent = data.totalCreditsApproved;
        analyticsCards[2].textContent = data.totalScans;

        const activityResponse = await fetch("/admin/useractivity");
        const activityData = await activityResponse.json();
        if (!activityResponse.ok) throw new Error(activityData.error || "Failed to fetch activity");

        const activityTable = document.querySelector(".analytics-table tbody");
        activityTable.innerHTML = activityData
            .map(activity => `
                <tr>
                    <td>${activity.userId}</td>
                    <td>${activity.action}</td>
                    <td>${new Date(activity.date).toLocaleDateString()}</td>
                </tr>
            `)
            .join("");
    } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
    }
});
