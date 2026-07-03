const ADMIN_EMAILS = ['admin@battleg.com'];

document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    if (!ADMIN_EMAILS.includes(email)) {
        alert('Unauthorized access');
        return;
    }
    
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        window.location.href = 'admin-dashboard.html';
    } catch (error) {
        alert(error.message);
    }
});
