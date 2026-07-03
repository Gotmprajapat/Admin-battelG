firebase.auth().onAuthStateChanged(user => {
    if (!user) { window.location.href = 'admin-login.html'; return; }
    loadUsers();
});

async function loadUsers(searchTerm = '') {
    let query = db.collection("users").orderBy("createdAt", "desc");
    const snapshot = await query.get();
    
    const container = document.getElementById('usersTable');
    let users = [];
    snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
    
    if (searchTerm) {
        users = users.filter(u => 
            (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }
    
    if (users.length === 0) {
        container.innerHTML = '<p style="color:#666;padding:20px;">No users found</p>';
        return;
    }
    
    let html = '<table><tr><th>Name</th><th>Email</th><th>Wallet</th><th>Status</th><th>Action</th></tr>';
    users.forEach(u => {
        html += `<tr>
            <td>${u.name || 'N/A'}</td>
            <td>${u.email}</td>
            <td>₹${u.wallet || 0}</td>
            <td>${u.status || 'active'}</td>
            <td>
                <button class="btn ${u.status === 'banned' ? 'btn-approve' : 'btn-reject'}" 
                    onclick="toggleBan('${u.id}', '${u.status === 'banned' ? 'active' : 'banned'}')">
                    ${u.status === 'banned' ? 'Unban' : 'Ban'}
                </button>
            </td>
        </tr>`;
    });
    html += '</table>';
    container.innerHTML = html;
}

function searchUsers() {
    const term = document.getElementById('userSearch').value;
    loadUsers(term);
}

async function toggleBan(userId, newStatus) {
    await db.collection("users").doc(userId).update({ status: newStatus });
    loadUsers();
}

function logout() { firebase.auth().signOut().then(() => window.location.href = 'admin-login.html'); }
