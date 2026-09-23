/* ════════════════════════════════════════════════════════════
   CONTROLE DE VERSÃO NITERRA — LÓGICA DE GESTÃO DE USUÁRIOS
   ════════════════════════════════════════════════════════════ */

const USERS_STORAGE_KEY = 'niterra_users';

function getStoredUsersList() {
  const data = localStorage.getItem(USERS_STORAGE_KEY);
  if (!data) return [];
  try { return JSON.parse(data); } catch (e) { return []; }
}

function saveUsersList(list) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
}

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('tbodyUsuarios');
  const inputSearch = document.getElementById('inputSearchUser');
  const selectPerfil = document.getElementById('selectPerfilFilter');
  const formAdd = document.getElementById('formAddUsuario');
  const formEdit = document.getElementById('formEditUsuario');

  function renderTable() {
    const users = getStoredUsersList();
    const query = inputSearch ? inputSearch.value.trim().toLowerCase() : '';
    const perfilFilter = selectPerfil ? selectPerfil.value : 'TODOS';

    // Metrics
    updateMetrics(users);

    const filtered = users.filter(u => {
      const matchQuery = u.nome.toLowerCase().includes(query) || u.login.toLowerCase().includes(query);
      const matchPerfil = perfilFilter === 'TODOS' || u.perfil === perfilFilter;
      return matchQuery && matchPerfil;
    });

    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="empty-state">
              <i class="ph ph-user-minus"></i>
              <h4>Nenhum usuário encontrado</h4>
              <p>Tente ajustar os critérios de pesquisa ou cadastre um novo usuário.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(u => {
      const initial = u.nome ? u.nome.charAt(0).toUpperCase() : 'U';
      const isAdmin = u.perfil === 'ADMIN';
      const badgeClass = isAdmin ? 'badge-admin' : 'badge-analista';
      const perfilLabel = isAdmin ? 'Administrador' : 'Analista';

      return `
        <tr>
          <td style="font-weight:700; color:var(--subtle);">#${u.registro}</td>
          <td>
            <div class="user-table-name">
              <div class="user-avatar-md">${initial}</div>
              <span>${escapeHtml(u.nome)}</span>
            </div>
          </td>
          <td>
            <span class="user-login-chip">@${escapeHtml(u.login)}</span>
          </td>
          <td>
            <span class="badge ${badgeClass}">
              <i class="ph ${isAdmin ? 'ph-shield-check' : 'ph-user-gear'}"></i>
              ${perfilLabel}
            </span>
          </td>
          <td style="text-align: right;">
            <div class="actions-cell" style="justify-content: flex-end;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="prepareEditUsuario(${u.registro})" title="Editar Usuário">
                <i class="ph ph-pencil-simple"></i>
              </button>
              <button type="button" class="btn btn-danger btn-sm" onclick="deleteUsuario(${u.registro})" title="Excluir Usuário">
                <i class="ph ph-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function updateMetrics(users) {
    const elTotal = document.getElementById('metricTotalUsers');
    const elAdmins = document.getElementById('metricAdmins');
    const elAnalistas = document.getElementById('metricAnalistas');

    if (elTotal) elTotal.textContent = users.length;
    if (elAdmins) elAdmins.textContent = users.filter(u => u.perfil === 'ADMIN').length;
    if (elAnalistas) elAnalistas.textContent = users.filter(u => u.perfil === 'ANALISTA').length;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  if (inputSearch) inputSearch.addEventListener('input', renderTable);
  if (selectPerfil) selectPerfil.addEventListener('change', renderTable);

  // Submissão Adicionar Usuário
  if (formAdd) {
    formAdd.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('addNomeUsuario').value.trim();
      const login = document.getElementById('addLoginUsuario').value.trim();
      const senha = document.getElementById('addSenhaUsuario').value.trim();
      const perfil = document.getElementById('addPerfilUsuario').value;

      if (!nome || !login || !senha) {
        showToast('Preencha todos os campos obrigatórios.', 'error');
        return;
      }

      const users = getStoredUsersList();

      if (users.some(u => u.login.toLowerCase() === login.toLowerCase())) {
        showToast(`O login "@${login}" já está em uso por outro usuário.`, 'error');
        return;
      }

      const nextRegistro = users.length > 0 ? Math.max(...users.map(u => u.registro)) + 1 : 1;

      const newUser = {
        registro: nextRegistro,
        nome,
        login,
        senha,
        perfil
      };

      users.push(newUser);
      saveUsersList(users);

      closeModal('modalAddUsuario');
      formAdd.reset();
      renderTable();
      showToast(`Usuário "${nome}" cadastrado com sucesso!`, 'success');
    });
  }

  // Submissão Editar Usuário
  if (formEdit) {
    formEdit.addEventListener('submit', (e) => {
      e.preventDefault();
      const registro = parseInt(document.getElementById('editRegistroUsuario').value, 10);
      const nome = document.getElementById('editNomeUsuario').value.trim();
      const login = document.getElementById('editLoginUsuario').value.trim();
      const senha = document.getElementById('editSenhaUsuario').value.trim();
      const perfil = document.getElementById('editPerfilUsuario').value;

      const users = getStoredUsersList();
      const index = users.findIndex(u => u.registro === registro);

      if (index !== -1) {
        // Verifica se login duplicou com outro usuário
        if (users.some(u => u.registro !== registro && u.login.toLowerCase() === login.toLowerCase())) {
          showToast(`O login "@${login}" já pertence a outro usuário.`, 'error');
          return;
        }

        users[index].nome = nome;
        users[index].login = login;
        users[index].perfil = perfil;
        if (senha) {
          users[index].senha = senha;
        }

        saveUsersList(users);

        // Se o usuário editado for o usuário logado no momento, atualiza a sessão
        const sessionUser = getSessionUser();
        if (sessionUser && sessionUser.registro === registro) {
          setSessionUser({
            ...sessionUser,
            nome,
            login,
            perfil
          });
        }

        closeModal('modalEditUsuario');
        renderTable();
        showToast(`Usuário "${nome}" atualizado!`, 'success');
      }
    });
  }

  window.prepareEditUsuario = function (registro) {
    const users = getStoredUsersList();
    const user = users.find(u => u.registro === registro);
    if (user) {
      document.getElementById('editRegistroUsuario').value = user.registro;
      document.getElementById('editNomeUsuario').value = user.nome;
      document.getElementById('editLoginUsuario').value = user.login;
      document.getElementById('editSenhaUsuario').value = '';
      document.getElementById('editPerfilUsuario').value = user.perfil;

      openModal('modalEditUsuario');
    }
  };

  window.deleteUsuario = function (registro) {
    const users = getStoredUsersList();
    const user = users.find(u => u.registro === registro);
    const sessionUser = getSessionUser();

    if (sessionUser && sessionUser.registro === registro) {
      showToast('Você não pode excluir o usuário conectado atualmente.', 'error');
      return;
    }

    if (user && confirm(`Deseja realmente excluir o usuário "${user.nome}" (@${user.login})?`)) {
      const updated = users.filter(u => u.registro !== registro);
      saveUsersList(updated);
      renderTable();
      showToast(`Usuário "${user.nome}" removido.`, 'info');
    }
  };

  renderTable();
});
