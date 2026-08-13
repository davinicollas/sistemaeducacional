const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../../database/mysql.js");
const router = express.Router();
const Usuario = require("../model/usuario");

router.get("/cadastro", (req, res) => {
    res.render("cadastro", {
        erro: null
    });
});

router.post("/cadastro", async (req, res) => {

    const { nome, email, telefone, senha, confirmarSenha } = req.body;
    const telefoneValor = telefone || "";

    try {

        if (!nome || !email || !senha || !confirmarSenha) {
            return res.render("cadastro", {
                erro: "Preencha todos os campos."
            });
        }

        if (senha !== confirmarSenha) {
            return res.render("cadastro", {
                erro: "As senhas não coincidem."
            });
        }

        const usuario = await Usuario.getUsuario(email);
       
        if (usuario) {
            return res.render("cadastro", {
                erro: "E-mail já cadastrado."
            });
        }

        console.log('teste123');
       
        const senhaHash = await bcrypt.hash(senha, senha.length < 10 ? 10 : senha.length);
        console.log('2332');

        await db.query(
            "INSERT INTO usuarios (nome,email,senha,telefone) VALUES (?,?,?,?)",
            [nome, email, senhaHash, telefoneValor]
        );

        const usuarioInserido = await Usuario.getUsuario(email);
        req.session.usuario = {
            id: usuarioInserido.id,
            nome: usuarioInserido.nome,
            email: usuarioInserido.email
        };

        res.redirect("/");

    } catch (err) {

        console.error(err);

        res.render("cadastro", {
            erro: "Erro ao cadastrar usuário."
        });

    }

});

module.exports = router;