import { initializeApp } from "./firebase-config.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Inicializa Firebase
const app = initializeApp();
const db = getFirestore(app);

const tableBody = document.querySelector("#studentsTable tbody");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

async function loadStudents() {
    try {
        // Pega todos os alunos da coleção "inscricao"
        const alunosSnapshot = await getDocs(collection(db, "inscricao"));
        tableBody.innerHTML = "";

        alunosSnapshot.forEach(doc => {
            const data = doc.data();
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${doc.id}</td>
                <td>${data.name || "-"}</td>
                <td>${data.course || "-"}</td>
                <td>${data.status || "-"}</td>
                <td>${data.numeroPedido || "-"}</td>
                <td>${data.email || "-"}</td>
                <td>${data.phone || "-"}</td>
                <td>${data.senha || "-"}</td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao carregar alunos:", error);
    }
}

// Busca simples
searchBtn.addEventListener("click", () => {
    const searchText = searchInput.value.toLowerCase();
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach(row => {
        const cells = Array.from(row.cells).map(cell => cell.textContent.toLowerCase());
        if (cells.some(text => text.includes(searchText))) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});

// Permite buscar com Enter
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchBtn.click();
});

// Carrega alunos ao abrir a página
loadStudents();
