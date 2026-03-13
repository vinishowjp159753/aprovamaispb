
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.cadastrarAluno = function(){

let nome = document.getElementById("nome").value;
let email = document.getElementById("email").value;
let senha = document.getElementById("senha").value;
let curso = document.getElementById("curso").value;

createUserWithEmailAndPassword(auth,email,senha)
.then(async ()=>{

await addDoc(collection(db,"alunos"),{
nome,
email,
curso,
status:"ativo"
});

alert("Aluno cadastrado");

});

}
