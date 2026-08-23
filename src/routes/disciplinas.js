const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();

const disciplinasModel = require("../model/disciplinas");
router.get("/disciplinas", async (req, res) => {
    try {
        const list = await disciplinasModel.getDisciplinas();
        res.render("disciplinas", { disciplinas: { disciplinas: list } });
    } catch (err) {
        console.error(err);
        res.render("disciplinas", { disciplinas: { disciplinas: [] }, erro: 'Erro ao carregar disciplinas' });
    }
});

router.post("/disciplinas/excluir/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await db.query(`UPDATE params_disciplina SET excluido = 1 WHERE id = ?`, [id]);
        res.redirect("/disciplinas");
    } catch (err) {
        console.error(err);
        res.redirect("/disciplinas");
    }
});

router.post("/disciplinas", async (req, res) => {
    try {
        const raw = req.body.disciplinas || {};
        const itens = Array.isArray(raw) ? raw : Object.values(raw);

        for (const item of itens) {
            if (!item) continue;

            const sigla = (item.sigla || '').trim();
            if (!sigla) continue;

            const id = item.id || null;
            const cargaHoraria = (item.cargaHoraria || '').trim();
            const status = item.status === '0' ? 0 : 1;
            const text = (item.text || '').trim();

            const params = [sigla, cargaHoraria, status, text];

            if (id) {
                await db.query(
                    `UPDATE params_disciplina SET sigla = ?, carga_horaria = ?, idStatus = ?, text = ? WHERE id = ?`,
                    [...params, id]
                );
            } else {
                await db.query(
                    `INSERT INTO params_disciplina (sigla, carga_horaria, idStatus, text) VALUES (?, ?, ?, ?)`,
                    params
                );
            }
        }

        res.redirect("/disciplinas");
    } catch (err) {
        console.error(err);
        res.redirect("/disciplinas");
    }
});

module.exports = router;
