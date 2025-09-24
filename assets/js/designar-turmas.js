import { db } from "./firebase-config.js";
import {
  collection, getDocs, addDoc, deleteDoc, doc,
  query, where
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ===================== VARIÁVEIS =====================
let professores = [];
let alunos = [];

// ===================== PROFESSORES =====================
async function carregarProfessores() {
  const snap = await getDocs(collection(db, "professores"));
  professores = [];
  snap.forEach(d => professores.push({ id: d.id, ...d.data() }));

  const select = document.getElementById("selectProfessor");
  select.innerHTML = `<option value="">Selecione um professor</option>`;
  professores.filter(p => p.status === "ativo").forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = `${p.nome} - ${p.materia}`;
    select.appendChild(opt);
  });
}

async function designarProfessor() {
  const profId = document.getElementById("selectProfessor").value;
  const turma = document.getElementById("selectTurmaProfessor").value;
  if (!profId || !turma) return alert("Selecione professor e turma!");

  const q = query(collection(db,"designacoes"), where("professorId","==",profId), where("turma","==",turma));
  if (!(await getDocs(q)).empty) return alert("Esta designação já existe!");

  await addDoc(collection(db,"designacoes"), { professorId: profId, turma });
  carregarDesignacoesProf();
}

async function carregarDesignacoesProf() {
  const snap = await getDocs(collection(db,"designacoes"));
  const tbody = document.getElementById("designacoesProfessoresBody");
  tbody.innerHTML = "";
  snap.forEach(d => {
    const prof = professores.find(p => p.id === d.data().professorId);
    if (prof) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${prof.nome}</td><td>${d.data().turma}</td>
        <td><button class="btn danger" data-id="${d.id}"><i class="fas fa-trash"></i> Remover</button></td>`;
      tbody.appendChild(tr);
    }
  });
  tbody.querySelectorAll(".danger").forEach(btn =>
    btn.addEventListener("click", async e => {
      await deleteDoc(doc(db,"designacoes",e.target.closest("button").dataset.id));
      carregarDesignacoesProf();
    })
  );
}

// ===================== ALUNOS =====================
async function carregarAlunos() {
  const snap = await getDocs(collection(db,"inscricoes"));
  alunos = [];
  snap.forEach(d => alunos.push({ id: d.id, ...d.data() }));

  const select = document.getElementById("selectAluno");
  select.innerHTML = `<option value="">Selecione um aluno</option>`;
  alunos.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a.id;
    opt.textContent = a.nomeCompleto;
    select.appendChild(opt);
  });
}

async function designarAluno() {
  const alunoId = document.getElementById("selectAluno").value;
  const turma = document.getElementById("selectTurmaAluno").value;
  if (!alunoId || !turma) return alert("Selecione aluno e turma!");

  const q = query(collection(db,"designacoesAlunos"),
                  where("alunoId","==",alunoId), where("turma","==",turma));
  if (!(await getDocs(q)).empty) return alert("Esta designação já existe!");

  await addDoc(collection(db,"designacoesAlunos"), { alunoId, turma });
  carregarDesignacoesAlunos();
  carregarTurmas(); // atualiza lista de turmas
}

async function carregarDesignacoesAlunos() {
  const snap = await getDocs(collection(db,"designacoesAlunos"));
  const tbody = document.getElementById("designacoesAlunosBody");
  tbody.innerHTML = "";
  snap.forEach(d => {
    const aluno = alunos.find(a => a.id === d.data().alunoId);
    if (aluno) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${aluno.nomeCompleto}</td><td>${d.data().turma}</td>
        <td><button class="btn danger" data-id="${d.id}"><i class="fas fa-trash"></i> Remover</button></td>`;
      tbody.appendChild(tr);
    }
  });
  tbody.querySelectorAll(".danger").forEach(btn =>
    btn.addEventListener("click", async e => {
      await deleteDoc(doc(db,"designacoesAlunos",e.target.closest("button").dataset.id));
      carregarDesignacoesAlunos();
      carregarTurmas();
    })
  );
}

// ===================== TURMAS =====================
async function carregarTurmas() {
  const snap = await getDocs(collection(db, "designacoesAlunos"));
  const turmas = new Set();
  snap.forEach(d => turmas.add(d.data().turma));

  const select = document.getElementById("selectTurmaListar");
  select.innerHTML = `<option value="">Escolha a turma</option>`;
  turmas.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    select.appendChild(opt);
  });
}

async function listarAlunosTurma(turma) {
  const q = query(collection(db,"designacoesAlunos"), where("turma","==",turma));
  const snap = await getDocs(q);
  const tbody = document.getElementById("turmaAlunosBody");
  tbody.innerHTML = "";

  if (snap.empty) {
    tbody.innerHTML = "<tr><td colspan='2'>Nenhum aluno nessa turma</td></tr>";
    return;
  }

  for (const d of snap.docs) {
    const alunoId = d.data().alunoId;
    const alunoSnap = alunos.find(a => a.id === alunoId);
    if (alunoSnap) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${alunoSnap.nomeCompleto}</td><td>${alunoSnap.email || "-"}</td>`;
      tbody.appendChild(tr);
    }
  }
}

function exportarTurmaCSV() {
  const turma = document.getElementById("selectTurmaListar").value;
  if (!turma) return alert("Selecione uma turma!");
  const rows = [["Aluno","Email"]];
  document.querySelectorAll("#turmaAlunosBody tr").forEach(tr => {
    const cols = Array.from(tr.querySelectorAll("td")).map(td => td.textContent);
    if (cols.length === 2) rows.push(cols);
  });
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `turma-${turma}.csv`;
  link.click();
}

// ===================== INIT =====================
document.addEventListener("DOMContentLoaded", () => {
  carregarProfessores();
  carregarAlunos();
  carregarDesignacoesProf();
  carregarDesignacoesAlunos();
  carregarTurmas();

  document.getElementById("designarProfessorBtn").addEventListener("click", designarProfessor);
  document.getElementById("designarAlunoBtn").addEventListener("click", designarAluno);

  document.getElementById("selectTurmaListar").addEventListener("change", e => {
    if (e.target.value) listarAlunosTurma(e.target.value);
    else document.getElementById("turmaAlunosBody").innerHTML =
      "<tr><td colspan='2'>Selecione uma turma</td></tr>";
  });

  document.getElementById("baixarTurmaBtn").addEventListener("click", exportarTurmaCSV);
});
