firebase.auth().onAuthStateChanged(user => {
    if (!user) { window.location.href = 'admin-login.html'; return; }
    loadPromos();
});

async function createPromo() {
    const code = document.getElementById('promoCodeInput').value.trim();
    const reward = parseInt(document.getElementById('promoReward').value);
    const maxUses = parseInt(document.getElementById('promoMaxUses').value);
    
    if (!code || !reward) { alert('Fill all fields'); return; }
    
    await db.collection("promo_codes").add({
        code, reward, maxUses: maxUses || 0,
        enabled: true, usedCount: 0, usedBy: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    alert('Promo code created!');
    document.getElementById('promoCodeInput').value = '';
    document.getElementById('promoReward').value = '';
    document.getElementById('promoMaxUses').value = '';
    loadPromos();
}

async function loadPromos() {
    const snapshot = await db.collection("promo_codes").orderBy("createdAt", "desc").get();
    const container = document.getElementById('promoList');
    
    if (snapshot.empty) {
        container.innerHTML = '<p style="color:#666;">No promo codes</p>';
        return;
    }
    
    let html = '<table><tr><th>Code</th><th>Reward</th><th>Used</th><th>Max</th><th>Status</th><th>Action</th></tr>';
    snapshot.forEach(doc => {
        const p = doc.data();
        html += `<tr>
            <td>${p.code}</td><td>₹${p.reward}</td><td>${p.usedCount}</td>
            <td>${p.maxUses || '∞'}</td><td>${p.enabled ? 'Active' : 'Disabled'}</td>
            <td>
                <button class="btn ${p.enabled ? 'btn-reject' : 'btn-approve'}" 
                    onclick="togglePromo('${doc.id}',${!p.enabled})">${p.enabled ? 'Disable' : 'Enable'}</button>
                <button class="btn btn-reject" onclick="deletePromo('${doc.id}')">Delete</button>
            </td>
        </tr>`;
    });
    html += '</table>';
    container.innerHTML = html;
}

async function togglePromo(id, enable) {
    await db.collection("promo_codes").doc(id).update({ enabled: enable });
    loadPromos();
}

async function deletePromo(id) {
    await db.collection("promo_codes").doc(id).delete();
    loadPromos();
}

function logout() { firebase.auth().signOut().then(() => window.location.href = 'admin-login.html'); }
