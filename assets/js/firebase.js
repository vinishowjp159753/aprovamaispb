// assets/js/firebase.js
// Integração completa com Firebase Firestore

// Configuração do Firebase (troque pelos dados reais do seu projeto Firebase)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT_ID.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Inicializar Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

/* =========================
   INSCRIÇÕES (ALUNOS)
   ========================= */

export async function salvarInscricao(dados) {
  try {
    const docRef = await db.collection("inscricoes").add({
      ...dados,
      criadoEm: Date.now(),
      status: "pendente"
    });
    return docRef.id;
  } catch (err) {
    console.error("Erro ao salvar inscrição:", err);
    throw err;
  }
}

export async function listarInscricoes() {
  try {
    const snapshot = await db.collection("inscricoes").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Erro ao listar inscrições:", err);
    throw err;
  }
}

export async function atualizarInscricao(id, dados) {
  try {
    await db.collection("inscricoes").doc(id).update(dados);
    console.log(`Inscrição ${id} atualizada`);
  } catch (err) {
    console.error("Erro ao atualizar inscrição:", err);
    throw err;
  }
}

export async function excluirInscricao(id) {
  try {
    await db.collection("inscricoes").doc(id).delete();
    console.log(`Inscrição ${id} excluída`);
  } catch (err) {
    console.error("Erro ao excluir inscrição:", err);
    throw err;
  }
}

/* =========================
   PROFESSORES
   ========================= */

export async function salvarProfessor(dados) {
  try {
    const docRef = await db.collection("professores").add({
      ...dados,
      status: "ativo",
      criadoEm: Date.now()
    });
    return docRef.id;
  } catch (err) {
    console.error("Erro ao salvar professor:", err);
    throw err;
  }
}

export async function listarProfessores() {
  try {
    const snapshot = await db.collection("professores").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Erro ao listar professores:", err);
    throw err;
  }
}

export async function excluirProfessor(id) {
  try {
    await db.collection("professores").doc(id).delete();
    console.log(`Professor ${id} excluído`);
  } catch (err) {
    console.error("Erro ao excluir professor:", err);
    throw err;
  }
}

export async function atualizarProfessor(id, dados) {
  try {
    await db.collection("professores").doc(id).update(dados);
    console.log(`Professor ${id} atualizado`);
  } catch (err) {
    console.error("Erro ao atualizar professor:", err);
    throw err;
  }
}

/* =========================
   DESIGNAR TURMAS
   ========================= */

export async function designarTurma(usuarioProfessor, turma) {
  try {
    await db.collection("designacoes").add({
      professor: usuarioProfessor,
      turma,
      criadoEm: Date.now()
    });
    console.log(`Turma ${turma} designada para ${usuarioProfessor}`);
  } catch (err) {
    console.error("Erro ao designar turma:", err);
    throw err;
  }
}

export async function buscarTurmasProfessor(usuarioProfessor) {
  try {
    const snapshot = await db.collection("designacoes").where("professor", "==", usuarioProfessor).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Erro ao buscar turmas do professor:", err);
    throw err;
  }
}

export async function buscarInscricoesPorTurma(turma) {
  try {
    const snapshot = await db.collection("inscricoes").where("turma", "==", turma).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Erro ao buscar inscrições por turma:", err);
    throw err;
  }
}

export async function listarDesignacoes() {
  try {
    const snapshot = await db.collection("designacoes").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Erro ao listar designações:", err);
    throw err;
  }
}

/* =========================
   AUTENTICAÇÃO
   ========================= */

export async function autenticarProfessor(usuario, senha) {
  try {
    const snapshot = await db.collection("professores")
      .where("usuario", "==", usuario)
      .where("senha", "==", senha)
      .get();
    return !snapshot.empty;
  } catch (err) {
    console.error("Erro ao autenticar professor:", err);
    return false;
  }
}

export async function autenticarAdmin(usuario, senha) {
  try {
    // ⚠️ Melhor prática: admin deve ser separado e seguro.
    // Aqui, exemplo simples salvo na coleção "admins"
    const snapshot = await db.collection("admins")
      .where("usuario", "==", usuario)
      .where("senha", "==", senha)
      .get();
    return !snapshot.empty;
  } catch (err) {
    console.error("Erro ao autenticar admin:", err);
    return false;
  }
}
