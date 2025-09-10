import { 
  salvarInscricao, 
  listarInscricoes, 
  salvarProfessor, 
  listarProfessores, 
  autenticarProfessor,
  designarTurma,
  buscarTurmasProfessor,
  buscarInscricoesPorTurma,
  atualizarInscricao
} from "./firebase.js";
import { enviarEmail } from "./email.js";

// Configurações
const ITENS_POR_PAGINA = 10;
let paginaAtual = 1;
let todasInscricoes = [];
let inscricoesFiltradas = [];

// Utilidades
function mostrarNotificacao(mensagem, tipo = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${tipo}`;
  notification.innerHTML = `
    <span>${mensagem}</span>
    <button onclick="this.parentElement.remove()">×</button>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

function formatarCPF(cpf) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function gerarSenha(tamanho = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: tamanho }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

// Matrícula
const form = document.getElementById("registration-form");
if (form) {
  // Adicionar máscara de CPF
  const cpfInput = document.getElementById("cpf");
  if (cpfInput) {
    cpfInput.addEventListener("input", function(e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 11) value = value.slice(0, 11);
      
      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
        value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
      }
      
      e.target.value = value;
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Validação
    const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
    if (!validarCPF(cpf)) {
      mostrarNotificacao("CPF inválido. Por favor, verifique o número.", "error");
      return;
    }
    
    const loading = document.getElementById("loading");
    if (loading) loading.style.display = "block";
    
    const dados = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      cpf: cpf,
      course: document.getElementById("course").value,
      numeroPedido: Math.floor(100000 + Math.random() * 900000),
      senha: gerarSenha(),
      criadoEm: new Date().toISOString(),
      status: "pendente"
    };
    
    try {
      await salvarInscricao(dados);
      await enviarEmail(dados);
      
      mostrarNotificacao("✅ Inscrição concluída! Seus dados foram enviados para " + dados.email);
      form.reset();
      
      // Botão WhatsApp
      const msg = `Olá, meu nome é ${dados.name}.%0A
Me inscrevi no curso *${dados.course}*.%0A
Número do pedido: ${dados.numeroPedido}%0A
CPF: ${formatarCPF(dados.cpf)}%0A
Telefone: ${dados.phone}%0A
Gostaria de confirmar o pagamento da matrícula via WhatsApp.`;
      const numeroWhats = "5583999999999";
      const url = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(msg)}`;
      
      const container = document.querySelector(".actions");
      if (container) {
        // Remove botão anterior se existir
        const btnAntigo = document.getElementById("btn-whatsapp");
        if (btnAntigo) btnAntigo.remove();
        
        const btnWpp = document.createElement("a");
        btnWpp.href = url;
        btnWpp.target = "_blank";
        btnWpp.className = "btn-modern";
        btnWpp.id = "btn-whatsapp";
        btnWpp.innerHTML = "📲 Confirmar pagamento no WhatsApp";
        container.appendChild(btnWpp);
      }
    } catch (err) {
      console.error(err);
      mostrarNotificacao("❌ Erro ao salvar inscrição. Tente novamente.", "error");
    } finally {
      if (loading) loading.style.display = "none";
    }
  });
}

// Admin login
const adminForm = document.getElementById('admin-login-form');
if(adminForm){
  adminForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const u = document.getElementById('admin-user').value;
    const p = document.getElementById('admin-pass').value;
    
    if(!u || !p) {
      document.getElementById('admin-msg').textContent = 'Preencha todos os campos.';
      return;
    }
    
    if(u === 'administrador' && p === '159753'){
      document.querySelector('.form-card.small').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      renderDashboard();
    } else {
      document.getElementById('admin-msg').textContent = 'Usuário ou senha incorretos.';
    }
  });
}

// Logout admin
const logoutBtn = document.getElementById('logout-admin');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    document.getElementById('dashboard').style.display = 'none';
    document.querySelector('.form-card.small').style.display = 'block';
    document.getElementById('admin-user').value = '';
    document.getElementById('admin-pass').value = '';
    document.getElementById('admin-msg').textContent = '';
  });
}

// Dashboard functions
async function renderDashboard(){
  try {
    todasInscricoes = await listarInscricoes();
    inscricoesFiltradas = [...todasInscricoes];
    
    renderInscricoes();
    renderProfessores();
    setupFiltros();
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
    mostrarNotificacao("Erro ao carregar dados do dashboard", "error");
  }
}

function renderInscricoes() {
  const tbody = document.querySelector('#inscricoes-table tbody');
  if (!tbody) return;
  
  // Aplicar paginação
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const inscricoesPagina = inscricoesFiltradas.slice(inicio, fim);
  
  tbody.innerHTML = '';
  inscricoesPagina.forEach(i => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i.name}</td>
      <td>${i.email}</td>
      <td>${i.course}</td>
      <td>${formatarCPF(i.cpf)}</td>
      <td>${new Date(i.criadoEm).toLocaleString('pt-BR')}</td>
      <td>
        <select class="status-select" data-id="${i.id}" onchange="atualizarStatus(this)">
          <option value="pendente" ${i.status === 'pendente' ? 'selected' : ''}>Pendente</option>
          <option value="confirmado" ${i.status === 'confirmado' ? 'selected' : ''}>Confirmado</option>
          <option value="cancelado" ${i.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
        </select>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  renderPaginacao();
}

function renderPaginacao() {
  const paginationContainer = document.getElementById('pagination');
  if (!paginationContainer) return;
  
  const totalPaginas = Math.ceil(inscricoesFiltradas.length / ITENS_POR_PAGINA);
  
  let html = '';
  for (let i = 1; i <= totalPaginas; i++) {
    html += `<button class="${i === paginaAtual ? 'active' : ''}" onclick="mudarPagina(${i})">${i}</button>`;
  }
  
  paginationContainer.innerHTML = html;
}

function mudarPagina(pagina) {
  paginaAtual = pagina;
  renderInscricoes();
}

function setupFiltros() {
  const searchInput = document.getElementById('search');
  const filterCourse = document.getElementById('filter-course');
  const filterStatus = document.getElementById('filter-status');
  
  if (searchInput) {
    searchInput.addEventListener('input', aplicarFiltros);
  }
  
  if (filterCourse) {
    filterCourse.addEventListener('change', aplicarFiltros);
  }
  
  if (filterStatus) {
    filterStatus.addEventListener('change', aplicarFiltros);
  }
}

function aplicarFiltros() {
  const searchTerm = document.getElementById('search')?.value.toLowerCase() || '';
  const courseFilter = document.getElementById('filter-course')?.value || '';
  const statusFilter = document.getElementById('filter-status')?.value || '';
  
  inscricoesFiltradas = todasInscricoes.filter(inscricao => {
    const matchesSearch = 
      inscricao.name.toLowerCase().includes(searchTerm) ||
      inscricao.email.toLowerCase().includes(searchTerm) ||
      inscricao.course.toLowerCase().includes(searchTerm) ||
      inscricao.cpf.includes(searchTerm);
    
    const matchesCourse = courseFilter ? inscricao.course === courseFilter : true;
    const matchesStatus = statusFilter ? inscricao.status === statusFilter : true;
    
    return matchesSearch && matchesCourse && matchesStatus;
  });
  
  paginaAtual = 1;
  renderInscricoes();
}

async function atualizarStatus(select) {
  const id = select.dataset.id;
  const status = select.value;
  
  try {
    await atualizarInscricao(id, { status });
    mostrarNotificacao(`Status atualizado para ${status}`, "success");
    
    // Atualizar localmente
    const index = todasInscricoes.findIndex(i => i.id === id);
    if (index !== -1) {
      todasInscricoes[index].status = status;
    }
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    mostrarNotificacao("Erro ao atualizar status", "error");
  }
}

async function renderProfessores() {
  const profs = await listarProfessores();
  const ul = document.getElementById('prof-list');
  if(ul){
    ul.innerHTML = '';
    profs.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="prof-item">
          <strong>${p.nome}</strong> — ${p.usuario} / ${p.senha}
          <div>
            <button class="btn-modern outline small" onclick="designarTurmaParaProfessor('${p.usuario}')">Designar Turma</button>
          </div>
        </div>
      `;
      ul.appendChild(li);
    });
  }
  
  document.getElementById('gerar-prof')?.addEventListener('click', async () => {
    const nome = prompt('Nome do professor:');
    if(!nome) return;
    
    const usuario = nome.toLowerCase().replace(/\s+/g, '.') + Math.floor(Math.random() * 90 + 10);
    const senha = gerarSenha();
    
    try {
      await salvarProfessor({nome, usuario, senha});
      mostrarNotificacao(`Professor criado: ${usuario} / ${senha}`);
      renderProfessores();
    } catch (error) {
      console.error("Erro ao criar professor:", error);
      mostrarNotificacao("Erro ao criar professor", "error");
    }
  });
}

