
import { auth, db, storage } from "./firebase.js"
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

document.getElementById("logoutBtn").addEventListener("click", async ()=>{
await signOut(auth)
window.location.href="login.html"
})

document.getElementById("btnUpload").addEventListener("click", uploadMaterial)

async function uploadMaterial(){

let titulo = document.getElementById("titulo").value
let materia = document.getElementById("materia").value
let professor = document.getElementById("professor").value
let curso = document.getElementById("curso").value

let arquivo = document.getElementById("arquivo").files[0]

if(!arquivo){
alert("Selecione um arquivo")
return
}

let storageRef = ref(storage,"materiais/"+Date.now()+"_"+arquivo.name)

await uploadBytes(storageRef,arquivo)

let url = await getDownloadURL(storageRef)

await addDoc(collection(db,"materiais"),{

titulo:titulo,
materia:materia,
professor:professor,
curso:curso,
url:url,
dataUpload:new Date()

})

alert("Material enviado com sucesso")

}
