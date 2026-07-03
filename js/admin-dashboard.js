firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) { window.location.href = 'admin-login.html'; return; }
    loadDashboardStats();
});

async function loadDashboardStats() {
    const usersSnapshot = await db.collection("users").get();
    document.getElementById('totalUsers').textContent = usersSnapshot.size;
    
    const today = getTodayDateString();
    let todayDeposits = 0, todayWithdrawals = 0, todayTournaments = 0;
    
    const depositsSnapshot = await db.collection("deposits")
        .where("status", "==", "approved").get();
    depositsSnapshot.forEach(doc => {
        const d = doc.data();
        if (d.timestamp && d.timestamp.toDate) {
            if (d.timestamp.toDate().toISOString().split('T')[0] === today) {
                todayDeposits += d.amount;
            }
        }
    });
    document.getElementById('todayDeposits').textContent = '₹' + todayDeposits;
    
    const withdrawalsSnapshot = await db.collection("withdrawals")
        .where("status", "==", "paid").get();
    withdrawalsSnapshot.forEach(doc => {
        const w = doc.data();
        if (w.timestamp && w.timestamp.toDate) {
            if (w.timestamp.toDate().toISOString().split('T')[0] === today) {
                todayWithdrawals += w.amount;
            }
        }
    });
    document.getElementById('todayWithdrawals').textContent = '₹' + todayWithdrawals;
    
    document.getElementById('todayTournaments').textContent = todayTournaments;
}

function getTodayDateString() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function logout() {
    firebase.auth().signOut().then(() => window.location.href = 'admin-login.html');
}
