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
const adminsCount=document.getElementById("adminsCount");
const gamesCount=document.getElementById("gamesCount");
const tournamentCount=document.getElementById("tournamentCount");
const liveCount=document.getElementById("liveCount");
const depositCount=document.getElementById("depositCount");
const withdrawCount=document.getElementById("withdrawCount");
const promoCount=document.getElementById("promoCount");
const notificationCount=document.getElementById("notificationCount");
const walletBalance=document.getElementById("walletBalance");

const logoutBtn=document.getElementById("logoutBtn");

onAuthStateChanged(auth,async(user)=>{

if(!user){
location.href="index.html";
return;
}

const adminSnap=await getDoc(doc(db,"admins",user.uid));

if(!adminSnap.exists()){
await signOut(auth);
location.href="index.html";
return;
}

adminName.textContent=adminSnap.data().name || "Admin";

loadDashboard();

});

async function loadDashboard(){

const usersSnap=await getDocs(collection(db,"users"));
usersCount.textContent=usersSnap.size;

let wallet=0;

usersSnap.forEach((d)=>{
wallet+=Number(d.data().wallet||0);
});

walletBalance.textContent="₹"+wallet;

const adminSnap=await getDocs(collection(db,"admins"));
adminsCount.textContent=adminSnap.size;

const gamesSnap=await getDocs(collection(db,"games"));
gamesCount.textContent=gamesSnap.size;

const tournamentSnap=await getDocs(collection(db,"tournaments"));
tournamentCount.textContent=tournamentSnap.size;

const liveSnap=await getDocs(
query(
collection(db,"tournaments"),
where("status","==","live")
)
);

liveCount.textContent=liveSnap.size;

const depositSnap=await getDocs(
query(
collection(db,"depositRequests"),
where("status","==","pending")
)
);

depositCount.textContent=depositSnap.size;

const withdrawSnap=await getDocs(
query(
collection(db,"withdrawRequests"),
where("status","==","pending")
)
);

withdrawCount.textContent=withdrawSnap.size;

const promoSnap=await getDocs(collection(db,"promoCodes"));
promoCount.textContent=promoSnap.size;

const notificationSnap=await getDocs(collection(db,"notifications"));
notificationCount.textContent=notificationSnap.size;

}

/* ==========================
   AUTO REFRESH
========================== */

setInterval(() => {

    loadDashboard();

}, 30000);

/* ==========================
   LOGOUT
========================== */

logoutBtn.onclick = async () => {

    if (!confirm("Logout from Admin Panel?")) return;

    try {

        await signOut(auth);

        location.href = "index.html";

    } catch (error) {

        console.error(error);

        alert("Logout Failed");

    }

};

/* ==========================
   ERROR HANDLING
========================== */

window.addEventListener("error", (e) => {

    console.error("Dashboard Error:", e.error);

});

console.log("BattleG Dashboard Loaded Successfully");
