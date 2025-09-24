// designar-turmas.js (module)
import { db } from "./firebase-config.js";
import {
  collection, getDocs, addDoc, deleteDoc, doc, query, where
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* ====== estado local ====== */
let professores = [];       // {id, nome, materia, status...}
let alunos = [];            // {id, nomeCompleto, email, status, turma?}
let designProf = [];        // docs de designacoes (professorId, turma)
let designAlunos = [];      // docs de designacoesAlunos (alunoId, turma)

/* ====== elementos ====== */
const selectProfessor = () => document.getElementById("selectProfessor");
const selectTurmaProfessor = () => document.getElementById("selectTurmaProfessor");
const btnDesignarProfessor = () => document.getElementById("btnDesignarProfessor");
const designacoesProfBody = () => document.getElementById("designacoesProfBody");

const filtroAlunoInput = () => document.getElementById("filtroAluno");
const alunosCheckboxList = () => document.getElementById("alunosCheckboxList");
const selectTurmaAluno = () => document.getElementById("selectTurmaAluno");
const btnDesignarAlunos = () => document.getElementById("btnDesignarAlunos");
const designacoesAlunosBody = () => document.getElementById("designacoesAlunosBody");

const selectTurmaListar = () => document.getElementById("selectTurmaListar");
const turmaAlunosBody = () => document.getElementById("turmaAlunosBody");
const baixarTurmaBtn = () => document.getElementById("baixarTurmaBtn");

/* ====== helpers ====== */
function createOption(text, value = "") {
  const opt = document.createElement("option");
  opt.value = value || text;
  opt.textContent = text;
  return opt;
}

/* ====== CARREGAMENTO ====== */
async function carregarProfessores() {
  const snap = await getDocs(collection(db, "professores"));
  professores = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  const sel = selectProfessor();
  sel.innerHTML = `<option value="">Selecione um professor</option>`;
  professores.filter(p => p.status === "ativo").forEach(p => {
    sel.appendChild(createOption(`${p.nome} - ${p.materia}`, p.id));
  });
}

async function carregarAlunos() {
  const snap = await getDocs(collection(db, "inscricoes"));
  alunos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  renderCheckboxAlunos(alunos);
}

/* Renderiza lista de checkboxes (pode ser filtrada) */
function renderCheckboxAlunos(lista) {
  const container = alunosCheckboxList();
  container.innerHTML = "";
  if (!lista.length) {
    container.innerHTML = `<div class="checkbox-item">Nenhum aluno encontrado</div>`;
    return;
  }
  lista.forEach(a => {
    const div = document.createElement("div");
    div.className = "checkbox-item";
    div.innerHTML = `<label style="cursor:pointer"><input type="checkbox" value="${a.id}"> <span style="margin-left:8px;">${a.nomeCompleto}</span></label>`;
    container.appendChild(div);
  });
}

/* filtro de alunos (campo de texto) */
function setupFiltroAlunos() {
  filtroAlunoInput().addEventListener("input", (e) => {
    const termo = e.target.value.trim().toLowerCase();
    if (!termo) { renderCheckboxAlunos(alunos); return; }
    const filtrados = alunos.filter(a => (a.nomeCompleto || "").toLowerCase().includes(termo));
    renderCheckboxAlunos(filtrados);
  });
}

/* ====== DESIGNACOES PROFESSORES ====== */
async function carregarDesignacoesProf() {
  const snap = await getDocs(collection(db, "designacoes"));
  designProf = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  const tbody = designacoesProfBody();
  tbody.innerHTML = "";
  if (!designProf.length) {
    tbody.innerHTML = `<tr><td colspan="3">Nenhuma designação de professor</td></tr>`;
    return;
  }
  designProf.forEach(d => {
    if (!d.professorId) return; // só tratar docs que sejam designações de professor
    const prof = professores.find(p => p.id === d.professorId) || { nome: "—" };
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${prof.nome}</td><td>${d.turma}</td>
      <td><button class="btn danger small" data-id="${d.id}"><i class="fas fa-trash"></i> Remover</button></td>`;
    tbody.appendChild(tr);
  });
  // listeners remover
  tbody.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", async (ev) => {
      const id = btn.dataset.id;
      if (!confirm("Remover designação do professor?")) return;
      await deleteDoc(doc(db, "designacoes", id));
      await carregarDesignacoesProf();
      await carregarTurmas(); // atualiza turmas
    });
  });
}

/* ====== DESIGNACOES ALUNOS ====== */
async function carregarDesignacoesAlunos() {
  const snap = await getDocs(collection(db, "designacoesAlunos"));
  designAlunos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  const tbody = designacoesAlunosBody();
  tbody.innerHTML = "";
  if (!designAlunos.length) {
    tbody.innerHTML = `<tr><td colspan="3">Nenhuma designação de aluno</td></tr>`;
    return;
  }
  designAlunos.forEach(d => {
    const aluno = alunos.find(a => a.id === d.alunoId) || { nomeCompleto: "—" };
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${aluno.nomeCompleto}</td><td>${d.turma}</td>
      <td><button class="btn danger small" data-id="${d.id}"><i class="fas fa-trash"></i> Remover</button></td>`;
    tbody.appendChild(tr);
  });
  // listeners remover
  tbody.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("Remover designação do aluno?")) return;
      await deleteDoc(doc(db, "designacoesAlunos", id));
      await carregarDesignacoesAlunos();
      await carregarTurmas();
    });
  });
}

