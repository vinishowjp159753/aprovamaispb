
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import { auth } from "./firebase.js"

let btn=document.getElementById("logoutBtn")
if(btn){
btn.addEventListener("click",async ()=>{
await signOut(auth)
window.location.href="../index.html"
})
}
