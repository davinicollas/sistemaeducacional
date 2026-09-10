(function () {
  const fields = ['id', 'nome', 'abreviacao', 'anoLetivo', 'dataInicio', 'dataFim', 'ordem', 'tipo', 'status', 'text'];
  const displayMap = [
    { field: 'nome', cls: 'periodo-nome' },
    { field: 'anoLetivo', cls: 'periodo-ano' },
    { field: 'dataInicio', cls: 'periodo-inicio' },
    { field: 'dataFim', cls: 'periodo-fim' },
    { field: 'ordem', cls: 'periodo-ordem' }
  ];
  const data = window.periodosConfig || { anos: [] };

  function getModal() {
    let modal = document.getElementById('periodos-modal');
    if (modal) return modal;
    const anos = data.anos.map(ano => `<option value="${ano.value}">${ano.label}</option>`).join('');
    modal = document.createElement('div');
    modal.id = 'periodos-modal';
    modal.innerHTML = `<div class="modal-panel">
      <h3>Período</h3><input type="hidden" id="modal-index" value="-1"><input type="hidden" id="modal-id">
      <div class="form-group"><label for="modal-nome">Nome *</label><input id="modal-nome" type="text" placeholder="Ex: 1º Bimestre"></div>
      <div class="form-group"><label for="modal-abreviacao">Abreviação</label><input id="modal-abreviacao" type="text"></div>
      <div class="form-group"><label for="modal-anoLetivo">Ano letivo</label><select id="modal-anoLetivo"><option value="">Selecione</option>${anos}</select></div>
      <div class="form-group"><label for="modal-dataInicio">Data inicial</label><input id="modal-dataInicio" type="date"></div>
      <div class="form-group"><label for="modal-dataFim">Data final</label><input id="modal-dataFim" type="date"></div>
      <div class="form-group"><label for="modal-ordem">Ordem</label><input id="modal-ordem" type="number"></div>
      <div class="form-group"><label for="modal-tipo">Tipo</label><select id="modal-tipo"><option>Bimestre</option><option>Trimestre</option><option>Semestre</option><option>Personalizado</option></select></div>
      <div class="form-group"><label for="modal-status">Status *</label><select id="modal-status"><option value="1">Ativo</option><option value="0">Inativo</option></select></div>
      <div class="form-group"><label for="modal-text">Descrição</label><textarea id="modal-text" rows="3"></textarea></div>
      <div class="actions"><button type="button" class="btn-secondary" data-action="close">Cancelar</button><button type="button" class="btn-primary" data-action="save">Salvar</button></div>
    </div>`;
    modal.addEventListener('click', event => {
      if (event.target === modal || event.target.dataset.action === 'close') closePeriodosModal();
      if (event.target.dataset.action === 'save') savePeriodosModal();
    });
    document.body.appendChild(modal);
    return modal;
  }

  function openPeriodosModal(index) {
    const modal = getModal();
    ModalHelper.openModal(modal, 'periodos', fields, index, { status: '1' });
    modal.querySelector('#modal-nome')?.focus();
  }

  function closePeriodosModal() { document.getElementById('periodos-modal')?.classList.remove('open'); }

  function savePeriodosModal() {
    const modal = document.getElementById('periodos-modal');
    const nome = modal?.querySelector('#modal-nome')?.value.trim();
    if (!modal || !nome) { modal?.querySelector('#modal-nome')?.focus(); return; }
    const values = ModalHelper.collectModalValues('periodos-modal', fields);
    const index = Number(modal.querySelector('#modal-index').value);
    ModalHelper.applyValuesToRow('periodos', fields, displayMap, index, values, 'openPeriodosModal', '/periodos/excluir');
    ModalHelper.reindex('periodos', fields, 'openPeriodosModal');
    closePeriodosModal();
    document.getElementById('periodos-form')?.submit();
  }

  window.openPeriodosModal = openPeriodosModal;
  window.closePeriodosModal = closePeriodosModal;
  window.savePeriodosModal = savePeriodosModal;
  window.excluirPeriodo = id => ModalHelper.submitDelete(`/periodos/excluir/${id}`);
})();
