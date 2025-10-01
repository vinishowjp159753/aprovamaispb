// assets/js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA8IOr3_gzyCbYqk8RH6lwwgtQLQ0u5ch0",
  authDomain: "aprovamaispb-73d39.firebaseapp.com",
  projectId: "aprovamaispb-73d39",
  storageBucket: "aprovamaispb-73d39.firebasestorage.app",
  messagingSenderId: "1052452508337",
  appId: "1:1052452508337:web:0b7919f981aa487c410890",
  measurementId: "G-M99KFX9636"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
