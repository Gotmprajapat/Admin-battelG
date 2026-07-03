firebase.auth().onAuthStateChanged(async user => {
    if (!user) { window.location.href = 'admin-login.html'; return; }
    
    let totalDeposits = 0, totalWithdrawals = 0, totalFees = 0, totalPrizes = 0;
    
    const txnsSnapshot = await db.collection("transactions").get();
    txnsSnapshot.forEach(doc => {
        const t = doc.data();
        if (t.type === 'deposit') totalDeposits += t.amount;
        if (t.type === 'withdrawal') totalWithdrawals += t.amount;
        if (t.type === 'entry_fee') totalFees += t.amount;
        if (t.type === 'prize') totalPrizes += t.amount;
    });
    
    document.getElementById('rTotalDeposits').textContent = '₹' + totalDeposits;
    document.getElementById('rTotalWithdrawals').textContent = '₹' + totalWithdrawals;
    document.getElementById('rTotalFees').textContent = '₹' + totalFees;
    document.getElementById('rTotalPrizes').textContent = '₹' + totalPrizes;
});

function logout() { firebase.auth().signOut().then(() => window.location.href = 'admin-login.html'); }
