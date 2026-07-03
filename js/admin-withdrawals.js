let currentFilter = 'pending';

firebase.auth().onAuthStateChanged(user => {
    if (!user) { window.location.href = 'admin-login.html'; return; }
    loadWithdrawals();
});

function filterWithdrawals(filter) {
    currentFilter = filter;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    loadWithdrawals();
}

async function loadWithdrawals() {
    const snapshot = await db.collection("withdrawals")
        .where("status", "==", currentFilter)
        .orderBy("timestamp", "desc")
        .get();
    
    const container = document.getElementById('withdrawalsTable');
    if (snapshot.empty) {
        container.innerHTML = '<p style="color:#666;padding:20px;">No withdrawals found</p>';
        return;
    }
    
    let html = '<table><tr><th>User</th><th>Amount</th><th>UPI</th><th>Date</th><th>Action</th></tr>';
    snapshot.forEach(doc => {
        const w = doc.data();
        html += `<tr>
            <td>${w.userEmail}</td>
            <td>₹${w.amount}</td>
            <td>${w.upiId}</td>
            <td>${formatDate(w.timestamp)}</td>
            <td>${currentFilter === 'pending' ? 
                `<button class="btn btn-paid" onclick="markPaid('${doc.id}','${w.userId}',${w.amount})">Mark Paid</button>
                 <button class="btn btn-reject" onclick="rejectWithdrawal('${doc.id}')">Reject</button>` : 
                w.status}</td>
        </tr>`;
    });
    html += '</table>';
    container.innerHTML = html;
}

async function markPaid(docId, userId, amount) {
    await db.collection("withdrawals").doc(docId).update({ status: 'paid' });
    await db.collection("notifications").add({
        userId, title: 'Withdrawal Paid',
        message: `Your withdrawal of ₹${amount} has been processed`,
        read: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    loadWithdrawals();
}

async function rejectWithdrawal(docId) {
    await db.collection("withdrawals").doc(docId).update({ status: 'rejected' });
    loadWithdrawals();
}

function formatDate(ts) { return ts ? ts.toDate().toLocaleString('en-IN') : ''; }
function logout() { firebase.auth().signOut().then(() => window.location.href = 'admin-login.html'); }
