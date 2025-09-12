<script type="module">
  import { db } from "./assets/js/firebase-config.js";
  import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

  const studentsTableBody = document.querySelector("#studentsTable tbody");

  function criarLinhaAluno(aluno) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${aluno.numeroPedido}</td>
      <td>${aluno.name}</td>
      <td>${aluno.course}</td>
      <td><span class="status ${aluno.status === 'confirmado' ? 'ativo' : 'inativo'}">${aluno.status}</span></td>
      <td>R$ 0,00</td>
      <td></td>
      <td>
        <button class="action-btn edit-btn" onclick="editStudent('${aluno.id}')"><i class="fas fa-edit"></i></button>
        <button class="action-btn payment-btn" onclick="showPaymentModal('${aluno.id}', '${aluno.name}')"><i class="fas fa-money-bill"></i></button>
        <button class="action-btn obs-btn" onclick="showObservationModal('${aluno.id}', '${aluno.name}')"><i class="fas fa-comment"></i></button>
      </td>
    `;
    return tr;
  }

  function atualizarTabela() {
    const inscricaoRef = collection(db, "inscricao");
    
    onSnapshot(inscricaoRef, (snapshot) => {
      studentsTableBody.innerHTML = ""; // limpa tabela antes de adicionar
      snapshot.forEach(doc => {
        const aluno = { id: doc.id, ...doc.data() };
        studentsTableBody.appendChild(criarLinhaAluno(aluno));
      });
    });
  }

  // Inicializa a tabela
  atualizarTabela();
</script>
