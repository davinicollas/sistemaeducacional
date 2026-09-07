function toggleUserMenu(button) {
    const menu = button.closest('.app-user-menu');
    const dropdown = menu.querySelector('.app-user-menu__dropdown');
    if (!dropdown) return;
    const isOpen = !dropdown.hidden;
    dropdown.hidden = isOpen;
}

document.addEventListener('click', function (event) {
    document.querySelectorAll('.app-user-menu__dropdown').forEach(function (dropdown) {
        if (!dropdown.hidden && !dropdown.closest('.app-user-menu').contains(event.target)) {
            dropdown.hidden = true;
        }
    });
});

function toggleSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

function highlightActiveNav() {
    const sidebar = document.getElementById('app-sidebar');
    if (!sidebar) return;

    const path = window.location.pathname;
    let activeLink = null;

    sidebar.querySelectorAll('a.nav-item').forEach(function (link) {
        const href = link.getAttribute('href');
        if (href && href !== '#' && (href === path || (href.length > 1 && path.startsWith(href)))) {
            if (!activeLink || href.length > activeLink.getAttribute('href').length) {
                activeLink = link;
            }
        }
    });

    if (!activeLink) return;

    activeLink.classList.add('active');

    const submenu = activeLink.closest('.sidebar-submenu');
    if (submenu) {
        submenu.classList.add('open');
        const toggle = submenu.querySelector('.submenu-toggle');
        const list = submenu.querySelector('.submenu-items');
        if (toggle) toggle.setAttribute('aria-expanded', 'true');
        if (list) list.hidden = false;
    }

    const breadcrumb = document.getElementById('app-breadcrumb');
    if (breadcrumb) {
        const sectionTitle = submenu
            ? submenu.querySelector('.submenu-toggle').textContent.replace(/\s+/g, ' ').trim()
            : null;
        const itemTitle = (activeLink.dataset.title || activeLink.textContent || '')
            .replace(/\s+/g, ' ')
            .trim();

        breadcrumb.innerHTML = '';
        if (sectionTitle && sectionTitle !== itemTitle) {
            const section = document.createElement('span');
            section.className = 'app-breadcrumb__item';
            section.textContent = sectionTitle;
            breadcrumb.appendChild(section);

            const separator = document.createElement('i');
            separator.className = 'bi bi-chevron-right app-breadcrumb__separator';
            breadcrumb.appendChild(separator);
        }
        const current = document.createElement('span');
        current.className = 'app-breadcrumb__item app-breadcrumb__item--current';
        current.textContent = itemTitle;
        breadcrumb.appendChild(current);
    }
}

document.addEventListener('DOMContentLoaded', highlightActiveNav);

function togglePassword() {

    const password = document.getElementById("senha");

    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }

}


function loginGoogle() {

    window.location.href = "/auth/google";

}


function loginMicrosoft() {

    window.location.href = "/auth/microsoft";

}

function toggleSubmenu(button) {
    const submenu = button.closest('.sidebar-submenu');
    const list = submenu.querySelector('.submenu-items');
    const isOpen = submenu.classList.toggle('open');
    // accessibility attributes
    const expanded = isOpen ? 'true' : 'false';
    button.setAttribute('aria-expanded', expanded);
    if (list) {
        if (isOpen) {
            list.hidden = false;
        } else {
            list.hidden = true;
        }
    }
}

// ==========================================
// MOSTRAR / OCULTAR SENHA
// ==========================================

function togglePassword() {

    const password = document.getElementById("senha");

    if (password.type === "password") {

        password.type = "text";

    } else {

        password.type = "password";

    }

}


// ==========================================
// MÁSCARA DE TELEFONE
// ==========================================

const telefone = document.getElementById("telefone");

if (telefone) {
    telefone.addEventListener("input", function (e) {

    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 11) {
        value = value.substring(0, 11);
    }

    if (value.length > 6) {

        value = value.replace(
            /^(\d{2})(\d{5})(\d{0,4}).*/,
            "($1) $2-$3"
        );

    } else if (value.length > 2) {

        value = value.replace(
            /^(\d{2})(\d{0,5}).*/,
            "($1) $2"
        );

    } else if (value.length > 0) {

        value = value.replace(
            /^(\d*)/,
            "($1"
        );

    }

    e.target.value = value;

    });
}

