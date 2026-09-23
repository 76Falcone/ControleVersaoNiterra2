/* ════════════════════════════════════════════════════════════
   CONTROLE DE VERSÃO NITERRA — LÓGICA DE PROGRAMAS E VERSÕES
   ════════════════════════════════════════════════════════════ */

const PROGRAMAS_KEY = 'niterra_programas';
const USERS_KEY = 'niterra_users';

function getStoredProgramas() {
  const data = localStorage.getItem(PROGRAMAS_KEY);
  if (!data) return [];
  try { return JSON.parse(data); } catch (e) { return []; }
}

function saveProgramas(list) {
  localStorage.setItem(PROGRAMAS_KEY, JSON.stringify(list));
}

function getStoredUsers() {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) return [];
  try { return JSON.parse(data); } catch (e) { return []; }
}

// Inicializa lista padrão de programas
function initDefaultProgramas() {
  const existing = localStorage.getItem(PROGRAMAS_KEY);
  if (!existing) {
    const defaultPrograms = [
      {
        id: 1,
        nome: 'Niterra_ControleEstoque',
        descricao: 'Módulo de gerenciamento e movimentação de peças de ignição e velas.',
        status: 'DISPONIVEL',
        registro_usuario: 1,
        data_envio: '2026-09-20 14:30:00'
      },
      {
        id: 2,
        nome: 'Niterra_QualidadeLinha',
        descricao: 'Sistema de inspeção e auditoria de qualidade na linha de montagem.',
        status: 'EM_DESENVOLVIMENTO',
        registro_usuario: 2,
        data_envio: '2026-09-22 09:15:00'
      },
      {
        id: 3,
        nome: 'Niterra_RelatoriosLogistica',
        descricao: 'Gerador automático de relatórios de expedição e transporte.',
        status: 'EM_DESENVOLVIMENTO',
        registro_usuario: 3,
        data_envio: '2026-09-21 16:45:00'
      }
    ];
    saveProgramas(defaultPrograms);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initDefaultProgramas();

  const tbody = document.getElementById('tbodyProgramas');
  const inputSearch = document.getElementById('inputSearchPrograma');
  const selectStatus = document.getElementById('selectStatusFilter');
  const selectDev = document.getElementById('selectDevFilter');
  const formAdd = document.getElementById('formAddPrograma');
  const formEdit = document.getElementById('formEditPrograma');

  // Elementos do Modal Add
  const addUsuarioSelect = document.getElementById('addUsuarioPrograma');
  const editUsuarioSelect = document.getElementById('editUsuarioPrograma');

  function populateUserDropdowns() {
    const users = getStoredUsers();
    
    // Filtro Dev
    if (selectDev) {
      selectDev.innerHTML = `<option value="TODOS">Todos Desenvolvedores</option>`;
      users.forEach(u => {
        selectDev.innerHTML += `<option value="${u.registro}">${u.nome} (${u.login})</option>`;
      });
    }

    // Modal Add
    if (addUsuarioSelect) {
      addUsuarioSelect.innerHTML = `<option value="">Selecione o Desenvolvedor...</option>`;
      users.forEach(u => {
        addUsuarioSelect.innerHTML += `<option value="${u.registro}">${u.nome} (${u.perfil})</option>`;
      });
    }

    // Modal Edit
    if (editUsuarioSelect) {
      editUsuarioSelect.innerHTML = `<option value="">Selecione o Desenvolvedor...</option>`;
      users.forEach(u => {
        editUsuarioSelect.innerHTML += `<option value="${u.registro}">${u.nome} (${u.perfil})</option>`;
      });
    }
  }

  function renderTable() {
    const programas = getStoredProgramas();
    const users = getStoredUsers();

    const query = inputSearch ? inputSearch.value.trim().toLowerCase() : '';
    const selectedStatus = selectStatus ? selectStatus.value : 'TODOS';
    const selectedDev = selectDev ? selectDev.value : 'TODOS';

    // Filtragem
    const filtered = programas.filter(p => {
      const matchQuery = p.nome.toLowerCase().includes(query) || (p.descricao || '').toLowerCase().includes(query);
      const matchStatus = selectedStatus === 'TODOS' || p.status === selectedStatus;
      const matchDev = selectedDev === 'TODOS' || String(p.registro_usuario) === String(selectedDev);
      return matchQuery && matchStatus && matchDev;
    });

    // Atualiza métricas
    updateMetrics(programas, users);

    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state">
              <i class="ph ph-folder-open"></i>
              <h4>Nenhum programa encontrado</h4>
              <p>Tente ajustar os filtros de busca ou cadastre um novo programa.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(p => {
      const dev = users.find(u => String(u.registro) === String(p.registro_usuario));
      const devName = dev ? dev.nome : `Registro #${p.registro_usuario}`;
      const devInitial = devName.charAt(0).toUpperCase();

      const isDisponivel = p.status === 'DISPONIVEL';
      const badgeClass = isDisponivel ? 'badge-disponivel' : 'badge-desenvolvimento';
      const badgeText = isDisponivel ? 'Disponível' : 'Em Desenvolvimento';

      const dataFormatada = p.data_envio ? new Date(p.data_envio).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }) : '—';

      return `
        <tr>
          <td style="font-weight:700; color:var(--subtle);">#${p.id}</td>
          <td>
            <div class="program-title-cell">${escapeHtml(p.nome)}</div>
          </td>
          <td>
            <div class="program-desc-cell" title="${escapeHtml(p.descricao || '')}">${escapeHtml(p.descricao || 'Sem descrição')}</div>
          </td>
          <td>
            <span class="badge ${badgeClass}">
              <span class="badge-dot"></span>
              ${badgeText}
            </span>
          </td>
          <td>
            <div class="user-badge-cell">
              <div class="user-avatar-xs">${devInitial}</div>
              <span>${escapeHtml(devName)}</span>
            </div>
          </td>
          <td style="font-size:0.82rem; color:var(--muted);">${dataFormatada}</td>
          <td style="text-align: right;">
            <div class="actions-cell" style="justify-content: flex-end;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="toggleStatusPrograma(${p.id})" title="Alternar Status">
                <i class="ph ph-arrows-counter-clockwise"></i>
              </button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="prepareEditPrograma(${p.id})" title="Editar">
                <i class="ph ph-pencil-simple"></i>
              </button>
              <button type="button" class="btn btn-danger btn-sm" onclick="deletePrograma(${p.id})" title="Excluir">
                <i class="ph ph-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function updateMetrics(programas, users) {
    const elTotal = document.getElementById('metricTotal');
    const elDev = document.getElementById('metricDev');
    const elDisp = document.getElementById('metricDisponivel');
    const elDevsCount = document.getElementById('metricDevsCount');

    if (elTotal) elTotal.textContent = programas.length;
    if (elDev) elDev.textContent = programas.filter(p => p.status === 'EM_DESENVOLVIMENTO').length;
    if (elDisp) elDisp.textContent = programas.filter(p => p.status === 'DISPONIVEL').length;
    
    // Desenvolvedores únicos associados a programas
    const uniqueDevs = new Set(programas.map(p => p.registro_usuario));
    if (elDevsCount) elDevsCount.textContent = uniqueDevs.size;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Eventos de Busca e Filtros
  if (inputSearch) inputSearch.addEventListener('input', renderTable);
  if (selectStatus) selectStatus.addEventListener('change', renderTable);
  if (selectDev) selectDev.addEventListener('change', renderTable);

  // Submissão Adicionar Programa
  if (formAdd) {
    formAdd.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('addNomePrograma').value.trim();
      const descricao = document.getElementById('addDescricaoPrograma').value.trim();
      const status = document.getElementById('addStatusPrograma').value;
      const registro_usuario = document.getElementById('addUsuarioPrograma').value;

      if (!nome || !registro_usuario) {
        showToast('Preencha o nome do programa e selecione um desenvolvedor.', 'error');
        return;
      }

      const programas = getStoredProgramas();
      
      // Verifica duplicidade de nome
      if (programas.some(p => p.nome.toLowerCase() === nome.toLowerCase())) {
        showToast('Já existe um programa com este nome.', 'error');
        return;
      }

      const nextId = programas.length > 0 ? Math.max(...programas.map(p => p.id)) + 1 : 1;
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

      const newProg = {
        id: nextId,
        nome,
        descricao,
        status,
        registro_usuario: parseInt(registro_usuario, 10),
        data_envio: now
      };

      programas.unshift(newProg);
      saveProgramas(programas);

      closeModal('modalAddPrograma');
      formAdd.reset();
      renderTable();
      showToast('Programa cadastrado com sucesso!', 'success');
    });
  }

  // Submissão Editar Programa
  if (formEdit) {
    formEdit.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = parseInt(document.getElementById('editIdPrograma').value, 10);
      const nome = document.getElementById('editNomePrograma').value.trim();
      const descricao = document.getElementById('editDescricaoPrograma').value.trim();
      const status = document.getElementById('editStatusPrograma').value;
      const registro_usuario = parseInt(document.getElementById('editUsuarioPrograma').value, 10);

      const programas = getStoredProgramas();
      const index = programas.findIndex(p => p.id === id);

      if (index !== -1) {
        programas[index].nome = nome;
        programas[index].descricao = descricao;
        programas[index].status = status;
        programas[index].registro_usuario = registro_usuario;

        saveProgramas(programas);
        closeModal('modalEditPrograma');
        renderTable();
        showToast('Programa atualizado com sucesso!', 'success');
      }
    });
  }

  // Funções Globais para Ações nas Linhas
  window.toggleStatusPrograma = function (id) {
    const programas = getStoredProgramas();
    const prog = programas.find(p => p.id === id);
    if (prog) {
      prog.status = prog.status === 'DISPONIVEL' ? 'EM_DESENVOLVIMENTO' : 'DISPONIVEL';
      saveProgramas(programas);
      renderTable();
      const newStatusText = prog.status === 'DISPONIVEL' ? 'Disponível' : 'Em Desenvolvimento';
      showToast(`Status do programa "${prog.nome}" alterado para ${newStatusText}.`, 'info');
    }
  };

  window.prepareEditPrograma = function (id) {
    const programas = getStoredProgramas();
    const prog = programas.find(p => p.id === id);
    if (prog) {
      document.getElementById('editIdPrograma').value = prog.id;
      document.getElementById('editNomePrograma').value = prog.nome;
      document.getElementById('editDescricaoPrograma').value = prog.descricao || '';
      document.getElementById('editStatusPrograma').value = prog.status;
      document.getElementById('editUsuarioPrograma').value = prog.registro_usuario;

      openModal('modalEditPrograma');
    }
  };

  window.deletePrograma = function (id) {
    const programas = getStoredProgramas();
    const prog = programas.find(p => p.id === id);
    if (prog && confirm(`Deseja realmente excluir o programa "${prog.nome}"?`)) {
      const updated = programas.filter(p => p.id !== id);
      saveProgramas(updated);
      renderTable();
      showToast(`Programa "${prog.nome}" removido.`, 'info');
    }
  };

  // Renderização inicial
  populateUserDropdowns();
  renderTable();
});
