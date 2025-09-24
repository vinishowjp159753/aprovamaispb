import { db } from "./firebase-config.js";
import { collection, getDocs, query, where, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Seletores
const selectProfessor = document.getElementById("selectProfessor");
const selectTurmaProfessor = document.getElementById("selectTurmaProfessor");
const designarTurmaProfessorBtn = document.getElementById("designarTurmaProfessorBtn");

const selectAlunosDiv = document.getElementById("selectAlunos");
const selectTurmaAluno = document.getElementById("selectTurmaAluno");
const designarTurmaAlunoBtn = document.getElementById("designarTurmaAlunoBtn");

const turmasSelect = document.getElementById("turmasSelect");
const alunosTurmaUl = document.getElementById("alunosTurma");
const exportTurmaBtn = document.getElementById("exportTurmaBtn");

// Carregar Professores
async function carregarProfessores(){
    const snapshot = await getDocs(collection(db,"professores"));
    selectProfessor.innerHTML = '<option value="">Selecione um professor</option>';
    snapshot.forEach(docSnap => {
        const p = docSnap.data();
        if(p.status === "ativo"){
            const opt = document.createElement("option");
            opt.value = docSnap.id;
            opt.textContent = `${p.nome} - ${p.materia}`;
            selectProfessor.appendChild(opt);
        }
    });
}

// Carregar Alunos sem turma
async function carregarAlunos(){
    const snapshot = await getDocs(query(collection(db,"inscricoes"), where("turma","==", null)));
    selectAlunosDiv.innerHTML = "";
    snapshot.forEach(docSnap => {
        const aluno = docSnap.data();
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" value="${docSnap.id}"> ${aluno.nomeCompleto}`;
        selectAlunosDiv.appendChild(label);
    });
}

// Designar turma para professor
designarTurmaProfessorBtn.onclick = async () => {
    const profId = selectProfessor.value;
    const turma = selectTurmaProfessor.value;
    if(!profId || !turma){ alert("Selecione professor e turma"); return; }
    await updateDoc(doc(db,"professores",profId), { turma });
    alert("Turma designada ao professor!");
    selectProfessor.value = "";
    selectTurmaProfessor.value = "";
};

// Designar turma para alunos
designarTurmaAlunoBtn.onclick = async () => {
    const turma = selectTurmaAluno.value;
    if(!turma){ alert("Selecione uma turma"); return; }

    const checkboxes = selectAlunosDiv.querySelectorAll("input[type='checkbox']:checked");
    if(checkboxes.length === 0){ alert("Selecione pelo menos um aluno"); return; }

    for(const cb of checkboxes){
        await updateDoc(doc(db,"inscricoes",cb.value), { turma });
    }

    alert("Alunos designados!");
    selectTurmaAluno.value = "";
    carregarAlunos();
    if(turmasSelect.value) carregarTurmaSelecionada();
