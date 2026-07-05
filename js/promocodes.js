import { db } from "../firebase/firebase.js";

import {
collection,
addDoc,
deleteDoc,
doc,
onSnapshot,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const promoCode = document.getElementById("promoCode");
const promoReward = document.getElementById("promoReward");
const promoLimit = document.getElementById("promoLimit");
const createPromo = document.getElementById("createPromo");
const promoTable = document.getElementById("promoTable");

const promoRef = collection(db, "promoCodes");

/* ==========================
   CREATE PROMO
========================== */

createPromo.onclick = async () => {

    const code = promoCode.value.trim().toUpperCase();
    const reward = Number(promoReward.value);
    const limit = Number(promoLimit.value);

    if (!code || reward <= 0 || limit <= 0) {
        alert("Fill all fields correctly");
        return;
    }

    try {

        await addDoc(promoRef, {
            code: code,
            reward: reward,
            limit: limit,
            used: 0,
            status: "active",
            createdAt: serverTimestamp()
        });

        promoCode.value = "";
        promoReward.value = "";
        promoLimit.value = "";

        alert("Promo Code Created");

    } catch (e) {

        console.error(e);
        alert(e.message);

    }

};

/* ==========================
   LOAD PROMOS
========================== */

onSnapshot(promoRef, (snapshot) => {

    let data = [];

    snapshot.forEach((d) => {

        data.push({
            id: d.id,
            ...d.data()
        });

    });

    data.reverse();

    promoTable.innerHTML = "";

    if (data.length === 0) {

        promoTable.innerHTML = `
        <tr>
            <td colspan="6">No Promo Codes</td>
        </tr>
        `;

        return;
    }

    data.forEach((item) => {

        promoTable.innerHTML += `

        <tr>

        <td>${item.code}</td>

        <td>${item.reward}</td>

        <td>${item.limit}</td>

        <td>${item.used || 0}</td>

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

});

/* ==========================
   DELETE PROMO
========================== */

window.deletePromo = async (id) => {

    if (!confirm("Delete this Promo Code?")) return;

    try {

        await deleteDoc(doc(db, "promoCodes", id));

        alert("Promo Code Deleted");

    } catch (e) {

        console.error(e);
        alert(e.message);

    }

};

console.log("Promo Code Module Loaded");
