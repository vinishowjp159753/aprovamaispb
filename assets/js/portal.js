
import { auth, db } from "./firebase.js"
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.getElementById("logoutBtn").addEventListener("click", async ()=>{
await signOut(auth)
window.location.href="login.html"
})

async function carregar(){

let lista=document.getElementById("materials-list")
const qs=await getDocs(collection(db,"materiais"))
lista.innerHTML=""

qs.forEach((doc)=>{
let m=doc.data()
lista.innerHTML+=`
<div class="material-item">
<h4>${m.titulo}</h4>
<p>${m.materia}</p>
<a href="${m.url}" target="_blank"><button>Baixar</button></a>
</div>`
})
}

carregar()

document.getElementById("filtroMateria").addEventListener("change",async (e)=>{

let filtro=e.target.value
let lista=document.getElementById("materials-list")

const qs=await getDocs(collection(db,"materiais"))
lista.innerHTML=""

qs.forEach((doc)=>{

let m=doc.data()

if(filtro==="todas"||m.materia===filtro){

lista.innerHTML+=`
<div class="material-item">
<h4>${m.titulo}</h4>
<p>${m.materia}</p>
<a href="${m.url}" target="_blank"><button>Baixar</button></a>
</div>`

}

})

})
