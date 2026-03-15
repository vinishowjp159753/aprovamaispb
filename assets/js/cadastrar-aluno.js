import { db } from "./firebase.js";

import { collection, addDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.getElementById("btnCadastrar").addEventListener("click", async () => {

let nome = document.getElementById("nome").value;
let email = document.getElementById("email").value;
let telefone = document.getElementById("telefone").value;

let curso = document.getElementById("curso").value;

let dataMatricula = document.getElementById("dataMatricula").value;

let expiracao = document.getElementById("expiracao").value;

let pagamento = document.getElementById("pagamento").value;

try {

await addDoc(collection(db, "alunos"), {

nome: nome,
email: email,
telefone: telefone,
curso: curso,
dataMatricula: dataMatricula,
expiracao: expiracao,
pagamento: pagamento,
status: "ativo",
dataCadastro: new Date()

});

alert("Aluno cadastrado com sucesso!");

} catch (erro) {

console.error(erro);
alert("Erro ao cadastrar aluno");

}

});
