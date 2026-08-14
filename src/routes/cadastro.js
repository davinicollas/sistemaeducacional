const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../../database/mysql.js");
const router = express.Router();
const Usuario = require("../model/usuario");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telefoneRegex = /^\d{10,11}$/;

router.get("/cadastro", (req, res) => {
    res.render("cadastro", {
        erro: null
    });
});

router.post("/cadastro", async (req, res) => {

    const nome = String(req.body.nome || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const telefone = String(req.body.telefone || "").trim();
    const dataNascimento = String(req.body.dataNascimento || "").trim();
    const senha = String(req.body.senha || "");
    const termo = req.body.termo === "on" ? true : false;

    try {
        if (!nome || !email || !senha || !dataNascimento) {
            return res.render("cadastro", {
                erro: "Preencha todos os campos."
            });
        }


        if (telefone && !telefoneRegex.test(telefone.replace(/\D/g, ""))) {
            return res.render("cadastro", {
                erro: "Telefone inválido. Use apenas números."
            });
        }

        const usuarioExistente = await Usuario.getUsuario(email);

        if (usuarioExistente) {
            return res.render("cadastro", {
                erro: "E-mail já cadastrado."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const [insertResult] = await db.query(
            "INSERT INTO usuarios (nome, email, senha, telefone, data_nascimento, termos) VALUES (?, ?, ?, ?, ?, ?)",
            [nome, email, senhaHash, telefone || "", dataNascimento || null, termo]
        );

        req.session.usuario = {
            id: insertResult.insertId,
            nome: nome,
            email: email
        };

        return res.redirect("/dashboard");
    } catch (err) {
        console.error(err);
        return res.render("cadastro", {
            erro: "Erro ao cadastrar usuário."
        });
    }
});

module.exports = router;