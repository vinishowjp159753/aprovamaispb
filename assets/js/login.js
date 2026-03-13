
import { auth } from "./firebase.js"
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.getElementById("btnLogin").addEventListener("click", login)

function login(){
let email=document.getElementById("email").value
let senha=document.getElementById("senha").value

signInWithEmailAndPassword(auth,email,senha)
.then(()=>{window.location.href="portal.html"})
.catch((e)=>{alert(e.message)})
}
