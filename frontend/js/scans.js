document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/user/scans", {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", 
        });
  
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch past scans");
        }

        const scansTableBody = document.getElementById("scansTableBody");
        scansTableBody.innerHTML = data
            .map(
                (scan) => `
                <tr>
                    <td>${scan.id}</td>
                    <td>${scan.fileName}</td>
                    <td>${new Date(scan.date).toLocaleDateString()}</td>
                    <td><button onclick="viewMatches(${scan.id})">View Matches</button></td>
                </tr>
            `
            )
            .join("");
    } catch (error) {
        console.error(error);
        alert("An error occurred while fetching past scans. Please try again.");
    }
});

async function viewMatches(id) { 
    sessionStorage.setItem("scanId", id); 
    window.location.href = "viewmatch.html"; 
  
    
}

document.getElementById("logout").addEventListener("click", async () => {
    try {
        const response = await fetch("/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", 
        });

        const data = await response.json();
        if (response.ok) {
            window.location.href = "login.html"; 
        } else {
            throw new Error(data.error || "Logout failed");
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred during logout. Please try again.");
    }
});