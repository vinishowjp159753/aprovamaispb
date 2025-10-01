// assets/js/listaAlunos.js
import { db } from "./firebase-config.js";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import QRCode from "https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js";

const alunosTableBody = document.getElementById("alunosTableBody");
const searchInput = document.getElementById("searchInput");
const contadorAlunosEl = document.getElementById("contadorAlunos");

let alunosData = [];

// ---------- Carregar alunos ----------
async function carregarAlunos() {
    const snapshot = await getDocs(collection(db, "inscricoes"));
    alunosData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    // Ordenar: ativos primeiro, pendentes por último
    alunosData.sort((a,b) => {
        if(a.Status === b.Status) return 0;
        if(a.Status === "ativo") return -1;
        return 1;
    });

    renderizarTabela(alunosData);
}

// ---------- Renderizar tabela ----------
function renderizarTabela(data) {
    const termo = searchInput.value.toLowerCase();
    let filtrados = data.filter(a => 
        a.Nome?.toLowerCase().includes(termo) ||
        a.CPF?.toLowerCase().includes(termo) ||
        a.Cupom?.toLowerCase().includes(termo) ||
        (a["Aluno Ethos"]?.toLowerCase() || "").includes(termo)
    );

    alunosTableBody.innerHTML = "";
    contadorAlunosEl.textContent = `Alunos: ${filtrados.length}`;

    filtrados.forEach(aluno => {
        const tr = document.createElement("tr");

        const statusClass = aluno.Status === "ativo" ? "status-ativo" : "status-pendente";

        tr.innerHTML = `
            <td>${aluno.Data || ""}</td>
            <td>${aluno.Nome || ""}</td>
            <td>${aluno.CPF || ""}</td>
            <td>${aluno.Cupom || ""}</td>
            <td>${aluno.Telefone || ""}</td>
            <td class="${statusClass}">${aluno.Status || ""}</td>
            <td>${aluno["Aluno Ethos"] || ""}</td>
            <td>
                <button class="table-btn" data-action="status">Status</button>
                <button class="table-btn delete" data-action="excluir">Excluir</button>
                <button class="table-btn" data-action="pagamento">Pagamento</button>
                <button class="table-btn" data-action="observacao">Observação</button>
            </td>
            <td>
                <a class="table-btn" target="_blank" href="https://api.whatsapp.com/send?phone=55${(aluno.Telefone||"").replace(/\D/g,'')}&text=${encodeURIComponent(`Olá ${aluno.Nome}, sua inscrição está confirmada! Número: ${aluno.Cupom}`)}">WhatsApp</a>
            </td>
            <td class="qr-cell"></td>
        `;

        // ---------- Botões de ação ----------
        tr.querySelector('[data-action="status"]').addEventListener("click", async () => {
            const novoStatus = aluno.Status === "ativo" ? "pendente" : "ativo";
            await updateDoc(doc(db,"inscricoes",aluno.id), { Status: novoStatus });
            carregarAlunos();
        });

        tr.querySelector('[data-action="excluir"]').addEventListener("click", async () => {
            if(confirm(`Deseja excluir o aluno ${aluno.Nome}?`)) {
                await deleteDoc(doc(db,"inscricoes",aluno.id));
                carregarAlunos();
            }
        });

        tr.querySelector('[data-action="pagamento"]').addEventListener("click", () => {
            alert(`Pagamento do aluno ${aluno.Nome} ainda não implementado.`);
        });

        tr.querySelector('[data-action="observacao"]').addEventListener("click", () => {
            alert(`Observação do aluno ${aluno.Nome} ainda não implementado.`);
        });

        // ---------- QR Code ----------
        const qrCell = tr.querySelector(".qr-cell");
        const qrCanvas = document.createElement("canvas");
        const qrUrl = `validar.html?inscricao=${aluno.Cupom}`;

        QRCode.toCanvas(qrCanvas, qrUrl, { width: 80 }, function(error) {
            if(error) console.error(error);

            const qrLink = document.createElement("a");
            qrLink.href = qrCanvas.toDataURL("image/png");
            qrLink.download = `inscricao_${aluno.Cupom}.png`;
            qrLink.textContent = "⬇️ Baixar QR";
            qrLink.className = "table-btn";
            qrLink.style.display = "block";
            qrLink.style.marginTop = "6px";
            qrCell.appendChild(qrLink);
        });

        qrCell.appendChild(qrCanvas);
        alunosTableBody.appendChild(tr);
    });
}

// ---------- Busca ----------
searchInput.addEventListener("input", () => renderizarTabela(alunosData));

// ---------- Inicialização ----------
carregarAlunos();
