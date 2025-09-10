import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  doc 
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

// Funções do Firebase
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

export async function salvarProfessor(prof) {
  try {
    const docRef = await addDoc(collection(db, "professores"), prof);
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
      where("senha", "==", senha)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Erro ao autenticar professor:", error);
    return false;
  }
}

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
