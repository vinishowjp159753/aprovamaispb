import { app, db } from "./firebase-config.js";
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

let professores = [];

// Carregar professores ativos
async function carregarProfessores() {
    const snapshot = await getDocs(collection(db, "professores"));
    professores = [];
    snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.status === "ativo") {
            professores.push({ id: docSnap.id, ...data });
        }
    });

    const select = document.getElementById("selectProfessor");
    select.innerHTML = `<option value="">Selecione um professor</option>`;
    professores.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = `${p.nome} - ${p.materia}`;
        select.appendChild(opt);
    });
}

// Carregar designações
async function carregarDesignacoes() {
    const snapshot = await getDocs(collection(db, "designacoes"));
    const tbody = document.getElementById("designacoesBody");
    tbody.innerHTML = "";

    if (snapshot.empty) {
        tbody.innerHTML = `<tr><td colspan="3">Nenhuma designação encontrada</td></tr>`;
        return;
    }

    snapshot.forEach(d => {
        const data = d.data();
        const prof = professores.find(p => p.id === data.professorId);
        if (prof) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${prof.nome}</td>
                <td>${data.turma}</td>
                <td>
                    <button class="btn delete-btn" data-id="${d.id}"><i class="fas fa-trash"></i> Remover</button>
                </td>
            `;
            tbody.appendChild(tr);
        }
    });

    // Adicionar evento de remover
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            await deleteDoc(doc(db, "designacoes", id));
            carregarDesignacoes();
        });
    });
}

// Designar turma
async function designarTurma() {
    const profId = document.getElementById("selectProfessor").value;
    const turma = document.getElementById("selectTurma").value;
    if (!profId || !turma) {
        alert("Selecione professor e turma");
        return;
    }

    // Verificar se já existe
    const q = query(collection(db, "designacoes"), where("professorId", "==", profId), where("turma", "==", turma));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        alert("Esta designação já existe");
        return;
    }

    await addDoc(collection(db, "designacoes"), { professorId: profId, turma });
    alert("Turma designada com sucesso!");
    carregarDesignacoes();
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    carregarProfessores().then(carregarDesignacoes);
    document.getElementById("designarTurmaBtn").addEventListener("click", designarTurma);
});
