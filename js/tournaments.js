/* =====================================
   BattleG Admin Tournament System
===================================== */

import { db } from "../firebase/firebase.js";

import {
collection,
addDoc,
getDocs,
doc,
getDoc,
updateDoc,
deleteDoc,
query,
orderBy,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/* ========= Elements ========= */

const popup=document.getElementById("popup");
const createBtn=document.getElementById("createBtn");
const closePopup=document.getElementById("closePopup");
const saveTournament=document.getElementById("saveTournament");

const title=document.getElementById("title");
const game=document.getElementById("game");
const entryFee=document.getElementById("entryFee");
const prizePool=document.getElementById("prizePool");
const slots=document.getElementById("slots");
const startTime=document.getElementById("startTime");
const endTime=document.getElementById("endTime");

const table=document.getElementById("tournamentTable");

let editId=null;

/* ========= Popup ========= */

createBtn.onclick=()=>{

popup.classList.add("active");

};

closePopup.onclick=()=>{

popup.classList.remove("active");

clearForm();

};

function clearForm(){

editId=null;

title.value="";
entryFee.value="";
prizePool.value="";
slots.value="";
startTime.value="";
endTime.value="";
game.selectedIndex=0;

}

/* ========= Save Tournament ========= */

saveTournament.onclick=async()=>{

if(
title.value.trim()===""||
entryFee.value===""||
prizePool.value===""||
slots.value===""||
startTime.value===""||
endTime.value===""){

alert("Fill all fields");

return;

}

const data={

title:title.value.trim(),

game:game.value,

entryFee:Number(entryFee.value),

prizePool:Number(prizePool.value),

slots:Number(slots.value),

joined:0,

status:"upcoming",

startTime:startTime.value,

endTime:endTime.value,

createdAt:serverTimestamp()

};

if(editId){

await updateDoc(
doc(db,"tournaments",editId),
data
);

alert("Tournament Updated");

}else{

await addDoc(
collection(db,"tournaments"),
data
);

alert("Tournament Created");

}

popup.classList.remove("active");

clearForm();

loadTournaments();

};

/* =====================================
   LOAD TOURNAMENTS
===================================== */

async function loadTournaments(){

table.innerHTML="";

const q=query(
collection(db,"tournaments"),
orderBy("createdAt","desc")
);

const snapshot=await getDocs(q);

if(snapshot.empty){

table.innerHTML=`
<tr>
<td colspan="7">
No Tournament Found
</td>
</tr>
`;

return;

}

snapshot.forEach((item)=>{

const t=item.data();

let statusClass="status-upcoming";

if(t.status==="live"){
statusClass="status-live";
}

if(t.status==="ended"){
statusClass="status-ended";
}

table.innerHTML+=`

<tr>

<td>${t.game}</td>

<td>${t.title}</td>

<td>₹${t.entryFee}</td>

<td>₹${t.prizePool}</td>

<td>${t.joined}/${t.slots}</td>

<td class="${statusClass}">
${t.status.toUpperCase()}
</td>

<td>

<button
class="actionBtn editBtn"
onclick="editTournament('${item.id}')">

Edit

</button>

<button
class="actionBtn liveBtn"
onclick="liveTournament('${item.id}')">

Live

</button>

<button
class="actionBtn endBtn"
onclick="endTournament('${item.id}')">

End

</button>

<button
class="actionBtn deleteBtn"
onclick="deleteTournament('${item.id}')">

Delete

</button>

</td>

</tr>

`;

});

}

/* =====================================
DELETE
===================================== */

window.deleteTournament=async(id)=>{

if(!confirm("Delete Tournament ?")) return;

await deleteDoc(
doc(db,"tournaments",id)
);

loadTournaments();

};

/* =====================================
LOAD FIRST TIME
===================================== */

loadTournaments();

/* =====================================
   EDIT TOURNAMENT
===================================== */

window.editTournament = async(id)=>{

const snap = await getDoc(doc(db,"tournaments",id));

if(!snap.exists()) return;

const t = snap.data();

editId = id;

title.value = t.title;
game.value = t.game;
entryFee.value = t.entryFee;
prizePool.value = t.prizePool;
slots.value = t.slots;
startTime.value = t.startTime;
endTime.value = t.endTime;

popup.classList.add("active");

};

/* =====================================
   LIVE TOURNAMENT
===================================== */

window.liveTournament = async(id)=>{

await updateDoc(doc(db,"tournaments",id),{

status:"live"

});

loadTournaments();

};

/* =====================================
   END TOURNAMENT
===================================== */

window.endTournament = async(id)=>{

await updateDoc(doc(db,"tournaments",id),{

status:"ended"

});

loadTournaments();

};

/* =====================================
   REALTIME TOURNAMENT LIST
===================================== */

import {
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const tournamentQuery = query(
collection(db,"tournaments"),
orderBy("createdAt","desc")
);

onSnapshot(tournamentQuery, () => {
loadTournaments();
});

/* =====================================
   AUTO STATUS UPDATE
===================================== */

async function autoStatusUpdate(){

const snapshot = await getDocs(collection(db,"tournaments"));

const now = new Date().getTime();

for(const item of snapshot.docs){

const t = item.data();

const start = new Date(t.startTime).getTime();
const end = new Date(t.endTime).getTime();

let status = t.status;

if(now >= start && now < end){
status = "live";
}

if(now >= end){
status = "ended";
}

if(status !== t.status){

await updateDoc(
doc(db,"tournaments",item.id),
{
status:status
}
);

}

}

}

setInterval(autoStatusUpdate,30000);

autoStatusUpdate();
