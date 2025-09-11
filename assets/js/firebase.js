// assets/js/firebase.js
// Integração completa com Firebase Firestore

// Configuração do Firebase (substitua se necessário)
const firebaseConfig = {
  apiKey: "AIzaSyAK3U35fipoWOOIJg0yrtgmVfQ7XQxZxqY",
  authDomain: "aprovamaispb-d4e75.firebaseapp.com",
  projectId: "aprovamaispb-d4e75",
  storageBucket: "aprovamaispb-d4e75.firebasestorage.app",
  messagingSenderId: "828577018900",
  appId: "1:828577018900:web:473d8c3fc2685d3f192301"
};

// Inicializar Firebase apenas se não estiver inicializado
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else if (typeof firebase !== 'undefined') {
  // Já está inicializado
  console.log("Firebase já inicializado");
}

// Referência para Firestore
const db = firebase.firestore();

/* =========================
   FUNÇÕES DE AUTENTICAÇÃO (USADAS NO LOGIN)
   ========================= */

/**
 * Autentica um professor
 * @param {string} usuario - Nome de usuário
 * @param {string} senha - Senha
 * @returns {Promise<boolean>} - True se autenticado com sucesso
 */
async function autenticarProfessor(usuario, senha) {
  try {
    const snapshot = await db.collection("professores")
      .where("usuario", "==", usuario)
      .where("senha", "==", senha)
      .where("status", "==", "ativo")
      .get();
    return !snapshot.empty;
  } catch (err) {
    console.error("Erro ao autenticar professor:", err);
    return false;
  }
}

/**
 * Autentica um administrador
 * @param {string} usuario - Nome de usuário
 * @param {string} senha - Senha
 * @returns {Promise<boolean>} - True se autenticado com sucesso
 */
async function autenticarAdmin(usuario, senha) {
  try {
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

/**
 * Verifica se usuário está logado
 * @returns {boolean} - True se estiver logado
 */
function estaLogado() {
  return localStorage.getItem('usuarioLogado') !== null;
}

/**
 * Faz logout do usuário
 */
function logout() {
  localStorage.removeItem('usuarioLogado');
  localStorage.removeItem('tipoAcesso');
  localStorage.removeItem('timestampLogin');
  window.location.href = 'login.html';
}

/**
 * Obtém informações do usuário logado
 * @returns {Object} - Dados do usuário ou null
 */
function obterUsuarioLogado() {
  return {
    usuario: localStorage.getItem('usuarioLogado'),
    tipo: localStorage.getItem('tipoAcesso'),
    loginTimestamp: localStorage.getItem('timestampLogin')
  };
}

/* =========================
   INSCRIÇÕES (ALUNOS)
   ========================= */

async function salvarInscricao(dados) {
  try {
    const docRef = await db.collection("inscricoes").add({
      ...dados,
      criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
      status: "pendente"
    });
    return docRef.id;
  } catch (err) {
    console.error("Erro ao salvar inscrição:", err);
    throw err;
  }
}

async function listarInscricoes() {
  try {
    const snapshot = await db.collection("inscricoes")
      .orderBy("criadoEm", "desc")
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Erro ao listar inscrições:", err);
    throw err;
  }
}

async function atualizarInscricao(id, dados) {
  try {
    await db.collection("inscricoes").doc(id).update({
      ...dados,
      atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log(`Inscrição ${id} atualizada`);
  } catch (err) {
    console.error("Erro ao atualizar inscrição:", err);
    throw err;
  }
}

async function excluirInscricao(id) {
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

async function salvarProfessor(dados) {
  try {
    const docRef = await db.collection("professores").add({
      ...dados,
      status: "ativo",
      criadoEm: firebase.firestore.FieldValue.serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    console.error("Erro ao salvar professor:", err);
    throw err;
  }
}

async function listarProfessores() {
  try {
    const snapshot = await db.collection("professores")
      .orderBy("nome")
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Erro ao listar professores:", err);
    throw err;
  }
}

async function excluirProfessor(id) {
  try {
    await db.collection("professores").doc(id).delete();
    console.log(`Professor ${id} excluído`);
  } catch (err) {
    console.error("Erro ao excluir professor:", err);
    throw err;
  }
}

async function atualizarProfessor(id, dados) {
  try {
    await db.collection("professores").doc(id).update({
      ...dados,
      atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log(`Professor ${id} atualizado`);
  } catch (err) {
    console.error("Erro ao atualizar professor:", err);
    throw err;
  }
}

/* =========================
   DESIGNAR TURMAS
   ========================= */

async function designarTurma(usuarioProfessor, turma) {
  try {
    await db.collection("designacoes").add({
      professor: usuarioProfessor,
      turma,
      criadoEm: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log(`Turma ${turma} designada para ${usuarioProfessor}`);
  } catch (err) {
    console.error("Erro ao designar turma:", err);
    throw err;
  }
}

async function buscarTurmasProfessor(usuarioProfessor) {
  try {
    const snapshot = await db.collection("designacoes")
      .where("professor", "==", usuarioProfessor)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Erro ao buscar turmas do professor:", err);
    throw err;
  }
}

async function buscarInscricoesPorTurma(turma) {
  try {
    const snapshot = await db.collection("inscricoes")
      .where("turma", "==", turma)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Erro ao buscar inscrições por turma:", err);
    throw err;
  }
}

async function listarDesignacoes() {
  try {
    const snapshot = await db.collection("designacoes")
      .orderBy("criadoEm", "desc")
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Erro ao listar designações:", err);
    throw err;
  }
}

// Exportar funções para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
  // Node.js
  module.exports = {
    autenticarProfessor,
    autenticarAdmin,
    estaLogado,
    logout,
    obterUsuarioLogado,
    salvarInscricao,
    listarInscricoes,
    atualizarInscricao,
    excluirInscricao,
    salvarProfessor,
    listarProfessores,
    excluirProfessor,
    atualizarProfessor,
    designarTurma,
    buscarTurmasProfessor,
    buscarInscricoesPorTurma,
    listarDesignacoes
  };
} else {
  // Navegador - adicionar ao escopo global
  window.firebaseApp = {
    autenticarProfessor,
    autenticarAdmin,
    estaLogado,
    logout,
    obterUsuarioLogado,
    salvarInscricao,
    listarInscricoes,
    atualizarInscricao,
    excluirInscricao,
    salvarProfessor,
    listarProfessores,
    excluirProfessor,
    atualizarProfessor,
    designarTurma,
    buscarTurmasProfessor,
    buscarInscricoesPorTurma,
    listarDesignacoes
  };
}
