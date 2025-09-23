// assets/js/professores-auth.js
import { 
    collection, 
    getDocs, 
    query, 
    where 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db } from './firebase-config.js';

class ProfessoresAuth {
    // Autenticar professor usando a coleção professores
    async autenticarProfessor(usuario, senha) {
        try {
            const professoresRef = collection(db, "professores");
            const q = query(
                professoresRef, 
                where("usuario", "==", usuario),
                where("senha", "==", senha)
            );
            
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const professorDoc = querySnapshot.docs[0];
                const professorData = professorDoc.data();
                
                // Salvar informações do professor no localStorage
                localStorage.setItem('professorLogado', JSON.stringify({
                    id: professorDoc.id,
                    usuario: professorData.usuario,
                    nome: professorData.nome || professorData.usuario,
                    email: professorData.email || ''
                }));
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erro na autenticação:', error);
            return false;
        }
    }

    // Buscar turmas do professor usando a coleção designacoes
    async buscarTurmasProfessor(professorId) {
        try {
            const designacoesRef = collection(db, "designacoes");
            const q = query(designacoesRef, where("professorId", "==", professorId));
            const querySnapshot = await getDocs(q);
            
            const turmas = [];
            querySnapshot.forEach((doc) => {
                turmas.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return turmas;
        } catch (error) {
            console.error('Erro ao buscar turmas:', error);
            return [];
        }
    }

    // Buscar inscrições por turma
    async buscarInscricoesPorTurma(turmaNome) {
        try {
            const inscricoesRef = collection(db, "inscricoes");
            const q = query(inscricoesRef, where("turma", "==", turmaNome));
            const querySnapshot = await getDocs(q);
            
            const alunos = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                alunos.push({
                    id: doc.id,
                    nomeCompleto: data.nomeCompleto || '',
                    cpf: data.cpf || '',
                    telefone: data.telefone || '',
                    alunoEthos: data.alunoEthos || '',
                    status: data.status || 'pendente',
                    cupom: data.cupom || '',
                    criadoEm: data.criadoEm ? this.formatarData(data.criadoEm) : '',
                    turma: data.turma || ''
                });
            });
            
            return alunos;
        } catch (error) {
            console.error('Erro ao buscar inscrições:', error);
            return [];
        }
    }

    // Formatar data do Firebase
    formatarData(timestamp) {
        if (timestamp && timestamp.toDate) {
            return timestamp.toDate().toLocaleDateString('pt-BR');
        }
        return '';
    }

    // Verificar se professor está logado
    isProfessorLogado() {
        return localStorage.getItem('professorLogado') !== null;
    }

    // Obter dados do professor logado
    getProfessorLogado() {
        const professor = localStorage.getItem('professorLogado');
        return professor ? JSON.parse(professor) : null;
    }

    // Logout
    logout() {
        localStorage.removeItem('professorLogado');
    }
}

// Inicializar e expor globalmente
window.professoresAuth = new ProfessoresAuth();
