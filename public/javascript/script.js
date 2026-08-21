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

// ======== Estados: adicionar / remover linhas dinamicamente ========
function addEstadoRow() {
    const tbody = document.getElementById('grid-palavras');
    if (!tbody) return;

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>
            <input type="hidden" name="itens[][id]" value="">
            <input type="text" class="form-control" name="itens[][descricao]" value="" placeholder="Ex: São Paulo">
        </td>
        <td>
            <input type="text" class="form-control" name="itens[][uf]" value="" placeholder="Ex: SP">
        </td>
        <td>
            <button type="button" class="btn btn-sm btn-danger" onclick="removeEstadoRow(this)" aria-label="Remover linha" title="Remover linha"><i class="bi bi-trash"></i></button>
        </td>
    `;
    tbody.appendChild(tr);
    // focus the new descricao input for faster data entry
    const newInput = tr.querySelector('input[name="itens[][descricao]"]');
    if (newInput) newInput.focus();
}

function removeEstadoRow(button) {
    const tr = button.closest('tr');
    if (!tr) return;
    const id = tr.getAttribute('data-id');
    if (id) {
        // mark for deletion
        const container = document.getElementById('to-delete');
        if (container) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'deleteIds[]';
            input.value = id;
            container.appendChild(input);
        }
    }
    tr.remove();
}

