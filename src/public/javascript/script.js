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
    submenu.classList.toggle('open');
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

