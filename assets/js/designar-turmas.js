import { db } from './firebase-config.js';
import {
  collection, getDocs, addDoc, deleteDoc, doc, query, where
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

const professores = [];
const alunos = [];
const designacoes = [];

async function carregarProfessores() {
  const snapshot = await getDocs(collection(db, "professores"));
  snapshot.forEach(d => professores.push({ id: d.id, ...d.data() }));
  const select = document.getElementById("selectProfessor");
  professores.forEach(p => {
    if (p.status === "ativo") {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = `${p.nome} - ${p.materia}`;
      select.appendChild(opt);
    }
  });
}

async function carregarAlunos() {
  const snap = await getDocs(collection(db, "inscricoes"));
  snap.forEach(d => alunos.push({ id: d.id, ...d.data() }));
  const select = document.getElementById("selectAluno");
  alunos.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a.id;
    opt.textContent = a.nomeCompleto;
    select.appendChild(opt);
  });
}

async function carregarDesignacoes() {
  designacoes.length = 0;
  const snap = await getDocs(collection(db,"designacoes"));
  snap.forEach(d => designacoes.push({id:d.id, ...d.data()}));
  const tbody = document.getElementById("designacoesBody");
  tbody.innerHTML = "";
  designacoes.forEach(des => {
    const prof = professores.find(p=>p.id===des.professorId);
    const alu  = alunos.find(a=>a.id===des.alunoId);
    if (prof && alu) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${prof.nome}</td>
        <td>${alu.nomeCompleto}</td>
        <td>${des.turma}</td>
        <td><button class="btn danger" data-id="${des.id}">Remover</button></td>
      `;
      tbody.appendChild(tr);
    }
  });
  document.querySelectorAll("#designacoesBody .btn.danger").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      await deleteDoc(doc(db,"designacoes",btn.dataset.id));
      carregarDesignacoes();
    });
  });
}

async function designar() {
  const prof = document.getElementById("selectProfessor").value;
  const aluno = document.getElementById("selectAluno").value;
  const turma = document.getElementById("selectTurma").value;
  if(!prof || !aluno || !turma) return alert("Selecione professor, aluno e turma!");

  const q = query(collection(db,"designacoes"),
    where("alunoId","==",aluno), where("turma","==",turma));
  const snap = await getDocs(q);
  if(!snap.empty) return alert("Aluno já está nesta turma!");

  await addDoc(collection(db,"designacoes"), { professorId: prof, alunoId: aluno, turma });
  document.getElementById("selectAluno").value="";
  document.getElementById("selectTurma").value="";
  carregarDesignacoes();
}

// --- Turmas -> listar alunos e exportar
async function listarAlunosTurma() {
  const turmaSel = document.getElementById("selectTurmaListar").value;
  const tbody = document.getElementById("turmaAlunosBody");
  tbody.innerHTML = "";
  if(!turmaSel) return;
  const snap = await getDocs(query(collection(db,"designacoes"), where("turma","==",turmaSel)));
  snap.forEach(d => {
    const alu = alunos.find(a => a.id === d.data().alunoId);
    if (alu) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${alu.nomeCompleto}</td><td>${alu.email || ""}</td>`;
      tbody.appendChild(tr);
    }
  });
}

function exportarTurmaXLSX() {
  const turma = document.getElementById("selectTurmaListar").value;
  if (!turma) return alert("Selecione uma turma!");
  const rows = [["Aluno", "Email"]];
  document.querySelectorAll("#turmaAlunosBody tr").forEach(tr => {
    const cols = Array.from(tr.querySelectorAll("td")).map(td => td.textContent);
    if (cols.length) rows.push(cols);
  });
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, turma);
  XLSX.writeFile(wb, `turma-${turma}.xlsx`);
}

document.addEventListener("DOMContentLoaded", () => {
  carregarProfessores();
  carregarAlunos().then(carregarDesignacoes);

  document.getElementById("designarBtn").addEventListener("click", designar);
  document.getElementById("selectTurmaListar").addEventListener("change", listarAlunosTurma);
  document.getElementById("baixarTurmaBtn").addEventListener("click", exportarTurmaXLSX);
});
