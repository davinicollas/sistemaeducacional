 function getOrCreateAnosModal() {
    let modal = document.getElementById('anos-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'anos-modal';
    modal.innerHTML = `
      <div class="modal-panel">
        <h3>Ano Letivo</h3>
        <input type="hidden" id="modal-index" value="-1">
        <input type="hidden" id="modal-id" value="">

        <div class="form-group">
          <label for="modal-anoLetivo">Ano *</label>
          <input id="modal-anoLetivo" type="number" placeholder="Ex: 2026" />
        </div>

        <div class="form-group">
          <label for="modal-dataInicio">Data inicial</label>
          <input id="modal-dataInicio" type="date" />
        </div>

        <div class="form-group">
          <label for="modal-dataFim">Data final</label>
          <input id="modal-dataFim" type="date" />
        </div>

        <div class="form-group">
          <label for="modal-atual">Ano atual</label>
          <select id="modal-atual">
            <option value="0">Não</option>
            <option value="1">Sim</option>
          </select>
        </div>

        <div class="form-group">
          <label for="modal-status">Status *</label>
          <select id="modal-status">
            <option value="1">Ativo</option>
            <option value="0">Inativo</option>
          </select>
        </div>

        <div class="form-group">
          <label for="modal-text">Descrição</label>
          <textarea id="modal-text" rows="3" placeholder="Informações do ano letivo"></textarea>
        </div>

        <div class="actions">
          <button type="button" class="btn-secondary" onclick="closeAnosModal()">Cancelar</button>
          <button type="button" class="btn-primary" onclick="saveAnosModal()">Salvar</button>
        </div>
      </div>
    `;
    modal.addEventListener('click', function (e) { if (e.target === modal) closeAnosModal(); });
    document.body.appendChild(modal);
    return modal;
  }

  function openAnosModal(index) {
    console.log('teste');
    const modal = getOrCreateAnosModal();
    const fields = ['id', 'anoLetivo', 'dataInicio', 'dataFim', 'status', 'atual', 'text'];

    ModalHelper.openModal(modal, 'anos', fields, index, { status: '1', atual: '0' });

    setTimeout(() => { const nameInput = modal.querySelector('#modal-anoLetivo'); if (nameInput) nameInput.focus(); }, 10);
  }

  function closeAnosModal() {
    const modal = document.getElementById('anos-modal');
    if (!modal) return;
    modal.classList.remove('open');
  }

  function saveAnosModal() {
    const modal = document.getElementById('anos-modal');
    if (!modal) return;

    const ano = modal.querySelector('#modal-anoLetivo').value.trim();
    if (!ano) { modal.querySelector('#modal-anoLetivo').focus(); return; }

    const values = {
      id: modal.querySelector('#modal-id').value.trim(),
      anoLetivo: ano,
      dataInicio: modal.querySelector('#modal-dataInicio').value.trim(),
      dataFim: modal.querySelector('#modal-dataFim').value.trim(),
      status: modal.querySelector('#modal-status').value,
      atual: modal.querySelector('#modal-atual').value,
      text: modal.querySelector('#modal-text').value.trim()
    };

    const idx = parseInt(modal.querySelector('#modal-index').value, 10);

    const fields = ['id','anoLetivo','dataInicio','dataFim','status','atual','text'];
    const displayMap = [
      { field: 'anoLetivo', cls: 'ano-ano' },
      { field: 'dataInicio', cls: 'ano-inicio' },
      { field: 'dataFim', cls: 'ano-fim' },
      { field: 'atual', cls: 'ano-atual' }
    ];

    ModalHelper.applyValuesToRow('anos', fields, displayMap, idx, values, 'openAnosModal', '/anos-letivos/excluir');
    ModalHelper.reindex('anos', fields, 'openAnosModal');
    closeAnosModal();

    const anosForm = document.getElementById('anos-form');
        if (anosForm) {
            anosForm.submit();
        }
  }

  function excluirAno(id) { ModalHelper.submitDelete(`/anos-letivos/excluir/${id}`); }

  function removeAnosRow(btn) { ModalHelper.removeRow(btn, 'anos', ['id','anoLetivo','dataInicio','dataFim','status','atual','text'], 'openAnosModal'); }

  function reindexAnos() { ModalHelper.reindex('anos', ['id','anoLetivo','dataInicio','dataFim','status','atual','text'], 'openAnosModal'); }