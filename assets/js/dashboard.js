// assets/js/dashboard.js
import { db } from './firebase-config.js';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Função utilitária para formatar moeda
function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// =========================
// Carregar Alunos
// =========================
async function carregarAlunos() {
  const snap = await getDocs(collection(db, "matriculas"));
  const totalAlunos = snap.size;

  document.getElementById("alunosAtivos").innerText = totalAlunos;
  document.getElementById("alunosVariacao").innerText = `${totalAlunos} alunos matriculados`;

  return snap.docs.map(doc => doc.data());
}

// =========================
// Carregar Turmas
// =========================
async function carregarTurmas() {
  const snap = await getDocs(collection(db, "turmas"));
  const turmas = snap.docs.map(doc => doc.data());
  const turmasAtivas = turmas.filter(t => t.ativa === true).length;

  document.getElementById("turmasAtivas").innerText = turmasAtivas;
  document.getElementById("turmasVariacao").innerText = `${turmasAtivas} turmas em andamento`;

  return turmas;
}

// =========================
// Carregar Professores
// =========================
async function carregarProfessores() {
  const snap = await getDocs(collection(db, "professores"));
  const totalProfessores = snap.size;

  document.getElementById("totalProfessores").innerText = totalProfessores;
  document.getElementById("professoresVariacao").innerText = `${totalProfessores} cadastrados`;

  return snap.docs.map(doc => doc.data());
}

// =========================
// Carregar Receita
// =========================
async function carregarReceita() {
  const snap = await getDocs(collection(db, "pagamentos"));
  const pagamentos = snap.docs.map(doc => doc.data());

  // Receita apenas do mês atual
  const mesAtual = new Date().getMonth();
  const receitaMes = pagamentos
    .filter(p => new Date(p.data).getMonth() === mesAtual)
    .reduce((sum, p) => sum + (p.valor || 0), 0);

  document.getElementById("receitaMensal").innerText = formatCurrency(receitaMes);
  document.getElementById("receitaVariacao").innerText = "Receita do mês atual";

  return pagamentos;
}

// =========================
// Gerar Gráficos
// =========================
function gerarGraficos(alunos, turmas) {
  // Gráfico de matrículas mensais
  const ctx1 = document.getElementById("enrollmentsChart").getContext("2d");

  const porMes = {};
  alunos.forEach(aluno => {
    const mes = new Date(aluno.data).toLocaleString("pt-BR", { month: "short" });
    porMes[mes] = (porMes[mes] || 0) + 1;
  });

  new Chart(ctx1, {
    type: "line",
    data: {
      labels: Object.keys(porMes),
      datasets: [{
        label: "Matrículas",
        data: Object.values(porMes),
        borderColor: "#1a2a6c",
        backgroundColor: "rgba(26,42,108,0.2)",
        fill: true,
      }]
    },
  });

  // Gráfico de distribuição por turma
  const ctx2 = document.getElementById("turmasChart").getContext("2d");

  const porTurma = {};
  alunos.forEach(aluno => {
    porTurma[aluno.turma] = (porTurma[aluno.turma] || 0) + 1;
  });

  new Chart(ctx2, {
    type: "doughnut",
    data: {
      labels: Object.keys(porTurma),
      datasets: [{
        data: Object.values(porTurma),
        backgroundColor: ["#1a2a6c", "#b21f1f", "#fdbb2d", "#28a745", "#17a2b8"],
      }]
    },
  });
}

// =========================
// Inicialização
// =========================
(async function initDashboard() {
  const alunos = await carregarAlunos();
  const turmas = await carregarTurmas();
  await carregarProfessores();
  await carregarReceita();

  gerarGraficos(alunos, turmas);
})();
