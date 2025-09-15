// assets/js/firebase-config.js
// Firebase v8 - compatível com db.collection
const firebaseConfig = {
  apiKey: "AIzaSyAK3U35fipoWOOIJg0yrtgmVfQ7XQxZxqY",
  authDomain: "aprovamaispb-d4e75.firebaseapp.com",
  projectId: "aprovamaispb-d4e75",
  storageBucket: "aprovamaispb-d4e75.appspot.com",
  messagingSenderId: "828577018900",
  appId: "1:828577018900:web:473d8c3fc2685d3f192301"
};

// Inicializa Firebase com namespace antigo
firebase.initializeApp(firebaseConfig);

// Firestore e Auth disponíveis globalmente
const db   = firebase.firestore();
const auth = firebase.auth();

// Torna acessível no window (se precisar em outros scripts)
window.db   = db;
window.auth = auth;
