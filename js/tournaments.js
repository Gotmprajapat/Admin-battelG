const createBtn = document.getElementById("createBtn");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");

createBtn.addEventListener("click", () => {
    popup.classList.add("active");
});

closePopup.addEventListener("click", () => {
    popup.classList.remove("active");
});

import { auth, db } from "../firebase/firebase.js";

import {
collection,
addDoc,
getDocs,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const popup=document.getElementById("popup");

const createBtn=document.getElementById("createBtn");

const closeBtn=document.getElementById("closePopup");

const saveBtn=document.getElementById("saveTournament");

const table=document.getElementById("tournamentTable");

createBtn.onclick=()=>{

popup.classList.add("active");

};

closeBtn.onclick=()=>{

popup.classList.remove("active");

};

/* ==========================
CREATE TOURNAMENT
========================== */

saveBtn.onclick=async()=>{

const title=document.getElementById("title").value.trim();

const game=document.getElementById("game").value;

const entryFee=Number(document.getElementById("entryFee").value);

const prizePool=Number(document.getElementById("prizePool").value);

const slots=Number(document.getElementById("slots").value);

const startTime=document.getElementById("startTime").value;

if(

title==="" ||

entryFee<=0 ||

prizePool<=0 ||

slots<=0 ||

startTime===""

){

alert("Fill all fields");

return;

}

await addDoc(

collection(db,"tournaments"),

{

title,

game,

entryFee,

prizePool,

slots,

joined:0,

status:"upcoming",

startTime,

createdAt:serverTimestamp()

}

);

alert("Tournament Created");

popup.classList.remove("active");

loadTournament();

};

/* ==========================
LOAD TOURNAMENT
========================== */

async function loadTournament(){

table.innerHTML += `

<tr>

<td>${t.game}</td>

<td>${t.title}</td>

<td>₹${t.entryFee}</td>

<td>₹${t.prizePool}</td>

<td>${t.joined}/${t.slots}</td>

<td>

<span class="status${t.status}">

${t.status}

</span>

</td>

<td>

<button
class="actionBtn liveBtn"
onclick="makeLive('${doc.id}')">

Live

</button>

<button
class="actionBtn editBtn"
onclick="endTournament('${doc.id}')">

End

</button>

<button
class="actionBtn deleteBtn"
onclick="deleteTournament('${doc.id}')">

Delete

</button>

</td>

</tr>

`;

import {
collection,
addDoc,
getDocs,
serverTimestamp,
deleteDoc,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

window.deleteTournament = async(id)=>{

if(!confirm("Delete Tournament?")) return;

await deleteDoc(
doc(db,"tournaments",id)
);

loadTournament();

};

window.makeLive = async(id)=>{

await updateDoc(

doc(db,"tournaments",id),

{

status:"live"

}

);

loadTournament();

};

window.endTournament = async(id)=>{

await updateDoc(

doc(db,"tournaments",id),

{

status:"ended"

}

);

loadTournament();

};