async function designarTurmaParaProfessor(usuario) {
  const turma = prompt(`Digite o nome da turma para designar ao professor ${usuario}:`);
  if(!turma) return;
  
  try {
    await designarTurma(usuario, turma);
    mostrarNotificacao(`Turma ${turma} designada para ${usuario}`);
  } catch (error) {
    console.error("Erro ao designar turma:", error);
    mostrarNotificacao("Erro ao designar turma", "error");
  }
}

// Exportar CSV
document.getElementById('export-btn')?.addEventListener('click', () => {
  if (inscricoesFiltradas.length === 0) {
    mostrarNotificacao("Nenhum dado para exportar", "warning");
    return;
  }
  
  const csvContent = [
    ['Nome', 'Email', 'Curso', 'CPF', 'Data de Inscrição', 'Status'],
    ...inscricoesFiltradas.map(i => [
      i.name,
      i.email,
      i.course,
      formatarCPF(i.cpf),
      new Date(i.criadoEm).toLocaleString('pt-BR'),
      i.status || 'pendente'
    ])
  ].map(e => e.join(',')).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `inscricoes_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  mostrarNotificacao("CSV exportado com sucesso");
});

// Professores login
const profForm = document.getElementById('prof-login-form');
if(profForm){
  profForm.addEventListener('submit', async e => {
    e.preventDefault();
    const u = document.getElementById('prof-user').value;
    const p = document.getElementById('prof-pass').value;
    
    if (!u || !p) {
      document.getElementById('prof-msg').textContent = 'Preencha todos os campos.';
      return;
    }
    
    try {
      const ok = await autenticarProfessor(u, p);
      const msg = document.getElementById('prof-msg');
      
      if(ok){
        msg.style.color = 'green';
        msg.textContent = 'Login bem-sucedido.';
        document.getElementById('prof-login-form').style.display = 'none';
        document.getElementById('prof-panel').style.display = 'block';
        await carregarPainelProfessor(u);
      } else {
        msg.style.color = 'crimson';
        msg.textContent = 'Usuário ou senha inválidos.';
      }
    } catch (error) {
      console.error("Erro no login do professor:", error);
      document.getElementById('prof-msg').style.color = 'crimson';
      document.getElementById('prof-msg').textContent = 'Erro ao fazer login. Tente novamente.';
    }
  });
}

async function carregarPainelProfessor(usuario) {
  try {
    // Buscar turmas designadas para este professor
    const turmas = await buscarTurmasProfessor(usuario);
    const panel = document.getElementById('prof-info');
    
    if (turmas.length > 0) {
      let html = '<h2>Suas Turmas</h2><div class="turma-grid">';
      
      for (const turma of turmas) {
        // Buscar alunos para cada turma
        const alunos = await buscarInscricoesPorTurma(turma.turma);
        
        html += `
          <div class="turma-card">
            <h3>${turma.turma}</h3>
            <p>Designada em: ${new Date(turma.designadoEm).toLocaleDateString('pt-BR')}</p>
            <div class="alunos-list">
              <h4>Alunos (${alunos.length})</h4>
              ${alunos.length > 0 ? 
                alunos.map(aluno => `
                  <div class="aluno-item">
                    <span>${aluno.name}</span>
                    <span class="status-badge ${aluno.status}">${aluno.status}</span>
                  </div>
                `).join('') : 
                '<p>Nenhum aluno nesta turma ainda.</p>'
              }
            </div>
          </div>
        `;
      }
      
      html += '</div>';
      panel.innerHTML = html;
    } else {
      panel.innerHTML = '<p>Nenhuma turma designada no momento.</p>';
    }
  } catch (error) {
    console.error("Erro ao carregar painel do professor:", error);
    document.getElementById('prof-info').innerHTML = '<p>Erro ao carregar informações. Tente novamente.</p>';
  }
}

// Make functions available globally
window.mudarPagina = mudarPagina;
window.atualizarStatus = atualizarStatus;
window.designarTurmaParaProfessor = designarTurmaParaProfessor;
