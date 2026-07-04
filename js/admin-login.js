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

/* SHOW PASSWORD */

toggle.onclick=()=>{

if(password.type==="password"){

password.type="text";

toggle.classList.replace("fa-eye","fa-eye-slash");

}else{

password.type="password";

toggle.classList.replace("fa-eye-slash","fa-eye");

}

};

/* LOGIN */

loginBtn.onclick=async()=>{

error.textContent="";

const mail=email.value.trim();

const pass=password.value.trim();

if(mail===""||pass===""){

error.textContent="Fill all fields.";

return;

}

loginBtn.disabled=true;

loginBtn.innerHTML="Please Wait...";

try{

const cred=await signInWithEmailAndPassword(
auth,
mail,
pass
);

const uid=cred.user.uid;

const snap=await getDoc(
doc(db,"admins",uid)
);

if(!snap.exists()){

await auth.signOut();

error.textContent="Access Denied";

loginBtn.disabled=false;

loginBtn.innerHTML="Login";

return;

}

window.location.href="dashboard.html";

}catch(e){

error.textContent="Invalid Email or Password";

loginBtn.disabled=false;

loginBtn.innerHTML="Login";

}

};
