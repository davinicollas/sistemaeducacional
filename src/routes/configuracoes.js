    const express = require("express");
    const db = require("../../database/mysql");
    const router = express.Router();

    const configuracoes = require("../model/configuracoes");
    const estados = require("../model/estados");

    router.get("/configuracoes", async (req,res)=>{


        const conf = await configuracoes.getConfig();
        const estado = await estados.getEstados();
        

        res.render("configuracoes",{

            conf: conf,
            estado: estado

        });

    });

    router.post("/configuracoes", async(req,res)=>{
        const {
            nome,
            nome_fantasia,
            cnpj,
            logo,
            telefone,
            whatsapp,
            email,
            site,
            ano_letivo_atual,
            horario_funcionamento,
            fuso_horario,
            moeda,
            cep,
            rua, numero, complemento, bairro, cidade, idEstado, data_inicio, data_fim
        } = req.body;


        
        await db.query(

            `INSERT INTO configuracoes
            (nome,nome_fantasia,cnpj,logo,telefone,whatsapp,email,site,ano_letivo_atual,horario_funcionamento,fuso_horario,moeda,cep,rua,numero,complemento,bairro,cidade,idEstado,data_inicio,data_fim)

VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            ON DUPLICATE KEY UPDATE

            nome=VALUES(nome),
            nome_fantasia=VALUES(nome_fantasia),
            cnpj=VALUES(cnpj),
            logo=VALUES(logo),
            telefone=VALUES(telefone),
            whatsapp=VALUES(whatsapp),
            email=VALUES(email),
            site=VALUES(site),
            ano_letivo_atual=VALUES(ano_letivo_atual),
            horario_funcionamento=VALUES(horario_funcionamento),
            fuso_horario=VALUES(fuso_horario),
            moeda=VALUES(moeda),
            cep=VALUES(cep),
            rua=VALUES(rua),
            numero=VALUES(numero),
            complemento=VALUES(complemento),
            bairro=VALUES(bairro),
            cidade=VALUES(cidade),
            idEstado=VALUES(idEstado),
            data_inicio=VALUES(data_inicio),
            data_fim=VALUES(data_fim)`,
            [
            nome,
            nome_fantasia,
            cnpj,
            logo,
            telefone,
            whatsapp,
            email,
            site,
            ano_letivo_atual,
            horario_funcionamento,
            fuso_horario,
            moeda,
            cep,
            rua,
            numero,
            complemento,
            bairro,
            cidade,
            idEstado,
            data_inicio,
            data_fim
            ]

        );

        res.redirect("/configuracoes");

    });

    module.exports = router;