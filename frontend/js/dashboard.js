document.addEventListener("DOMContentLoaded", async () => {
    try {
       
     
        const profileResponse = await fetch("/user/profile");
        const profileData = await profileResponse.json();
        if (!profileResponse.ok) throw new Error(profileData.error || "Failed to fetch profile");

        
        document.querySelector("header h1").textContent = `Welcome, ${profileData.name}`;
     

      
        const scansResponse = await fetch("/user/scans");
        const scansData = await scansResponse.json();
        if (!scansResponse.ok) throw new Error(scansData.error || "Failed to fetch scans");

        
        const scansTable = document.querySelector("table tbody");
        scansTable.innerHTML = scansData
            .map(
                (scan) => `
                <tr>
                    <td>${scan.fileName}</td>
                    <td>${new Date(scan.date).toLocaleDateString()}</td>
                    <td>${scan.matchCount}</td>
                </tr>
            `
            )
            .join("");
    } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
    }
});