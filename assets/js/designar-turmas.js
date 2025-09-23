import { db } from "./firebase-config.js";
import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

let professores = [];

// Carrega professores ativos
async function carregarProfessores() {
    const snapshot = await getDocs(collection(db, "professores"));
    professores = [];
    snapshot.forEach(docSnap => {
        const p = docSnap.data();
        if (p.status === "ativo") {
            professores.push({ id: docSnap.id, ...p });
        }
    });
    preencherSelectProfessores();
}

// Preenche select de professores
function preencherSelectProfessores() {
    const select = document.getElementById("selectProfessor");
    select.innerHTML = `<option value="">Selecione um professor</option>`;
    professores.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = `${p.nome} - ${p.materia}`;
        select.appendChild(opt);
    });
}

// Designa turma para professor
async function designarTurma() {
    const profId = document.getElementById("selectProfessor").value;
    const turma = document.getElementById("selectTurma").value;

    if (!profId || !turma) {
        alert("Selecione professor e turma.");
        return;
    }

    // Verifica se já existe designação
    const q = query(collection(db, "designacoes"), where("professorId", "==", profId), where("turma", "==", turma));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        alert("Esta designação já existe.");
        return;
    }

    await addDoc(collection(db, "designacoes"), { professorId: profId, turma });
    document.getElementById("selectProfessor").value = "";
    document.getElementById("selectTurma").value = "";
    carregarDesignacoes();
    alert("Turma designada com sucesso!");
}

// Carrega designações
async function carregarDesignacoes() {
    const snapshot = await getDocs(collection(db, "designacoes"));
    const tbody = document.getElementById("designacoesBody");
    tbody.innerHTML = "";

    snapshot.forEach(d => {
        const data = d.data();
        const prof = professores.find(p => p.id === data.professorId);
        if (prof) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${prof.nome}</td>
                <td>${data.turma}</td>
                <td><button class="btn delete-btn" data-id="${d.id}"><i class="fas fa-unlink"></i> Remover</button></td>
            `;
            tbody.appendChild(tr);
        }
    });

    // Adiciona eventos de remover
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            if (confirm("Deseja remover esta designação?")) {
                await deleteDoc(doc(db, "designacoes", btn.dataset.id));
                carregarDesignacoes();
            }
        });
    });
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    carregarProfessores();
    carregarDesignacoes();

    document.getElementById("designarTurmaBtn").addEventListener("click", designarTurma);
});
