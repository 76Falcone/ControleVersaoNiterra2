/* ════════════════════════════════════════════════════════════
   CONTROLE DE VERSÃO NITERRA — NAVEGAÇÃO E UTILITÁRIOS GLOBAIS
   ════════════════════════════════════════════════════════════ */

const NITERRA_SESSION_KEY = 'niterra_user_session';

// Inicializa dados padrão de sessão se não existirem
function getSessionUser() {
  const session = localStorage.getItem(NITERRA_SESSION_KEY);
  if (!session) return null;
  try {
    return JSON.parse(session);
  } catch (e) {
    return null;
  }
}

function setSessionUser(user) {
  localStorage.setItem(NITERRA_SESSION_KEY, JSON.stringify(user));
}

function clearSessionUser() {
  localStorage.removeItem(NITERRA_SESSION_KEY);
}

function checkAuth(requireAuth = true) {
  const user = getSessionUser();
  const isLoginPage = window.location.pathname.includes('login.html');

  if (requireAuth && !user && !isLoginPage) {
    window.location.href = window.location.pathname.includes('/html/') ? 'login.html' : 'html/login.html';
    return null;
  }
  return user;
}

function logoutUser() {
  clearSessionUser();
  const isHtmlSubfolder = window.location.pathname.includes('/html/');
  window.location.href = isHtmlSubfolder ? 'login.html' : 'html/login.html';
}

// ─── UTILS DE UI: MODAL E TOAST ───
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconClass = 'ph-check-circle';
  if (type === 'error') iconClass = 'ph-warning-circle';
  if (type === 'info') iconClass = 'ph-info';

  toast.innerHTML = `
    <i class="ph ${iconClass} toast-icon"></i>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ─── INITIALIZATION ON DOM READY ───
document.addEventListener('DOMContentLoaded', () => {
  // Verifica autenticação para páginas protegidas
  const user = checkAuth(true);

  if (user) {
    // Atualiza nome do usuário na interface se existir os elementos
    const userNameElements = document.querySelectorAll('.user-name');
    const userRoleElements = document.querySelectorAll('.user-role');
    const userAvatarElements = document.querySelectorAll('.user-avatar');

    userNameElements.forEach(el => el.textContent = user.nome || user.login);
    userRoleElements.forEach(el => el.textContent = user.perfil === 'ADMIN' ? 'Administrador' : 'Analista');
    userAvatarElements.forEach(el => {
      const initial = (user.nome || user.login || 'N').charAt(0).toUpperCase();
      el.textContent = initial;
    });
  }

  // Toggle do menu mobile
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const sidebar = document.querySelector('.app-sidebar');

  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  // Fechamento de modais ao clicar no backdrop ou botão fechar
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  document.querySelectorAll('.modal-close-btn, .btn-close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const backdrop = btn.closest('.modal-backdrop');
      if (backdrop) closeModal(backdrop.id);
    });
  });
});
