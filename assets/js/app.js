// assets/js/app.js
import {
  listarInscricoes,
  listarProfessores,
  salvarProfessor,
  excluirProfessor,
  designarTurma,
  buscarTurmasProfessor,
  buscarInscricoesPorTurma,
  atualizarInscricao
} from "./firebase.js";

import { mostrarNotificacao, gerarSenha, formatarCPF } from "./utils.js";

const VALOR_MATRICULA = 150; // ajuste se necessário

document.addEventListener('DOMContentLoaded', async () => {
  // Validação de sessão
  const usuario = localStorage.getItem('usuarioLogado');
  const userType = localStorage.getItem('userType'); // 'professor' | 'admin'
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // Se não estiver logado, redireciona para login
  if (!usuario) {
    window.location.href = 'login.html';
    return;
  }

  // Elementos do layout
  const adminPanel = document.getElementById('admin-panel');
  const professorPanel = document.getElementById('professor-panel');
  const userNameSpan = document.getElementById('user-name');

  if (userNameSpan) userNameSpan.textContent = usuario;

  if (isAdmin && adminPanel) {
    adminPanel.style.display = 'block';
    await carregarDashboardAdmin();
    setupAdminActions();
  } else if (userType === 'professor' && professorPanel) {
    professorPanel.style.display = 'block';
    await carregarPainelProfessor(usuario);
  } else {
    // Se não for admin e não for professor, forçar logout
    window.location.href = 'login.html';
  }
});

/* -------------------------
  FUNÇÕES DO ADMIN (DASHBOARD)
   ------------------------- */

async function carregarDashboardAdmin() {
  try {
    // carregar inscrições e professores
    const [inscricoes, professores] = await Promise.all([
      listarInscricoes(),
      listarProfessores()
    ]);

    renderEstatisticas(inscricoes, professores);
    renderTabelaAlunos(inscricoes);
    renderTabelaProfessores(professores);
    // gerar opções de filtros se existir select
    popularFiltrosCursos(inscricoes);
  } catch (err) {
    console.error('Erro ao carregar dashboard admin:', err);
    mostrarNotificacao('Erro ao carregar dashboard', 'error');
  }
}

function renderEstatisticas(inscricoes = [], professores = []) {
  const totalAlunos = inscricoes.length;
  const totalProfessores = professores.length;

  const totalConfirmadas = inscricoes.filter(i => i.status === 'confirmado').length;
  const receita = totalConfirmadas * VALOR_MATRICULA;

  document.getElementById('total-alunos') && (document.getElementById('total-alunos').textContent = totalAlunos);
  document.getElementById('total-professores') && (document.getElementById('total-professores').textContent = totalProfessores);
  document.getElementById('receita-mensal') && (document.getElementById('receita-mensal').textContent = `R$ ${receita.toFixed(2)}`);

  // total turmas: agregue turmas a partir das designações de cada professor
  calcularTotalTurmas().then(totalTurmas => {
    document.getElementById('total-turmas') && (document.getElementById('total-turmas').textContent = totalTurmas);
    document.getElementById('aulas-hoje') && (document.getElementById('aulas-hoje').textContent = totalTurmas); // placeholder
  }).catch(()=>{ /* não crítico */ });
}

async function calcularTotalTurmas() {
  try {
    const profs = await listarProfessores();
    const allTurmas = new Set();
    for (const p of profs) {
      const turmas = await buscarTurmasProfessor(p.usuario);
      turmas.forEach(t => allTurmas.add(t.turma));
    }
    return allTurmas.size;
  } catch (err) {
    console.error('Erro ao calcular turmas:', err);
    return 0;
  }
}

function renderTabelaAlunos(inscricoes = []) {
  const tbody = document.querySelector('#tabela-alunos tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  inscricoes.forEach(i => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i.name}</td>
      <td>${formatarCPF(i.cpf || '')}</td>
      <td>${i.email || ''}</td>
      <td>${i.course || ''}</td>
      <td>
        <select data-id="${i.id}" class="status-select">
          <option value="pendente" ${i.status === 'pendente' ? 'selected' : ''}>Pendente</option>
          <option value="confirmado" ${i.status === 'confirmado' ? 'selected' : ''}>Confirmado</option>
          <option value="cancelado" ${i.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
        </select>
      </td>
      <td>${i.turma || ''}</td>
      <td>
        <button class="btn-action btn-edit" data-id="${i.id}">✏️</button>
        <button class="btn-action btn-delete" data-id="${i.id}">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // listeners status selects
  document.querySelectorAll('.status-select').forEach(sel => {
    sel.addEventListener('change', async (e) => {
      const id = e.target.dataset.id;
      const status = e.target.value;
      try {
        await atualizarInscricao(id, { status });
        mostrarNotificacao('Status atualizado', 'success');
        // atualizar estatísticas
        const inscricoes = await listarInscricoes();
        renderEstatisticas(inscricoes, await listarProfessores());
      } catch (err) {
        console.error('Erro atualizar status:', err);
        mostrarNotificacao('Erro ao atualizar status', 'error');
      }
    });
  });

  // editar / excluir - (excluir não implementado no firebase exemplo de origem para inscrições)
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (confirm('Deseja realmente excluir esta inscrição?')) {
        // aqui, caso tenha função excluirInscricao, chamá-la. Senão, apenas sinalizar.
        mostrarNotificacao('Exclusão não implementada diretamente. Use Firestore console.', 'warning');
      }
    });
  });
}

