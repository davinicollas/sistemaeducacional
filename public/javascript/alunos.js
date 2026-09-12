
const ALUNOS_FIELDS = ['id', 'nome', 'nome_social', 'cpf', 'rg', 'matricula', 'email', 'data_nascimento', 'sexo', 'nacionalidade', 'naturalidade', 'id_estado_nascimento', 'foto', 'id_tipo_documento', 'numero_documento', 'orgao_expedidor',
    'data_expedicao', 'certidao_nascimento', 'numero_certidao', 'observacoes', 'id_status',  'has_senha'];

function getAlunosOptions(templateId) {
    const template = document.getElementById(templateId);
    return template ? template.innerHTML : '<option value="">Selecione</option>';
}

function getOrCreateAlunosModal() {
    let modal = document.getElementById('alunos-modal');

    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'alunos-modal';
    modal.innerHTML = `
    <div class="modal-panel">

        <!-- =========================
             DADOS PESSOAIS
        ========================== -->
        <section class="config-card">
            <h3>Dados pessoais</h3>

            <input type="hidden" id="modal-index" value="-1">
            <input type="hidden" id="modal-id" value="">

            <div class="form-group">
                <label for="modal-nome">Nome *</label>
                <input
                    id="modal-nome"
                    type="text"
                    placeholder="Ex: Maria da Silva"
                />
            </div>

            <div class="form-group">
                <label for="modal-nome_social">Nome Social</label>
                <input
                    id="modal-nome_social"
                    type="text"
                    placeholder="Ex: Maria"
                />
            </div>

            <div class="form-group">
                <label for="modal-cpf">CPF</label>
                <input
                    id="modal-cpf"
                    type="text"
                    placeholder="Ex: 123.456.789-00"
                />
            </div>

            <div class="form-group">
                <label for="modal-rg">RG</label>
                <input
                    id="modal-rg"
                    type="text"
                    placeholder="Ex: MG-12.345.678"
                />
            </div>
            <div class="form-group">
                <label for="modal-matricula">Matrícula</label>
                <input
                    id="modal-matricula"
                    type="text"
                    placeholder="Ex: 123456",
                    readonly
                />
                 <button type="button" class="btn-warning"
                    onclick="gerarMatricula()"><i class="bi bi-arrow-repeat"></i>Gerar Matrícula</button>    
            </div>
            <div class="form-group">
                <label for="modal-data_nascimento">Data de Nascimento</label>
                <input
                    id="modal-data_nascimento"
                    type="date"
                />
            </div>

            <div class="form-group">
                <label for="modal-sexo">Sexo</label>
                <select id="modal-sexo">
                    <option value="">Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                </select>
            </div>

            <div class="form-group">
                <label for="modal-nacionalidade">Nacionalidade</label>
                <input
                    id="modal-nacionalidade"
                    type="text"
                    placeholder="Ex: Brasileira"
                />
            </div>

            <div class="form-group">
                <label for="modal-naturalidade">Naturalidade</label>
                <input
                    id="modal-naturalidade"
                    type="text"
                    placeholder="Ex: Belo Horizonte"
                />
            </div>
            <div class="form-group">

                <label for="modal-id_estado_nascimento">Estado de Nascimento</label>
                <select id="modal-id_estado_nascimento">${getAlunosOptions('alunos-estados-options')}</select>
            </div>
           <div class="form-group"> <label for="modal-foto"> Foto do aluno </label> <input id="modal-foto" name="foto" type="file" accept=".png,.jpg,.jpeg" /> <p id="modal-foto-atual" class="foto-atual"></p> </div>
            <div class="form-group">
                <label for="modal-id_status">Status *</label>
                <select id="modal-id_status">
                    <option value="1">Ativo</option>
                    <option value="0">Inativo</option>
                </select>
            </div>
        </section>


        <!-- =========================
             DOCUMENTAÇÃO
        ========================== -->
        <section class="config-card">
            <h3>Documentação</h3>

            <div class="form-group">
                <label for="modal-id_tipo_documento">
                    Tipo de Documento
                </label>

                <select id="modal-id_tipo_documento">${getAlunosOptions('alunos-tipos-documentos-options')}</select>
            </div>

            <div class="form-group">
                <label for="modal-numero_documento">
                    Número do Documento
                </label>

                <input
                    id="modal-numero_documento"
                    type="text"
                    placeholder="Ex: 123456789"
                />
            </div>

            <div class="form-group">
                <label for="modal-orgao_expedidor">
                    Órgão Expedidor
                </label>

                <input
                    id="modal-orgao_expedidor"
                    type="text"
                    placeholder="Ex: SSP/MG"
                />
            </div>

            <div class="form-group">
                <label for="modal-data_expedicao">
                    Data de Expedição
                </label>

                <input
                    id="modal-data_expedicao"
                    type="date"
                />
            </div>

            <div class="form-group">
                <label for="modal-certidao_nascimento">
                    Certidão de Nascimento
                </label>

                <input
                    id="modal-certidao_nascimento"
                    type="text"
                    placeholder="Ex: Certidão de Nascimento"
                />
            </div>

            <div class="form-group">
                <label for="modal-numero_certidao">
                    Número da Certidão
                </label>

                <input
                    id="modal-numero_certidao"
                    type="text"
                    placeholder="Número da certidão"
                />
            </div>
        </section>
        <section class="config-card">
            <h3>Informações complementares</h3>
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

        <!-- =========================
             ACESSO DO ALUNO
        ========================== -->
        <section class="config-card">
            <h3>Acesso do aluno</h3>

            <input type="hidden" id="modal-has_senha" value="">

            <div class="form-group" id="access-fields">
                <label for="modal-senha">Senha</label>
                <div style="display:flex;gap:8px;align-items:center;">
                    <input id="modal-senha" type="password" autocomplete="new-password" style="flex:1" />
                </div>
            </div>

            <div class="form-group" id="access-confirm">
                <label for="modal-confirmar_senha">Confirmar senha</label>
                <div style="display:flex;gap:8px;align-items:center;">
                    <input id="modal-confirmar_senha" type="password" autocomplete="new-password" style="flex:1" />
                </div>
            </div>

            <div style="display:flex;gap:8px;margin-top:8px;">
                <button type="button" class="btn-warning" onclick="gerarSenhaModal()"><i class="bi bi-shuffle"></i> Gerar senha</button>
                <button type="button" class="btn-primary" onclick="saveSenhaModal()">Salvar acesso</button>
                <button type="button" class="btn-secondary" onclick="toggleSenha()" aria-label="Mostrar senha"><i id="modal-senha-ico" class="bi bi-eye"></i></button>

            </div>
        </section>

        <!-- =========================
             AÇÕES
        ========================== -->
        <div class="actions">
            <button
                type="button"
                class="btn-secondary"
                onclick="closeAlunosModal()"
            >
                Cancelar
            </button>

            <button
                type="button"
                class="btn-primary"
                onclick="saveAlunosModal()"
            >
                Salvar
            </button>
        </div>
      </div>
    `;
    modal.addEventListener('click', function (e) { if (e.target === modal) closeAlunosModal(); });
    document.body.appendChild(modal);
    return modal;
}

