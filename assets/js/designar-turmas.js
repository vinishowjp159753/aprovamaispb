import { app, db } from './firebase-config.js';
import { 
  collection, getDocs, doc, updateDoc 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const professorSelect      = document.getElementById('professorSelect');
const alunoContainer       = document.getElementById('alunoCheckboxContainer');
const turmaInput           = document.getElementById('turmaInput');
const btnDesignar          = document.getElementById('btnDesignar');
const turmaSelect          = document.getElementById('turmaSelect');
const listaAlunosTurma     = document.getElementById('listaAlunosTurma');
const btnBaixar            = document.getElementById('btnBaixar');

// Carrega professores ativos
async function carregarProfessores() {
  const snap = await getDocs(collection(db, 'professores'));
  professorSelect.innerHTML = '<option value="">Selecione</option>';
  snap.forEach(d => {
    const data = d.data();
    if (data.status === 'ativo') {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = data.nome;
      professorSelect.appendChild(opt);
    }
  });
}

// Carrega alunos sem turma
async function carregarAlunosSemTurma() {
  const snap = await getDocs(collection(db, 'inscricoes'));
  alunoContainer.innerHTML = '';
  snap.forEach(d => {
    const data = d.data();
    if (!data.turma) { // apenas quem não tem turma
      const lbl = document.createElement('label');
      lbl.innerHTML = `<input type="checkbox" value="${d.id}"> ${data.nomeCompleto || 'Sem nome'}`;
      alunoContainer.appendChild(lbl);
    }
  });
}

// Designar turma
btnDesignar.addEventListener('click', async () => {
  const profId = professorSelect.value;
  const turma  = turmaInput.value.trim();
  const alunosMarcados = [...alunoContainer.querySelectorAll('input:checked')].map(cb => cb.value);

  if (!profId || !turma || alunosMarcados.length === 0) {
    alert('Selecione professor, turma e pelo menos um aluno.');
    return;
  }

  // Atualiza professor
  await updateDoc(doc(db, 'professores', profId), { turma });

  // Atualiza alunos selecionados
  for (const alunoId of alunosMarcados) {
    await updateDoc(doc(db, 'inscricoes', alunoId), { turma });
  }

  alert('Turma designada com sucesso!');
  turmaInput.value = '';
  await carregarAlunosSemTurma();
  await carregarTurmas();
});

// Carrega turmas existentes
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

// Lista alunos da turma + contagem
turmaSelect.addEventListener('change', async () => {
  listaAlunosTurma.innerHTML = '';
  if (!turmaSelect.value) return;

  const snap = await getDocs(collection(db, 'inscricoes'));
  let count = 1;
  snap.forEach(d => {
    const data = d.data();
    if (data.turma === turmaSelect.value) {
      const li = document.createElement('li');
      li.textContent = `${count++}. ${data.nomeCompleto || 'Sem nome'}`;
      listaAlunosTurma.appendChild(li);
    }
  });
});

// Exportar Excel (cada nome em coluna separada)
btnBaixar.addEventListener('click', async () => {
  if (!turmaSelect.value) {
    alert('Selecione uma turma para exportar.');
    return;
  }
  const XLSX = await import("https://cdn.jsdelivr.net/npm/xlsx@0.19.3/+esm");
  const snap = await getDocs(collection(db, 'inscricoes'));
  const alunos = [];
  snap.forEach(d => {
    const data = d.data();
    if (data.turma === turmaSelect.value) alunos.push(data.nomeCompleto);
  });

  const ws = XLSX.utils.aoa_to_sheet([alunos]); // uma linha, várias colunas
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, turmaSelect.value);
  XLSX.writeFile(wb, `turma-${turmaSelect.value}.xlsx`);
});

// Inicializa
carregarProfessores();
carregarAlunosSemTurma();
carregarTurmas();
