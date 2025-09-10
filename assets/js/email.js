// CORRETO - Importar EmailJS corretamente
import emailjs from 'https://cdn.jsdelivr.net/npm/emailjs-com@3.2.0/+esm';

const serviceID = "service_dgemmi7";
const templateID = "template_3xu931y";
const publicKey = "3odMz4ZugF-JjtWF6";

// Inicializar EmailJS
emailjs.init(publicKey);

export async function enviarEmail(dados) {
  try {
    await emailjs.send(serviceID, templateID, {
      to_email: dados.email,
      to_name: dados.name,
      curso: dados.course,
      senha: dados.senha,
      cpf: dados.cpf,
      telefone: dados.phone,
      numeroPedido: dados.numeroPedido
    });
    console.log("📧 Email enviado para " + dados.email);
  } catch (err) {
    console.error("Erro ao enviar email:", err);
    throw err; // Importante: propagar o erro para tratamento no formulário
  }
}
