/* ===========================================
   BattleG Admin Tournament System
   Part 1
=========================================== */

import { auth, db } from "../firebase/firebase.js";

import {
collection,
addDoc,
getDocs,
doc,
updateDoc,
deleteDoc,
serverTimestamp,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const popup = document.getElementById("popup");
const createBtn = document.getElementById("createBtn");
const closePopup = document.getElementById("closePopup");
const saveTournament = document.getElementById("saveTournament");
const tournamentTable = document.getElementById("tournamentTable");

const title = document.getElementById("title");
const game = document.getElementById("game");
const entryFee = document.getElementById("entryFee");
const prizePool = document.getElementById("prizePool");
const slots = document.getElementById("slots");
const startTime = document.getElementById("startTime");

let editId = null;

/* ==========================
   OPEN POPUP
========================== */

createBtn.addEventListener("click", () => {

popup.classList.add("active");

});

/* ==========================
   CLOSE POPUP
========================== */

closePopup.addEventListener("click", () => {

popup.classList.remove("active");

clearForm();

});

/* ==========================
   CLEAR FORM
========================== */

function clearForm(){

title.value="";

game.selectedIndex=0;

entryFee.value="";

prizePool.value="";

slots.value="";

startTime.value="";

editId=null;

}

/* ==========================
   SAVE TOURNAMENT
========================== */

saveTournament.addEventListener("click", async()=>{

if(
title.value.trim()===""||
entryFee.value===""||
prizePool.value===""||
slots.value===""||
startTime.value===""){
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

loadTournament();

});
/* ==========================
   LOAD TOURNAMENTS
========================== */

async function loadTournament(){

tournamentTable.innerHTML="";

const q=query(
collection(db,"tournaments"),
orderBy("createdAt","desc")
);

const snap=await getDocs(q);

if(snap.empty){

tournamentTable.innerHTML=`

<tr>

<td colspan="7">

No Tournament Found

</td>

</tr>

`;

return;

}

snap.forEach((d)=>{

const t=d.data();

tournamentTable.innerHTML+=`

<tr>

<td>${t.game}</td>

<td>${t.title}</td>

<td>₹${t.entryFee}</td>

<td>₹${t.prizePool}</td>

<td>${t.joined}/${t.slots}</td>

<td>${t.status}</td>

<td>

<button onclick="editTournament('${d.id}')">

Edit

</button>

<button onclick="liveTournament('${d.id}')">

Live

</button>

<button onclick="endTournament('${d.id}')">

End

</button>

<button onclick="deleteTournament('${d.id}')">

Delete

</button>

</td>

</tr>

`;

});

}

/* ==========================
   DELETE
========================== */

window.deleteTournament=async(id)=>{

if(!confirm("Delete Tournament?")) return;

await deleteDoc(
doc(db,"tournaments",id)
);

loadTournament();

};

/* ==========================
   LIVE
========================== */

window.liveTournament=async(id)=>{

await updateDoc(

doc(db,"tournaments",id),

{

status:"live"

}

);

loadTournament();

};

/* ==========================
   END
========================== */

window.endTournament=async(id)=>{

await updateDoc(

doc(db,"tournaments",id),

{

status:"ended"

}

);

loadTournament();

};

loadTournament();
