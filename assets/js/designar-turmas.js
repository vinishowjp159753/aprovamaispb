import { app, db } from "./firebase-config.js";
import { collection, getDocs, addDoc, deleteDoc, query, where, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

let professores = [], alunos = [];

async function carregarProfessores() {
    const snapshot = await getDocs(collection(db,"professores"));
    professores = [];
    snapshot.forEach(d => { if(d.data().status==="ativo") professores.push({id:d.id,...d.data()}); });
    const select = document.getElementById("selectProfessor");
    select.innerHTML = `<option value="">Selecione um professor</option>`;
    professores.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = `${p.nome} - ${p.materia}`;
        select.appendChild(opt);
    });
    carregarDesignacoes();
}

async function carregarAlunos() {
    const snapshot = await getDocs(collection(db,"inscricoes"));
    alunos = [];
    snapshot.forEach(d => { if(d.data().status==="ativo") alunos.push({id:d.id,...d.data()}); });
    const select = document.getElementById("selectAluno");
    select.innerHTML = `<option value="">Selecione um aluno</option>`;
    alunos.forEach(a => {
        const opt = document.createElement("option");
        opt.value = a.id;
        opt.textContent = a.nome;
        select.appendChild(opt);
    });
    carregarDesignacoesAlunos();
}

async function designarTurma(){
    const profId = document.getElementById("selectProfessor").value;
    const turma = document.getElementById("selectTurma").value;
    if(!profId || !turma) return alert("Selecione professor e turma");
    const q = query(collection(db,"designacoes"), where("professorId","==",profId), where("turma","==",turma));
    const snap = await getDocs(q);
    if(!snap.empty) return alert("Esta designação já existe");
    await addDoc(collection(db,"designacoes"), {professorId:profId,turma});
    alert("Professor designado com sucesso!");
    carregarDesignacoes();
}

async function designarAluno(){
    const alunoId = document.getElementById("selectAluno").value;
    const turma = document.getElementById("selectTurmaAluno").value;
    if(!alunoId || !turma) return alert("Selecione aluno e turma");
    const q = query(collection(db,"designacoesAlunos"), where("alunoId","==",alunoId), where("turma","==",turma));
    const snap = await getDocs(q);
    if(!snap.empty) return alert("Aluno já designado para esta turma");
    await addDoc(collection(db,"designacoesAlunos"), {alunoId, turma});
    alert("Aluno designado com sucesso!");
    carregarDesignacoesAlunos();
}

async function carregarDesignacoes(){
    const snapshot = await getDocs(collection(db,"designacoes"));
    const tbody = document.getElementById("designacoesBody");
    tbody.innerHTML = snapshot.empty ? `<tr><td colspan="3">Nenhuma designação</td></tr>` : "";
    snapshot.forEach(d => {
        const data = d.data();
        const p = professores.find(x=>x.id===data.professorId);
        if(p){
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${p.nome}</td><td>${data.turma}</td><td><button class="btn delete-btn" data-id="${d.id}"><i class="fas fa-trash"></i> Remover</button></td>`;
            tbody.appendChild(tr);
        }
    });
    document.querySelectorAll('#designacoesBody .delete-btn').forEach(btn=>btn.addEventListener('click', async ()=>{ await deleteDoc(doc(db,"designacoes",btn.dataset.id)); carregarDesignacoes(); }));
}

async function carregarDesignacoesAlunos(){
    const snapshot = await getDocs(collection(db,"designacoesAlunos"));
    const tbody = document.getElementById("designacoesAlunosBody");
    tbody.innerHTML = snapshot.empty ? `<tr><td colspan="3">Nenhuma designação</td></tr>` : "";
    snapshot.forEach(d=>{
        const data = d.data();
        const a = alunos.find(x=>x.id===data.alunoId);
        if(a){
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${a.nome}</td><td>${data.turma}</td><td><button class="btn delete-btn" data-id="${d.id}"><i class="fas fa-trash"></i> Remover</button></td>`;
            tbody.appendChild(tr);
        }
    });
    document.querySelectorAll('#designacoesAlunosBody .delete-btn').forEach(btn=>btn.addEventListener('click', async ()=>{ await deleteDoc(doc(db,"designacoesAlunos",btn.dataset.id)); carregarDesignacoesAlunos(); }));
}

document.addEventListener("DOMContentLoaded", ()=>{
    carregarProfessores();
    carregarAlunos();
    document.getElementById("designarTurmaBtn").addEventListener("click", designarTurma);
    document.getElementById("designarAlunoBtn").addEventListener("click", designarAluno);
});
