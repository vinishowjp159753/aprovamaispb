
import { auth, db } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.logout = function(){
signOut(auth).then(()=>{
window.location="login.html";
});
}

async function carregar(){

let lista = document.getElementById("materials-list");
let destaque = document.getElementById("featured");

const querySnapshot = await getDocs(collection(db,"materiais"));

querySnapshot.forEach((doc)=>{

let m = doc.data();

let card = `
<div class="card p-3 mb-2 material-item">
<h5>${m.titulo}</h5>
<p>${m.materia}</p>
<a href="${m.url}" target="_blank">
<button class="btn btn-success btn-sm">Baixar</button>
</a>
</div>
`;

lista.innerHTML += card;

if(m.destaque){

destaque.innerHTML += card;

}

});

}

carregar();

window.filtrar = function(materia){

document.querySelectorAll(".material-item").forEach(item=>{

if(materia==="all" || item.innerText.includes(materia))
item.style.display="block";
else
item.style.display="none";

});

}
