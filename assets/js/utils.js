// assets/js/utils.js
// Funções utilitárias compartilhadas

export function mostrarNotificacao(mensagem, tipo = "success") {
  // Remove notificações existentes
  const existing = document.querySelectorAll('.notification');
  existing.forEach(n => n.remove());

  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = `notification ${tipo}`;
  notification.innerHTML = `
    <span>${mensagem}</span>
    <button aria-label="fechar" style="background:transparent;border:0;color:inherit;cursor:pointer">×</button>
  `;

  // fechar ao clicar no X
  notification.querySelector('button')?.addEventListener('click', () => notification.remove());

  document.body.appendChild(notification);

  // Forçar layout e exibir
  setTimeout(() => notification.classList.add('show'), 50);

  // remover após 5s
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 350);
  }, 5000);

  return notification;
}

export function validarCPF(cpf) {
  if (!cpf) return false;
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

export function formatarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function gerarSenha(tamanho = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: tamanho }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}
