/* =========================================
        BattleG Admin Games System
========================================= */

import { db } from "../firebase/firebase.js";

import {
collection,
addDoc,
getDocs,
getDoc,
doc,
updateDoc,
deleteDoc,
query,
orderBy,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/* =========================
        Elements
========================= */

const popup=document.getElementById("popup");
const createGameBtn=document.getElementById("createGameBtn");
const closePopup=document.getElementById("closePopup");
const saveGame=document.getElementById("saveGame");

const gameName=document.getElementById("gameName");
const gameId=document.getElementById("gameId");
const category=document.getElementById("category");
const description=document.getElementById("description");
const status=document.getElementById("status");

const gamesTable=document.getElementById("gamesTable");

let editId=null;

/* =========================
        Popup
========================= */

createGameBtn.onclick=()=>{

popup.classList.add("active");

};

closePopup.onclick=()=>{

popup.classList.remove("active");

clearForm();

};

function clearForm(){

editId=null;

gameName.value="";
gameId.value="";
description.value="";
category.selectedIndex=0;
status.selectedIndex=0;

}

/* =========================
        Save Game
========================= */

saveGame.onclick=async()=>{

if(
gameName.value.trim()==""||
gameId.value.trim()==""
){

alert("Fill all fields");

return;

}

const data={

gameName:gameName.value.trim(),

gameId:gameId.value.trim().toLowerCase(),

category:category.value,

description:description.value,

status:status.value,

createdAt:serverTimestamp()

};

if(editId){

await updateDoc(

doc(db,"games",editId),

data

);

alert("Game Updated");

}else{

await addDoc(

collection(db,"games"),

data

);

alert("Game Added");

}

popup.classList.remove("active");

clearForm();

loadGames();

};

/* =========================================
        LOAD GAMES
========================================= */

async function loadGames(){

gamesTable.innerHTML="";

const q=query(
collection(db,"games"),
orderBy("createdAt","desc")
);

const snapshot=await getDocs(q);

if(snapshot.empty){

gamesTable.innerHTML=`
<tr>
<td colspan="6">
No Games Available
</td>
</tr>
`;

return;

}

snapshot.forEach((item)=>{

const game=item.data();

const badge=
game.status==="active"
?"🟢 Active"
:"🔴 Inactive";

gamesTable.innerHTML+=`

<tr>

<td>${game.gameName}</td>

<td>${game.gameId}</td>

<td>${game.category}</td>

<td>${badge}</td>

<td>${
game.createdAt
? new Date(game.createdAt.seconds*1000).toLocaleDateString()
: "-"
}</td>

<td>

<button
class="actionBtn editBtn"
onclick="editGame('${item.id}')">

Edit

</button>

<button
class="actionBtn deleteBtn"
onclick="deleteGame('${item.id}')">

Delete

</button>

</td>

</tr>

`;

});

}

/* =========================================
        DELETE GAME
========================================= */

window.deleteGame=async(id)=>{

if(!confirm("Delete this game?")) return;

await deleteDoc(
doc(db,"games",id)
);

loadGames();

};

/* =========================================
        EDIT GAME
========================================= */

window.editGame=async(id)=>{

const snap=await getDoc(
doc(db,"games",id)
);

if(!snap.exists()) return;

const game=snap.data();

editId=id;

gameName.value=game.gameName;
gameId.value=game.gameId;
category.value=game.category;
description.value=game.description;
status.value=game.status;

popup.classList.add("active");

};

/* =========================================
        FIRST LOAD
========================================= */

loadGames();
