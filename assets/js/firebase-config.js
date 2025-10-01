// assets/js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDZwVAAJ1hYzzT3U0Jae59KBEZypmR6hNE",
  authDomain: "aprovamaispb-ceec4.firebaseapp.com",
  projectId: "aprovamaispb-ceec4",
  storageBucket: "aprovamaispb-ceec4.firebasestorage.app",
  messagingSenderId: "419459930869",
  appId: "1:419459930869:web:349c510b9b650c78cb83bc",
  measurementId: "G-GEXTZMR0B1"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
