const express = require("express");
const bcrypt = require("bcrypt");
const Usuario = require("../model/usuario");
const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.get("/login", (req, res) => {
    res.render("login", {
        erro: null
    });
});

router.post("/login", async (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const senha = String(req.body.senha || "");

    try {
        if (!email || !senha) {
            return res.render("login", {
                erro: "Preencha e-mail e senha."
            });
        }

        if (!emailRegex.test(email)) {
            return res.render("login", {
                erro: "Informe um e-mail válido."
            });
        }

        const usuario = await Usuario.getUsuario(email);

        if (!usuario) {
            return res.render("login", {
                erro: "Usuário não encontrado."
            });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.render("login", {
                erro: "Senha inválida."
            });
        }

        req.session.usuario = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        };

        return res.redirect("/");
    } catch (err) {
        console.error(err);
        return res.render("login", {
            erro: "Erro ao realizar login."
        });
    }
});

module.exports = router;