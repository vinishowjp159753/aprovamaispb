// assets/js/dashboard.js
import { app, db } from "./firebase-config.js";
import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/**
 * Atualiza todos os indicadores e gráficos do dashboard.
 */
async function updateDashboard() {
    try {
        // --- Consultas principais ---
        const alunosSnapshot = await getDocs(collection(db, "inscricoes"));
        const professoresSnapshot = await getDocs(
            query(collection(db, "professores"), where("status", "==", "ativo"))
        );

        // === Alunos Ativos ===
        const alunosAtivos = alunosSnapshot.size;
        document.getElementById("alunosAtivos").textContent = alunosAtivos;

        // === Turmas Ativas e Receita Mensal ===
        const turmasSet = new Set();
        let receitaMensal = 0;
        const currentMonth = new Date().getMonth();

        alunosSnapshot.forEach(docSnap => {
            const data = docSnap.data();
            if (data.turma) turmasSet.add(data.turma);

            // Soma apenas pagamentos do mês atual
            if (data.criadoEm) {
                const date = new Date(data.criadoEm);
                if (date.getMonth() === currentMonth && data.valorPago) {
                    receitaMensal += Number(data.valorPago);
                }
            }
        });

        document.getElementById("turmasAtivas").textContent = turmasSet.size;
        document.getElementById("receitaMensal").textContent =
            `R$ ${receitaMensal.toFixed(2)}`;

        // === Professores Ativos ===
        document.getElementById("totalProfessores").textContent =
            professoresSnapshot.size;

        // === Atualiza Gráficos ===
        updateCharts(alunosSnapshot);

    } catch (err) {
        console.error("Erro ao atualizar dashboard:", err);
    }
}

/**
 * Atualiza gráficos de matrículas por mês e distribuição de turmas.
 * @param {QuerySnapshot} alunosSnapshot
 */
function updateCharts(alunosSnapshot) {
    const months = [
        "Jan","Fev","Mar","Abr","Mai","Jun",
        "Jul","Ago","Set","Out","Nov","Dez"
    ];

    const matriculasPorMes = new Array(12).fill(0);
    const cursosMap = {};

    alunosSnapshot.forEach(docSnap => {
        const data = docSnap.data();

        // Contagem por mês
        if (data.criadoEm) {
            const date = new Date(data.criadoEm);
            matriculasPorMes[date.getMonth()]++;
        }

        // Contagem por turma
        if (data.turma) {
            cursosMap[data.turma] = (cursosMap[data.turma] || 0) + 1;
        }
    });

    // --- Gráfico de Matrículas ---
    const ctx1 = document.getElementById("enrollmentsChart").getContext("2d");
    new Chart(ctx1, {
        type: "bar",
        data: {
            labels: months,
            datasets: [{
                label: "Matrículas",
                data: matriculasPorMes,
                backgroundColor: "rgba(26,42,108,0.7)"
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // --- Gráfico de Turmas ---
    const ctx2 = document.getElementById("classesChart").getContext("2d");
    new Chart(ctx2, {
        type: "pie",
        data: {
            labels: Object.keys(cursosMap),
            datasets: [{
                data: Object.values(cursosMap),
                backgroundColor: ["#1a2a6c","#b21f1f","#fdba2d","#28a745","#17a2b8"]
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// Atualiza inicialmente e depois a cada 10s
updateDashboard();
setInterval(updateDashboard, 10000);
