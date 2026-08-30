const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();

const { exportarExcel, upload } = require('../utils/excel');
const ExcelJS = require('exceljs');


const alunos = require("../model/alunos");
const estadoModel = require("../model/estados");
const tipoDocumentoModel = require("../model/tiposDocumentos");

router.get("/alunos", async (req, res) => {
    try {
        const alunosList = await alunos.getAlunos();
        const estadosList = await estadoModel.getEstados();
        const tipoDocumentoList = await tipoDocumentoModel.getTiposDocumentos();
        res.render("alunos", {
            alunos: { alunos: alunosList },
            estado: estadosList,
            tipoDocumento: tipoDocumentoList
        });
    } catch (err) {
        console.error(err);
        res.render("alunos", {
            alunos: { alunos: [] },
            estado: [],
            erro: 'Erro ao carregar alunos'
        });
    }
});

router.post("/alunos/excluir/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await db.query(`UPDATE alunos SET excluido = 1 WHERE id = ?`, [id]);
        res.redirect("/alunos");
    } catch (err) {
        console.error(err);
        res.redirect("/alunos");
    }
});

router.post("/alunos", async (req, res) => {
    try {
        const raw = req.body.alunos || {};
        const itens = Array.isArray(raw) ? raw : Object.values(raw);
        for (const item of itens) {
            if (!item) continue;

            const nome = (item.nome || '').trim();
            if (!nome) continue;

            const id = item.id || null;
            const nomeSocial = (item.nome_social || '').trim();
            const cpf = (item.cpf || '').trim();
            const rg = (item.rg || '').trim();
            const matricula = (item.matricula || '').trim();
            const dataNascimento = (item.data_nascimento || '').trim() || null;
            const sexo = (item.sexo || '').trim();
            const nacionalidade = (item.nacionalidade || '').trim();
            const naturalidade = (item.naturalidade || '').trim();
            const idEstadoNascimento = item.id_estado_nascimento || null;
            const foto = (item.foto || '').trim();
            const idTipoDocumento = item.id_tipo_documento || null;
            const numeroDocumento = (item.numero_documento || '').trim();
            const orgaoExpedidor = (item.orgao_expedidor || '').trim();
            const dataExpedicao = (item.data_expedicao || '').trim() || null;
            const certidaoNascimento = (item.certidao_nascimento || '').trim();
            const numeroCertidao = (item.numero_certidao || '').trim();
            const observacoes = (item.observacoes || '').trim();
            const idStatus = item.id_status || null;

            const params = [nome, nomeSocial, cpf, rg, dataNascimento, sexo, nacionalidade, naturalidade, idEstadoNascimento, foto, idTipoDocumento, numeroDocumento, orgaoExpedidor, matricula, dataExpedicao, certidaoNascimento, numeroCertidao, observacoes, idStatus];

            if (id) {
                await db.query(
                    `UPDATE alunos SET nome = ?, nome_social = ?, cpf = ?, rg = ?, matricula = ?, data_nascimento = ?, sexo = ?, nacionalidade = ?, naturalidade = ?, id_estado_nascimento = ?, foto = ?, id_tipo_documento = ?, numero_documento = ?, orgao_expedidor = ?, data_expedicao = ?, certidao_nascimento = ?, numero_certidao = ?, observacoes = ?, id_status = ? WHERE id = ?`,
                    [...params, id]
                );
            } else {
                await db.query(
                    `INSERT INTO alunos (nome, nome_social, cpf, rg, matricula, data_nascimento, sexo, nacionalidade, naturalidade, id_estado_nascimento, foto, id_tipo_documento, numero_documento, orgao_expedidor, data_expedicao, certidao_nascimento, numero_certidao, observacoes, id_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    params
                );
            }
        }

        res.redirect("/alunos");
    } catch (err) {
        console.error(err);
        res.redirect("/alunos");
    }

});

router.post('/alunos-exportar-excel', async (req, res) => {
    try {
        const [alunos] = await db.query(`
            SELECT
               id, nome, nome_social, cpf, rg, matricula, data_nascimento, sexo, nacionalidade, naturalidade, id_estado_nascimento, foto, id_tipo_documento, numero_documento, orgao_expedidor,
  data_expedicao, certidao_nascimento, numero_certidao, observacoes, id_status
            FROM alunos
            ORDER BY nome
        `);

        await exportarExcel({
            res,
            nomeArquivo: 'alunos',
            nomePlanilha: 'Alunos',
            colunas: [
                { header: 'ID', key: 'id' },
                { header: 'Nome', key: 'nome' },
                { header: 'Nome Social', key: 'nome_social' },
                { header: 'CPF', key: 'cpf' },
                { header: 'RG', key: 'rg' },
                { header: 'Matrícula', key: 'matricula' },
                { header: 'Data de Nascimento', key: 'data_nascimento' },
                { header: 'Sexo', key: 'sexo' },
                { header: 'Nacionalidade', key: 'nacionalidade' },
                { header: 'Naturalidade', key: 'naturalidade' },
                { header: 'Estado de Nascimento', key: 'id_estado_nascimento' },
                { header: 'Foto', key: 'foto' },
                { header: 'Tipo de Documento', key: 'id_tipo_documento' },
                { header: 'Número do Documento', key: 'numero_documento' },
                { header: 'Órgão Expedidor', key: 'orgao_expedidor' },
                { header: 'Data de Expedição', key: 'data_expedicao' },
                { header: 'Certidão de Nascimento', key: 'certidao_nascimento' },
                { header: 'Número da Certidão', key: 'numero_certidao' },
                { header: 'Observações', key: 'observacoes' },
                { header: 'Status', key: 'id_status' }
            ],
            dados: alunos
        });
    } catch (error) {
        console.error('Erro ao exportar alunos:', error);
        res.status(500).json({ erro: 'Erro ao gerar arquivo Excel' });
    }
});

router.post('/aluno-importar-excel', upload.single('arquivo'), async (req, res) => {
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

        const alunos = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            const nome = row.getCell(1).value;
            if (!nome) return;
            alunos.push({
                nome: String(nome).trim(),
                cpf: row.getCell(2).value ? String(row.getCell(2).value).trim() : null,
                rg: row.getCell(3).value ? String(row.getCell(3).value).trim() : null,
                matricula: row.getCell(4).value ? String(row.getCell(4).value).trim() : null,
                email: row.getCell(5).value ? String(row.getCell(5).value).trim() : null,
                telefone: row.getCell(6).value ? String(row.getCell(6).value).trim() : null,
                nome_social: row.getCell(7).value ? String(row.getCell(7).value).trim() : null,
                data_nascimento: row.getCell(8).value ? String(row.getCell(8).value).trim() : null,
                sexo: row.getCell(9).value ? String(row.getCell(9).value).trim() : null,
                id_disciplina: row.getCell(10).value ? Number(row.getCell(10).value) : null,  
                carga_horaria: row.getCell(11).value ? String(row.getCell(11).value).trim() : null,
                id_status: row.getCell(12).value !== undefined ? Number(row.getCell(12).value) : 1,
                celular: row.getCell(13).value ? String(row.getCell(13).value).trim() : null,
                cep: row.getCell(14).value ? String(row.getCell(14).value).trim() : null,
                endereco: row.getCell(15).value ? String(row.getCell(15).value).trim() : null,
                numeros: row.getCell(16).value ? String(row.getCell(16).value).trim() : null,
                complemento: row.getCell(17).value ? String(row.getCell(17).value).trim() : null,
                bairro: row.getCell(18).value ? String(row.getCell(18).value).trim() : null,
                cidade: row.getCell(19).value ? String(row.getCell(19).value).trim() : null,
                id_estado: row.getCell(20).value ? Number(row.getCell(20).value) : null,
                registro_profissional: row.getCell(21).value ? String(row.getCell(21).value).trim() : null,
                data_admissao: row.getCell(22).value ? String(row.getCell(22).value).trim() : null,
                area_formacao: row.getCell(23).value ? String(row.getCell(23).value).trim() : null,
                idFormacao: row.getCell(24).value ? Number(row.getCell(24).value) : null,
                observacoes: row.getCell(25).value ? String(row.getCell(25).value).trim() : null
            });
        });

        let importados = 0;
        for (const aluno of alunos) {
            await db.query(
                `INSERT INTO alunos (nome, nome_social, cpf, rg, matricula, data_nascimento, sexo, id_disciplina, carga_horaria, id_status, email, telefone, celular, cep, endereco, numero, complemento, bairro, cidade, id_estado, registro_profissional, data_admissao,  observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [aluno.nome, aluno.nome_social, aluno.cpf, aluno.rg, aluno.matricula, aluno.data_nascimento, aluno.sexo, aluno.id_disciplina, aluno.carga_horaria, aluno.id_status, aluno.email, aluno.telefone, aluno.celular, aluno.cep, aluno.endereco, aluno.numero, aluno.complemento, aluno.bairro, aluno.cidade, aluno.id_estado, aluno.registro_profissional, aluno.data_admissao,  aluno.observacoes]
            );
            importados++;
        }

        return res.json({ sucesso: true, mensagem: 'Importação concluída.', importados });
    } catch (error) {
        console.error('Erro ao importar alunos:', error);
        return res.status(500).json({ sucesso: false, mensagem: 'Erro ao importar alunos.', erro: error.message });
    }
});

module.exports = router;
