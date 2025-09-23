// Importa Firebase já configurado
import { db } from "./assets/js/firebase-config.js";
import {
  collection, getDocs, addDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const tbody         = document.getElementById("designacoesBody");
const searchInput   = document.getElementById("searchProfessor");
const turmaFiltro   = document.getElementById("filterTurma");
const statusFiltro  = document.getElementById("filterStatus");
const addBtn        = document.getElementById("addBtn");

// ----------- CRUD FIRESTORE -------------

async function carregarDesignacoes() {
  tbody.innerHTML = "";
  const snap = await getDocs(collection(db, "designacoes"));

  snap.forEach(docItem => {
    const data   = docItem.data();
    const nome   = data.professor || "";
    const turma  = data.turma || "";
    const status = (data.status || "").toLowerCase();
    const alunos = (data.alunosVinculados || []).length;

    // Filtros
    if (searchInput.value && !nome.toLowerCase().includes(searchInput.value.toLowerCase())) return;
    if (turmaFiltro.value && !turma.toLowerCase().includes(turmaFiltro.value.toLowerCase())) return;
    if (statusFiltro.value && status !== statusFiltro.value.toLowerCase()) return;

    const tr = document.createElement("tr");
    tr.className = "hover:bg-gray-50";
    tr.innerHTML = `
      <td class="py-3 px-4">${nome}</td>
      <td class="py-3 px-4">${turma}</td>
      <td class="py-3 px-4 text-center">${alunos}</td>
      <td class="py-3 px-4 capitalize">${status}</td>
      <td class="py-3 px-4">
        <button class="text-red-600 hover:text-red-800 font-semibold"
                onclick="removerDesignacao('${docItem.id}')">
          <i class="fa fa-trash"></i> Remover
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.removerDesignacao = async (id) => {
  if (!confirm("Deseja remover esta designação?")) return;
  await deleteDoc(doc(db, "designacoes", id));
  carregarDesignacoes();
};

// ----------- ADICIONAR ---------------
addBtn.addEventListener("click", async () => {
  const professor = document.getElementById("professorInput").value.trim();
  const turma     = document.getElementById("turmaInput").value.trim();
  const status    = document.getElementById("statusInput").value;

  if (!professor || !turma) {
    alert("Preencha todos os campos!");
    return;
  }

  await addDoc(collection(db, "designacoes"), {
    professor,
    turma,
    status,
    alunosVinculados: [] // inicial
  });

  document.getElementById("professorInput").value = "";
  document.getElementById("turmaInput").value = "";
  document.getElementById("statusInput").value = "ativo";
  carregarDesignacoes();
});

// ----------- FILTROS ---------------
[searchInput, turmaFiltro, statusFiltro].forEach(el =>
  el.addEventListener("input", carregarDesignacoes)
);

// Inicial
carregarDesignacoes();
