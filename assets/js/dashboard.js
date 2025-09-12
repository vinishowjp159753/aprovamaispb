import { db } from './firebase-config.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    // Verifica login
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('userName').textContent = usuarioLogado;
    document.getElementById('currentUser').textContent = usuarioLogado;

    // Carrega dados do Firebase
    await loadDashboardData();

    // Botão logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('usuarioLogado');
        localStorage.removeItem('tipoAcesso');
        window.location.href = 'login.html';
    });

    // Configura gráficos
    setupCharts();
});

async function loadDashboardData() {
    try {
        // Alunos ativos
        const inscricoesSnapshot = await getDocs(query(collection(db, "inscricoes"), where("status", "==", "confirmado")));
        document.getElementById('alunosAtivos').textContent = inscricoesSnapshot.size;

        // Turmas ativas
        const turmasSet = new Set();
        inscricoesSnapshot.forEach(doc => {
            const data = doc.data();
            if(data.course) turmasSet.add(data.course);
        });
        document.getElementById('turmasAtivas').textContent = turmasSet.size;

        // Receita mensal
        const hoje = new Date();
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();
        let receita = 0;
        inscricoesSnapshot.forEach(doc => {
            const data = doc.data();
            const criado = new Date(data.criadoEm);
            if (criado.getMonth() === mesAtual && criado.getFullYear() === anoAtual) {
                receita += data.valorPago ? parseFloat(data.valorPago) : 0;
            }
        });
        document.getElementById('receitaMensal').textContent = `R$ ${receita.toFixed(2)}`;

        // Professores ativos
        const professoresSnapshot = await getDocs(collection(db, "professores"));
        document.getElementById('totalProfessores').textContent = professoresSnapshot.size;
    } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
    }
}

function setupCharts() {
    // Exemplo de gráfico
    const enrollmentsCtx = document.getElementById('enrollmentsChart').getContext('2d');
    new Chart(enrollmentsCtx, {
        type: 'line',
        data: {
            labels: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
            datasets: [{
                label: 'Matrículas',
                data: [25,32,28,41,36,52,47,63,55,68,72,80],
                borderColor: '#1a2a6c',
                backgroundColor: 'rgba(26,42,108,0.1)',
                tension: 0.3,
                fill: true
            }]
        }
    });

    const classesCtx = document.getElementById('classesChart').getContext('2d');
    new Chart(classesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Turma A','Turma B','Turma C','Turma D','Turma E'],
            datasets: [{ data:[25,20,18,15,22], backgroundColor:['#1a2a6c','#b21f1f','#fdbb2d','#28a745','#17a2b8'] }]
        }
    });
}
