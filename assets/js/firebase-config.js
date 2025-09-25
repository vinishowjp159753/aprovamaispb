// assets/js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDYT4OkPkJHkXE44jqIcaWtXL-f105JNoE",
  authDomain: "aprovamaispb-6ea02.firebaseapp.com",
  projectId: "aprovamaispb-6ea02",
  storageBucket: "aprovamaispb-6ea02.firebasestorage.app",
  messagingSenderId: "980253365163",
  appId: "1:980253365163:web:e1d116769cd8031dd1b8ee"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
