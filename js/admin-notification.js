firebase.auth().onAuthStateChanged(user => {
    if (!user) { window.location.href = 'admin-login.html'; return; }
});

async function sendNotification() {
    const target = document.getElementById('targetType').value;
    const userId = document.getElementById('targetUserId').value.trim();
    const title = document.getElementById('notifTitle').value.trim();
    const message = document.getElementById('notifMessage').value.trim();
    
    if (!title || !message) { alert('Enter title and message'); return; }
    
    if (target === 'all') {
        const usersSnapshot = await db.collection("users").get();
        const batch = db.batch();
        usersSnapshot.forEach(doc => {
            const ref = db.collection("notifications").doc();
            batch.set(ref, {
                userId: doc.id, title, message,
                read: false,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
        await batch.commit();
        alert('Notification sent to all users!');
    } else {
        if (!userId) { alert('Enter user ID'); return; }
        await db.collection("notifications").add({
            userId, title, message,
            read: false,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert('Notification sent!');
    }
}

function logout() { firebase.auth().signOut().then(() => window.location.href = 'admin-login.html'); }
