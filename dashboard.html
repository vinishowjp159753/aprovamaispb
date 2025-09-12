import { initializeApp } from "./firebase-config.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const app = initializeApp();
const db = getFirestore(app);

async function updateDashboard() {
    try {
        const alunosSnapshot = await getDocs(query(collection(db, "inscricoes")));
        const professoresSnapshot = await getDocs(query(collection(db, "professores"), where("status", "==", "ativo")));

        // Alunos
        document.getElementById("alunosAtivos").textContent = alunosSnapshot.size;

        // Turmas
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

        // Professores
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
            if (!cursosMap[data.turma]) cursosMap[data.turma] = 0;
            cursosMap[data.turma]++;
        }
    });

    const ctx1 = document.getElementById('enrollmentsChart').getContext('2d');
    new Chart(ctx1, {
        type: 'bar',
        data: { labels: months, datasets: [{ label: 'Matrículas', data: matriculasPorMes, backgroundColor:'rgba(26,42,108,0.7)' }] },
        options: { responsive:true }
    });

    const ctx2 = document.getElementById('classesChart').getContext('2d');
    new Chart(ctx2, {
        type: 'pie',
        data: { labels:Object.keys(cursosMap), datasets:[{ data:Object.values(cursosMap), backgroundColor:['#1a2a6c','#b21f1f','#fdba2d','#28a745','#17a2b8'] }] },
        options: { responsive:true }
    });
}

// Atualiza automaticamente
updateDashboard();
setInterval(updateDashboard, 10000);
