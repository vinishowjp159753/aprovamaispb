// firebase-integration.js
// Funções para integração com Firebase

// Funções para Alunos
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

// Funções para Professores
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

// Funções para Pagamentos
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

// Adicionar funções ao escopo global
window.getAlunos = getAlunos;
window.saveAluno = saveAluno;
window.updateAluno = updateAluno;
window.getProfessores = getProfessores;
window.saveProfessor = saveProfessor;
window.registrarPagamento = registrarPagamento;
