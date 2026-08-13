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