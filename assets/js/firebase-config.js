// assets/js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAK3U35fipoWOOIJg0yrtgmVfQ7XQxZxqY",
  authDomain: "aprovamaispb-d4e75.firebaseapp.com",
  projectId: "aprovamaispb-d4e75",
  storageBucket: "aprovamaispb-d4e75.firebasestorage.app",
  messagingSenderId: "828577018900",
  appId: "1:828577018900:web:473d8c3fc2685d3f192301"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
