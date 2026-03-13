
import { storage, db } from "./firebase.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.uploadMaterial = async function(){

let file = document.getElementById("arquivo").files[0];
let titulo = document.getElementById("titulo").value;
let materia = document.getElementById("materia").value;
let destaque = document.getElementById("destaque").checked;

const storageRef = ref(storage,"materiais/"+file.name);

await uploadBytes(storageRef,file);

let url = await getDownloadURL(storageRef);

await addDoc(collection(db,"materiais"),{
titulo,
materia,
url,
destaque
});

alert("Material enviado");

}
