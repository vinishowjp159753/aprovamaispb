import { initializeApp } from "./firebase-config.js";
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const app = initializeApp();
const db = getFirestore(app);
const alunosCollection = collection(db, "inscricoes");

const tabela = document.getElementById("alunosTable").querySelector("tbody");
const statusFilter = document.getElementById("statusFilter");

let alunosCache = []; // Guarda dados para aplicar filtro sem buscar novamente

async function carregarAlunos() {
    tabela.innerHTML = ""; 
    const snapshot = await getDocs(alunosCollection);
    alunosCache = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    renderizarTabela();
}

function renderizarTabela() {
    tabela.innerHTML = "";
    const filtro = statusFilter.value;

    // Corrigido para pegar Status com maiúscula
    const alunosFiltrados = filtro === "todos" 
        ? alunosCache 
        : alunosCache.filter(a => (a.Status || "").toLowerCase() === filtro);

    alunosFiltrados.forEach(aluno => {
        const tr = document.createElement("tr");
        const statusAtual = (aluno.Status || "pendente").toLowerCase();

        tr.innerHTML = `
            <td>${aluno.Nome || ""}</td>
            <td>${aluno.Turma || ""}</td>
            <td>${aluno.Cupom || ""}</td>
            <td>${aluno.Telefone || ""}</td>
            <td>${statusAtual}</td>
            <td>
                <button class="btn-status">${statusAtual === "pendente" ? "Ativar" : "Desativar"}</button>
                <button class="btn-excluir">Excluir</button>
            </td>
        `;

        // Botão alterar status
        tr.querySelector(".btn-status").addEventListener("click", async () => {
            const novoStatus = statusAtual === "pendente" ? "ativo" : "pendente";
            await updateDoc(doc(db, "inscricoes", aluno.id), { Status: novoStatus }); // Corrigido para maiúscula
            carregarAlunos();
        });

        // Botão excluir
        tr.querySelector(".btn-excluir").addEventListener("click", async () => {
            if (confirm(`Deseja excluir o aluno ${aluno.Nome}?`)) { // Corrigido para Nome
                await deleteDoc(doc(db, "inscricoes", aluno.id));
                carregarAlunos();
            }
        });

        tabela.appendChild(tr);
    });
}

// Filtro muda ao selecionar
statusFilter.addEventListener("change", renderizarTabela);

// Carregar tabela ao abrir a página
carregarAlunos();
