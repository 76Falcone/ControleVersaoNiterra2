/* ════════════════════════════════════════════════════════════
   CONTROLE DE VERSÃO NITERRA — DARK MODE CONTROLLER
   ════════════════════════════════════════════════════════════ */

(function () {
  const THEME_KEY = 'niterra_theme';

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    // Update any theme toggle buttons on the page
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      const icon = btn.querySelector('.theme-icon');
      const label = btn.querySelector('.theme-label');
      if (theme === 'dark') {
        if (icon) icon.className = 'theme-icon ph ph-sun';
        if (label) label.textContent = 'Modo Claro';
        btn.setAttribute('aria-label', 'Alternar para Modo Claro');
      } else {
        if (icon) icon.className = 'theme-icon ph ph-moon';
        if (label) label.textContent = 'Modo Escuro';
        btn.setAttribute('aria-label', 'Alternar para Modo Escuro');
      }
    });
  }

  // Apply immediately before DOM content loads to avoid flicker
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getPreferredTheme());

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.theme-toggle-btn');
      if (btn) {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
      }
    });
  });
})();
