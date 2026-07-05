import { db } from "../firebase/firebase.js";

import {
collection,
doc,
getDoc,
getDocs,
updateDoc,
query,
onSnapshot,
increment
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const depositTable=document.getElementById("depositTable");

const popup=document.getElementById("popup");
const paymentImage=document.getElementById("paymentImage");
const closePopup=document.getElementById("closePopup");

const depositRef=collection(db,"depositRequests");

/* ==========================
      LOAD REQUESTS
========================== */

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

const status=item.status||"pending";

depositTable.innerHTML+=`

<tr>

<td>${item.name||"-"}</td>

<td>${item.email||"-"}</td>

<td>₹${item.amount}</td>

<td>${item.utr}</td>

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

<button
class="actionBtn approveBtn"
onclick="approveDeposit('${d.id}','${item.uid}',${item.amount})">

Approve

</button>

<button
class="actionBtn rejectBtn"
onclick="rejectDeposit('${d.id}')">

Reject

</button>

</td>

</tr>

`;

});

});

closePopup.onclick=()=>{

popup.classList.remove("active");

};

window.viewImage=(url)=>{

paymentImage.src=url;

popup.classList.add("active");

};

/* =========================================
        APPROVE DEPOSIT
========================================= */

window.approveDeposit = async(requestId, uid, amount)=>{

if(!confirm("Approve this deposit?")) return;

try{

const userRef = doc(db,"users",uid);

await updateDoc(userRef,{
wallet:increment(Number(amount))
});

const requestRef = doc(db,"depositRequests",requestId);

await updateDoc(requestRef,{
status:"approved"
});

alert("Deposit Approved Successfully");

}catch(error){

console.error(error);

alert("Approval Failed");

}

};

/* =========================================
        REJECT DEPOSIT
========================================= */

window.rejectDeposit = async(requestId)=>{

if(!confirm("Reject this deposit?")) return;

try{

const requestRef = doc(db,"depositRequests",requestId);

await updateDoc(requestRef,{
status:"rejected"
});

alert("Deposit Rejected");

}catch(error){

console.error(error);

alert("Reject Failed");

}

};

const searchDeposit=document.getElementById("searchDeposit");
const statusFilter=document.getElementById("statusFilter");

let deposits=[];

function renderDeposits(data){

depositTable.innerHTML="";

if(data.length===0){

depositTable.innerHTML=`
<tr>
<td colspan="7">No Deposit Requests</td>
</tr>
`;

return;

}

data.forEach(item=>{

let buttons="";

if(item.status==="pending"||!item.status){

buttons=`

<button class="actionBtn approveBtn"
onclick="approveDeposit('${item.id}','${item.uid}',${item.amount})">

Approve

</button>

<button class="actionBtn rejectBtn"
onclick="rejectDeposit('${item.id}')">

Reject

</button>

`;

}else{

buttons=`<b>${item.status.toUpperCase()}</b>`;

}

depositTable.innerHTML+=`
<tr>

<td>${item.name||"-"}</td>

<td>${item.email||"-"}</td>

<td>₹${item.amount}</td>

<td>${item.utr}</td>

<td>

<button
class="actionBtn viewBtn"
onclick="viewImage('${item.screenshot}')">

View

</button>

</td>

<td>${item.status||"pending"}</td>

<td>${buttons}</td>

</tr>
`;

});

}
