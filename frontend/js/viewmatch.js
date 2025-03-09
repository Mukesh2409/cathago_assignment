document.addEventListener("DOMContentLoaded", async () => {
    const scanId = sessionStorage.getItem("scanId");

    if (!scanId) {
        alert("Invalid Scan ID");
        window.location.href = "scans.html"; 
        return;
    }

    try {
        const response = await fetch(`user/matches/${scanId}`, {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch matches");
        }

        const documentsContainer = document.getElementById("documentsContainer");

        if (data.similarDocs.length === 0) {
            documentsContainer.innerHTML = `<p class="no-matches">No similar documents found.</p>`;
            return;
        }

        documentsContainer.innerHTML = data.similarDocs
            .map(
                (match, index) => `
                <div class="document-card">
                    <h3>Doc ID: ${match.id || `Match-${index + 1}`}</h3>
                    <p><strong>Matched Document:</strong> ${match.fileName}</p>
                    <p><strong>Similarity Score:</strong> ${(match.similarity * 100).toFixed(2)}%</p>
                    <button onclick="viewContent('${match.id}')">View Content</button>

                </div>
            `
            )
            .join("");

    } catch (error) {
        console.error(error);
        alert("An error occurred while fetching matches. Please try again.");
    }
});


function viewContent(docId) {
    if (!docId) {
        alert("Invalid document ID.");
        return;
    }
    
    window.location.href = `document_view.html?docId=${docId}`;
}

function goBack() {
    window.history.back();
}
   