const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();

const salasModel = require("../model/salas");

router.get("/salas", async (req, res) => {
    try {
        const list = await salasModel.getSalas();
        res.render("salas", { salas: { salas: list } });
    } catch (err) {
        console.error(err);
        res.render("salas", { salas: { salas: [] }, erro: 'Erro ao carregar salas' });
    }
});

router.post("/salas/excluir/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await db.query(`UPDATE params_salas SET excluido = 1 WHERE id = ?`, [id]);
        res.redirect("/salas");
    } catch (err) {
        console.error(err);
        res.redirect("/salas");
    }
});

router.post("/salas", async (req, res) => {
    try {
        const raw = req.body.salas || {};
        const itens = Array.isArray(raw) ? raw : Object.values(raw);

        for (const item of itens) {
            if (!item) continue;

            const nome = (item.nome || '').trim();
            if (!nome) continue;

            const id = item.id || null;
            const codigo = (item.codigo || '').trim();
            const tipo = (item.tipo || '').trim();
            const capacidade = item.capacidade ? Number(item.capacidade) : null;
            const bloco = (item.bloco || '').trim();
            const andar = (item.andar || '').trim();
            const recursos = (item.recursos || '').trim();
            const status = item.status === '0' ? 0 : 1;
            const text = (item.text || '').trim();

            const params = [nome, codigo, tipo, capacidade, bloco, andar, recursos, status, text];

            if (id) {
                await db.query(
                    `UPDATE params_salas SET nome = ?, codigo = ?, tipo = ?, capacidade = ?, bloco = ?, andar = ?, recursos = ?, status = ?, text = ? WHERE id = ?`,
                    [...params, id]
                );
            } else {
                await db.query(
                    `INSERT INTO params_salas (nome, codigo, tipo, capacidade, bloco, andar, recursos, status, text) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    params
                );
            }
        }

        res.redirect("/salas");
    } catch (err) {
        console.error(err);
        res.redirect("/salas");
    }
});

module.exports = router;
