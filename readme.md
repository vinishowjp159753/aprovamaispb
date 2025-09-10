# AprovaMaisPB - Sistema Completo

Sistema de gestão para curso preparatório para o ENEM com funcionalidades completas de matrícula, administração e painel de professores.

## Funcionalidades

- **Matrícula online** com validação de CPF e envio de e-mail confirmatório
- **Painel administrativo** completo dengan gerenciamento de inscrições e professores
- **Sistema de professores** com turmas designadas e visualização de alunos
- **Design responsivo** para todos os dispositivos
- **Exportação de dados** em formato CSV
- **Sistema de notificações** para feedback do usuário

## Credenciais de Acesso

### Administrador
- Usuário: `administrador`
- Senha: `159753`

### Professores
- Os logins são gerados pelo administrador no painel

## Tecnologias Utilizadas

- HTML5, CSS3 e JavaScript ES6+
- Firebase Firestore para banco de dados
- EmailJS para envio de e-mails
- Design responsivo com CSS Grid e Flexbox

## Como Implementar

1. Faça o upload dos arquivos para seu servidor web
2. Certifique-se de que o Firebase está configurado corretamente
3. Verifique as configurações do EmailJS no arquivo `email.js`
4. Teste todas as funcionalidades

## Estrutura de Arquivos

- `index.html` - Página inicial com informações sobre o curso
- `matricula.html` - Formulário de matrícula dos alunos
- `professores.html` - Área de login e painel para professores
- `admin.html` - Painel administrativo completo
- `assets/css/style.css` - Estilos do sistema
- `assets/js/app.js` - Lógica principal da aplicação
- `assets/js/firebase.js` - Integração com Firebase
- `assets/js/email.js` - Integração com EmailJS

## Melhorias Implementadas

1. **Correção de bugs** no login administrativo
2. **Sistema completo de turmas** para professores
3. **Validação de CPF** no formulário de matrícula
4. **Design modernizado** com interface mais amigável
5. **Sistema de paginação** para grandes volumes de dados
6. **Filtros e busca** no painel administrativo
7. **Sistema de notificações** para feedback do usuário
8. **Exportação de dados** em CSV
9. **Design totalmente responsivo**
10. **Melhorias de UX** em todos os formulários