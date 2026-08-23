const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();

const turnosModel = require("../model/turnos");

router.get("/turnos", async (req, res) => {
    try {
        const list = await turnosModel.getTurnos();
        res.render("turnos", { turnos: { turnos: list } });
    } catch (err) {
        console.error(err);
        res.render("turnos", { turnos: { turnos: [] }, erro: 'Erro ao carregar turnos' });
    }
});

router.post("/turnos/excluir/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await db.query(`UPDATE params_turnos SET excluido = 1 WHERE id = ?`, [id]);
        res.redirect("/turnos");
    } catch (err) {
        console.error(err);
        res.redirect("/turnos");
    }
});

router.post("/turnos", async (req, res) => {
    try {
        const raw = req.body.turnos || {};
        const itens = Array.isArray(raw) ? raw : Object.values(raw);

        for (const item of itens) {
            if (!item) continue;

            const nome = (item.nome || '').trim();
            if (!nome) continue;

            const id = item.id || null;
            const sigla = (item.sigla || '').trim();
            const horarioInicio = (item.horarioInicio || '').trim();
            const horarioFinal = (item.horarioFinal || '').trim();
            const status = item.status === '0' ? 0 : 1;
            const text = (item.text || '').trim();

            const params = [nome, sigla, horarioInicio, horarioFinal, status, text];

            if (id) {
                await db.query(
                    `UPDATE params_turnos SET nome = ?, sigla = ?, horario_inicio = ?, horario_final = ?, status = ?, text = ? WHERE id = ?`,
                    [...params, id]
                );
            } else {
                await db.query(
                    `INSERT INTO params_turnos (nome, sigla, horario_inicio, horario_final, status, text) VALUES (?, ?, ?, ?, ?, ?)`,
                    params
                );
            }
        }

        res.redirect("/turnos");
    } catch (err) {
        console.error(err);
        res.redirect("/turnos");
    }
});

module.exports = router;
