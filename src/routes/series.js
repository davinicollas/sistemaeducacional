const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();

const seriesModel = require("../model/series");

router.get("/series", async (req, res) => {
    try {
        const seriesList = await seriesModel.getSeries();
        res.render("series", { series: { series: seriesList } });
    } catch (err) {
        console.error(err);
        res.render("series", { series: { series: [] }, erro: 'Erro ao carregar séries' });
    }
});

router.post("/series/excluir/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await db.query(`UPDATE params_series SET excluido = 1 WHERE id = ?`, [id]);
        res.redirect("/series");
    } catch (err) {
        console.error(err);
        res.redirect("/series");
    }
});

router.post("/series", async (req, res) => {
    try {
        const raw = req.body.series || {};
        const itens = Array.isArray(raw) ? raw : Object.values(raw);

        let deleteIds = req.body.deleteIds || [];
        if (!Array.isArray(deleteIds)) deleteIds = [deleteIds];

        if (deleteIds.length) {
            const ids = deleteIds.filter(Boolean).map(Number).filter(Boolean);
            if (ids.length) {
                await db.query(`DELETE FROM params_series WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
            }
        }

        for (const item of itens) {
            if (!item) continue;

            const nome = (item.nome || '').trim();
            if (!nome) continue; // skip empty rows

            const id = item.id || null;
            const abreviacao = (item.abreviacao || '').trim();
            const etapa_ensino = (item.etapa_ensino || '').trim();
            const nivel_ensino = (item.nivel_ensino || '').trim();
            const ano_serie = item.ano_serie ? Number(item.ano_serie) : null;
            const codigo = (item.codigo || '').trim();
            const turnos = (item.turnos || '').trim();
            const idade_minima = item.idade_minima ? Number(item.idade_minima) : null;
            const idade_maxima = item.idade_maxima ? Number(item.idade_maxima) : null;
            const carga_horaria = item.carga_horaria ? Number(item.carga_horaria) : null;
            const aulas_semanais = item.aulas_semanais ? Number(item.aulas_semanais) : null;
            const status = item.status === '0' ? 0 : 1;
            const descricao = (item.descricao || '').trim();

            const params = [
                nome, abreviacao, etapa_ensino, nivel_ensino, ano_serie, codigo, turnos,
                idade_minima, idade_maxima, carga_horaria, aulas_semanais, status, descricao
            ];

            if (id) {
                await db.query(
                    `UPDATE params_series SET
                        nome = ?, abreviacao = ?, etapa_ensino = ?, nivel_ensino = ?, ano_serie = ?,
                        codigo = ?, turnos = ?, idade_minima = ?, idade_maxima = ?, carga_horaria = ?,
                        aulas_semanais = ?, status = ?, descricao = ?
                     WHERE id = ?`,
                    [...params, id]
                );
            } else {
                await db.query(
                    `INSERT INTO params_series
                        (nome, abreviacao, etapa_ensino, nivel_ensino, ano_serie, codigo, turnos,
                         idade_minima, idade_maxima, carga_horaria, aulas_semanais, status, descricao)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    params
                );
            }
        }

        res.redirect("/series");
    } catch (err) {
        console.error(err);
        res.redirect("/series");
    }
});

module.exports = router;
