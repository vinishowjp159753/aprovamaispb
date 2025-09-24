import { app, db } from './firebase-config.js';
import { 
  getFirestore, collection, getDocs, doc, updateDoc 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ===== Elementos
const professorSelect  = document.getElementById('professorSelect');
const alunoSelect      = document.getElementById('alunoSelect');
const turmaInput       = document.getElementById('turmaInput');
const btnDesignar      = document.getElementById('btnDesignar');
const turmaSelect      = document.getElementById('turmaSelect');
const listaAlunosTurma = document.getElementById('listaAlunosTurma');
const btnBaixar        = document.getElementById('btnBaixar');

// ===== Carregar professores
async function carregarProfessores() {
  const snap = await getDocs(collection(db, 'professores'));
  professorSelect.innerHTML = '<option value="">Selecione</option>';
  snap.forEach(docu => {
    const d = docu.data();
    if (d.status === 'ativo') {
      const opt = document.createElement('option');
      opt.value = docu.id;
      opt.textContent = d.nome;
      professorSelect.appendChild(opt);
    }
  });
}

// ===== Carregar alunos
async function carregarAlunos() {
  const snap = await getDocs(collection(db, 'inscricoes'));
  alunoSelect.innerHTML = '';
  snap.forEach(docu => {
    const d = docu.data();
    const opt = document.createElement('option');
    opt.value = docu.id;
    opt.textContent = d.nomeCompleto || 'Sem nome';
    alunoSelect.appendChild(opt);
  });
}

// ===== Designar
btnDesignar.addEventListener('click', async () => {
  const profId = professorSelect.value;
  const turma  = turmaInput.value.trim();
  const alunosMarcados = [...alunoSelect.selectedOptions].map(o => o.value);

  if (!profId || !turma || alunosMarcados.length === 0) {
    alert('Selecione professor, turma e pelo menos um aluno.');
    return;
  }

  // Atualiza professor
  await updateDoc(doc(db, 'professores', profId), { turma });

  // Atualiza alunos
  for (const alunoId of alunosMarcados) {
    await updateDoc(doc(db, 'inscricoes', alunoId), { turma });
  }

  alert('Turma designada com sucesso!');
  turmaInput.value = '';
  alunoSelect.selectedIndex = -1;
  carregarTurmas();
});

// ===== Carregar turmas
async function carregarTurmas() {
  const snap = await getDocs(collection(db, 'inscricoes'));
  const turmas = new Set();
  snap.forEach(d => { if (d.data().turma) turmas.add(d.data().turma); });
  turmaSelect.innerHTML = '<option value="">Selecione</option>';
  turmas.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    turmaSelect.appendChild(opt);
  });
}

// ===== Listar alunos da turma
turmaSelect.addEventListener('change', async () => {
  listaAlunosTurma.innerHTML = '';
  if (!turmaSelect.value) return;

  const snap = await getDocs(collection(db, 'inscricoes'));
  snap.forEach(docu => {
    const d = docu.data();
    if (d.turma === turmaSelect.value) {
      const li = document.createElement('li');
      li.textContent = d.nomeCompleto || 'Sem nome';
      listaAlunosTurma.appendChild(li);
    }
  });
});

// ===== Baixar Excel (cada nome em coluna separada)
btnBaixar.addEventListener('click', async () => {
  if (!turmaSelect.value) {
    alert('Selecione uma turma para exportar.');
    return;
  }

  const XLSX = await import("https://cdn.jsdelivr.net/npm/xlsx@0.19.3/+esm");

  const snap = await getDocs(collection(db, 'inscricoes'));
  const alunos = [];
  snap.forEach(docu => {
    const d = docu.data();
    if (d.turma === turmaSelect.value) alunos.push(d.nomeCompleto);
  });

  // Transformar em linhas de 1 linha com cada aluno em uma coluna
  const ws = XLSX.utils.aoa_to_sheet([alunos]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, turmaSelect.value);
  XLSX.writeFile(wb, `turma-${turmaSelect.value}.xlsx`);
});

// ===== Inicialização
carregarProfessores();
carregarAlunos();
carregarTurmas();
