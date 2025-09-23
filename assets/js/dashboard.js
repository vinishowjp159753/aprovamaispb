import { db } from "./firebase-config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

async function updateDashboard() {
    try {
        const alunosSnapshot = await getDocs(query(collection(db, "inscricoes")));
        const professoresSnapshot = await getDocs(query(collection(db, "professores"), where("status", "==", "ativo")));

        // Alunos ativos
        const ativos = alunosSnapshot.docs.filter(doc => doc.data().status === "ativo").length;
        document.getElementById("alunosAtivos").textContent = ativos;

        // Turmas e receita mensal
        const turmasSet = new Set();
        let receitaMensal = 0;
        const currentMonth = new Date().getMonth();
        alunosSnapshot.forEach(docSnap => {
            const data = docSnap.data();
            if (data.turma) turmasSet.add(data.turma);

            if (data.criadoEm) {
                const date = new Date(data.criadoEm);
                if (date.getMonth() === currentMonth && data.valorPago) {
                    receitaMensal += Number(data.valorPago);
                }
            }
        });
        document.getElementById("turmasAtivas").textContent = turmasSet.size;
        document.getElementById("receitaMensal").textContent = `R$ ${receitaMensal.toFixed(2)}`;

        // Professores ativos
        document.getElementById("totalProfessores").textContent = professoresSnapshot.size;

        // Atualiza gráficos
        updateCharts(alunosSnapshot);

    } catch (err) {
        console.error("Erro ao atualizar dashboard:", err);
    }
}

function updateCharts(alunosSnapshot) {
    const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    const matriculasPorMes = new Array(12).fill(0);
    const cursosMap = {};

    alunosSnapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.criadoEm) {
            const date = new Date(data.criadoEm);
            matriculasPorMes[date.getMonth()]++;
        }
        if (data.turma) {
            cursosMap[data.turma] = (cursosMap[data.turma] || 0) + 1;
        }
    });

    // Gráfico Matrículas
    const ctx1 = document.getElementById('enrollmentsChart').getContext('2d');
    if (window.enrollmentsChartInstance) window.enrollmentsChartInstance.destroy();
    window.enrollmentsChartInstance = new Chart(ctx1, {
        type: 'bar',
        data: { labels: months, datasets: [{ label: 'Matrículas', data: matriculasPorMes, backgroundColor:'rgba(26,42,108,0.7)' }] },
        options: { responsive:true, maintainAspectRatio:false }
    });

    // Gráfico Turmas
    const ctx2 = document.getElementById('classesChart').getContext('2d');
    if (window.classesChartInstance) window.classesChartInstance.destroy();
    window.classesChartInstance = new Chart(ctx2, {
        type: 'pie',
        data: { labels:Object.keys(cursosMap), datasets:[{ data:Object.values(cursosMap), backgroundColor:['#1a2a6c','#b21f1f','#fdba2d','#28a745','#17a2b8'] }] },
        options: { responsive:true, maintainAspectRatio:false }
    });
}

// Inicializa e atualiza a cada 10s
updateDashboard();
setInterval(updateDashboard, 10000);
