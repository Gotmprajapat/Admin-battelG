/* =========================================
        BattleG Admin Users System
========================================= */

import { db } from "../firebase/firebase.js";

import {
collection,
getDocs,
doc,
getDoc,
updateDoc,
query,
orderBy,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/* =========================
        Elements
========================= */

const usersTable=document.getElementById("usersTable");
const searchUser=document.getElementById("searchUser");

const popup=document.getElementById("popup");
const closePopup=document.getElementById("closePopup");

const viewName=document.getElementById("viewName");
const viewEmail=document.getElementById("viewEmail");
const viewWallet=document.getElementById("viewWallet");
const viewTournament=document.getElementById("viewTournament");
const viewWins=document.getElementById("viewWins");
const viewStatus=document.getElementById("viewStatus");

let allUsers=[];

/* =========================
        Load Users
========================= */

function loadUsers(){

const q=query(
collection(db,"users"),
orderBy("joinedAt","desc")
);

onSnapshot(q,(snapshot)=>{

allUsers=[];

snapshot.forEach(doc=>{

allUsers.push({
id:doc.id,
...doc.data()
});

});

renderUsers(allUsers);

});

}

/* =========================
        Render Users
========================= */

function renderUsers(list){

usersTable.innerHTML="";

if(list.length===0){

usersTable.innerHTML=`
<tr>
<td colspan="7">
No Users Found
</td>
</tr>
`;

return;

}

list.forEach(user=>{

const statusClass=
user.status==="banned"
?"bannedStatus"
:"activeStatus";

const actionButton=
user.status==="banned"
?`<button class="actionBtn unbanBtn"
onclick="toggleBan('${user.id}','active')">
Unban
</button>`
:`<button class="actionBtn banBtn"
onclick="toggleBan('${user.id}','banned')">
Ban
</button>`;

usersTable.innerHTML+=`

<tr>

<td>${user.name||"-"}</td>

<td>${user.email||"-"}</td>

<td>₹${user.wallet||0}</td>

<td>${user.totalTournament||0}</td>

<td>${user.totalWins||0}</td>

<td class="${statusClass}">
${user.status||"active"}
</td>

<td>

<button
class="actionBtn viewBtn"
onclick="viewUser('${user.id}')">

View

</button>

${actionButton}

</td>

</tr>

`;

});

}

loadUsers();

    /* =========================================
        VIEW USER
========================================= */

window.viewUser = async(id)=>{

const snap = await getDoc(doc(db,"users",id));

if(!snap.exists()) return;

const user = snap.data();

viewName.textContent = user.name || "-";
viewEmail.textContent = user.email || "-";
viewWallet.textContent = user.wallet || 0;
viewTournament.textContent = user.totalTournament || 0;
viewWins.textContent = user.totalWins || 0;
viewStatus.textContent = user.status || "active";

popup.classList.add("active");

};

/* =========================================
        CLOSE POPUP
========================================= */

closePopup.onclick = ()=>{

popup.classList.remove("active");

};

/* =========================================
        BAN / UNBAN USER
========================================= */

window.toggleBan = async(id,status)=>{

const text =
status==="banned"
? "Ban this user?"
: "Unban this user?";

if(!confirm(text)) return;

await updateDoc(
doc(db,"users",id),
{
status:status
}
);

};

/* =========================================
        SEARCH USER
========================================= */

searchUser.addEventListener("input",()=>{

const keyword =
searchUser.value.toLowerCase();

const filtered =
allUsers.filter(user=>{

const name =
(user.name||"").toLowerCase();

const email =
(user.email||"").toLowerCase();

return name.includes(keyword) ||
email.includes(keyword);

});

renderUsers(filtered);

});
