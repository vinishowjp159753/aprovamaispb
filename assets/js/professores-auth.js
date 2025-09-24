// assets/js/professores-auth.js - VERSÃO REAL
import { 
    collection, 
    getDocs, 
    query, 
    where 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db } from './firebase-config.js';

class ProfessoresAuth {
    async autenticarProfessor(usuario, senha) {
        try {
            console.log('🔐 Tentando autenticar:', usuario);
            
            const professoresRef = collection(db, "professores");
            const q = query(professoresRef, where("usuario", "==", usuario));
            
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const professorDoc = querySnapshot.docs[0];
                const professorData = professorDoc.data();
                
                console.log('📋 Dados encontrados:', professorData);
                
                // Verificar se a senha corresponde
                if (professorData.senha === senha) {
                    console.log('✅ Senha correta!');
                    
                    localStorage.setItem('professorLogado', JSON.stringify({
                        id: professorDoc.id,
                        usuario: professorData.usuario,
                        nome: professorData.nome || professorData.usuario,
                        email: professorData.email || '',
                        materia: professorData.materia || ''
                    }));
                    
                    return true;
                } else {
                    console.log('❌ Senha incorreta');
                    return false;
                }
            }
            console.log('❌ Usuário não encontrado');
            return false;
        } catch (error) {
            console.error('💥 Erro na autenticação:', error);
            return false;
        }
    }

    async buscarTurmasProfessor(professorId) {
        try {
            const designacoesRef = collection(db, "designacoes");
            const q = query(designacoesRef, where("professorId", "==", professorId));
            const querySnapshot = await getDocs(q);
            
            const turmas = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                turmas.push({
                    id: doc.id,
                    turma: data.turma,
                    professorId: data.professorId,
                    disciplina: data.disciplina || '',
                    periodo: data.periodo || ''
                });
            });
            
            return turmas;
        } catch (error) {
            console.error('Erro ao buscar turmas:', error);
            return [];
        }
    }

    async buscarAlunosPorTurma(turma) {
        try {
            const inscricoesRef = collection(db, "inscricoes");
            const q = query(inscricoesRef, where("turma", "==", turma));
            
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
                    turma: data.turma || '',
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

    formatarDataString(dataString) {
        try {
            if (!dataString) return '';
            const data = new Date(dataString);
            return data.toLocaleDateString('pt-BR');
        } catch (error) {
            return dataString;
        }
    }

    isProfessorLogado() {
        return localStorage.getItem('professorLogado') !== null;
    }

    getProfessorLogado() {
        const professor = localStorage.getItem('professorLogado');
        return professor ? JSON.parse(professor) : null;
    }

    logout() {
        localStorage.removeItem('professorLogado');
    }
}

window.professoresAuth = new ProfessoresAuth();
