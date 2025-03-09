document.addEventListener("DOMContentLoaded", fetchUsers);

async function fetchUsers() {
    try {
        const response = await fetch("/admin/users");
        const users = await response.json();
        const usersTableBody = document.getElementById("usersTableBody");
        usersTableBody.innerHTML = "";

        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>${user.credits}</td>
                <td>
                    <button onclick="openCreditModal('${user.id}', ${user.credits})">Edit Credits</button>
                    <button onclick="deleteUser('${user.id}')">Delete</button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

document.getElementById("addUserForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/admin/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, username, password })
        });

        if (response.ok) {
            alert("User added successfully!");
            fetchUsers();
            this.reset();
        } else {
            alert("Failed to add user");
        }
    } catch (error) {
        console.error("Error adding user:", error);
    }
});

async function updateCredits(userId) {
    const newCredits = document.getElementById("credits").value;

    try {
        const response = await fetch(`/admin/${userId}/credits`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credits: newCredits })
        });

        if (response.ok) {
            alert("Credits updated successfully!");
            fetchUsers();
            closeModal();
        } else {
            alert("Failed to update credits");
        }
    } catch (error) {
        console.error("Error updating credits:", error);
    }
}

function openCreditModal(userId, currentCredits) {
    document.getElementById("creditModal").style.display = "block";
    document.getElementById("credits").value = currentCredits;

    document.getElementById("creditForm").onsubmit = function (event) {
        event.preventDefault();
        updateCredits(userId);
    };
}

function closeModal() {
    document.getElementById("creditModal").style.display = "none";
}

document.querySelector(".close").addEventListener("click", closeModal);

async function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
        const response = await fetch(`/admin/${userId}`, { method: "DELETE" });

        if (response.ok) {
            alert("User deleted successfully!");
            fetchUsers();
        } else {
            alert("Failed to delete user");
        }
    } catch (error) {
        console.error("Error deleting user:", error);
    }
}
