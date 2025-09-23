import { db } from "./assets/js/firebase-config.js";
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

async function carregarDesignacoes() {
  const tbody = document.getElementById("designacoesBody");
  tbody.innerHTML = "";

  const search = document.getElementById("searchProfessor").value.toLowerCase();
  const turmaFiltro = document.getElementById("filterTurma").value;
  const statusFiltro = document.getElementById("filterStatus").value;

  try {
    const snap = await getDocs(collection(db, "designacoes"));
    snap.forEach((docItem) => {
      const data = docItem.data();
      const nome = (data.professor || "").toLowerCase();
      const status = (data.status || "").toLowerCase();
      const turma = data.turma || "";

      // Aplicar filtros
      if (search && !nome.includes(search)) return;
      if (turmaFiltro && turmaFiltro !== turma) return;
      if (statusFiltro && statusFiltro !== status) return;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${data.professor || "-"}</td>
        <td>${turma}</td>
        <td>${(data.alunosVinculados || []).length}</td>
        <td>${status}</td>
        <td>
          <button class="action-btn" onclick="removerDesignacao('${docItem.id}')">
            Remover
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar designações:", err);
  }
}

window.removerDesignacao = async (id) => {
  if (!confirm("Deseja remover esta designação?")) return;
  try {
    await deleteDoc(doc(db, "designacoes", id));
    alert("Designação removida com sucesso!");
    carregarDesignacoes();
  } catch (err) {
    console.error("Erro ao remover:", err);
  }
};

// Inicializa a listagem
carregarDesignacoes();
