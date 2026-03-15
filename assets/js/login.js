
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import { auth } from "./firebase.js"

document.getElementById("btnLogin").addEventListener("click", async ()=>{
let email=document.getElementById("email").value
let senha=document.getElementById("senha").value
await signInWithEmailAndPassword(auth,email,senha)
window.location.href="pages/dashboard.html"
})
