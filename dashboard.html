import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDYT4OkPkJHkXE44jqIcaWtXL-f105JNoE",
  authDomain: "aprovamaispb-6ea02.firebaseapp.com",
  projectId: "aprovamaispb-6ea02",
  storageBucket: "aprovamaispb-6ea02.firebasestorage.app",
  messagingSenderId: "980253365163",
  appId: "1:980253365163:web:e1d116769cd8031dd1b8ee"
};

// Inicializar Firebase apenas uma vez
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Firebase inicializado com sucesso");
} catch (error) {
  console.error("Erro ao inicializar Firebase:", error);
}

// FUNÇÕES PARA INSCRIÇÕES
export async function salvarInscricao(dados) {
  try {
    const docRef = await addDoc(collection(db, "inscricoes"), dados);
    console.log("Inscrição salva com ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao salvar inscrição:", error);
    throw error;
  }
}

export async function listarInscricoes() {
  try {
    const snapshot = await getDocs(collection(db, "inscricoes"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao listar inscrições:", error);
    return [];
  }
}

export async function atualizarInscricao(id, dados) {
  try {
    await updateDoc(doc(db, "inscricoes", id), dados);
    console.log("Inscrição atualizada:", id);
  } catch (error) {
    console.error("Erro ao atualizar inscrição:", error);
    throw error;
  }
}

// FUNÇÕES PARA PROFESSORES
export async function salvarProfessor(prof) {
  try {
    const docRef = await addDoc(collection(db, "professores"), {
      ...prof,
      criadoEm: new Date().toISOString(),
      status: "ativo"
    });
    console.log("Professor salvo com ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao salvar professor:", error);
    throw error;
  }
}

export async function listarProfessores() {
  try {
    const snapshot = await getDocs(collection(db, "professores"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao listar professores:", error);
    return [];
  }
}

export async function autenticarProfessor(usuario, senha) {
  try {
    const q = query(
      collection(db, "professores"),
      where("usuario", "==", usuario),
      where("senha", "==", senha),
      where("status", "==", "ativo")
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Erro ao autenticar professor:", error);
    return false;
  }
}

export async function verificarLoginProfessor(usuario, senha) {
  try {
    const q = query(
      collection(db, "professores"),
      where("usuario", "==", usuario),
      where("senha", "==", senha),
      where("status", "==", "ativo")
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Erro ao verificar login professor:", error);
    return false;
  }
}

export async function excluirProfessor(id) {
  try {
    await deleteDoc(doc(db, "professores", id));
    console.log("Professor excluído:", id);
  } catch (error) {
    console.error("Erro ao excluir professor:", error);
    throw error;
  }
}

// FUNÇÕES PARA TURMAS E DESIGNACÕES
export async function designarTurma(professor, turma) {
  try {
    await addDoc(collection(db, "designacoes"), {
      professor: professor,
      turma: turma,
      designadoEm: new Date().toISOString()
    });
    console.log(`Turma ${turma} designada para ${professor}`);
  } catch (error) {
    console.error("Erro ao designar turma:", error);
    throw error;
  }
}

export async function buscarTurmasProfessor(usuario) {
  try {
    const q = query(
      collection(db, "designacoes"),
      where("professor", "==", usuario)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar turmas do professor:", error);
    return [];
  }
}

export async function buscarInscricoesPorTurma(turma) {
  try {
    const q = query(
      collection(db, "inscricoes"),
      where("turma", "==", turma)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar inscrições por turma:", error);
    return [];
  }
}

// FUNÇÕES PARA ADMIN
export async function autenticarAdmin(usuario, senha) {
  try {
    // Verificar se é um professor primeiro
    const isProfessor = await autenticarProfessor(usuario, senha);
    
    if (isProfessor) {
      // Verificar se é admin (usuários específicos)
      const admins = ['admin', 'administrador', 'diretor'];
      return admins.includes(usuario.toLowerCase());
    }
    
    return false;
  } catch (error) {
    console.error("Erro ao autenticar admin:", error);
    return false;
  }
}

// FUNÇÕES PARA RELATÓRIOS
export async function buscarInscricoesPorStatus(status) {
  try {
    const q = query(
      collection(db, "inscricoes"),
      where("status", "==", status)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar inscrições por status:", error);
    return [];
  }
}

export async function buscarInscricoesPorCurso(curso) {
  try {
    const q = query(
      collection(db, "inscricoes"),
      where("course", "==", curso)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar inscrições por curso:", error);
    return [];
  }
}

// FUNÇÃO PARA GERAR RELATÓRIOS
export async function gerarRelatorio(tipo, filtros = {}) {
  try {
    let dados = [];
    
    switch(tipo) {
      case 'matriculas':
        dados = await listarInscricoes();
        break;
      case 'professores':
        dados = await listarProfessores();
        break;
      case 'financeiro':
        // Implementar lógica financeira
        dados = await listarInscricoes();
        break;
      default:
        dados = await listarInscricoes();
    }
    
    return dados;
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    return [];
  }
}
