import { db } from "./firebase-config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Função principal para atualizar dashboard
async function updateDashboard() {
    try {
        // Buscar dados
        const alunosSnapshot = await getDocs(query(collection(db, "inscricoes")));
        const professoresSnapshot = await getDocs(query(collection(db, "professores"), where("status", "==", "ativo")));

        // --- Alunos Ativos ---
        const ativos = alunosSnapshot.docs.filter(doc => doc.data().status === "ativo").length;
        document.getElementById("alunosAtivos").textContent = ativos;

        // --- Turmas Ativas e Receita Mensal ---
        const turmasSet = new Set();
        let receitaMensal = 0;
        const currentMonth = new Date().getMonth();

        alunosSnapshot.forEach(docSnap => {
            const data = docSnap.data();

            if (data.turma) turmasSet.add(data.turma);

            // Converte criadoEm para Date corretamente
            let dateObj = null;
            if (data.criadoEm) {
                if (typeof data.criadoEm === "object" && data.criadoEm.toDate) {
                    // Firebase Timestamp
                    dateObj = data.criadoEm.toDate();
                } else {
                    // String ou outro formato
                    dateObj = new Date(data.criadoEm);
                }
            }

            // Soma receita do mês atual
            if (dateObj && !isNaN(dateObj.getTime()) && data.valorPago) {
                if (dateObj.getMonth() === currentMonth) {
                    receitaMensal += Number(data.valorPago);
                }
            }
        });

        document.getElementById("turmasAtivas").textContent = turmasSet.size;
        document.getElementById("receitaMensal").textContent = `R$ ${receitaMensal.toFixed(2)}`;

        // --- Professores Ativos ---
        document.getElementById("totalProfessores").textContent = professoresSnapshot.size;

        // --- Atualiza gráficos ---
        updateCharts(alunosSnapshot);

    } catch (err) {
        console.error("Erro ao atualizar dashboard:", err);
    }
}

// Função para atualizar gráficos
function updateCharts(alunosSnapshot) {
    const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    const matriculasPorMes = new Array(12).fill(0);
    const cursosMap = {};

    alunosSnapshot.forEach(docSnap => {
        const data = docSnap.data();

        // Converte criadoEm para Date
        let dateObj = null;
        if (data.criadoEm) {
            if (typeof data.criadoEm === "object" && data.criadoEm.toDate) {
                dateObj = data.criadoEm.toDate();
            } else {
                dateObj = new Date(data.criadoEm);
            }
        }

        // Matrículas por mês
        if (dateObj && !isNaN(dateObj.getTime())) {
            matriculasPorMes[dateObj.getMonth()]++;
        }

        // Contagem de alunos por turma
        if (data.turma) {
            cursosMap[data.turma] = (cursosMap[data.turma] || 0) + 1;
        }
    });

    // --- Gráfico Matrículas ---
    const ctx1 = document.getElementById('enrollmentsChart').getContext('2d');
    if (window.enrollmentsChartInstance) window.enrollmentsChartInstance.destroy();
    window.enrollmentsChartInstance = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Matrículas',
                data: matriculasPorMes,
                backgroundColor:'rgba(26,42,108,0.7)'
            }]
        },
        options: { responsive:true, maintainAspectRatio:false }
    });

    // --- Gráfico Distribuição de Turmas ---
    const ctx2 = document.getElementById('classesChart').getContext('2d');
    if (window.classesChartInstance) window.classesChartInstance.destroy();
    window.classesChartInstance = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: Object.keys(cursosMap),
            datasets: [{
                data: Object.values(cursosMap),
                backgroundColor:['#1a2a6c','#b21f1f','#fdba2d','#28a745','#17a2b8']
            }]
        },
        options: { responsive:true, maintainAspectRatio:false }
    });
}

// Inicializa dashboard e atualiza a cada 10 segundos
updateDashboard();
setInterval(updateDashboard, 10000);
