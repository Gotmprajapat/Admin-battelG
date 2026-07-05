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

const depositRef=collection(db,"depositRequests");

closePopup.onclick=()=>{

popup.classList.remove("active");

};

window.viewImage=(url)=>{

paymentImage.src=url;

popup.classList.add("active");

};

onSnapshot(depositRef,(snapshot)=>{

depositTable.innerHTML="";

if(snapshot.empty){

depositTable.innerHTML=`
<tr>
<td colspan="7">
No Deposit Requests
</td>
</tr>
`;

return;

}

snapshot.forEach((d)=>{

const item=d.data();

const status=item.status||"Pending";

let buttons="";

if(status==="pending"){

buttons=`

<button class="actionBtn approveBtn"
onclick="approveDeposit('${d.id}','${item.uid}',${item.amount})">

Approve

</button>

<button class="actionBtn rejectBtn"
onclick="rejectDeposit('${d.id}')">

Reject

</button>

`;

}else{

buttons=`<b>${status.toUpperCase()}</b>`;

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

<td class="${status}">
${status.toUpperCase()}
</td>

<td>

${buttons}

</td>

</tr>

`;

});

});

/* ==========================
   APPROVE DEPOSIT
========================== */

window.approveDeposit = async (requestId, uid, amount) => {

    if (!confirm("Approve this deposit?")) return;

    try {

        // Wallet Update
        await updateDoc(doc(db, "users", uid), {
            wallet: increment(Number(amount))
        });

        // Transaction History
        await addDoc(collection(db, "transactions"), {
            uid: uid,
            type: "Deposit",
            amount: Number(amount),
            status: "Approved",
            createdAt: serverTimestamp()
        });

        // Deposit Status
        await updateDoc(doc(db, "depositRequests", requestId), {
            status: "approved"
        });

        alert("Deposit Approved Successfully");

    } catch (error) {

        console.error(error);
        alert("Approval Failed");

    }

};

/* ==========================
   REJECT DEPOSIT
========================== */

window.rejectDeposit = async (requestId) => {

    if (!confirm("Reject this deposit?")) return;

    try {

        await updateDoc(doc(db, "depositRequests", requestId), {
            status: "rejected"
        });

        alert("Deposit Rejected");

    } catch (error) {

        console.error(error);
        alert("Reject Failed");

    }

};
