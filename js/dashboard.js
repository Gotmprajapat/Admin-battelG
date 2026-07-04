import { auth, db } from "../firebase/firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
doc,
getDoc,
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const adminName=document.getElementById("adminName");

const usersCount=document.getElementById("usersCount");

const liveCount=document.getElementById("liveCount");

const depositCount=document.getElementById("depositCount");

const withdrawCount=document.getElementById("withdrawCount");

const logoutBtn=document.getElementById("logoutBtn");

/* ==========================
ADMIN LOGIN CHECK
========================== */

onAuthStateChanged(auth,async(user)=>{

if(!user){

window.location.href="index.html";

return;

}

const adminRef=doc(db,"admins",user.uid);

const adminSnap=await getDoc(adminRef);

if(!adminSnap.exists()){

await signOut(auth);

window.location.href="index.html";

return;

}

const adminData=adminSnap.data();

adminName.textContent=
adminData.name || "Admin";

loadDashboard();

});

/* ==========================
LOAD DASHBOARD
========================== */

async function loadDashboard(){

// Total Users

const usersSnap=await getDocs(
collection(db,"users")
);

usersCount.textContent=usersSnap.size;

// Live Tournament

const liveSnap=await getDocs(

query(

collection(db,"tournaments"),

where("status","==","live")

)

);

liveCount.textContent=liveSnap.size;

// Pending Deposit

const depSnap=await getDocs(

query(

collection(db,"deposits"),

where("status","==","pending")

)

);

depositCount.textContent=depSnap.size;

// Pending Withdraw

const wdSnap=await getDocs(

query(

collection(db,"withdraws"),

where("status","==","pending")

)

);

withdrawCount.textContent=wdSnap.size;

}

/* ==========================
LOGOUT
========================== */

logoutBtn.onclick=async()=>{

await signOut(auth);

window.location.href="index.html";

};
