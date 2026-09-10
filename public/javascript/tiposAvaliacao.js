(function () {
  const fields = ['id', 'nome', 'sigla', 'notaMaxima', 'status', 'text'];
  const displayMap = [
    { field: 'nome', cls: 'tipo-nome' },
    { field: 'sigla', cls: 'tipo-sigla' },
    { field: 'notaMaxima', cls: 'tipo-nota' }
  ];

  function getModal() {
    let modal = document.getElementById('tipos-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'tipos-modal';
    modal.innerHTML = `<div class="modal-panel">
      <h3>Tipo de Avaliação</h3><input type="hidden" id="modal-index" value="-1"><input type="hidden" id="modal-id">
      <div class="form-group"><label for="modal-nome">Nome *</label><input id="modal-nome" type="text" placeholder="Ex: Prova"></div>
      <div class="form-group"><label for="modal-sigla">Sigla</label><input id="modal-sigla" type="text" placeholder="Ex: P"></div>
      <div class="form-group"><label for="modal-notaMaxima">Nota máxima</label><input id="modal-notaMaxima" type="number" step="0.01"></div>
      <div class="form-group"><label for="modal-status">Status *</label><select id="modal-status"><option value="1">Ativo</option><option value="0">Inativo</option></select></div>
      <div class="form-group"><label for="modal-text">Descrição</label><textarea id="modal-text" rows="3"></textarea></div>
      <div class="actions"><button type="button" class="btn-secondary" data-action="close">Cancelar</button><button type="button" class="btn-primary" data-action="save">Salvar</button></div>
    </div>`;
    modal.addEventListener('click', event => {
      if (event.target === modal || event.target.dataset.action === 'close') closeTiposModal();
      if (event.target.dataset.action === 'save') saveTiposModal();
    });
    document.body.appendChild(modal);
    return modal;
  }

  function openTiposModal(index) {
    const modal = getModal();
    ModalHelper.openModal(modal, 'tipos', fields, index, { status: '1' });
    modal.querySelector('#modal-nome')?.focus();
  }

  function closeTiposModal() { document.getElementById('tipos-modal')?.classList.remove('open'); }

  function saveTiposModal() {
    const modal = document.getElementById('tipos-modal');
    const nome = modal?.querySelector('#modal-nome')?.value.trim();
    if (!modal || !nome) { modal?.querySelector('#modal-nome')?.focus(); return; }
    const values = ModalHelper.collectModalValues('tipos-modal', fields);
    const index = Number(modal.querySelector('#modal-index').value);
    ModalHelper.applyValuesToRow('tipos', fields, displayMap, index, values, 'openTiposModal', '/tipos-avaliacao/excluir');
    ModalHelper.reindex('tipos', fields, 'openTiposModal');
    closeTiposModal();
    document.getElementById('tipos-form')?.submit();
  }

  window.openTiposModal = openTiposModal;
  window.closeTiposModal = closeTiposModal;
  window.saveTiposModal = saveTiposModal;
  window.excluirTipo = id => ModalHelper.submitDelete(`/tipos-avaliacao/excluir/${id}`);
})();
