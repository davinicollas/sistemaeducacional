const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();

const periodosModel = require("../model/periodos");
const anosModel = require("../model/anosLetivos");

router.get("/periodos", async (req, res) => {
    try {
        const list = await periodosModel.getPeriodos();
        const anos = await anosModel.getAnosLetivos();
        res.render("periodos", { periodos: { periodos: list }, anos });
    } catch (err) {
        console.error(err);
        res.render("periodos", { periodos: { periodos: [] }, anos: [], erro: 'Erro ao carregar períodos' });
    }
});

router.post("/periodos/excluir/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await db.query(`UPDATE params_periodos SET excluido = 1 WHERE id = ?`, [id]);
        res.redirect("/periodos");
    } catch (err) {
        console.error(err);
        res.redirect("/periodos");
    }
});

router.post("/periodos", async (req, res) => {
    try {
        const raw = req.body.periodos || {};
        const itens = Array.isArray(raw) ? raw : Object.values(raw);
        
        for (const item of itens) {
            if (!item) continue;

            const nome = (item.nome || '').trim();
            if (!nome) continue;

            const id = item.id || null;
            const abreviacao = (item.abreviacao || '').trim();
            const anoLetivo = (item.anoLetivo || '').trim();
            const dataInicio = (item.dataInicio || '').trim();
            const dataFim = (item.dataFim || '').trim();
            const ordem = item.ordem ? Number(item.ordem) : null;
            const tipo = (item.tipo || '').trim();
            const status = item.status === '0' ? 0 : 1;
            const text = (item.text || '').trim();

            const params = [nome, abreviacao, anoLetivo, dataInicio, dataFim, ordem, tipo, status, text];

            if (id) {
                await db.query(
                    `UPDATE params_periodos SET nome = ?, abreviacao = ?, ano_letivo = ?, data_inicio = ?, data_fim = ?, ordem = ?, tipo = ?, status = ?, text = ? WHERE id = ?`,
                    [...params, id]
                );
            } else {
                await db.query(
                    `INSERT INTO params_periodos (nome, abreviacao, ano_letivo, data_inicio, data_fim, ordem, tipo, status, text) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    params
                );
            }
        }

        res.redirect("/periodos");
    } catch (err) {
        console.error(err);
        res.redirect("/periodos");
    }
});

module.exports = router;