/* ====== FUNÇÕES DE DESIGNAR ====== */
async function designarProfessor() {
  const profId = selectProfessor().value;
  const turma = document.getElementById("selectTurmaProfessor").value;
  if (!profId || !turma) return alert("Selecione professor e turma");

  // Verifica duplicata
  const q = query(collection(db, "designacoes"), where("professorId", "==", profId), where("turma", "==", turma));
  if (!(await getDocs(q)).empty) return alert("Professor já designado para esta turma.");

  await addDoc(collection(db, "designacoes"), { professorId: profId, turma });
  alert("Professor designado!");
  await carregarDesignacoesProf();
  await carregarTurmas();
}

async function designarAlunosEmMassa() {
  const turma = selectTurmaAluno().value;
  if (!turma) return alert("Escolha a turma para designar os alunos selecionados.");
  const checkboxes = Array.from(alunosCheckboxList().querySelectorAll("input[type='checkbox']:checked"));
  if (!checkboxes.length) return alert("Marque ao menos um aluno.");

  // Para cada selecionado, verifica duplicidade e cria doc em "designacoesAlunos"
  const promises = [];
  for (const chk of checkboxes) {
    const alunoId = chk.value;
    const q = query(collection(db, "designacoesAlunos"), where("alunoId", "==", alunoId), where("turma", "==", turma));
    const existing = await getDocs(q);
    if (!existing.empty) continue; // pula duplicata
    promises.push(addDoc(collection(db, "designacoesAlunos"), { alunoId, turma }));
  }
  await Promise.all(promises);
  alert("Alunos designados (as duplicatas foram ignoradas).");
  // desmarcar checkboxes
  alunosCheckboxList().querySelectorAll("input[type='checkbox']:checked").forEach(c => c.checked = false);
  await carregarDesignacoesAlunos();
  await carregarTurmas();
}

/* ====== TURMAS: listar e exportar ====== */
async function carregarTurmas() {
  const turmasSet = new Set();
  // pegar turmas dos alunos designados
  const snapAl = await getDocs(collection(db, "designacoesAlunos"));
  snapAl.forEach(d => turmasSet.add(d.data().turma));
  // pegar turmas dos professores designados
  const snapPr = await getDocs(collection(db, "designacoes"));
  snapPr.forEach(d => turmasSet.add(d.data().turma));

  const sel = selectTurmaListar();
  sel.innerHTML = `<option value="">Selecione uma turma</option>`;
  Array.from(turmasSet).sort().forEach(t => sel.appendChild(createOption(t, t)));
  // se nenhuma turma, mostra opção vazia
  if (!turmasSet.size) sel.innerHTML = `<option value="">Nenhuma turma encontrada</option>`;
}

async function listarAlunosDaTurma(turma) {
  const tbody = turmaAlunosBody();
  tbody.innerHTML = "";
  if (!turma) {
    tbody.innerHTML = `<tr><td colspan="2">Selecione uma turma</td></tr>`;
    return;
  }
  const q = query(collection(db, "designacoesAlunos"), where("turma", "==", turma));
  const snap = await getDocs(q);
  if (snap.empty) {
    tbody.innerHTML = `<tr><td colspan="2">Nenhum aluno nesta turma</td></tr>`;
    return;
  }
  for (const d of snap.docs) {
    const alunoId = d.data().alunoId;
    const aluno = alunos.find(a => a.id === alunoId);
    const nome = aluno ? aluno.nomeCompleto : "—";
    const email = aluno ? (aluno.email || "") : "";
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${nome}</td><td>${email}</td>`;
    tbody.appendChild(tr);
  }
}

function exportarTurmaXLSX() {
  const turma = selectTurmaListar().value;
  if (!turma) return alert("Selecione uma turma para exportar.");
  // construir rows (Nome, Email)
  const rows = [["Aluno", "Email"]];
  const tbody = turmaAlunosBody();
  const trs = Array.from(tbody.querySelectorAll("tr"));
  trs.forEach(tr => {
    const tds = Array.from(tr.querySelectorAll("td")).map(td => td.textContent.trim());
    if (tds.length === 2 && tds[0] !== "" && tds[0] !== "Nenhum aluno nesta turma") rows.push(tds);
  });
  // gerar xlsx com SheetJS (global XLSX)
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, turma.substring(0, 31)); // nome da aba <=31 chars
  XLSX.writeFile(wb, `turma-${turma}.xlsx`);
}

/* ====== inicialização e listeners ====== */
document.addEventListener("DOMContentLoaded", async () => {
  // carregar dados base
  await carregarProfessores();
  await carregarAlunos();
  await carregarDesignacoesProf();
  await carregarDesignacoesAlunos();
  await carregarTurmas();

  // listeners UI
  setupFiltroAlunos();

  // professor
  document.getElementById("btnDesignarProfessor").addEventListener("click", designarProfessor);

  // alunos em massa
  document.getElementById("btnDesignarAlunos").addEventListener("click", designarAlunosEmMassa);

  // listar alunos ao mudar turma selecionada
  selectTurmaListar().addEventListener("change", (e) => {
    listarAlunosDaTurma(e.target.value);
  });

  // export
  baixarTurmaBtn().addEventListener("click", exportarTurmaXLSX);
});
