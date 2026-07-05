import { db } from "../firebase/firebase.js";

import {
collection,
query,
orderBy,
onSnapshot,
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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

let users=[];

const q = collection(db,"users");

onSnapshot(q,(snapshot)=>{

users=[];

snapshot.forEach((d)=>{

users.push({
id:d.id,
...d.data()
});

});

renderUsers(users);

});

function renderUsers(data){

usersTable.innerHTML="";

if(data.length===0){

usersTable.innerHTML=`
<tr>
<td colspan="7">No Users Found</td>
</tr>
`;

return;

}

data.forEach(user=>{

usersTable.innerHTML+=`

<tr>

<td>${user.name||"-"}</td>

<td>${user.email||"-"}</td>

<td>₹${user.wallet||0}</td>

<td>${user.totalTournament||0}</td>

<td>${user.totalWinning||0}</td>

<td>${user.status||"active"}</td>

<td>

<button class="actionBtn viewBtn"
onclick="viewUser('${user.id}')">

View

</button>

<button class="actionBtn banBtn"
onclick="toggleBan('${user.id}')">

${user.status==="banned"?"Unban":"Ban"}

</button>

</td>

</tr>

`;

});

}

/* ==========================
   VIEW USER
========================== */

window.viewUser = async(id)=>{

const snap = await getDoc(doc(db,"users",id));

if(!snap.exists()){
alert("User not found");
return;
}

const user = snap.data();

viewName.textContent = user.name || "-";
viewEmail.textContent = user.email || "-";
viewWallet.textContent = user.wallet || 0;
viewTournament.textContent = user.totalTournament || 0;
viewWins.textContent = user.totalWinning || 0;
viewStatus.textContent = user.status || "active";

popup.classList.add("active");

};

/* ==========================
   CLOSE POPUP
========================== */

closePopup.onclick = ()=>{

popup.classList.remove("active");

};

/* ==========================
   BAN / UNBAN
========================== */

window.toggleBan = async(id)=>{

const ref = doc(db,"users",id);

const snap = await getDoc(ref);

if(!snap.exists()) return;

const user = snap.data();

const newStatus =
user.status==="banned"
? "active"
: "banned";

await updateDoc(ref,{
status:newStatus
});

};

/* ==========================
   SEARCH
========================== */

searchUser.addEventListener("input",()=>{

const value = searchUser.value.toLowerCase();

const filtered = users.filter(user=>{

return (
(user.name||"").toLowerCase().includes(value) ||
(user.email||"").toLowerCase().includes(value)
);

});

renderUsers(filtered);

});

/* =========================================
        REALTIME REFRESH
========================================= */

function refreshUsers() {

renderUsers(users);

}

/* =========================================
        WINDOW FUNCTIONS
========================================= */

window.refreshUsers = refreshUsers;

/* =========================================
        ESC CLOSE POPUP
========================================= */

window.addEventListener("keydown",(e)=>{

if(e.key==="Escape"){

popup.classList.remove("active");

}

});

/* =========================================
        CLICK OUTSIDE POPUP
========================================= */

popup.addEventListener("click",(e)=>{

if(e.target===popup){

popup.classList.remove("active");

}

});

/* =========================================
        USERS READY
========================================= */

console.log("BattleG Users Module Loaded Successfully");
