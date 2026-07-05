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

const withdrawTable = document.getElementById("withdrawTable");

const withdrawRef = collection(db, "withdrawRequests");

onSnapshot(withdrawRef, (snapshot) => {

    let data = [];

    snapshot.forEach((d) => {

        data.push({
            id: d.id,
            ...d.data()
        });

    });

    data.reverse();

    withdrawTable.innerHTML = "";

    if (data.length === 0) {

        withdrawTable.innerHTML = `
        <tr>
            <td colspan="6">No Withdraw Requests</td>
        </tr>
        `;

        return;

    }

    data.forEach((item) => {

        const status = (item.status || "pending").toLowerCase();

        let action = "";

        if (status === "pending") {

            action = `
            <button class="actionBtn approveBtn"
            onclick="approveWithdraw('${item.id}','${item.uid}',${item.amount})"
            Approve
            </button>

            <button class="actionBtn rejectBtn"
            onclick="rejectWithdraw('${item.id}','${item.uid}',${item.amount})"
            Reject
            </button>
            `;

        } else if (status === "approved") {

            action = `<b style="color:#00C853;">APPROVED</b>`;

        } else {

            action = `<b style="color:#F44336;">REJECTED</b>`;

        }

        withdrawTable.innerHTML += `

        <tr>

        <td>${item.name || "-"}</td>

        <td>${item.email || "-"}</td>

        <td>₹${item.amount}</td>

        <td>${item.upi || "-"}</td>

        <td class="${status}">
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
   APPROVE WITHDRAW
========================================= */

window.approveWithdraw = async (requestId, uid, amount) => {

    if (!confirm("Approve this withdraw request?")) return;

    try {

        // Transaction History
        await addDoc(
            collection(db, "transactions"),
            {
                uid: uid,
                type: "Withdraw",
                amount: Number(amount),
                status: "approved",
                createdAt: serverTimestamp()
            }
        );

        // Update Withdraw Status
        await updateDoc(
            doc(db, "withdrawRequests", requestId),
            {
                status: "approved"
            }
        );

        alert("Withdraw Approved Successfully");

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

};

/* =========================================
   REJECT WITHDRAW
========================================= */

window.rejectWithdraw = async (requestId, uid, amount) => {

    if (!confirm("Reject this withdraw request?")) return;

    try {

        // Refund Wallet
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
                type: "Withdraw",
                amount: Number(amount),
                status: "rejected",
                createdAt: serverTimestamp()
            }
        );

        // Update Status
        await updateDoc(
            doc(db, "withdrawRequests", requestId),
            {
                status: "rejected"
            }
        );

        alert("Withdraw Rejected");

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

};
