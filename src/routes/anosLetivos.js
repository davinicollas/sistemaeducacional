const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();

const anosModel = require("../model/anosLetivos");

router.get("/anos-letivos", async (req, res) => {
    try {
        const list = await anosModel.getAnosLetivos();
        res.render("anosLetivos", { anos: { anos: list } });
    } catch (err) {
        console.error(err);
        res.render("anosLetivos", { anos: { anos: [] }, erro: 'Erro ao carregar anos letivos' });
    }
});

router.post("/anos-letivos/excluir/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await db.query(`UPDATE params_anos_letivos SET excluido = 1 WHERE id = ?`, [id]);
        res.redirect("/anos-letivos");
    } catch (err) {
        console.error(err);
        res.redirect("/anos-letivos");
    }
});

router.post("/anos-letivos", async (req, res) => {
    try {
        const raw = req.body.anos || {};
        const itens = Array.isArray(raw) ? raw : Object.values(raw);

        for (const item of itens) {
            if (!item) continue;

            const anoLetivo = (item.anoLetivo || '').trim();
            if (!anoLetivo) continue;

            const id = item.id || null;
            const dataInicio = (item.dataInicio || '').trim();
            const dataFim = (item.dataFim || '').trim();
            const status = item.status === '0' ? 0 : 1;
            const atual = item.atual === '1' ? 1 : 0;
            const text = (item.text || '').trim();

            // If marked as atual, unset others
            if (atual) {
                await db.query(`UPDATE params_anos_letivos SET atual = 0`);
            }

            const params = [anoLetivo, dataInicio, dataFim, status, atual, text];

            if (id) {
                await db.query(
                    `UPDATE params_anos_letivos SET ano_letivo = ?, data_inicio = ?, data_fim = ?, status = ?, atual = ?, text = ? WHERE id = ?`,
                    [...params, id]
                );
            } else {
                await db.query(
                    `INSERT INTO params_anos_letivos (ano_letivo, data_inicio, data_fim, status, atual, text) VALUES (?, ?, ?, ?, ?, ?)`,
                    params
                );
            }
        }

        res.redirect("/anos-letivos");
    } catch (err) {
        console.error(err);
        res.redirect("/anos-letivos");
    }
});

module.exports = router;
