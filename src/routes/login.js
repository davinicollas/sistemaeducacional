const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();
const bcrypt = require("bcrypt");

const Usuario = require("../model/usuario");


router.get("/login", (req, res) => {

    res.render("login");

});

router.post("/login", async (req, res) => {

    const { email, senha } = req.body;


    const usuario = await Usuario.getUsuario(email);

    if (!usuario) {

        return res.render("login", {

            erro: "Email ou senha inválidos."

        });

    }

    //const usuario = usuarios[0];
    const senhaCorreta = await bcrypt.compare(

        senha,

        usuario.senha

    );

    if (!senhaCorreta) {

        return res.render("login", {

            erro: "Email ou senha inválidos."

        });

    }

    req.session.usuario = {

        id: usuario.id,

        nome: usuario.nome,

        email: usuario.email

    };

    res.redirect("/");

});


router.get("/logout", (req, res) => {

     req.session.destroy(err => {
        if (err) {
            return res.redirect("/");
        }

        /*res.clearCookie(process.env.SESSION_NAME || "pokemon_ai_session");
        res.redirect("/login");*/
    });

});

module.exports = router;