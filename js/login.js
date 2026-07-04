import { auth, db } from "../firebase/firebase.js";

import {
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const email=document.getElementById("email");
const password=document.getElementById("password");
const loginBtn=document.getElementById("loginBtn");
const error=document.getElementById("error");
const toggle=document.getElementById("togglePassword");

toggle.onclick=()=>{

if(password.type==="password"){

password.type="text";
toggle.className="fa-solid fa-eye-slash";

}else{

password.type="password";
toggle.className="fa-solid fa-eye";

}

};

loginBtn.onclick=async()=>{

error.textContent="";

try{

const user=await signInWithEmailAndPassword(

auth,

email.value,

password.value

);

const uid=user.user.uid;

const admin=await getDoc(

doc(db,"admins",uid)

);

if(!admin.exists()){

error.textContent="Access Denied";

return;

}

window.location.href="dashboard.html";

}catch(e){

error.textContent="Invalid Email or Password";

}

};
