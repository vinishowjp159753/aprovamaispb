
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js"

const firebaseConfig = {
  apiKey: "AIzaSyBRm4yix2fC2PhAVjTtbWlR-azz0bAglpo",
  authDomain: "aprovamaispb2-3bc78.firebaseapp.com",
  projectId: "aprovamaispb2-3bc78",
  storageBucket: "aprovamaispb2-3bc78.firebasestorage.app",
  messagingSenderId: "830264910104",
  appId: "1:830264910104:web:0c0c6a9b1930c155c47e6d",
  measurementId: "G-PM06K116GT"
};

const app=initializeApp(firebaseConfig)

export const auth=getAuth(app)
export const db=getFirestore(app)
export const storage=getStorage(app)
