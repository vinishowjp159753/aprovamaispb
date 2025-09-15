// assets/js/firebase-integration.js
import {
  collection, getDocs, addDoc, updateDoc, doc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db } from './firebase-config.js';

// === Alunos ===
async function getAlunos() {
  try {
    const snapshot = await getDocs(collection(db, "inscricoes"));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error("Erro ao buscar alunos:", e);
    notifications.error("Erro ao carregar alunos");
    return [];
  }
}

async function saveAluno(alunoData) {
  try {
    const docRef = await addDoc(collection(db, "inscricoes"), {
      ...alunoData,
      criadoEm: serverTimestamp(),
      status: "pendente"
    });
    notifications.success("Aluno salvo com sucesso!");
    return docRef.id;
  } catch (e) {
    console.error("Erro ao salvar aluno:", e);
    notifications.error("Erro ao salvar aluno");
    throw e;
  }
}

async function updateAluno(id, alunoData) {
  try {
    await updateDoc(doc(db, "inscricoes", id), {
      ...alunoData,
      atualizadoEm: serverTimestamp()
    });
    notifications.success("Aluno atualizado com sucesso!");
  } catch (e) {
    console.error("Erro ao atualizar aluno:", e);
    notifications.error("Erro ao atualizar aluno");
    throw e;
  }
}

// === Professores ===
async function getProfessores() {
  try {
    const snapshot = await getDocs(collection(db, "professores"));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error("Erro ao buscar professores:", e);
    notifications.error("Erro ao carregar professores");
    return [];
  }
}

async function saveProfessor(professorData) {
  try {
    const docRef = await addDoc(collection(db, "professores"), {
      ...professorData,
      criadoEm: serverTimestamp(),
      status: "ativo"
    });
    notifications.success("Professor salvo com sucesso!");
    return docRef.id;
  } catch (e) {
    console.error("Erro ao salvar professor:", e);
    notifications.error("Erro ao salvar professor");
    throw e;
  }
}

// === Pagamentos ===
async function registrarPagamento(pagamentoData) {
  try {
    const docRef = await addDoc(collection(db, "pagamentos"), {
      ...pagamentoData,
      registradoEm: serverTimestamp()
    });
    notifications.success("Pagamento registrado com sucesso!");
    return docRef.id;
  } catch (e) {
    console.error("Erro ao registrar pagamento:", e);
    notifications.error("Erro ao registrar pagamento");
    throw e;
  }
}

// === Controle Financeiro ===
import { query, where } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

async function getReceitaTotal() {
  const snap = await getDocs(collection(db, "inscricoes"));
  return snap.docs.reduce((acc, d) => acc + (Number(d.data().valorPago) || 0), 0);
}

async function getReceitaMensal() {
  const now = new Date();
  const inicio = new Date(now.getFullYear(), now.getMonth(), 1);
  const q = query(collection(db, "inscricoes"),
                  where("dataPagamento", ">=", inicio));
  const snap = await getDocs(q);
  return snap.docs.reduce((acc, d) => acc + (Number(d.data().valorPago) || 0), 0);
}

async function getDespesas(mensal = false) {
  let q = collection(db, "despesas");
  if (mensal) {
    const now = new Date();
    const inicio = new Date(now.getFullYear(), now.getMonth(), 1);
    q = query(q, where("data", ">=", inicio));
  }
  const snap = await getDocs(q);
  let total = 0;
  const lista = [];
  snap.forEach(d => {
    const dados = d.data();
    total += Number(dados.valor) || 0;
    lista.push({ id: d.id, ...dados });
  });
  return { total, lista };
}

async function salvarDespesa(despesa) {
  return addDoc(collection(db, "despesas"), {
    ...despesa,
    criadoEm: serverTimestamp()
  });
}

// Expõe no escopo global
window.getAlunos         = getAlunos;
window.saveAluno         = saveAluno;
window.updateAluno       = updateAluno;
window.getProfessores    = getProfessores;
window.saveProfessor     = saveProfessor;
window.registrarPagamento = registrarPagamento;
window.getReceitaTotal   = getReceitaTotal;
window.getReceitaMensal  = getReceitaMensal;
window.getDespesas       = getDespesas;
window.salvarDespesa     = salvarDespesa;
