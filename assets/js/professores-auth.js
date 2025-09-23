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
                    email: professorData.email || '',
                    materia: professorData.materia || ''
                }));
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erro na autenticação:', error);
            return false;
        }
    }

    // Buscar turmas do professor (baseado na matéria do professor)
    async buscarTurmasProfessor(professorId, materiaProfessor) {
        try {
            // Buscar todas as inscrições para encontrar as turmas únicas da matéria do professor
            const inscricoesRef = collection(db, "inscricoes");
            const q = query(inscricoesRef, where("materia", "==", materiaProfessor));
            const querySnapshot = await getDocs(q);
            
            // Extrair turmas únicas
            const turmasUnicas = [...new Set(querySnapshot.docs.map(doc => doc.data().turma || 'Geral'))];
            
            const turmas = turmasUnicas.map(turma => ({
                id: turma,
                turma: turma,
                materia: materiaProfessor,
                quantidadeAlunos: querySnapshot.docs.filter(doc => doc.data().turma === turma).length
            }));
            
            return turmas;
        } catch (error) {
            console.error('Erro ao buscar turmas:', error);
            return [];
        }
    }

    // Buscar alunos por matéria (e opcionalmente por turma)
    async buscarAlunosPorMateria(materia, turma = null) {
        try {
            const inscricoesRef = collection(db, "inscricoes");
            let q;
            
            if (turma && turma !== 'Geral') {
                q = query(
                    inscricoesRef, 
                    where("materia", "==", materia),
                    where("turma", "==", turma)
                );
            } else {
                q = query(inscricoesRef, where("materia", "==", materia));
            }
            
            const querySnapshot = await getDocs(q);
            
            const alunos = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                alunos.push({
                    id: doc.id,
                    nome: data.nome || '',
                    email: data.email || '',
                    telefone: data.telefone || '',
                    usuario: data.usuario || '',
                    status: data.status || 'pendente',
                    materia: data.materia || '',
                    turma: data.turma || 'Geral',
                    criadoEm: data.criadoEm ? this.formatarDataString(data.criadoEm) : '',
                    senha: data.senha || ''
                });
            });
            
            return alunos;
        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
            return [];
        }
    }

    // Formatar data string (seu formato atual)
    formatarDataString(dataString) {
        try {
            if (!dataString) return '';
            const data = new Date(dataString);
            return data.toLocaleDateString('pt-BR');
        } catch (error) {
            return dataString;
        }
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
