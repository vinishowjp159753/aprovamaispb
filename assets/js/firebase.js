
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
apiKey:"AIzaSyA8IOr3_gzyCbYqk8RH6lwwgtQLQ0u5ch0",
authDomain:"aprovamaispb-73d39.firebaseapp.com",
projectId:"aprovamaispb-73d39",
storageBucket:"aprovamaispb-73d39.firebasestorage.app",
messagingSenderId:"1052452508337",
appId:"1:1052452508337:web:0b7919f981aa487c410890"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
