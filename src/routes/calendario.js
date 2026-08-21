const express = require("express");
const router = express.Router();

const calendarioModel = require("../model/calendario");
const db = require("../../database/mysql");

router.get("/calendario", async (req, res) => {
    const hoje = new Date();
    const ano = parseInt(req.query.ano, 10) || hoje.getFullYear();
    const mes = req.query.mes !== undefined ? parseInt(req.query.mes, 10) : hoje.getMonth();

    const evento = await calendarioModel.getEventos(ano, mes);

    res.render("calendario", {
        evento,
        filtros: { ano, mes }
    });
});

router.post("/calendario", async (req, res) => {
    try {
        const titulo = (req.body.titulo || "").trim();
        const tipo = (req.body.tipo || "evento").trim();
        const data_inicio = req.body.data_inicio;
        const data_fim = req.body.data_fim || null;
        const descricao = (req.body.descricao || "").trim();

        await db.query(
            `INSERT INTO eventos_calendario (titulo, tipo, data_inicio, data_fim, descricao)
            VALUES (?, ?, ?, ?, ?)`,
        [titulo, tipo, data_inicio, data_fim, descricao]
        );
        res.redirect("/calendario");
    } catch (err) {
        console.error(err);
        res.redirect("/calendario");
    }
});

router.post("/calendario/excluir/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await db.query(`UPDATE eventos_calendario SET excluido = 1 WHERE id = ?`, [id]);
        res.redirect("/calendario");
    } catch (err) {
        console.error(err);
        res.redirect("/calendario");
    }
});

module.exports = router;
