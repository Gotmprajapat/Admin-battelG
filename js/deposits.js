import { db } from "../firebase/firebase.js";

import {
collection,
doc,
updateDoc,
onSnapshot,
increment,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const depositTable=document.getElementById("depositTable");

const popup=document.getElementById("popup");
const paymentImage=document.getElementById("paymentImage");
const closePopup=document.getElementById("closePopup");

closePopup.onclick=()=>{

popup.classList.remove("active");

};

window.viewImage=(url)=>{

paymentImage.src=url;

popup.classList.add("active");

};

const depositRef=collection(db,"depositRequests");

onSnapshot(depositRef,(snapshot)=>{

let data=[];

snapshot.forEach((docu)=>{

data.push({

id:docu.id,
...docu.data()

});

});

data.reverse();

depositTable.innerHTML="";

if(data.length===0){

depositTable.innerHTML=`
<tr>
<td colspan="7">
No Deposit Requests
</td>
</tr>
`;

return;

}

data.forEach((item)=>{

const status=(item.status||"pending").toLowerCase();

let action="";

if(status==="pending"){

action=`

<button
class="actionBtn approveBtn"
onclick="approveDeposit('${item.id}','${item.uid}',${item.amount})">

Approve

</button>

<button
class="actionBtn rejectBtn"
onclick="rejectDeposit('${item.id}')">

Reject

</button>

`;

}else if(status==="approved"){

action=`<b style="color:#00C853;">APPROVED</b>`;

}else{

action=`<b style="color:red;">REJECTED</b>`;

}

depositTable.innerHTML+=`

<tr>

<td>${item.name||"-"}</td>

<td>${item.email||"-"}</td>

<td>₹${item.amount}</td>

<td>${item.utr||"-"}</td>

<td>

<button
class="actionBtn viewBtn"
onclick="viewImage('${item.screenshot}')">

View

</button>

</td>

<td>

${status.toUpperCase()}

</td>

<td>

${action}

</td>

</tr>

`;

});

});

   /* =========================================
   APPROVE DEPOSIT
========================================= */

window.approveDeposit = async (requestId, uid, amount) => {

    if (!confirm("Approve this deposit?")) return;

    try {

        // Wallet Update
        await updateDoc(
            doc(db, "users", uid),
            {
                wallet: increment(Number(amount))
            }
        );

        // Transaction History
        await addDoc(
            collection(db, "transactions"),
            {
                uid: uid,
                type: "Deposit",
                amount: Number(amount),
                status: "approved",
                createdAt: serverTimestamp()
            }
        );

        // Deposit Status Update
        await updateDoc(
            doc(db, "depositRequests", requestId),
            {
                status: "approved"
            }
        );

        alert("Deposit Approved Successfully");

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

};

/* =========================================
   REJECT DEPOSIT
========================================= */

window.rejectDeposit = async (requestId) => {

    if (!confirm("Reject this deposit?")) return;

    try {

        await updateDoc(
            doc(db, "depositRequests", requestId),
            {
                status: "rejected"
            }
        );

        alert("Deposit Rejected");

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

};

/* =========================================
   MODULE READY
========================================= */

console.log("BattleG Deposit Module Loaded");                                                  
