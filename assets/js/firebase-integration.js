// ===============================
// firebase-integration.js
// ===============================
// Funções para integração com Firebase

// ---------- Alunos ----------
async function getAlunos() {
    try {
        const snapshot = await db.collection("inscricoes").get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        notifications.error("Erro ao carregar alunos");
        return [];
    }
}

async function saveAluno(alunoData) {
    try {
        const docRef = await db.collection("inscricoes").add({
            ...alunoData,
            criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
            status: "pendente"
        });
        notifications.success("Aluno salvo com sucesso!");
        return docRef.id;
    } catch (error) {
        console.error("Erro ao salvar aluno:", error);
        notifications.error("Erro ao salvar aluno");
        throw error;
    }
}

async function updateAluno(id, alunoData) {
    try {
        await db.collection("inscricoes").doc(id).update({
            ...alunoData,
            atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
        });
        notifications.success("Aluno atualizado com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar aluno:", error);
        notifications.error("Erro ao atualizar aluno");
        throw error;
    }
}

// ---------- Professores ----------
async function getProfessores() {
    try {
        const snapshot = await db.collection("professores").get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Erro ao buscar professores:", error);
        notifications.error("Erro ao carregar professores");
        return [];
    }
}

async function saveProfessor(professorData) {
    try {
        const docRef = await db.collection("professores").add({
            ...professorData,
            criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
            status: "ativo"
        });
        notifications.success("Professor salvo com sucesso!");
        return docRef.id;
    } catch (error) {
        console.error("Erro ao salvar professor:", error);
        notifications.error("Erro ao salvar professor");
        throw error;
    }
}

// ---------- Pagamentos ----------
async function registrarPagamento(pagamentoData) {
    try {
        const docRef = await db.collection("pagamentos").add({
            ...pagamentoData,
            registradoEm: firebase.firestore.FieldValue.serverTimestamp()
        });
        notifications.success("Pagamento registrado com sucesso!");
        return docRef.id;
    } catch (error) {
        console.error("Erro ao registrar pagamento:", error);
        notifications.error("Erro ao registrar pagamento");
        throw error;
    }
}

// ---------- Controle Financeiro ----------
async function getReceitaTotal() {
    try {
        const snapshot = await db.collection("inscricoes").get();
        let total = 0;
        snapshot.forEach(doc => total += Number(doc.data().valorPago) || 0);
        return total;
    } catch (e) {
        console.error("Erro ao calcular receita total:", e);
        notifications.error("Erro ao calcular receita total");
        return 0;
    }
}

async function getReceitaMensal() {
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
    try {
        const snapshot = await db.collection("inscricoes")
            .where("dataPagamento", ">=", inicioMes)
            .get();
        let total = 0;
        snapshot.forEach(doc => total += Number(doc.data().valorPago) || 0);
        return total;
    } catch (e) {
        console.error("Erro ao calcular receita mensal:", e);
        return 0;
    }
}

async function getDespesas(mensal = false) {
    try {
        let ref = db.collection("despesas");
        if (mensal) {
            const now = new Date();
            const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
            ref = ref.where("data", ">=", inicioMes);
        }
        const snapshot = await ref.get();
        let total = 0;
        const lista = [];
        snapshot.forEach(doc => {
            const d = doc.data();
            lista.push({ id: doc.id, ...d });
            total += Number(d.valor) || 0;
        });
        return { total, lista };
    } catch (e) {
        console.error("Erro ao buscar despesas:", e);
        notifications.error("Erro ao buscar despesas");
        return { total: 0, lista: [] };
    }
}

async function salvarDespesa(despesa) {
    try {
        const docRef = await db.collection("despesas").add({
            ...despesa,
            criadoEm: firebase.firestore.FieldValue.serverTimestamp()
        });
        notifications.success("Despesa registrada!");
        return docRef.id;
    } catch (e) {
        console.error("Erro ao salvar despesa:", e);
        notifications.error("Erro ao salvar despesa");
        throw e;
    }
}

// ---------- Exporta para escopo global ----------
window.getAlunos        = getAlunos;
window.saveAluno        = saveAluno;
window.updateAluno      = updateAluno;
window.getProfessores   = getProfessores;
window.saveProfessor    = saveProfessor;
window.registrarPagamento = registrarPagamento;

window.getReceitaTotal  = getReceitaTotal;
window.getReceitaMensal = getReceitaMensal;
window.getDespesas      = getDespesas;
window.salvarDespesa    = salvarDespesa;
