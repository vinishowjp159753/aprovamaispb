import { app, db } from "./firebase-config.js";
import { 
    collection, getDocs, addDoc, deleteDoc, query, where, doc 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Elementos
const selectProfessor = document.getElementById("selectProfessor");
const selectTurma = document.getElementById("selectTurma");
const alunosList = document.getElementById("alunosList");
const designarTurmaBtn = document.getElementById("designarTurmaBtn");
const designacoesBody = document.getElementById("designacoesBody");
const turmasSelect = document.getElementById("turmasSelect");
const turmaAlunosList = document.getElementById("turmaAlunosList");
const exportTurmaBtn = document.getElementById("exportTurmaBtn");

let professores = [];
let alunos = [];
let designacoes = [];

// Carrega professores ativos
async function carregarProfessores(){
    const snapshot = await getDocs(collection(db,"professores"));
    professores = snapshot.docs.map(d=>({ id: d.id, ...d.data() })).filter(p=>p.status==="ativo");
    selectProfessor.innerHTML = `<option value="">Selecione um professor</option>`;
    professores.forEach(p=>{
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = `${p.nome} - ${p.materia}`;
        selectProfessor.appendChild(opt);
    });
}

// Carrega alunos disponíveis (não em nenhuma turma)
async function carregarAlunosDisponiveis(){
    const snapshot = await getDocs(collection(db,"inscricoes"));
    alunos = snapshot.docs.map(d=>({ id: d.id, ...d.data() }));
    // Filtra alunos não designados
    const designacoesSnapshot = await getDocs(collection(db,"designacoes"));
    const alunosDesignados = designacoesSnapshot.docs.map(d=>d.data().alunoId);
    alunos = alunos.filter(a=>!alunosDesignados.includes(a.id));

    alunosList.innerHTML = "";
    alunos.forEach(a=>{
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" value="${a.id}"> ${a.nomeCompleto}`;
        alunosList.appendChild(label);
    });
}

// Designar turma para vários alunos
async function designarTurma(){
    const profId = selectProfessor.value;
    const turma = selectTurma.value;
    if(!profId || !turma){ alert("Selecione professor e turma"); return; }

    const checkboxes = alunosList.querySelectorAll("input[type='checkbox']:checked");
    if(checkboxes.length === 0){ alert("Selecione ao menos um aluno"); return; }

    for(const cb of checkboxes){
        const alunoId = cb.value;
        await addDoc(collection(db,"designacoes"),{
            professorId: profId,
            turma,
            alunoId
        });
    }
    alert("Turma designada com sucesso!");
    await carregarAlunosDisponiveis();
    await carregarDesignacoes();
    carregarTurmasSelect();
}

// Carrega designações
async function carregarDesignacoes(){
    const snapshot = await getDocs(collection(db,"designacoes"));
    designacoes = snapshot.docs.map(d=>({ id: d.id, ...d.data() }));

    designacoesBody.innerHTML = "";
    designacoes.forEach(d=>{
        const prof = professores.find(p=>p.id===d.professorId);
        const aluno = alunos.find(a=>a.id===d.alunoId) || { nomeCompleto: "Aluno designado" };
        if(prof){
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${prof.nome}</td>
                <td>${d.turma}</td>
                <td>${aluno.nomeCompleto}</td>
                <td><button class="btn delete-btn" data-id="${d.id}">Remover</button></td>
            `;
            designacoesBody.appendChild(tr);
        }
    });

    designacoesBody.querySelectorAll(".delete-btn").forEach(btn=>{
        btn.addEventListener("click", async ()=>{
            await deleteDoc(doc(db,"designacoes",btn.dataset.id));
            carregarDesignacoes();
            carregarAlunosDisponiveis();
        });
    });
}

// Carrega turmas para aba de baixo
function carregarTurmasSelect(){
    const turmas = [...new Set(designacoes.map(d=>d.turma))];
    turmasSelect.innerHTML = `<option value="">Selecione uma turma</option>`;
    turmas.forEach(t=>{
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        turmasSelect.appendChild(opt);
    });
}

// Carrega alunos da turma selecionada
function carregarAlunosTurma(){
    const turma = turmasSelect.value;
    if(!turma){ turmaAlunosList.innerHTML=""; return; }
    const alunosTurma = designacoes.filter(d=>d.turma===turma).map(d=>d.alunoId);
    const snapshot = alunos.concat(alunosTurma.map(id=>({ id, nomeCompleto: "Aluno designado" }))); // placeholder
    turmaAlunosList.innerHTML = "";
    let count = 1;
    designacoes.filter(d=>d.turma===turma).forEach(d=>{
        const aluno = alunos.find(a=>a.id===d.alunoId) || { nomeCompleto: "Aluno designado" };
        const li = document.createElement("li");
        li.textContent = `${count} - ${aluno.nomeCompleto}`;
        turmaAlunosList.appendChild(li);
        count++;
    });
}

// Exportar turma XLSX
async function exportarTurmaXLSX(){
    const turma = turmasSelect.value;
    if(!turma){ alert("Selecione uma turma"); return; }

    const alunosTurma = designacoes.filter(d=>d.turma===turma).map(d=>d.alunoId);
    const data = alunosTurma.map((id, index)=>{
        const aluno = alunos.find(a=>a.id===id) || { nomeCompleto: "Aluno designado" };
        return { [`Aluno ${index+1}`]: aluno.nomeCompleto };
    });

    const worksheet = XLSX.utils.json_to_sheet(data, { header: Object.keys(data[0]) });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, turma);
    XLSX.writeFile(workbook, `${turma}.xlsx`);
}

// Inicialização
document.addEventListene
