const db = require("../../database/mysql.js");
const bcrypt = require("bcrypt");


async function getUsuario(email) {
    const [usuario] = await db.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
    );

    return usuario[0];
}

async function getUsuarioPorId(id) {
    const [usuario] = await db.query(
        "SELECT * FROM usuarios WHERE id = ?",
        [id]
    );

    return usuario[0];
}

function construirAtualizacaoPerfil({ nome, email, telefone, avatar, senha }) {
    const campos = [];
    const valores = [];

    if (nome) {
        campos.push("nome = ?");
        valores.push(nome);
    }

    if (email) {
        campos.push("email = ?");
        valores.push(email);
    }

    if (telefone) {
        campos.push("telefone = ?");
        valores.push(telefone);
    }

   /* if (avatar) {
        campos.push("avatar = ?");
        valores.push(avatar);
    }*/

    if (senha) {
        campos.push("senha = ?");
        valores.push(senha);
    }

    return {
        campos,
        valores
    };
}


async function gerarPassword() {
    const senha = Math.random().toString(36).slice(-10);
    const hash = await bcrypt.hash(senha, 10);
    return hash;
}

module.exports = {
    getUsuario,
    getUsuarioPorId,
    construirAtualizacaoPerfil
};