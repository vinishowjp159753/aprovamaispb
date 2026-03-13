
import { auth, db, storage } from "./firebase.js"
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

document.getElementById("logoutBtn").addEventListener("click", async ()=>{
await signOut(auth)
window.location.href="login.html"
})

document.getElementById("btnUpload").addEventListener("click",async ()=>{

let titulo=document.getElementById("titulo").value
let materia=document.getElementById("materia").value
let arquivo=document.getElementById("arquivo").files[0]

if(!arquivo){alert("Selecione um arquivo");return}

let storageRef=ref(storage,"materiais/"+arquivo.name)

await uploadBytes(storageRef,arquivo)

let url=await getDownloadURL(storageRef)

await addDoc(collection(db,"materiais"),{
titulo:titulo,
materia:materia,
url:url
})

document.getElementById("statusUpload").innerText="Upload concluído!"

})