function renderTabelaProfessores(professores = []) {
  const tbody = document.querySelector('#tabela-professores tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  professores.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.nome || ''}</td>
      <td>${p.usuario || ''}</td>
      <td>${p.email || ''}</td>
      <td>${p.disciplina || ''}</td>
      <td>
        <span class="status-badge status-ativo">${p.status || 'ativo'}</span>
      </td>
      <td>
        <button class="btn-action btn-assign" data-usuario="${p.usuario}">🎯 Designar Turma</button>
        <button class="btn-action btn-delete" data-id="${p.id}" data-usuario="${p.usuario}">🗑️ Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // listeners
  document.querySelectorAll('.btn-assign').forEach(btn => {
    btn.addEventListener('click', async () => {
      const usuario = btn.dataset.usuario;
      const turma = prompt(`Digite o nome da turma para designar ao professor ${usuario}:`);
      if (!turma) return;
      try {
        await designarTurma(usuario, turma);
        mostrarNotificacao(`Turma ${turma} designada para ${usuario}`, 'success');
      } catch (err) {
        console.error('Erro designar turma:', err);
        mostrarNotificacao('Erro ao designar turma', 'error');
      }
    });
  });

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const usuario = btn.dataset.usuario;
      if (!confirm(`Excluir professor ${usuario}?`)) return;
      try {
        await excluirProfessor(id);
        mostrarNotificacao('Professor excluído', 'success');
        const profs = await listarProfessores();
        renderTabelaProfessores(profs);
      } catch (err) {
        console.error('Erro excluir professor:', err);
        mostrarNotificacao('Erro ao excluir professor', 'error');
      }
    });
  });
}

function setupAdminActions() {
  // criar professor
  document.getElementById('abrir-criar-prof')?.addEventListener('click', async () => {
    const nome = prompt('Nome completo do professor:');
    if (!nome) return;
    const disciplina = prompt('Disciplina (opcional):') || '';
    const usuario = nome.toLowerCase().replace(/\s+/g, '.') + Math.floor(Math.random() * 90 + 10);
    const senha = gerarSenha();
    try {
      await salvarProfessor({ nome, usuario, senha, disciplina });
      mostrarNotificacao(`Professor criado: ${usuario} / ${senha}`, 'success');
      const profs = await listarProfessores();
      renderTabelaProfessores(profs);
    } catch (err) {
      console.error('Erro criar professor:', err);
      mostrarNotificacao('Erro ao criar professor', 'error');
    }
  });

  // export CSV
  document.getElementById('export-btn')?.addEventListener('click', async () => {
    try {
      const inscricoes = await listarInscricoes();
      if (!inscricoes.length) {
        mostrarNotificacao('Nenhum dado para exportar', 'warning');
        return;
      }

      const rows = [
        ['Nome', 'Email', 'Curso', 'CPF', 'Data de inscrição', 'Status', 'Turma']
      ];
      inscricoes.forEach(i => {
        rows.push([
          i.name || '',
          i.email || '',
          i.course || '',
          formatarCPF(i.cpf || ''),
          i.criadoEm ? new Date(i.criadoEm).toLocaleString('pt-BR') : '',
          i.status || '',
          i.turma || ''
        ]);
      });

      const csvContent = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inscricoes_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      mostrarNotificacao('CSV exportado com sucesso', 'success');
    } catch (err) {
      console.error('Erro exportar CSV:', err);
      mostrarNotificacao('Erro ao exportar CSV', 'error');
    }
  });
}

/* -------------------------
  PAINEL DO PROFESSOR
   ------------------------- */

async function carregarPainelProfessor(usuario) {
  try {
    const turmas = await buscarTurmasProfessor(usuario);
    const container = document.getElementById('turmas-professor');
    if (!container) return;

    container.innerHTML = '';
    let totalAlunos = 0;

    for (const t of turmas) {
      const alunos = await buscarInscricoesPorTurma(t.turma);
      totalAlunos += alunos.length;

      const turmaCard = document.createElement('div');
      turmaCard.className = 'turma-card card';
      turmaCard.innerHTML = `
        <div class="turma-header">
          <h3>Turma ${t.turma}</h3>
          <div>${alunos.length} alunos</div>
        </div>
        <div>
          <p><strong>Horário:</strong> ${t.horario || 'A definir'}</p>
          <p><strong>Dias:</strong> ${t.dias || 'A definir'}</p>
        </div>
        <h4>Alunos</h4>
        <div class="alunos-list">
          ${alunos.map(a => `
            <div class="aluno-item">
              <div>
                <div><strong>${a.name}</strong></div>
                <div>${a.phone || ''} • ${a.email || ''}</div>
              </div>
              <div>
                <a href="https://wa.me/55${(a.phone||'').replace(/\D/g,'')}" target="_blank" class="btn-modern outline">📲 Contatar</a>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      container.appendChild(turmaCard);
    }

    document.getElementById('total-alunos') && (document.getElementById('total-alunos').textContent = totalAlunos);
    document.getElementById('total-turmas') && (document.getElementById('total-turmas').textContent = turmas.length);
  } catch (err) {
    console.error('Erro carregar painel professor:', err);
  }
}

/* -------------------------
  UTILIDADES
   ------------------------- */

function popularFiltrosCursos(inscricoes) {
  const sel = document.getElementById('filter-course');
  if (!sel) return;
  const cursos = Array.from(new Set(inscricoes.map(i => i.course).filter(Boolean)));
  sel.innerHTML = `<option value="">Todos os cursos</option>` + cursos.map(c => `<option value="${c}">${c}</option>`).join('');
  sel.addEventListener('change', async (e) => {
    const curso = e.target.value;
    const inscricoesAll = await listarInscricoes();
    const filtradas = curso ? inscricoesAll.filter(i => i.course === curso) : inscricoesAll;
    renderTabelaAlunos(filtradas);
  });
}
