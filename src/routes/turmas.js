const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();

const { exportarExcel, upload } = require('../utils/excel');
const ExcelJS = require('exceljs');


const series = require("../model/series");
const turmas = require("../model/turmas");
const anoLetivo = require("../model/anosLetivos");
const salas = require("../model/salas");
const turnos = require("../model/turnos");

router.get("/turmas", async (req, res) => {
    try {
        const filtros = {
          busca: req.query.busca || ""
        };
        let where = "1=1";

        const params = [];
        if (filtros.busca) {
            where = "1=1 AND (t.nome LIKE ? OR t.sigla LIKE ? )";
            params.push(`%${filtros.busca}%`, `%${filtros.busca}%`);
        }

        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;
        const offset = (page - 1) * pageSize;

        const turmasList = await turmas.getTurmas(where, params, pageSize, offset);
        const totalItems = await turmas.getTotalTurmas(where, params);
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
        const seriesList = await series.getSeries();
        const anoLetivoList = await anoLetivo.getAnosLetivos();
        const salasList = await salas.getSalas();
        const turnosList = await turnos.getTurnos();

        res.render("turmas", {
            turmas: { turmas: turmasList },
            series: seriesList,
            anoLetivo: anoLetivoList,
            salas: salasList,
            turnos: turnosList,
            filtros,
            pagination: {
                page,
                pageSize,
                totalItems,
                totalPages
            }
        });
    } catch (err) {
        console.error(err);
        res.render("turmas", {
            turmas: { turmas: [] },
            series: [],
            anoLetivo: [],
            salas: [],
            turnos: [],
            erro: 'Erro ao carregar turmas'
        });
    }
});

router.post("/turmas/excluir/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await db.query(`UPDATE turmas SET excluido = 1 WHERE id = ?`, [id]);
        res.redirect("/turmas");
    } catch (err) {
        console.error(err);
        res.redirect("/turmas");
    }
});

router.post("/turmas", async (req, res) => {
    try {
        const raw = req.body.turmas || {};
        const itens = Array.isArray(raw) ? raw : Object.values(raw);

        for (const item of itens) {
            if (!item) continue;

            const nome = (item.nome || '').trim();
            if (!nome) continue;

            const id = item.id || null;
            const text = (item.text || nome).trim();
            const sigla = (item.sigla || '').trim();
            const id_ano_letivo = item.id_ano_letivo ?? null;
            const id_serie = item.id_serie ?? null;
            const id_turno = item.id_turno ?? null;
            const id_salas = item.id_salas ?? null;
            const capacidade = item.capacidade ?? null;
            const data_inicio = (item.data_inicio ?? item.dataInicio ?? '').toString().trim() || null;
            const data_fim = (item.data_fim ?? item.dataFim ?? '').toString().trim() || null;
            const id_status = item.id_status ?? 1;
            const observacoes = (item.observacoes || '').trim();

            const params = [nome, sigla, id_ano_letivo, id_serie, id_turno, id_salas, capacidade, data_inicio, data_fim, id_status, observacoes];

            if (id) {
                await db.query(
                    `UPDATE turmas SET nome = ?,  sigla = ?, id_ano_letivo = ?, id_serie = ?, id_turno = ?, id_salas = ?, capacidade = ?, data_inicio = ?, data_fim = ?, id_status = ?, observacoes = ? WHERE id = ?`,
                    [...params, id]
                );
            } else {
                await db.query(
                    `INSERT INTO turmas (nome,  sigla, id_ano_letivo, id_serie, id_turno, id_salas, capacidade, data_inicio, data_fim, id_status, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    params
                );
            }
        }

        res.redirect("/turmas");
    } catch (err) {
        console.error(err);
        res.redirect("/turmas");
    }
});

router.post('/turmas-exportar-excel', async (req, res) => {
    try {
        const [turmas] = await db.query(`
            SELECT
               id, nome, sigla, id_ano_letivo, id_serie, id_turno, id_salas, capacidade, data_inicio, data_fim, id_status, observacoes
            FROM turmas
            ORDER BY nome
        `);

        await exportarExcel({
            res,
            nomeArquivo: 'turmas',
            nomePlanilha: 'turmas',
            colunas: [
                { header: 'ID', key: 'id' },
                { header: 'Nome', key: 'nome' },
                { header: 'Sigla', key: 'sigla' },
                { header: 'Ano Letivo', key: 'id_ano_letivo' },
                { header: 'Série', key: 'id_serie' },
                { header: 'Turno', key: 'id_turno' },
                { header: 'Sala', key: 'id_salas' },
                { header: 'Capacidade', key: 'capacidade' },
                { header: 'Data de Início', key: 'data_inicio' },
                { header: 'Data de Fim', key: 'data_fim' },
                { header: 'Observações', key: 'observacoes' },
                { header: 'Status', key: 'id_status' }
            ],
            dados: turmas
        });
    } catch (error) {
        console.error('Erro ao exportar turmas:', error);
        res.status(500).json({ erro: 'Erro ao gerar arquivo Excel' });
    }
});

router.post('/turmas-importar-excel', upload.single('arquivo'), async (req, res) => {
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

        const turmas = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            const nome = row.getCell(1).value;
            if (!nome) return;
            turmas.push({
                nome: String(nome).trim(),
                sigla: row.getCell(2).value ? String(row.getCell(2).value).trim() : null,
                id_ano_letivo: row.getCell(3).value ? String(row.getCell(3).value).trim() : null,
                id_serie: row.getCell(4).value ? String(row.getCell(4).value).trim() : null,
                id_turno: row.getCell(5).value ? String(row.getCell(5).value).trim() : null,
                id_salas: row.getCell(6).value ? String(row.getCell(6).value).trim() : null,
                capacidade: row.getCell(7).value ? String(row.getCell(7).value).trim() : null,
                data_inicio: row.getCell(8).value ? String(row.getCell(8).value).trim() : null,
                data_fim: row.getCell(9).value ? String(row.getCell(9).value).trim() : null,
                observacoes: row.getCell(10).value ? Number(row.getCell(10).value) : null,  
                id_status: row.getCell(12).value !== undefined ? Number(row.getCell(12).value) : 1
            });
        });

        let importados = 0;
        for (const turma of turmas) {
            await db.query(
                `INSERT INTO turmas (nome, sigla, id_ano_letivo, id_serie, id_turno, id_salas, capacidade, data_inicio, data_fim, observacoes, id_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [turma.nome, turma.sigla, turma.id_ano_letivo, turma.id_serie, turma.id_turno, turma.id_salas, turma.capacidade, turma.data_inicio, turma.data_fim, turma.observacoes, turma.id_status]
            );
            importados++;
        }

        return res.json({ sucesso: true, mensagem: 'Importação concluída.', importados });
    } catch (error) {
        console.error('Erro ao importar turmas:', error);
        return res.status(500).json({ sucesso: false, mensagem: 'Erro ao importar turmas.', erro: error.message });
    }
});

module.exports = router;
