import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB_aXEl60NzaxkMCtm0n89y04zlIaf08EE",
    authDomain: "crm-lead-system-94fc0.firebaseapp.com",
    projectId: "crm-lead-system-94fc0",
    storageBucket: "crm-lead-system-94fc0.firebasestorage.app",
    messagingSenderId: "855876665898",
    appId: "1:855876665898:web:85e7f0dbd726dc93b57953",
    measurementId: "G-JZXXYBE6MX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);