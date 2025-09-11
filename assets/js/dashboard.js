// dashboard.js
import { db } from './firebase-config.js'; // Import do Firestore
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

async function carregarDashboard() {
    // Coleções
    const alunosCol = collection(db, 'alunos');
    const profsCol = collection(db, 'professores');
    const turmasCol = collection(db, 'turmas');

    const alunosSnap = await getDocs(alunosCol);
    const profsSnap = await getDocs(profsCol);
    const turmasSnap = await getDocs(turmasCol);

    // Cards
    const alunos = [];
    let receitaMensal = 0;
    const turmasAtivasSet = new Set();

    alunosSnap.forEach(doc => {
        const data = doc.data();
        alunos.push(data);
        if (data.status === 'ativo') {
            turmasAtivasSet.add(data.turma);
        }
        if (data.pagamentos) {
            data.pagamentos.forEach(p => {
                const pago = new Date(p.data);
                const now = new Date();
                if (pago.getMonth() === now.getMonth() && pago.getFullYear() === now.getFullYear()) {
                    receitaMensal += parseFloat(p.valor);
                }
            });
        }
    });

    document.getElementById('alunosAtivos').textContent = alunos.filter(a => a.status === 'ativo').length;
    document.getElementById('turmasAtivas').textContent = turmasAtivasSet.size;
    document.getElementById('totalProfessores').textContent = profsSnap.size;
    document.getElementById('receitaMensal').textContent = `R$ ${receitaMensal.toFixed(2)}`;

    // Gráfico de matrículas (mensal)
    const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const matriculasMensal = new Array(12).fill(0);

    alunos.forEach(a => {
        const matriculaDate = new Date(a.dataMatricula); // campo dataMatricula necessário no Firebase
        matriculasMensal[matriculaDate.getMonth()] += 1;
    });

    const ctxEnroll = document.getElementById('enrollmentsChart').getContext('2d');
    new Chart(ctxEnroll, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [{
                label: 'Matrículas Mensais',
                data: matriculasMensal,
                borderColor: 'rgba(26,42,108,1)',
                backgroundColor: 'rgba(26,42,108,0.2)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            }
        }
    });

    // Gráfico de turmas
    const turmaContagem = {};
    alunos.forEach(a => {
        if (!turmaContagem[a.turma]) turmaContagem[a.turma] = 0;
        turmaContagem[a.turma]++;
    });

    const ctxTurmas = document.getElementById('classesChart').getContext('2d');
    new Chart(ctxTurmas, {
        type: 'doughnut',
        data: {
            labels: Object.keys(turmaContagem),
            datasets: [{
                label: 'Distribuição por Turma',
                data: Object.values(turmaContagem),
                backgroundColor: ['#1a2a6c','#b21f1f','#fdbb2d','#28a745','#17a2b8','#6f42c1']
            }]
        },
        options: { responsive: true }
    });
}

// Logout simples
document.getElementById('logoutBtn').addEventListener('click', () => {
    alert('Deslogado!');
    // firebase.auth().signOut(); // caso utilize autenticação
});

window.onload