function openAlunosModal(index) {
        const modal = getOrCreateAlunosModal();


    ModalHelper.openModal(
        modal,
        'alunos',
        ALUNOS_FIELDS,
        index,
        {
            id_status: '1'
        }
    );

    // Control access fields visibility: if aluno already has senha, hide fields and show "Alterar senha" button
    setTimeout(() => {
        const hasSenha = modal.querySelector('#modal-has_senha')?.value;
        const accessFields = modal.querySelector('#access-fields');
        const accessConfirm = modal.querySelector('#access-confirm');
        const alterarBtn = modal.querySelector('#alterar-senha-btn');
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

    setTimeout(() => {

        const nameInput = modal.querySelector('#modal-nome');

        if (nameInput) {
            nameInput.focus();
        }

    }, 10);
}
function closeAlunosModal() {
    const modal = document.getElementById('alunos-modal');
    if (!modal) return;
    modal.classList.remove('open');
}

function saveAlunosModal() {

    const modal = document.getElementById('alunos-modal');

    if (!modal) return;

    const values = ModalHelper.collectModalValues(
        'alunos-modal',
        ALUNOS_FIELDS
    );

    if (!values.nome) {

        modal.querySelector('#modal-nome').focus();

        return;
    }

    const idx = parseInt(
        modal.querySelector('#modal-index').value,
        10
    );

    const displayValues = Object.assign({}, values, {

        status_label:
            values.id_status === '0'
                ? 'Inativo'
                : 'Ativo'

    });

    const displayMap = [

        {
            field: 'nome',
            cls: 'alunos-nome'
        },

        {
            field: 'email',
            cls: 'alunos-email'
        },

        {
            field: 'status_label',
            cls: 'alunos-status'
        }

    ];

    ModalHelper.applyValuesToRow(
        'alunos',
        ALUNOS_FIELDS,
        displayMap,
        idx,
        displayValues,
        'openAlunosModal',
        '/alunos/excluir'
    );

    ModalHelper.reindex(
        'alunos',
        ALUNOS_FIELDS,
        'openAlunosModal'
    );

    closeAlunosModal();

    const alunosForm = document.getElementById('alunos-form');
    if (alunosForm) {
        alunosForm.submit();
    }
}

function excluirAluno(id) {

    if (confirm('Tem certeza que deseja excluir este aluno?')) {
        ModalHelper.submitDelete(`/alunos/excluir/${id}`);
    }
}

function removeAlunoRow(btn) { ModalHelper.removeRow(btn, 'alunos', ALUNOS_FIELDS, 'openAlunosModal'); }

function reindexAluno() { ModalHelper.reindex('alunos', ALUNOS_FIELDS, 'openAlunosModal'); }


function gerarMatricula(){
    const modalMatricula = document.getElementById('modal-matricula');
    if (!modalMatricula) return;
    var numero = Math.random() * 99999 + Math.floor(Math.random() * (100 - 1) + 1);
    modalMatricula.value = Math.floor(numero);
}

// Toggle visibility for both password fields in the modal
function toggleSenha() {
    const s1 = document.getElementById('modal-senha');
    const s2 = document.getElementById('modal-confirmar_senha');
    const ico1 = document.getElementById('modal-senha-ico');
    const ico2 = document.getElementById('modal-confirmar-senha-ico');
    if (!s1 || !s2) return;
    const modal = document.getElementById('alunos-modal');
    const hasSenha = modal?.querySelector('#modal-has_senha')?.value;
    const isMasked = s1.value === '********' || s2.value === '********' || (!s1.value && hasSenha === '1');
    if (isMasked) {
        const entered = window.prompt('Digite a senha para exibir');
        if (!entered) return;
        s1.type = 'text'; s2.type = 'text';
        s1.value = entered; s2.value = entered;
        s1.dataset.revealed = '1';
        if (ico1) ico1.className = 'bi bi-eye-slash';
        if (ico2) ico2.className = 'bi bi-eye-slash';
        s1.readOnly = false; s2.readOnly = false;
        return;
    }

    const show = s1.type === 'password';
    s1.type = show ? 'text' : 'password';
    s2.type = show ? 'text' : 'password';
    if (ico1) ico1.className = show ? 'bi bi-eye-slash' : 'bi bi-eye';
    if (ico2) ico2.className = show ? 'bi bi-eye-slash' : 'bi bi-eye';

    if (!show && s1.dataset.revealed) {
        s1.value = '********'; s2.value = '********';
        s1.readOnly = true; s2.readOnly = true;
        delete s1.dataset.revealed;
    }
}

// Secure password generator avoiding ambiguous chars
function gerarSenhaModal(length = 10) {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I, no O
    const lower = 'abcdefghijkmnopqrstuvwxyz'; // no l
    const numbers = '23456789'; // no 0,1
    const symbols = '!@#$%*?&';

    const all = upper + lower + numbers + symbols;
    function randFrom(str) {
        return str[Math.floor(Math.random() * str.length)];
    }

    // ensure each category
    let pw = '';
    pw += randFrom(upper);
    pw += randFrom(lower);
    pw += randFrom(numbers);
    pw += randFrom(symbols);

    for (let i = pw.length; i < Math.max(8, length); i++) pw += randFrom(all);

    // shuffle
    pw = pw.split('').sort(() => 0.5 - Math.random()).join('');

    const s1 = document.getElementById('modal-senha');
    const s2 = document.getElementById('modal-confirmar_senha');
    if (s1 && s2) {
        s1.value = pw;
        s2.value = pw;
        // show for admin convenience
        if (s1.type === 'password') toggleSenha();
    }
}

function validarSenhas() {
    const s1 = document.getElementById('modal-senha')?.value || '';
    const s2 = document.getElementById('modal-confirmar_senha')?.value || '';
    if (s1.length < 8) return { valido: false, mensagem: 'A senha deve ter pelo menos 8 caracteres.' };
    if (s1 !== s2) return { valido: false, mensagem: 'Senha e confirmação não conferem.' };
    return { valido: true };
}

async function saveSenhaModal() {
    const modal = document.getElementById('alunos-modal');
    if (!modal) return;
    const idx = parseInt(modal.querySelector('#modal-index').value || -1, 10);
    const id = modal.querySelector('#modal-id')?.value;
    if (!id) return alert('ID do aluno não encontrado.');

    const valid = validarSenhas();
    if (!valid.valido) return alert(valid.mensagem);

    const senha = modal.querySelector('#modal-senha').value;
    const confirmar = modal.querySelector('#modal-confirmar_senha').value;

    const meta = document.querySelector('meta[name="csrf-token"]');

    try {
        const res = await fetch(`/alunos/${encodeURIComponent(id)}/senha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': meta ? meta.content : ''
            },
            credentials: 'same-origin',
            body: JSON.stringify({ senha, confirmar })
        });
        const data = await res.json();
        if (!res.ok) return alert(data.mensagem || 'Erro ao salvar senha.');

        alert(data.mensagem || 'Senha atualizada.');

        // mark has_senha on the corresponding hidden input in the table row
        if (idx >= 0) {
            const row = document.querySelector(`#alunos-tbody tr[data-index="${idx}"]`);
            if (row) {
                const hidden = row.querySelector('.hidden-values input[data-field="has_senha"]');
                if (hidden) hidden.value = '1';
            }
        }

        // clear modal password fields
        // mask the password fields after saving
        const s1 = modal.querySelector('#modal-senha');
        const s2 = modal.querySelector('#modal-confirmar_senha');
        if (s1 && s2) {
            s1.value = '********';
            s2.value = '********';
            s1.readOnly = true; s2.readOnly = true;
        }
        modal.querySelector('#modal-has_senha').value = '1';

    } catch (e) {
        console.error(e);
        alert('Erro ao atualizar senha.');
    }
}
