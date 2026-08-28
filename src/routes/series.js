const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();

const { exportarExcel, upload } = require('../utils/excel');
const ExcelJS = require('exceljs');


const seriesModel = require("../model/series");
const turnosModel = require("../model/turnos");

router.get("/series", async (req, res) => {
    try {
        const seriesList = await seriesModel.getSeries();
        const turnosList = await turnosModel.getTurnos();
        res.render("series", { series: { series: seriesList }, turnos: turnosList });
    } catch (err) {
        console.error(err);
        const turnosList = await turnosModel.getTurnos();
        res.render("series", { series: { series: [] }, turnos: turnosList, erro: 'Erro ao carregar séries' });
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
            const idTurnos = item.idTurnos || null; // Assuming idTurnos is a single value, not an array
            const idade_minima = item.idade_minima ? Number(item.idade_minima) : null;
            const idade_maxima = item.idade_maxima ? Number(item.idade_maxima) : null;
            const carga_horaria = item.carga_horaria ? Number(item.carga_horaria) : null;
            const aulas_semanais = item.aulas_semanais ? Number(item.aulas_semanais) : null;
            const status = item.status === '0' ? 0 : 1;
            const descricao = (item.descricao || '').trim();

            const params = [
                nome, abreviacao, etapa_ensino, nivel_ensino, ano_serie, codigo, idTurnos,
                idade_minima, idade_maxima, carga_horaria, aulas_semanais, status, descricao
            ];

            if (id) {
                await db.query(
                    `UPDATE params_series SET
                        nome = ?, abreviacao = ?, etapa_ensino = ?, nivel_ensino = ?, ano_serie = ?,
                        codigo = ?, idTurnos = ?, idade_minima = ?, idade_maxima = ?, carga_horaria = ?,
                        aulas_semanais = ?, status = ?, descricao = ?
                     WHERE id = ?`,
                    [...params, id]
                );
            } else {
                await db.query(
                    `INSERT INTO params_series
                        (nome, abreviacao, etapa_ensino, nivel_ensino, ano_serie, codigo, idTurnos,
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

router.post('/series-exportar-excel', async (req, res) => {
    try {
        const [alunos] = await db.query(`
            SELECT
               *
            FROM params_series
            ORDER BY nome
        `);

        await exportarExcel({
            res,
            nomeArquivo: 'series',
            nomePlanilha: 'Séries',
            colunas: [
                { header: 'ID', key: 'id' },
                { header: 'Nome', key: 'nome' },
                { header: 'Abreviação', key: 'abreviacao' },
                { header: 'Etapa de Ensino', key: 'etapa_ensino' },
                { header: 'Nível de Ensino', key: 'nivel_ensino' },
                { header: 'Ano da Série', key: 'ano_serie' },
                { header: 'Código', key: 'codigo' },
                { header: 'Turno', key: 'idTurnos' },
                { header: 'Idade Mínima', key: 'idade_minima' },
                { header: 'Idade Máxima', key: 'idade_maxima' },
                { header: 'Carga Horária', key: 'carga_horaria' },
                { header: 'Aulas Semanais', key: 'aulas_semanais' },
                { header: 'Status', key: 'status' },
                { header: 'Descrição', key: 'descricao' }
            ],
            dados: alunos
        });
    } catch (error) {
        console.error('Erro ao exportar alunos:', error);
        res.status(500).json({ erro: 'Erro ao gerar arquivo Excel' });
    }
});

router.post('/series-importar-excel', upload.single('arquivo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ sucesso: false, mensagem: 'Nenhum arquivo Excel foi enviado.' });
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);
        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            return res.status(400).json({ sucesso: false, mensagem: 'Arquivo Excel inválido.' });
        }

        const series = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            const nome = row.getCell(1).value;
            if (!nome) return;
            series.push({
                nome: String(nome).trim(),
                abreviacao: row.getCell(2).value ? String(row.getCell(2).value).trim() : '',
                etapa_ensino: row.getCell(3).value ? String(row.getCell(3).value).trim() : '',
                nivel_ensino: row.getCell(4).value ? String(row.getCell(4).value).trim() : '',
                ano_serie: row.getCell(5).value ? Number(row.getCell(5).value) : null,
                codigo: row.getCell(6).value ? String(row.getCell(6).value).trim() : '',
                idTurnos: row.getCell(7).value ? Number(row.getCell(7).value) : null,
                status: row.getCell(13).value !== undefined ? Number(row.getCell(13).value) : 1,
                idade_minima: row.getCell(14).value ? Number(row.getCell(14).value) : null,
                idade_maxima: row.getCell(15).value ? Number(row.getCell(15).value) : null,
                carga_horaria: row.getCell(16).value ? Number(row.getCell(16).value) : null,
                aulas_semanais: row.getCell(17).value ? Number(row.getCell(17).value) : null,
                descricao: row.getCell(18).value ? String(row.getCell(18).value).trim() : ''
            });
        });

        let importados = 0;
        for (const item of series) {
            await db.query(
                `INSERT INTO params_series (nome, abreviacao, etapa_ensino, nivel_ensino, ano_serie, codigo, idTurnos, status, idade_minima, idade_maxima, carga_horaria, aulas_semanais, descricao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [item.nome, item.abreviacao, item.etapa_ensino, item.nivel_ensino, item.ano_serie, item.codigo, item.idTurnos, item.status, item.idade_minima, item.idade_maxima, item.carga_horaria, item.aulas_semanais, item.descricao]
            );
            importados++;
        }

        return res.json({ sucesso: true, mensagem: 'Importação concluída.', importados });
    } catch (error) {
        console.error('Erro ao importar séries:', error);
        return res.status(500).json({ sucesso: false, mensagem: 'Erro ao importar séries.', erro: error.message });
    }
});

module.exports = router;
