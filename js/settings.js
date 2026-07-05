import { db } from "../firebase/firebase.js";

import {
doc,
getDoc,
setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const appName=document.getElementById("appName");
const appVersion=document.getElementById("appVersion");
const minDeposit=document.getElementById("minDeposit");
const minWithdraw=document.getElementById("minWithdraw");
const maxWithdraw=document.getElementById("maxWithdraw");
const signupBonus=document.getElementById("signupBonus");
const referBonus=document.getElementById("referBonus");
const upiId=document.getElementById("upiId");
const qrImage=document.getElementById("qrImage");
const notice=document.getElementById("notice");

const maintenance=document.getElementById("maintenance");
const depositStatus=document.getElementById("depositStatus");
const withdrawStatus=document.getElementById("withdrawStatus");
const tournamentStatus=document.getElementById("tournamentStatus");
const registrationStatus=document.getElementById("registrationStatus");

const saveSettings=document.getElementById("saveSettings");

const settingsRef=doc(db,"settings","app");

async function loadSettings(){

const snap=await getDoc(settingsRef);

if(!snap.exists()) return;

const s=snap.data();

appName.value=s.appName||"";
appVersion.value=s.appVersion||"";

minDeposit.value=s.minDeposit||"";
minWithdraw.value=s.minWithdraw||"";
maxWithdraw.value=s.maxWithdraw||"";

signupBonus.value=s.signupBonus||"";
referBonus.value=s.referBonus||"";

upiId.value=s.upiId||"";
qrImage.value=s.qrImage||"";

notice.value=s.notice||"";

maintenance.checked=s.maintenance||false;
depositStatus.checked=s.depositStatus??true;
withdrawStatus.checked=s.withdrawStatus??true;
tournamentStatus.checked=s.tournamentStatus??true;
registrationStatus.checked=s.registrationStatus??true;

}

loadSettings();
/* =========================================
   SAVE SETTINGS
========================================= */

saveSettings.onclick = async () => {

    try {

        await setDoc(settingsRef, {

            appName: appName.value.trim(),
            appVersion: appVersion.value.trim(),

            minDeposit: Number(minDeposit.value),
            minWithdraw: Number(minWithdraw.value),
            maxWithdraw: Number(maxWithdraw.value),

            signupBonus: Number(signupBonus.value),
            referBonus: Number(referBonus.value),

            upiId: upiId.value.trim(),
            qrImage: qrImage.value.trim(),

            notice: notice.value.trim(),

            maintenance: maintenance.checked,
            depositStatus: depositStatus.checked,
            withdrawStatus: withdrawStatus.checked,
            tournamentStatus: tournamentStatus.checked,
            registrationStatus: registrationStatus.checked

        });

        alert("Settings Saved Successfully");

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

};

console.log("BattleG Settings Module Loaded");
