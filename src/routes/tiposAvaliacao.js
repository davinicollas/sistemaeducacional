const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();

const tiposModel = require("../model/tiposAvaliacao");

router.get("/tipos-avaliacao", async (req, res) => {
    try {
        const list = await tiposModel.getTiposAvaliacao();
        res.render("tiposAvaliacao", { tipos: { tipos: list } });
    } catch (err) {
        console.error(err);
        res.render("tiposAvaliacao", { tipos: { tipos: [] }, erro: 'Erro ao carregar tipos de avaliação' });
    }
});

router.post("/tipos-avaliacao/excluir/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await db.query(`UPDATE params_tipos_avaliacao SET excluido = 1 WHERE id = ?`, [id]);
        res.redirect("/tipos-avaliacao");
    } catch (err) {
        console.error(err);
        res.redirect("/tipos-avaliacao");
    }
});

router.post("/tipos-avaliacao", async (req, res) => {
    try {
        const raw = req.body.tipos || {};
        const itens = Array.isArray(raw) ? raw : Object.values(raw);

        for (const item of itens) {
            if (!item) continue;

            const nome = (item.nome || '').trim();
            if (!nome) continue;

            const id = item.id || null;
            const sigla = (item.sigla || '').trim();
            const notaMaxima = item.notaMaxima ? Number(item.notaMaxima) : null;
            const status = item.status === '0' ? 0 : 1;
            const text = (item.text || '').trim();

            const params = [nome, sigla, notaMaxima, status, text];

            if (id) {
                await db.query(
                    `UPDATE params_tipos_avaliacao SET nome = ?, sigla = ?, nota_maxima = ?, status = ?, text = ? WHERE id = ?`,
                    [...params, id]
                );
            } else {
                await db.query(
                    `INSERT INTO params_tipos_avaliacao (nome, sigla, nota_maxima, status, text) VALUES (?, ?, ?, ?, ?)`,
                    params
                );
            }
        }

        res.redirect("/tipos-avaliacao");
    } catch (err) {
        console.error(err);
        res.redirect("/tipos-avaliacao");
    }
});

module.exports = router;
