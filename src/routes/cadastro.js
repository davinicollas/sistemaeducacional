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

        if (nome.length < 2) {
            return res.render("cadastro", {
                erro: "O nome deve ter pelo menos 2 caracteres."
            });
        }

        if (!emailRegex.test(email)) {
            return res.render("cadastro", {
                erro: "Informe um e-mail válido."
            });
        }

        if (senha.length < 8) {
            return res.render("cadastro", {
                erro: "A senha deve ter pelo menos 8 caracteres."
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
        console.log('-> resultado INSERT:', insertResult && insertResult.affectedRows ? { affectedRows: insertResult.affectedRows, insertId: insertResult.insertId } : insertResult);

        const usuarioInserido = await Usuario.getUsuario(email);

        return res.redirect("/");
    } catch (err) {
        console.error(err);
        return res.render("cadastro", {
            erro: "Erro ao cadastrar usuário."
        });
    }
});

module.exports = router;