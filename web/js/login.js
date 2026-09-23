/* ════════════════════════════════════════════════════════════
   CONTROLE DE VERSÃO NITERRA — AUTENTICAÇÃO E LOGIN
   ════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Se o usuário já estiver logado, redireciona para o dashboard
  const currentUser = getSessionUser();
  if (currentUser) {
    window.location.href = 'controleProgramas.html';
    return;
  }

  // Elementos da página
  const loginForm = document.getElementById('loginForm');
  const inputLogin = document.getElementById('inputLogin');
  const inputSenha = document.getElementById('inputSenha');
  const groupLogin = document.getElementById('groupLogin');
  const groupSenha = document.getElementById('groupSenha');
  const errorLogin = document.getElementById('errorLogin');
  const errorSenha = document.getElementById('errorSenha');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const togglePasswordIcon = document.getElementById('togglePasswordIcon');
  const btnSubmit = document.getElementById('btnLoginSubmit');

  // Toggle de visibilidade da senha
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = inputSenha.getAttribute('type') === 'password' ? 'text' : 'password';
      inputSenha.setAttribute('type', type);
      if (type === 'text') {
        togglePasswordIcon.className = 'ph ph-eye-slash';
      } else {
        togglePasswordIcon.className = 'ph ph-eye';
      }
    });
  }

  // Inicializa lista padrão de usuários se não houver no localStorage
  function initDefaultUsers() {
    const savedUsers = localStorage.getItem('niterra_users');
    if (!savedUsers) {
      const defaultUsers = [
        { registro: 1, nome: 'Administrador Niterra', login: 'admin', senha: '123', perfil: 'ADMIN' },
        { registro: 2, nome: 'Carlos Analista', login: 'analista', senha: '123', perfil: 'ANALISTA' },
        { registro: 3, nome: 'Mariana Silva', login: 'mariana', senha: '123', perfil: 'ANALISTA' }
      ];
      localStorage.setItem('niterra_users', JSON.stringify(defaultUsers));
    }
  }

  initDefaultUsers();

  // Validação e Submit do formulário
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;
      const loginValue = inputLogin.value.trim();
      const senhaValue = inputSenha.value.trim();

      // Validação de campos
      groupLogin.classList.remove('has-error');
      groupSenha.classList.remove('has-error');

      if (!loginValue) {
        groupLogin.classList.add('has-error');
        errorLogin.textContent = 'Por favor, informe seu usuário ou registro.';
        valid = false;
      }

      if (!senhaValue) {
        groupSenha.classList.add('has-error');
        errorSenha.textContent = 'Por favor, informe sua senha.';
        valid = false;
      }

      if (!valid) return;

      // Feedback visual de carregamento
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `<i class="ph ph-circle-notch animate-spin"></i> Autenticando...`;

      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('niterra_users') || '[]');
        
        // Procura usuário correspondente por login ou registro
        const foundUser = users.find(u => 
          (u.login.toLowerCase() === loginValue.toLowerCase() || String(u.registro) === loginValue) && 
          u.senha === senhaValue
        );

        if (foundUser) {
          // Salva sessão do usuário
          setSessionUser({
            registro: foundUser.registro,
            nome: foundUser.nome,
            login: foundUser.login,
            perfil: foundUser.perfil
          });

          showToast(`Bem-vindo, ${foundUser.nome}! Redirecting...`, 'success');

          setTimeout(() => {
            window.location.href = '../index.html';
          }, 800);
        } else {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = `<i class="ph ph-sign-in"></i> Entrar no Sistema`;
          
          groupSenha.classList.add('has-error');
          errorSenha.textContent = 'Usuário ou senha incorretos.';
          showToast('Falha no login: credenciais inválidas.', 'error');
        }
      }, 600);
    });
  }
});
