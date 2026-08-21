    const express = require("express");
    const db = require("../../database/mysql");
    const router = express.Router();

    const notificacoes = require("../model/notificacoes");

    router.get("/notificacoes", async (req,res)=>{

        const notificacoesData = await notificacoes.getNotificacoes();

        res.render("notificacoes",{

            notificacoes: notificacoesData

        });

    });

    router.post("/notificacoes", async(req,res)=>{
        const {
            titulo,
            tipo,
            prioridade,
            mensagem,
            destinatarios,
            data_inicio,
            data_fim,
            enviar_notificacao
        } = req.body;


        
        await db.query(

            `INSERT INTO notificacoes
            (titulo,tipo,prioridade,mensagem,destinatarios,data_inicio,data_fim,enviar_notificacao)

            VALUES(?,?,?,?,?,?,?,?)

            ON DUPLICATE KEY UPDATE

            titulo=VALUES(titulo),
            tipo=VALUES(tipo),
            prioridade=VALUES(prioridade),
            mensagem=VALUES(mensagem),
            destinatarios=VALUES(destinatarios),
            data_inicio=VALUES(data_inicio),
            data_fim=VALUES(data_fim),
            enviar_notificacao=VALUES(enviar_notificacao)`,
            [
            titulo,
            tipo,
            prioridade,
            mensagem,
            destinatarios,
            data_inicio,
            data_fim,
            enviar_notificacao
            ]

        );

        res.redirect("/notificacoes");

    });

    module.exports = router;