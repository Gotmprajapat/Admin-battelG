let currentFilter = 'pending';

firebase.auth().onAuthStateChanged(user => {
    if (!user) { window.location.href = 'admin-login.html'; return; }
    loadDeposits();
});

function filterDeposits(filter) {
    currentFilter = filter;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    loadDeposits();
}

async function loadDeposits() {
    const snapshot = await db.collection("deposits")
        .where("status", "==", currentFilter)
        .orderBy("timestamp", "desc")
        .get();
    
    const container = document.getElementById('depositsTable');
    
    if (snapshot.empty) {
        container.innerHTML = '<p style="color:#666;padding:20px;">No deposits found</p>';
        return;
    }
    
    let html = '<table><tr><th>User</th><th>Amount</th><th>UTR</th><th>Date</th><th>Action</th></tr>';
    snapshot.forEach(doc => {
        const d = doc.data();
        html += `<tr>
            <td>${d.userEmail}</td>
            <td>₹${d.amount}</td>
            <td>${d.utr}</td>
            <td>${formatDate(d.timestamp)}</td>
            <td>${currentFilter === 'pending' ? 
                `<button class="btn btn-approve" onclick="approveDeposit('${doc.id}',${d.amount},'${d.userId}')">Approve</button>
                 <button class="btn btn-reject" onclick="rejectDeposit('${doc.id}')">Reject</button>` : 
                d.status}</td>
        </tr>`;
    });
    html += '</table>';
    container.innerHTML = html;
}

async function approveDeposit(docId, amount, userId) {
    await db.collection("deposits").doc(docId).update({ status: 'approved' });
    await db.collection("users").doc(userId).update({
        wallet: firebase.firestore.FieldValue.increment(amount)
    });
    await db.collection("transactions").add({
        userId, type: 'deposit', amount,
        description: 'Deposit Approved',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    await db.collection("notifications").add({
        userId, title: 'Deposit Approved',
        message: `Your deposit of ₹${amount} has been approved`,
        read: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    loadDeposits();
}

async function rejectDeposit(docId) {
    await db.collection("deposits").doc(docId).update({ status: 'rejected' });
    loadDeposits();
}

function formatDate(ts) {
    return ts ? ts.toDate().toLocaleString('en-IN') : '';
}

function logout() {
    firebase.auth().signOut().then(() => window.location.href = 'admin-login.html');
}
