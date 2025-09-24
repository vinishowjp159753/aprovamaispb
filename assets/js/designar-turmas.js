import { app, db } from './firebase-config.js';
import {
  collection, getDocs, addDoc, updateDoc, doc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ELEMENTOS
const professorSelect    = document.getElementById('professorSelect');
const designarProfessor  = document.getElementById('designarProfessor');
const turmaProfessor     = document.getElementById('turmaProfessor');

const alunoContainer     = document.getElementById('alunoListaCheckbox');
const designarAlunosMass = document.getElementById('designarAlunosEmMassa');
const turmaAlunos        = document.getElementById('turmaAlunos');
const filtroAluno        = document.getElementById('filtroAluno');

const turmaListSelect    = document.getElementById('turmaListSelect');
const listaAlunosTurma   = document.getElementById('listaAlunosTurma');
const baixarTurma        = document.getElementById('baixarTurma');

// ==================== CARREGAR PROFESSORES ====================
async function carregarProfessores() {
  const snap = await getDocs(collection(db, 'professores'));
  snap.forEach(docu => {
    const opt = document.createElement('option');
    opt.value = docu.id;
    opt.textContent = docu.data().nome;
    professorSelect.appendChild(opt);
  });
}

// ==================== CARREGAR ALUNOS (checkbox) ====================
let todosAlunos = [];
async function carregarAlunos() {
  const snap = await getDocs(collection(db, 'inscricoes'));
  todosAlunos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  renderCheckboxAlunos(todosAlunos);
}

function renderCheckboxAlunos(lista) {
  alunoContainer.innerHTML = '';
  lista.forEach(aluno => {
    const item = document.createElement('div');
    item.className = 'aluno-checkbox-item';
    item.innerHTML = `
      <input type="checkbox" value="${aluno.id}" />
      <span>${aluno.nomeCompleto}</span>
    `;
    alunoContainer.appendChild(item);
  });
}

// Filtro por nome
filtroAluno.addEventListener('input', e => {
  const termo = e.target.value.toLowerCase();
  const filtrados = todosAlunos.filter(a =>
    a.nomeCompleto.toLowerCase().includes(termo)
  );
  renderCheckboxAlunos(filtrados);
});

// ==================== CARREGAR TURMAS EXISTENTES ====================
async function carregarTurmas() {
  turmaListSelect.innerHTML = '';
  const snap = await getDocs(collection(db, 'turmas'));
  snap.forEach(docu => {
    const opt = document.createElement('option');
    opt.value = docu.id;
    opt.textContent = docu.id;
    turmaListSelect.appendChild(opt);
  });
}

// ==================== AÇÕES ====================
designarProfessor.addEventListener('click', async () => {
  const profId = professorSelect.value;
  const turma  = turmaProfessor.value.trim();
  if (!profId || !turma) return alert('Selecione professor e turma');

  await updateDoc(doc(db, 'professores', profId), { turma });
  alert('Professor designado!');
  carregarTurmas();
});

designarAlunosMass.addEventListener('click', async () => {
  const turma = turmaAlunos.value.trim();
  if (!turma) return alert('Informe uma turma');

  const selecionados = [...alunoContainer.querySelectorAll('input:checked')];
  if (!selecionados.length) return alert('Selecione ao menos um aluno');

  for (const chk of selecionados) {
    await updateDoc(doc(db, 'inscricoes', chk.value), { turma });
  }
  alert('Alunos designados!');
  carregarTurmas();
});

// Listar alunos de uma turma
turmaListSelect.addEventListener('change', async () => {
  const turma = turmaListSelect.value;
  const snap = await getDocs(collection(db, 'inscricoes'));
  const filtrados = snap.docs
    .map(d => d.data().turma === turma ? d.data().nomeCompleto : null)
    .filter(Boolean);

  listaAlunosTurma.innerHTML = filtrados.map(n => `<div>${n}</div>`).join('');
});

// Exportar XLSX
baixarTurma.addEventListener('click', async () => {
  const turma = turmaListSelect.value;
  if (!turma) return alert('Escolha uma turma');

  const snap = await getDocs(collection(db, 'inscricoes'));
  const alunos = snap.docs
    .map(d => d.data().turma === turma ? [d.data().nomeCompleto] : null)
    .filter(Boolean);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([['Nome']].concat(alunos));
  XLSX.utils.book_append_sheet(wb, ws, turma);
  XLSX.writeFile(wb, `Turma-${turma}.xlsx`);
});

// Inicialização
carregarProfessores();
carregarAlunos();
carregarTurmas();
