import { initializeApp } from "./firebase-config.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const app = initializeApp();
const db = getFirestore(app);

let enrollmentsChart, classesChart;

async function fetchData() {
    const alunos = await getDocs(collection(db, "inscricoes"));
    const professores = await getDocs(query(collection(db, "professores"), where("status", "==", "ativo")));
    return { alunos, professores };
}

function calculateMetrics(alunosSnapshot) {
    const turmas = new Set();
    let receitaMensal = 0;
    const currentMonth = new Date().getMonth();

    alunosSnapshot.forEach(doc => {
        const d = doc.data();
        const criado = d.criadoEm?.toDate ? d.criadoEm.toDate() : new Date(d.criadoEm);
        if (d.turma) turmas.add(d.turma);
        if (criado && criado.getMonth() === currentMonth && d.valorPago) {
            receitaMensal += Number(d.valorPago);
        }
    });

    return { turmas: turmas.size, receitaMensal };
}

function formatBRL(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function updateCards(alunosSnapshot, professoresSnapshot) {
    const { turmas, receitaMensal } = calculateMetrics(alunosSnapshot);

    document.getElementById("alunosAtivos").textContent = alunosSnapshot.size;
    document.getElementById("turmasAtivas").textContent = turmas;
    document.getElementById("receitaMensal").textContent = formatBRL(receitaMensal);
    document.getElementById("totalProfessores").textContent = professoresSnapshot.size;
}

function updateCharts(alunosSnapshot) {
    const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    const matriculasPorMes = new Array(12).fill(0);
    const cursosMap = {};

    alunosSnapshot.forEach(doc => {
        const d = doc.data();
        const criado = d.criadoEm?.toDate ? d.criadoEm.toDate() : new Date(d.criadoEm);
        if (criado) matriculasPorMes[criado.getMonth()]++;
        if (d.turma) cursosMap[d.turma] = (cursosMap[d.turma] || 0) + 1;
    });

    const ctx1 = document.getElementById('enrollmentsChart').getContext('2d');
    const ctx2 = document.getElementById('classesChart').getContext('2d');

    if (!enrollmentsChart) {
        enrollmentsChart = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{ label: 'Matrículas', data: matriculasPorMes, backgroundColor:'rgba(26,42,108,0.7)' }]
            },
            options: { responsive: true }
        });
    } else {
        enrollmentsChart.data.datasets[0].data = matriculasPorMes;
        enrollmentsChart.update();
    }

    if (!classesChart) {
        classesChart = new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: Object.keys(cursosMap),
                datasets: [{ data: Object.values(cursosMap), backgroundColor:['#1a2a6c','#b21f1f','#fdba2d','#28a745','#17a2b8'] }]
            },
            options: { responsive: true }
        });
    } else {
        classesChart.data.labels = Object.keys(cursosMap);
        classesChart.data.datasets[0].data = Object.values(cursosMap);
        classesChart.update();
    }
}

async function updateDashboard() {
    try {
        const { alunos, professores } = await fetchData();
        updateCards(alunos, professores);
        updateCharts(alunos);
    } catch (err) {
        console.error("Erro ao atualizar dashboard:", err);
        document.querySelectorAll('.card-desc').forEach(el => el.textContent = 'Erro ao carregar');
    }
}

// Atualização inicial e periódica (30s para reduzir custos)
updateDashboard();
setInterval(updateDashboard, 30000);

// Menu mobile
const toggleBtn = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
});
overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});
