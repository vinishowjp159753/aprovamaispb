// assets/js/app.js
import {
  listarInscricoes,
  listarProfessores,
  salvarProfessor,
  excluirProfessor,
  excluirInscricao,
  designarTurma,
  buscarTurmasProfessor,
  buscarInscricoesPorTurma,
  atualizarInscricao
} from "./firebase.js";

import { mostrarNotificacao, gerarSenha, formatarCPF } from "./utils.js";

const VALOR_MATRICULA = 150;

document.addEventListener('DOMContentLoaded', async () => {
  const usuario = localStorage.getItem('usuarioLogado');
  const userType = localStorage.getItem('userType');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!usuario) {
    window.location.href = 'login.html';
    return;
  }

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
    window.location.href = 'login.html';
  }
});

/* ========== DASHBOARD ADMIN ========== */
async function carregarDashboardAdmin() {
  try {
    const [inscricoes, professores] = await Promise.all([
      listarInscricoes(),
      listarProfessores()
    ]);
    renderEstatisticas(inscricoes, professores);
    renderTabelaAlunos(inscricoes);
    renderTabelaProfessores(professores);
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

  document.getElementById('total-alunos').textContent = totalAlunos;
  document.getElementById('total-professores').textContent = totalProfessores;
  document.getElementById('receita-mensal').textContent = `R$ ${receita.toFixed(2)}`;
  document.getElementById('receita-mensal-detalhe')?.textContent = `R$ ${receita.toFixed(2)}`;
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
        <button class="btn-action btn-delete" data-id="${i.id}">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Atualizar status
  document.querySelectorAll('.status-select').forEach(sel => {
    sel.addEventListener('change', async e => {
      const id = e.target.dataset.id;
      const status = e.target.value;
      try {
        await atualizarInscricao(id, { status });
        mostrarNotificacao('Status atualizado', 'success');
        const inscricoes = await listarInscricoes();
        renderEstatisticas(inscricoes, await listarProfessores());
      } catch {
        mostrarNotificacao('Erro ao atualizar status', 'error');
      }
    });
  });

  // Excluir inscrição
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (!confirm("Excluir esta inscrição?")) return;
      try {
        await excluirInscricao(id);
        mostrarNotificacao('Inscrição excluída', 'success');
        const inscricoes = await listarInscricoes();
        renderTabelaAlunos(inscricoes);
        renderEstatisticas(inscricoes, await listarProfessores());
      } catch {
        mostrarNotificacao('Erro ao excluir inscrição', 'error');
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
      <td>${p.status || 'ativo'}</td>
      <td>
        <button class="btn-action btn-assign" data-usuario="${p.usuario}">🎯 Turma</button>
        <button class="btn-action btn-delete-prof" data-id="${p.id}">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.btn-assign').forEach(btn => {
    btn.addEventListener('click', async () => {
      const usuario = btn.dataset.usuario;
      const turma = prompt(`Turma para ${usuario}:`);
      if (!turma) return;
      try {
        await designarTurma(usuario, turma);
        mostrarNotificacao(`Turma ${turma} atribuída`, 'success');
      } catch {
        mostrarNotificacao('Erro ao designar turma', 'error');
      }
    });
  });

  document.querySelectorAll('.btn-delete-prof').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (!confirm("Excluir professor?")) return;
      try {
        await excluirProfessor(id);
        mostrarNotificacao('Professor excluído', 'success');
        renderTabelaProfessores(await listarProfessores());
      } catch {
        mostrarNotificacao('Erro ao excluir professor', 'error');
      }
    });
  });
}

function setupAdminActions() {
  document.getElementById('abrir-criar-prof')?.addEventListener('click', async () => {
    const nome = prompt("Nome do professor:");
    if (!nome) return;
    const usuario = nome.toLowerCase().replace(/\s+/g, '.') + Math.floor(Math.random() * 90 + 10);
    const senha = gerarSenha();
    try {
      await salvarProfessor({ nome, usuario, senha });
      mostrarNotificacao(`Professor criado: ${usuario} / ${senha}`, 'success');
      renderTabelaProfessores(await listarProfessores());
    } catch {
      mostrarNotificacao('Erro ao criar professor', 'error');
    }
  });

  document.getElementById('export-btn')?.addEventListener('click', async () => {
    const inscricoes = await listarInscricoes();
    if (!inscricoes.length) return mostrarNotificacao('Sem dados', 'warning');
    const rows = [["Nome","Email","Curso","CPF","Status","Turma"]];
    inscricoes.forEach(i =
