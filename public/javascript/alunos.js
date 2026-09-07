
const ALUNOS_FIELDS = ['id', 'nome', 'nome_social', 'cpf', 'rg', 'matricula', 'data_nascimento', 'sexo', 'nacionalidade', 'naturalidade', 'id_estado_nascimento', 'foto', 'id_tipo_documento', 'numero_documento', 'orgao_expedidor',
    'data_expedicao', 'certidao_nascimento', 'numero_certidao', 'observacoes', 'id_status'];

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
