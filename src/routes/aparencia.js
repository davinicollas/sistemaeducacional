    const express = require("express");
    const db = require("../../database/mysql");
    const router = express.Router();

    const aparencia = require("../model/aparencia");

    router.get("/aparencia", async (req,res)=>{


        const aparenciaData = await aparencia.getAparencia();
        

        res.render("aparencia",{

            aparencia: aparenciaData

        });

    });

    router.post("/aparencia", async(req,res)=>{
        const {
            tema_sistema,
            cor_principal,
            menu_lateral
        } = req.body;


        
        await db.query(

            `INSERT INTO sistema_aparencia
            (tema_sistema,cor_principal,menu_lateral)

            VALUES(?,?,?)

            ON DUPLICATE KEY UPDATE

            tema_sistema=VALUES(tema_sistema),
            cor_principal=VALUES(cor_principal),
            menu_lateral=VALUES(menu_lateral)`,
            [
            tema_sistema,
            cor_principal,
            menu_lateral
            ]

        );

        res.redirect("/aparencia");

    });

    module.exports = router;