(function (window) {
  const ModalHelper = {};

  // Coleta valores dos campos do modal (ids: modal-<field>)
  ModalHelper.collectModalValues = function (modalId, fields) {
    const modal = document.getElementById(modalId);
    if (!modal) return {};
    const values = {};
    fields.forEach(f => {
      const el = modal.querySelector(`#modal-${f}`);
      values[f] = el ? (el.value || '').trim() : '';
    });
    return values;
  };

  // Preenche os campos do modal com valores informados (usado para "Novo" com defaults)
 ModalHelper.fillModalFields = function (modal, fields, values = {}) {

    if (!modal || !Array.isArray(fields)) {
        return;
    }

    fields.forEach(field => {

        const el = modal.querySelector(`#modal-${field}`);

        if (!el) {
            return;
        }
        if (el.type === 'file') {
            el.value = '';
            return;
        }

       const value = values[field] !== undefined && values[field] !== null ? values[field] : ''; el.value = value;
    });
};

  // Limpa o modal para um novo registro, aplicando defaults (ex: status = '1')
  ModalHelper.resetModal = function (modal, fields, defaults = {}) {
    ModalHelper.fillModalFields(modal, fields, defaults);
  };

  // Preenche o modal a partir de uma linha na tabela (campos escondidos)
  ModalHelper.populateModalFromRow = function (modalId, prefix, index, fields) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const tbody = document.getElementById(`${prefix}-tbody`);
    if (!tbody) return;
    const row = tbody.querySelector(`tr[data-index="${index}"]`);
    if (!row) return;
    const values = {};
    fields.forEach(f => {
      const hidden = row.querySelector(`.hidden-values input[data-field="${f}"]`);
      values[f] = hidden ? hidden.value : '';
    });
    ModalHelper.fillModalFields(modal, fields, values);
  };

  // Abre o modal de edição/criação: reseta com defaults (novo) ou popula a partir da linha (editar)
  ModalHelper.openModal = function (modal, prefix, fields, index, defaults = {}) {
    const idxInput = modal.querySelector('#modal-index');
    if (idxInput) idxInput.value = index === null ? -1 : index;

    if (index === null) {
      ModalHelper.resetModal(modal, fields, defaults);
    } else {
      ModalHelper.populateModalFromRow(modal.id, prefix, index, fields);
    }

    modal.classList.add('open');
  };

  // Aplica valores à tabela: atualiza linha existente ou cria uma nova
  // displayMap = [{ field: 'nome', cls: 'turno-nome' }, ...]
  ModalHelper.applyValuesToRow = function (prefix, fields, displayMap, idx, values, openFnName, deleteUrlPrefix) {
    const tbody = document.getElementById(`${prefix}-tbody`);
    if (!tbody) return;

    if (idx === -1) {
      const newIdx = tbody.querySelectorAll('tr').length;
      const tr = document.createElement('tr');
      tr.setAttribute('data-index', newIdx);
      tr.className = `${prefix}-row`;

      // visible columns
      let inner = '';
      displayMap.forEach(dm => { inner += `<td><span class="${dm.cls}"></span></td>`; });

      inner += `<td class="${prefix}-actions">
                  <button type="button" class="btn-secondary btn-edit-row" onclick="${openFnName}(${newIdx})">Editar</button>
                  <button type="button" class="btn-secondary" onclick="ModalHelper.submitDelete('${deleteUrlPrefix}/${values.id || ''}')">Excluir</button>
                </td>`;

      inner += `<td class="hidden-values" style="display:none"></td>`;
      tr.innerHTML = inner;

      const hiddenCell = tr.querySelector('.hidden-values');
      fields.forEach(f => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = `${prefix}[${newIdx}][${f}]`;
        input.setAttribute('data-field', f);
        input.value = values[f] || '';
        hiddenCell.appendChild(input);
      });

      // preencher spans visíveis
      displayMap.forEach(dm => {
        const span = tr.querySelector(`.${dm.cls}`);
        if (span) span.textContent = values[dm.field] || '';
      });

      tbody.appendChild(tr);
      const empty = document.getElementById(`${prefix}-empty`);
      if (empty) empty.remove();
      return;
    }

    // update existing
    const row = tbody.querySelector(`tr[data-index="${idx}"]`);
    if (!row) return;
    fields.forEach(f => {
      const hidden = row.querySelector(`.hidden-values input[data-field="${f}"]`);
      if (hidden) hidden.value = values[f] || '';
    });
    displayMap.forEach(dm => {
      const span = row.querySelector(`.${dm.cls}`);
      if (span) span.textContent = values[dm.field] || '';
    });
  };

  // Reindexa os nomes dos inputs escondidos e atualiza o botão de edição
  // Usa o atributo data-field (definido nos inputs) em vez de parsear o name, evitando erros de regex.
  ModalHelper.reindex = function (prefix, fields, openFnName) {
    const tbody = document.getElementById(`${prefix}-tbody`);
    if (!tbody) return;
    tbody.querySelectorAll('tr').forEach(function (row, idx) {
      row.setAttribute('data-index', idx);
      row.querySelectorAll('.hidden-values input[data-field]').forEach(function (input) {
        input.name = `${prefix}[${idx}][${input.getAttribute('data-field')}]`;
      });
      const editBtn = row.querySelector('.btn-edit-row');
      if (editBtn) editBtn.setAttribute('onclick', `${openFnName}(${idx})`);
    });
  };

  ModalHelper.removeRow = function (btn, prefix, fields, openFnName) {
    const row = btn.closest('tr');
    if (!row) return;
    const tbody = row.parentElement;
    row.remove();
    ModalHelper.reindex(prefix, fields, openFnName);
    if (tbody && !tbody.querySelectorAll('tr').length) {
      const existingEmpty = document.getElementById(`${prefix}-empty`);
      if (!existingEmpty) {
        const p = document.createElement('p');
        p.id = `${prefix}-empty`;
        p.className = 'series-empty';
        p.textContent = 'Nenhum registro cadastrado ainda.';
        tbody.parentElement.appendChild(p);
      }
    }
  };

  ModalHelper.submitDelete = function (action) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = action;
    document.body.appendChild(form);
    form.submit();
  };

  window.ModalHelper = ModalHelper;
})(window);
