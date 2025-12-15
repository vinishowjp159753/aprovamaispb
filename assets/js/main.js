<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>AprovaMaisPB – Pré-ENEM</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- FONTE -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">

  <!-- ================= CSS EMBUTIDO ================= -->
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Inter', sans-serif;
    }

    body {
      background: #f5f7fb;
      color: #1f2937;
      line-height: 1.6;
    }

    header {
      position: fixed;
      top: 0;
      width: 100%;
      background: #fff;
      box-shadow: 0 4px 20px rgba(0,0,0,.08);
      z-index: 1000;
    }

    .navbar {
      max-width: 1200px;
      margin: auto;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-weight: 700;
      font-size: 20px;
      color: #4338ca;
    }

    .menu {
      list-style: none;
      display: flex;
      gap: 20px;
    }

    .menu a {
      text-decoration: none;
      color: #374151;
      font-weight: 500;
    }

    .btn-whatsapp {
      background: #25d366;
      color: #fff;
      padding: 10px 16px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
    }

    .hero {
      max-width: 1200px;
      margin: 140px auto 80px;
      padding: 0 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
    }

    .hero h1 {
      font-size: 42px;
      margin-bottom: 20px;
    }

    .hero h1 span {
      color: #6366f1;
    }

    .hero p {
      color: #4b5563;
      margin-bottom: 25px;
    }

    .hero-buttons {
      display: flex;
      gap: 15px;
    }

    .btn-primary {
      background: #6366f1;
      color: #fff;
      padding: 12px 22px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
    }

    .btn-outline {
      border: 2px solid #6366f1;
      color: #6366f1;
      padding: 10px 20px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
    }

    section {
      max-width: 1200px;
      margin: 80px auto;
      padding: 0 20px;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 25px;
    }

    .card {
      background: #fff;
      padding: 25px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,.08);
    }

    .card h3 {
      margin-bottom: 10px;
      color: #4338ca;
    }

    /* PRÉ-MATRÍCULA */
    #pre-matricula {
      background: #fff;
      padding: 50px 25px;
      border-radius: 18px;
      box-shadow: 0 10px 30px rgba(0,0,0,.1);
      max-width: 600px;
      margin: auto;
    }

    #pre-matricula h2 {
      text-align: center;
      margin-bottom: 25px;
    }

    #formPreMatricula {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    #formPreMatricula input,
    #formPreMatricula select,
    #formPreMatricula textarea {
      padding: 12px 14px;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      font-size: 15px;
    }

    #formPreMatricula textarea {
      resize: vertical;
      min-height: 90px;
    }

    #formPreMatricula button {
      background: #25d366;
      color: #fff;
      border: none;
      padding: 14px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
    }

    footer {
      background: #111827;
      color: #fff;
      text-align: center;
      padding: 30px 20px;
      margin-top: 80px;
    }

    @media (max-width: 900px) {
      .hero {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .hero-buttons {
        justify-content: center;
      }

      .menu {
        display: none;
      }
    }
  </style>
</head>

<body>

<header>
  <div class="navbar">
    <div class="logo">AprovaMaisPB</div>
    <ul class="menu">
      <li><a href="#sobre">Sobre</a></li>
      <li><a href="#horarios">Horários</a></li>
      <li><a href="#pre-matricula">Pré-Matrícula</a></li>
    </ul>
    <a class="btn-whatsapp" href="https://wa.me/5583996627827" target="_blank">WhatsApp</a>
  </div>
</header>

<div class="hero">
  <div>
    <h1>Prepare-se para o <span>ENEM</span><br>com quem aprova</h1>
    <p>Aulas focadas, acompanhamento real e resultados comprovados.</p>

    <div class="hero-buttons">
      <a href="#pre-matricula" class="btn-primary">Pré-Matrícula</a>
      <a href="https://wa.me/5583996627827" class="btn-outline">Tirar dúvidas</a>
    </div>
  </div>

  <div class="cards">
    <div class="card">
      <h3>📘 Metodologia ENEM</h3>
      <p>Conteúdo direcionado para o que realmente cai na prova.</p>
    </div>

    <div class="card" id="horarios">
      <h3>⏰ Horários das Aulas</h3>
      <p>
        <strong>Aulas à tarde:</strong><br>
        Segunda, Quarta e Sexta<br>
        🕑 14:00 às 17:30
      </p>
      <br>
      <p>
        <strong>Sábados:</strong><br>
        ☀️ Manhã e Tarde
      </p>
    </div>

    <div class="card">
      <h3>🎯 Foco em Aprovação</h3>
      <p>Planejamento, simulados e acompanhamento contínuo.</p>
    </div>
  </div>
</div>

<section id="pre-matricula">
  <h2>📚 Pré-Matrícula ENEM</h2>

  <form id="formPreMatricula">
    <input type="text" id="nome" placeholder="Nome completo" required>
    <input type="tel" id="whatsapp" placeholder="WhatsApp" required>
    <input type="email" id="email" placeholder="Email" required>

    <select id="ano" required>
      <option value="">Ano do ENEM</option>
      <option value="2025">2025</option>
      <option value="2026">2026</option>
    </select>

    <input type="text" id="curso" placeholder="Curso desejado" required>
    <textarea id="obs" placeholder="Observações"></textarea>

    <button type="submit">Enviar pelo WhatsApp</button>
  </form>
</section>

<footer>
  <p>📍 João Pessoa – PB</p>
  <p>AprovaMaisPB © 2025</p>
</footer>

<!-- ================= JS EMBUTIDO ================= -->
<script>
document.getElementById("formPreMatricula").addEventListener("submit", function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const whatsapp = document.getElementById("whatsapp").value;
  const email = document.getElementById("email").value;
  const ano = document.getElementById("ano").value;
  const curso = document.getElementById("curso").value;
  const obs = document.getElementById("obs").value || "Nenhuma";

  const mensagem =
`📚 PRÉ-MATRÍCULA ENEM

👤 Nome: ${nome}
📱 WhatsApp: ${whatsapp}
📧 Email: ${email}
📅 Ano ENEM: ${ano}
🎓 Curso: ${curso}

📝 Observações:
${obs}`;

  const numero = "5583996627827";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
});
</script>

</body>
</html>
