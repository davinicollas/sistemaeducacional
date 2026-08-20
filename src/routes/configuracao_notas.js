    const express = require("express");
    const db = require("../../database/mysql");
    const router = express.Router();

    const configuracao_notas = require("../model/configuracao_notas");

    router.get("/configuracao_notas", async (req,res)=>{


        const configuracaoNotasData = await configuracao_notas.getConfiguracaoNotas();
        

        res.render("configuracao_notas",{

            configuracao_notas: configuracaoNotasData

        });

    });

    router.post("/configuracao_notas", async(req,res)=>{
        const {
            tipo,
            nota_minima,
            nota_maxima,
            recuperacao,
            nota_recuperacao
        } = req.body;


        const configuracaoNotasData = await configuracao_notas.getConfiguracaoNotas();
        const id = configuracaoNotasData ? configuracaoNotasData.id : null;

        if(!id){
        
            await db.query(

        

                `INSERT INTO configuracao_notas
                (tipo,nota_minima,nota_maxima,recuperacao,nota_recuperacao)

                VALUES(?,?,?,?,?)

                ON DUPLICATE KEY UPDATE

                tipo=VALUES(tipo),
                nota_minima=VALUES(nota_minima),
                nota_maxima=VALUES(nota_maxima),
                recuperacao=VALUES(recuperacao),
                nota_recuperacao=VALUES(nota_recuperacao)`,
                [
                tipo,
                nota_minima,    
                nota_maxima,
                recuperacao,
                nota_recuperacao
                ]

            );
        }
        else{

            await db.query(
                `UPDATE configuracao_notas
                SET
                tipo=?,
                nota_minima=?,
                nota_maxima=?,
                recuperacao=?,
                nota_recuperacao=?
                WHERE id = ?`,
                [
                tipo,
                nota_minima,
                nota_maxima,
                recuperacao,
                nota_recuperacao,
                id
                ]

            );

            
        }

        res.redirect("/configuracao_notas");

    });

    module.exports = router;