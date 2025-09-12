// assets/js/firebase-config.js

// Importações do Firebase
import { initializeApp as firebaseInitializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAK3U35fipoWOOIJg0yrtgmVfQ7XQxZxqY",
  authDomain: "aprovamaispb-d4e75.firebaseapp.com",
  projectId: "aprovamaispb-d4e75",
  storageBucket: "aprovamaispb-d4e75.firebasestorage.app",
  messagingSenderId: "828577018900",
  appId: "1:828577018900:web:473d8c3fc2685d3f192301"
};

// Inicializa o Firebase
const app = firebaseInitializeApp(firebaseConfig);

// Inicializa o Firestore
const db = getFirestore(app);

// Exporta Firestore e funções para uso nos HTMLs
export { db, collection, getDocs, addDoc, doc, updateDoc, deleteDoc };
