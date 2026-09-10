(function () {
  const fields = ['id', 'nome', 'sigla', 'horarioInicio', 'horarioFinal', 'status', 'text'];
  const displayMap = [
    { field: 'nome', cls: 'turno-nome' },
    { field: 'sigla', cls: 'turno-sigla' },
    { field: 'horarioInicio', cls: 'turno-inicio' },
    { field: 'horarioFinal', cls: 'turno-fim' }
  ];

  function getModal() {
    let modal = document.getElementById('turnos-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'turnos-modal';
    modal.innerHTML = `<div class="modal-panel">
      <h3>Turno</h3><input type="hidden" id="modal-index" value="-1"><input type="hidden" id="modal-id">
      <div class="form-group"><label for="modal-nome">Nome *</label><input id="modal-nome" type="text" placeholder="Ex: Manhã"></div>
      <div class="form-group"><label for="modal-sigla">Sigla</label><input id="modal-sigla" type="text" placeholder="Ex: MAN"></div>
      <div class="form-group"><label for="modal-horarioInicio">Horário inicial</label><input id="modal-horarioInicio" type="time"></div>
      <div class="form-group"><label for="modal-horarioFinal">Horário final</label><input id="modal-horarioFinal" type="time"></div>
      <div class="form-group"><label for="modal-status">Status *</label><select id="modal-status"><option value="1">Ativo</option><option value="0">Inativo</option></select></div>
      <div class="form-group"><label for="modal-text">Descrição</label><textarea id="modal-text" rows="3"></textarea></div>
      <div class="actions"><button type="button" class="btn-secondary" data-action="close">Cancelar</button><button type="button" class="btn-primary" data-action="save">Salvar</button></div>
    </div>`;
    modal.addEventListener('click', event => {
      if (event.target === modal || event.target.dataset.action === 'close') closeTurnosModal();
      if (event.target.dataset.action === 'save') saveTurnosModal();
    });
    document.body.appendChild(modal);
    return modal;
  }

  function openTurnosModal(index) {
    const modal = getModal();
    ModalHelper.openModal(modal, 'turnos', fields, index, { status: '1' });
    modal.querySelector('#modal-nome')?.focus();
  }

  function closeTurnosModal() { document.getElementById('turnos-modal')?.classList.remove('open'); }

  function saveTurnosModal() {
    const modal = document.getElementById('turnos-modal');
    const nome = modal?.querySelector('#modal-nome')?.value.trim();
    if (!modal || !nome) { modal?.querySelector('#modal-nome')?.focus(); return; }
    const values = ModalHelper.collectModalValues('turnos-modal', fields);
    const index = Number(modal.querySelector('#modal-index').value);
    ModalHelper.applyValuesToRow('turnos', fields, displayMap, index, values, 'openTurnosModal', '/turnos/excluir');
    ModalHelper.reindex('turnos', fields, 'openTurnosModal');
    closeTurnosModal();
    document.getElementById('turnos-form')?.submit();
  }

  window.openTurnosModal = openTurnosModal;
  window.closeTurnosModal = closeTurnosModal;
  window.saveTurnosModal = saveTurnosModal;
  window.excluirTurno = id => ModalHelper.submitDelete(`/turnos/excluir/${id}`);
})();
