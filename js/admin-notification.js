import { db } from "../firebase/firebase.js";

import {
collection,
addDoc,
onSnapshot,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const title=document.getElementById("title");
const message=document.getElementById("message");
const sendBtn=document.getElementById("sendBtn");
const notificationTable=document.getElementById("notificationTable");

const notificationRef=collection(db,"notifications");

sendBtn.onclick=async()=>{

const t=title.value.trim();
const m=message.value.trim();

if(!t||!m){

alert("Fill all fields");

return;

}

await addDoc(notificationRef,{

title:t,
message:m,
createdAt:serverTimestamp()

});

title.value="";
message.value="";

alert("Notification Sent");

};

onSnapshot(notificationRef,(snapshot)=>{

let data=[];

snapshot.forEach((d)=>{

data.push({

id:d.id,
...d.data()

});

});

data.reverse();

notificationTable.innerHTML="";

if(data.length===0){

notificationTable.innerHTML=`
<tr>
<td colspan="3">
No Notifications
</td>
</tr>
`;

return;

}

data.forEach((item)=>{

notificationTable.innerHTML+=`

<tr>

<td>${item.title}</td>

<td>${item.message}</td>

<td>

${item.createdAt?.toDate().toLocaleString() || "-"}

</td>

</tr>

`;

});

});
