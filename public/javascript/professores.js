window.PROFESSOR_FIELDS = ['id','nome','nome_social','cpf','data_nascimento','sexo','id_disciplina','carga_horaria','id_status','email','telefone','celular','cep','endereco','numeros','complemento','bairro','cidade','id_estado','matricula','registro_profissional','data_admissao','idFormacao','area_formacao','observacoes','has_senha'];

// Ensure PROFESSOR_DISCIPLINAS is provided by the page (set in the EJS view before this script)
window.PROFESSOR_DISCIPLINAS = window.PROFESSOR_DISCIPLINAS || {};

function getOrCreateProfessorModal() {
  let modal = document.getElementById('professor-modal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.id = 'professor-modal';
  modal.innerHTML = `
      <div class="modal-panel">
        <section class="config-card">
            <h3>Professor</h3>
            <input type="hidden" id="modal-index" value="-1">
            <input type="hidden" id="modal-id" value="">

            <div class="form-group">
            <label for="modal-nome">Nome *</label>
            <input id="modal-nome" type="text" placeholder="Ex: Maria" />
            </div>

            <div class="form-group">
            <label for="modal-nome_social">Nome Social</label>
            <input id="modal-nome_social" type="text" placeholder="Ex: Maria" />
            </div>

            <div class="form-group">
            <label for="modal-cpf">CPF</label>
            <input id="modal-cpf" type="text" placeholder="Ex: 123.456.789-00" />
            </div>

            <div class="form-group">
            <label for="modal-data_nascimento">Data de Nascimento</label>
            <input id="modal-data_nascimento" type="date" />
            </div>

            <div class="form-group">
            <label for="modal-sexo">Sexo</label>
            <select id="modal-sexo">
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
            </select>
            </div>
        </section>

        <section class="config-card">
            <h3>Contato</h3>
            <div class="form-group">
                <label for="modal-telefone">Telefone</label>
                <input id="modal-telefone" type="text" placeholder="Ex: (11) 98765-4321" />
            </div>

            <div class="form-group">
                <label for="modal-celular">Celular</label>
                <input id="modal-celular" type="text" placeholder="Ex: (11) 98765-4321" />
            </div>

            <div class="form-group">
                <label for="modal-cep">CEP</label>
                <input id="modal-cep" type="text" placeholder="Ex: 12345-678" />
            </div>

            <div class="form-group">
                <label for="modal-endereco">Endereço</label>
                <input id="modal-endereco" type="text" placeholder="Ex: Rua das Flores, 123" />
            </div>

            <div class="form-group">
                <label for="modal-numeros">Números</label>
                <input id="modal-numeros" type="text" placeholder="Ex: 12345" />
            </div>

            <div class="form-group">
                <label for="modal-complemento">Complemento</label>
                <input id="modal-complemento" type="text" placeholder="Ex: Apt 101" />
            </div>

            <div class="form-group">
                <label for="modal-bairro">Bairro</label>
                <input id="modal-bairro" type="text" placeholder="Ex: Centro" />
            </div>

            <div class="form-group">
                <label for="modal-cidade">Cidade</label>
                <input id="modal-cidade" type="text" placeholder="Ex: São Paulo" />
             </div>
            <div class="form-group">
                <label for="modal-id_estado">Estado</label>
                <select id="modal-id_estado">
                    <option value="">Selecione</option>
                    <% estadoList.forEach(function (e) { %>
                        <option value="<%= e.id %>"><%= e.text %></option>
                    <% }) %>
                </select>
            </div>
        </section>

        <section class="config-card">
            <h3>Dados profissionais</h3>    
            <div class="form-group">
                <label for="modal-matricula">Matrícula</label>
                <input id="modal-matricula" type="text" placeholder="Ex: 123456" />
            </div>
            <div class="form-group">
                <label for="modal-registro_profissional">Registro Profissional</label>
                <input id="modal-registro_profissional" type="text" placeholder="Ex: 123456" />
            </div>
            <div class="form-group">
                <label for="modal-data_admissao">Data de Admissão</label>
                <input id="modal-data_admissao" type="date" />
            </div>
            <div class="form-group">
              <label for="modal-idFormacao">Formação</label>
               <select id="modal-idFormacao">
                    <option value="">Selecione</option>
                    <% formacaoCatalogo.forEach(function (f) { %>
                        <option value="<%= f.id %>"><%= f.text %></option>
                    <% }) %>
                </select>
            </div>
            <div class="form-group">
                <label for="modal-area_formacao">Área de Formação</label>
                <input id="modal-area_formacao" type="text" placeholder="Ex: Matemática" />
            </div>
            <div class="form-group">
                <label for="modal-id_disciplina">Disciplina</label>
                <select id="modal-id_disciplina">
                    <option value="">Selecione</option>
                    <% disciplinasCatalogo.forEach(function (d) { %>
                        <option value="<%= d.id %>"><%= d.text %></option>
                    <% }) %>
                </select>
            </div>
            <div class="form-group">
                <label for="modal-carga_horaria">Carga Horária</label>
                <input id="modal-carga_horaria" type="text" placeholder="Ex: 40h" />
            </div>
            <div class="form-group">
                <label for="modal-id_status">Status *</label>
                <select id="modal-id_status">
                    <option value="1">Ativo</option>
                    <option value="0">Inativo</option>
                </select>
            </div>
            <div class="form-group">
                <label for="modal-observacoes">Observações</label>
                <textarea id="modal-observacoes" placeholder="Ex: Professor dedicado e experiente"></textarea>
            </div>
            
        </section>
<section class="config-card">
                <h3>E-mail de acesso</h3>
                <div class="form-group">
                    <label for="modal-email">E-mail:</label>
                    <input id="modal-email" type="email" placeholder="E-mail de acesso" />
                    <div style="margin-top:8px;">
                        <button type="button" id="alterar-senha-btn" class="btn-secondary" style="display:none" onclick="(function(){ document.getElementById('access-fields').style.display='block'; document.getElementById('access-confirm').style.display='block'; document.getElementById('alterar-senha-btn').style.display='none'; })()">Alterar senha</button>
                    </div>
                </div>
            </section>
          <!-- Acesso do professor -->
          <section class="config-card">
            <h3>Acesso do professor</h3>
            <input type="hidden" id="modal-has_senha" value="">
            <div class="form-group" id="prof-access-fields">
              <label for="modal-senha">Senha</label>
              <div style="display:flex;gap:8px;align-items:center;">
                <input id="modal-senha" type="password" autocomplete="new-password" style="flex:1" readonly />
              </div>
            </div>
            <div class="form-group" id="prof-access-confirm">
              <label for="modal-confirmar_senha">Confirmar senha</label>
              <div style="display:flex;gap:6px;align-items:center;">
                <input id="modal-confirmar_senha" type="password" autocomplete="new-password" style="flex:1" readonly />
              </div>
            </div>
            <div style="display:flex;gap:8px;margin-top:8px;">
              <button type="button" class="btn-warning" onclick="profGerarSenhaModal()"><i class="bi bi-shuffle"></i> Gerar senha</button>
              <button type="button" class="btn-primary" onclick="profSaveSenhaModal()">Salvar acesso</button>
              <button type="button" class="btn-secondary" onclick="profToggleSenha()" aria-label="Mostrar senha"><i id="modal-senha-ico" class="bi bi-eye"></i></button>
            </div>
          </section>


        <div class="actions">
          <button type="button" class="btn-secondary" onclick="closeProfessorModal()">Cancelar</button>
          <button type="button" class="btn-primary" onclick="saveProfessorModal()">Salvar</button>
        </div>
      </div>
    `;
  modal.addEventListener('click', function (e) { if (e.target === modal) closeProfessorModal(); });
  document.body.appendChild(modal);
  return modal;
}

function openProfessorModal(index) {
  const modal = getOrCreateProfessorModal();

  ModalHelper.openModal(modal, 'professores', window.PROFESSOR_FIELDS, index, { id_status: '1' });

  // control access fields visibility depending on has_senha flag
  setTimeout(() => {
    const nameInput = modal.querySelector('#modal-nome'); if (nameInput) nameInput.focus();
    const hasSenha = modal.querySelector('#modal-has_senha')?.value;
    const accessFields = modal.querySelector('#prof-access-fields');
    const accessConfirm = modal.querySelector('#prof-access-confirm');
    const alterarBtn = modal.querySelector('#prof-alterar-senha-btn');
    if (hasSenha && String(hasSenha) !== '0' && String(hasSenha) !== '') {
      if (accessFields) accessFields.style.display = 'none';
      if (accessConfirm) accessConfirm.style.display = 'none';
      if (alterarBtn) alterarBtn.style.display = 'inline-block';
    } else {
      if (accessFields) accessFields.style.display = 'block';
      if (accessConfirm) accessConfirm.style.display = 'block';
      if (alterarBtn) alterarBtn.style.display = 'none';
    }
  }, 10);
}

function closeProfessorModal() {
  const modal = document.getElementById('professor-modal');
  if (!modal) return;
  modal.classList.remove('open');
}

function saveProfessorModal() {
  const modal = document.getElementById('professor-modal');
  if (!modal) return;

  const values = ModalHelper.collectModalValues('professor-modal', window.PROFESSOR_FIELDS);
  if (!values.nome) { modal.querySelector('#modal-nome').focus(); return; }

  const idx = parseInt(modal.querySelector('#modal-index').value, 10);

  const displayValues = Object.assign({}, values, {
    status_label: values.id_status === '0' ? 'Inativo' : 'Ativo',
    disciplina_nome: window.PROFESSOR_DISCIPLINAS[values.id_disciplina] || ''
  });

  const displayMap = [
    { field: 'nome', cls: 'professores-nome' },
    { field: 'disciplina_nome', cls: 'professores-disciplina' },
    { field: 'email', cls: 'professores-email' },
    { field: 'status_label', cls: 'professores-status' }
  ];

  ModalHelper.applyValuesToRow('professores', window.PROFESSOR_FIELDS, displayMap, idx, displayValues, 'openProfessorModal', '/professores/excluir');
  ModalHelper.reindex('professores', window.PROFESSOR_FIELDS, 'openProfessorModal');
  closeProfessorModal();

  const professoresForm = document.getElementById('professores-form');
        if (professoresForm) {
            professoresForm.submit();
        }
}

function excluirProfessor(id) { ModalHelper.submitDelete(`/professores/excluir/${id}`); }

function removeProfessorRow(btn) { ModalHelper.removeRow(btn, 'professores', window.PROFESSOR_FIELDS, 'openProfessorModal'); }

function reindexProfessor() { ModalHelper.reindex('professores', window.PROFESSOR_FIELDS, 'openProfessorModal'); }


// Password helpers for professors (client-side)
function profToggleSenha() {
  const s1 = document.getElementById('modal-senha');
  const s2 = document.getElementById('modal-confirmar_senha');
  const ico1 = document.getElementById('modal-senha-ico');
  const ico2 = document.getElementById('modal-confirmar-senha-ico');
  if (!s1 || !s2) return;
  const modal = document.getElementById('professor-modal');
  const hasSenha = modal?.querySelector('#modal-has_senha')?.value;
  // if password is masked (we store mask as '********'), ask for the password before revealing
  const isMasked = s1.value === '********' || s2.value === '********' || (!s1.value && hasSenha === '1');
  if (isMasked) {
    const entered = window.prompt('Digite a senha para exibir');
    if (!entered) return;
    // reveal the entered password (no server-side verification)
    s1.type = 'text'; s2.type = 'text';
    s1.value = entered; s2.value = entered;
    s1.dataset.revealed = '1';
    if (ico1) ico1.className = 'bi bi-eye-slash';
    if (ico2) ico2.className = 'bi bi-eye-slash';
    // make editable so user can copy if needed
    s1.readOnly = false; s2.readOnly = false;
    return;
  }

  // normal toggle
  const show = s1.type === 'password';
  s1.type = show ? 'text' : 'password';
  s2.type = show ? 'text' : 'password';
  if (ico1) ico1.className = show ? 'bi bi-eye-slash' : 'bi bi-eye';
  if (ico2) ico2.className = show ? 'bi bi-eye-slash' : 'bi bi-eye';

  // if hiding and previously revealed via prompt, remask
  if (!show && s1.dataset.revealed) {
    s1.value = '********'; s2.value = '********';
    s1.readOnly = true; s2.readOnly = true;
    delete s1.dataset.revealed;
  }
}

function profGerarSenhaModal(length = 10) {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%*?&';
  const all = upper + lower + numbers + symbols;
  function randFrom(str) { return str[Math.floor(Math.random() * str.length)]; }
  let pw = '';
  pw += randFrom(upper); pw += randFrom(lower); pw += randFrom(numbers); pw += randFrom(symbols);
  for (let i = pw.length; i < Math.max(8, length); i++) pw += randFrom(all);
  pw = pw.split('').sort(() => 0.5 - Math.random()).join('');
  const s1 = document.getElementById('modal-senha');
  const s2 = document.getElementById('modal-confirmar_senha');
  if (s1 && s2) {
    s1.value = pw; s2.value = pw; if (s1.type === 'password') profToggleSenha();
  }
}

function profValidarSenhas() {
  const s1 = document.getElementById('modal-senha')?.value || '';
  const s2 = document.getElementById('modal-confirmar_senha')?.value || '';
  if (s1.length < 8) return { valido: false, mensagem: 'A senha deve ter pelo menos 8 caracteres.' };
  if (s1 !== s2) return { valido: false, mensagem: 'Senha e confirmação não conferem.' };
  return { valido: true };
}

async function profSaveSenhaModal() {
  const modal = document.getElementById('professor-modal');
  if (!modal) return;
  const idx = parseInt(modal.querySelector('#modal-index').value || -1, 10);
  const id = modal.querySelector('#modal-id')?.value;
  if (!id) return alert('ID do professor não encontrado.');
  const valid = profValidarSenhas();
  if (!valid.valido) return alert(valid.mensagem);
  const senha = modal.querySelector('#modal-senha').value;
  const confirmar = modal.querySelector('#modal-confirmar_senha').value;
  const meta = document.querySelector('meta[name="csrf-token"]');
  try {
    const res = await fetch(`/professores/${encodeURIComponent(id)}/senha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-csrf-token': meta ? meta.content : '' },
      credentials: 'same-origin',
      body: JSON.stringify({ senha, confirmar })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.mensagem || 'Erro ao salvar senha.');
    alert(data.mensagem || 'Senha atualizada.');
    if (idx >= 0) {
      const row = document.querySelector(`#professores-tbody tr[data-index="${idx}"]`);
      if (row) {
        const hidden = row.querySelector('.hidden-values input[data-field="has_senha"]');
        if (hidden) hidden.value = '1';
      }
    }
    // mask the password in the form after saving
    const s1 = modal.querySelector('#modal-senha');
    const s2 = modal.querySelector('#modal-confirmar_senha');
    if (s1 && s2) {
      s1.value = '********';
      s2.value = '********';
      s1.readOnly = true; s2.readOnly = true;
    }
    modal.querySelector('#modal-has_senha').value = '1';
  } catch (e) { console.error(e); alert('Erro ao atualizar senha.'); }
}
