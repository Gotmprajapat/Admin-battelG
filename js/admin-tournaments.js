firebase.auth().onAuthStateChanged(user => {
    if (!user) { window.location.href = 'admin-login.html'; return; }
    loadTournaments();
});

async function createTournament() {
    const game = document.getElementById('tGame').value;
    const entry = parseInt(document.getElementById('tEntry').value);
    const prize = parseInt(document.getElementById('tPrize').value);
    const maxPlayers = parseInt(document.getElementById('tMaxPlayers').value);
    const startTime = new Date(document.getElementById('tStartTime').value);
    
    if (!entry || !prize || !maxPlayers || isNaN(startTime.getTime())) {
        alert('Fill all fields'); return;
    }
    
    await db.collection("tournaments").add({
        game, entryFee: entry, prizePool: prize,
        maxPlayers, playersJoined: 0,
        startTime: firebase.firestore.Timestamp.fromDate(startTime),
        status: 'upcoming',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    alert('Tournament created!');
    loadTournaments();
}

async function loadTournaments() {
    const snapshot = await db.collection("tournaments").orderBy("createdAt", "desc").get();
    const container = document.getElementById('tournamentsTable');
    
    if (snapshot.empty) {
        container.innerHTML = '<p style="color:#666;">No tournaments</p>';
        return;
    }
    
    let html = '<table><tr><th>Game</th><th>Entry</th><th>Prize</th><th>Players</th><th>Status</th><th>Action</th></tr>';
    snapshot.forEach(doc => {
        const t = doc.data();
        html += `<tr>
            <td>${t.game}</td><td>₹${t.entryFee}</td><td>₹${t.prizePool}</td>
            <td>${t.playersJoined}/${t.maxPlayers}</td><td>${t.status}</td>
            <td><button class="btn btn-reject" onclick="deleteTournament('${doc.id}')">Delete</button></td>
        </tr>`;
    });
    html += '</table>';
    container.innerHTML = html;
}

async function deleteTournament(id) {
    await db.collection("tournaments").doc(id).delete();
    loadTournaments();
}

function logout() { firebase.auth().signOut().then(() => window.location.href = 'admin-login.html'); }
