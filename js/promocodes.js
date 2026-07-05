import { db } from "../firebase/firebase.js";

import {
collection,
addDoc,
deleteDoc,
doc,
onSnapshot,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const promoCode=document.getElementById("promoCode");
const promoReward=document.getElementById("promoReward");
const promoLimit=document.getElementById("promoLimit");
const createPromo=document.getElementById("createPromo");
const promoTable=document.getElementById("promoTable");

const promoRef=collection(db,"promoCodes");

createPromo.onclick=async()=>{

const code=promoCode.value.trim().toUpperCase();
const reward=Number(promoReward.value);
const limit=Number(promoLimit.value);

if(!code||!reward||!limit){

alert("Fill all fields");

return;

}

await addDoc(promoRef,{

code:code,
reward:reward,
limit:limit,
used:0,
status:"active",
createdAt:serverTimestamp()

});

promoCode.value="";
promoReward.value="";
promoLimit.value="";

alert("Promo Code Created");

};

onSnapshot(promoRef,(snapshot)=>{

let data=[];

snapshot.forEach((d)=>{

data.push({

id:d.id,
...d.data()

});

});

data.reverse();

promoTable.innerHTML="";

if(data.length===0){

promoTable.innerHTML=`
<tr>
<td colspan="6">
No Promo Codes
</td>
</tr>
`;

return;

}

data.forEach((item)=>{

promoTable.innerHTML+=`

<tr>

<td>${item.code}</td>

<td>${item.reward}</td>

<td>${item.limit}</td>

<td>${item.used}</td>

<td class="${item.status}">
${item.status.toUpperCase()}
</td>

<td>

<button
class="deleteBtn"
onclick="deletePromo('${item.id}')">

Delete

</button>

</td>

</tr>

`;

});

/* =========================================
   DELETE PROMO CODE
========================================= */

window.deletePromo = async (id) => {

    if (!confirm("Delete this Promo Code?")) return;

    try {

        await deleteDoc(doc(db, "promoCodes", id));

        alert("Promo Code Deleted Successfully");

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

};

/* =========================================
   MODULE READY
========================================= */

console.log("BattleG Promo Code Module Loaded Successfully");  