// ==========================================
// FILTRO DE BUSCA (alunos / professores)
// ==========================================

document.querySelectorAll('.search-box input').forEach(function (input) {
    input.addEventListener('input', function (e) {
        const q = e.target.value.trim().toLowerCase();
        const main = e.target.closest('.main-content');
        if (!main) return;
        const table = main.querySelector('.data-table');
        if (!table) return;
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(function (row) {
            const text = row.textContent.toLowerCase();
            row.style.display = text.indexOf(q) !== -1 ? '' : 'none';
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
});

// ======== Estados: adicionar / remover linhas dinamicamente ========
function addParamsRow(tr) {

    const tbody = document.getElementById('grid-params');

    const novaLinha = tr.cloneNode(true);

    const index = tbody.querySelectorAll('tr:not(#trClone)').length;

    novaLinha.removeAttribute('id');
    novaLinha.style.display = '';

    novaLinha.querySelectorAll('[data-field]').forEach(input => {

        const field = input.dataset.field;

        input.name = `itens[${index}][${field}]`;
        input.value = '';

        if (field === 'uf') {
            input.maxLength = 2;
        }
    });

    tbody.appendChild(novaLinha);
}

function removeParamsRow(button) {
    const tr = button.closest('tr');
    if (!tr) return;
    const id = tr.getAttribute('data-id');
    if (id) {
        const form = button.closest('form');
        const deleteUrl = form?.dataset.deleteUrl;
        if (!deleteUrl) return;
        if (!window.confirm('Deseja excluir este registro?')) return;

        const deleteForm = document.createElement('form');
        deleteForm.method = 'POST';
        deleteForm.action = `${deleteUrl}/${encodeURIComponent(id)}`;
        document.body.appendChild(deleteForm);
        deleteForm.submit();
        return;
    }
    tr.remove();
}

function ExportExcel(url) {
    console.log('Exportando para Excel...');
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/' + url;
    document.body.appendChild(form);
    form.submit();
}

function ImportExcel(path) {
    const url = '/' + path;
    let modal = document.getElementById('modalImportar');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalImportar';
        modal.className = 'modal fade';
        modal.tabIndex = -1;
        modal.style.zIndex = '1060';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-file-earmark-excel me-2"></i>Importar dados</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">Selecione uma planilha <strong>.xlsx</strong> ou <strong>.xls</strong>.</div>
                        <label class="form-label" for="arquivoImportar">Arquivo</label>
                        <input id="arquivoImportar" class="form-control" type="file" accept=".xlsx,.xls">
                        <div class="form-text">O arquivo deve conter uma coluna com o nome dos dados.</div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success" id="confirmarImportacao"><i class="bi bi-upload me-1"></i>Importar</button>

                    </div>
                </div>
            </div>`;
        document.body.appendChild(modal);
        modal.addEventListener('shown.bs.modal', () => {
            modal.querySelector('#arquivoImportar')?.focus();
        });
        modal.querySelector('#confirmarImportacao').addEventListener('click', async () => {
            const input = modal.querySelector('#arquivoImportar');
            const file = input.files?.[0];
            if (!file) { input.focus(); return; }
            const formData = new FormData();
            formData.append('arquivo', file);
            const button = modal.querySelector('#confirmarImportacao');
            button.disabled = true;
            try {
                const response = await fetch(url, { method: 'POST', body: formData });
                const result = await response.json();
                if (!response.ok || !result.sucesso) throw new Error(result.mensagem || 'Erro ao importar dados.');
                bootstrap.Modal.getOrCreateInstance(modal).hide();
                alert(`${result.importados || 0} aluno(s) importado(s) com sucesso.`);
                window.location.reload();
            } catch (error) {
                console.error(error);
                alert(error.message || 'Erro ao importar dados.');
            } finally {
                button.disabled = false;
            }
        });
    }
    bootstrap.Modal.getOrCreateInstance(modal).show();
}