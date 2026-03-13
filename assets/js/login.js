
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

window.login = function(){

let email = document.getElementById("email").value;
let senha = document.getElementById("senha").value;

signInWithEmailAndPassword(auth,email,senha)
.then(()=>{
window.location="portal.html";
})
.catch(()=>{
alert("Login inválido");
});

}
