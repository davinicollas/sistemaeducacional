const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();

const { exportarExcel, upload } = require('../utils/excel');
const ExcelJS = require('exceljs');


const professoresModel = require("../model/professores");
const estadoModel = require("../model/estados");
const disciplinasModel = require("../model/disciplinas");
const formacoesModel = require("../model/formacoes");

router.get("/professores", async (req, res) => {
    try {
        const filtros = {
          busca: req.query.busca || ""
        };
        let where = "1=1";

        const params = [];
        if (filtros.busca) {
            where = "1=1 AND (a.nome LIKE ? OR a.matricula LIKE ? )";
            params.push(`%${filtros.busca}%`, `%${filtros.busca}%`);
        }

        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;
        const offset = (page - 1) * pageSize;
        const professoresList = await professoresModel.getProfessores(where, params, pageSize, offset);
        const totalItems = professoresList.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

        const estadosList = await estadoModel.getEstados();
        const disciplinasList = await disciplinasModel.getDisciplinas();
        const formacaoList = await formacoesModel.getFormacoes();
        res.render("professores", {
            professores: { professores: professoresList },
            estado: estadosList,
            disciplinasList,
            formacaoList,
            filtros,
            pagination: {
                page,
                pageSize,
                totalItems:totalItems,
                totalPages: totalPages
            }
        });
    } catch (err) {
        console.error(err);
        res.render("professores", {
            professores: { professores: [] },
            estado: [],
            disciplinasList: [],
            erro: 'Erro ao carregar professores'
        });
    }
});

router.post("/professores/excluir/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await db.query(`UPDATE professores SET excluido = 1 WHERE id = ?`, [id]);
        res.redirect("/professores");
    } catch (err) {
        console.error(err);
        res.redirect("/professores");
    }
});

router.post("/professores", async (req, res) => {
    try {
        const raw = req.body.professores || {};
        const itens = Array.isArray(raw) ? raw : Object.values(raw);
        for (const item of itens) {
            if (!item) continue;

            const nome = (item.nome || '').trim();
            if (!nome) continue;

            const id = item.id || null;
            const nomeSocial = (item.nome_social || '').trim();
            const cpf = (item.cpf || '').trim();
            const dataNascimento = (item.data_nascimento || '').trim() || null;
            const sexo = (item.sexo || '').trim();
            const idDisciplina = item.id_disciplina || null;
            const cargaHoraria = (item.carga_horaria || '').trim();
            const idStatus = item.id_status === '0' ? 0 : 1;
            const email = (item.email || '').trim();
            const telefone = (item.telefone || '').trim();
            const celular = (item.celular || '').trim();
            const cep = (item.cep || '').trim();
            const endereco = (item.endereco || '').trim();
            const numeros = (item.numeros || '').trim();
            const complemento = (item.complemento || '').trim();
            const bairro = (item.bairro || '').trim();
            const cidade = (item.cidade || '').trim();
            const idEstado = item.id_estado || null;
            const matricula = (item.matricula || '').trim();
            const registroProfissional = (item.registro_profissional || '').trim();
            const dataAdmissao = (item.data_admissao || '').trim() || null;
            const idFormacao = item.idFormacao || null;
            const areaFormacao = (item.area_formacao || '').trim();
            const observacoes = (item.observacoes || '').trim();

            const params = [nome, nomeSocial, cpf, dataNascimento, sexo, idDisciplina, cargaHoraria, idStatus, email, telefone, celular, cep, endereco, numeros, complemento, bairro, cidade, idEstado, matricula, registroProfissional, dataAdmissao, idFormacao, areaFormacao, observacoes];

            if (id) {
                await db.query(
                    `UPDATE professores SET nome = ?, nome_social = ?, cpf = ?, data_nascimento = ?, sexo = ?, id_disciplina = ?, carga_horaria = ?, id_status = ?, email = ?, telefone = ?, celular = ?, cep = ?, endereco = ?, numeros = ?, complemento = ?, bairro = ?, cidade = ?, id_estado = ?, matricula = ?, registro_profissional = ?, data_admissao = ?, idFormacao = ?, area_formacao = ?, observacoes = ? WHERE id = ?`,
                    [...params, id]
                );
            } else {
                await db.query(
                    `INSERT INTO professores (nome, nome_social, cpf, data_nascimento, sexo, id_disciplina, carga_horaria, id_status, email, telefone, celular, cep, endereco, numeros, complemento, bairro, cidade, id_estado, matricula, registro_profissional, data_admissao, idFormacao, area_formacao, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    params
                );
            }
        }

        res.redirect("/professores");
    } catch (err) {
        console.error(err);
        res.redirect("/professores");
    }

});

router.post('/professor-exportar-excel', async (req, res) => {
    try {
        const [professores] = await db.query(`
            SELECT
                id,
                nome,
                nome_social,
                cpf,
                data_nascimento,
                sexo,
                id_disciplina,
                carga_horaria,
                id_status,
                email,
                telefone,
                celular,
                cep,
                endereco,
                numeros,
                complemento,
                bairro,
                cidade,
                id_estado,
                matricula,
                registro_profissional,
                data_admissao,
                idFormacao,
                area_formacao,
                observacoes
            FROM professores
            ORDER BY nome
        `);

        await exportarExcel({
            res,
            nomeArquivo: 'professores',
            nomePlanilha: 'Professores',
            colunas: [
                { header: 'ID', key: 'id' },
                { header: 'Nome', key: 'nome' },
                { header: 'Nome Social', key: 'nome_social' },
                { header: 'CPF', key: 'cpf' },
                { header: 'Data de Nascimento', key: 'data_nascimento' },
                { header: 'Sexo', key: 'sexo' },
                { header: 'Disciplina', key: 'id_disciplina' },
                { header: 'Carga Horária', key: 'carga_horaria' },
                { header: 'Status', key: 'id_status' },
                { header: 'Email', key: 'email' },
                { header: 'Telefone', key: 'telefone' },
                { header: 'Celular', key: 'celular' },
                { header: 'CEP', key: 'cep' },
                { header: 'Endereço', key: 'endereco' },
                { header: 'Números', key: 'numeros' },
                { header: 'Complemento', key: 'complemento' },
                { header: 'Bairro', key: 'bairro' },
                { header: 'Cidade', key: 'cidade' },
                { header: 'Estado', key: 'id_estado' },
                { header: 'Matrícula', key: 'matricula' },
                { header: 'Registro Profissional', key: 'registro_profissional' },
                { header: 'Data de Admissão', key: 'data_admissao' },
                { header: 'Formação', key: 'idFormacao' },
                { header: 'Área de Formação', key: 'area_formacao' },
                { header: 'Observações', key: 'observacoes' }
            ],
            dados: professores
        });
    } catch (error) {
        console.error('Erro ao exportar professores:', error);
        res.status(500).json({ erro: 'Erro ao gerar arquivo Excel' });
    }
});

router.post('/professor-importar-excel', upload.single('arquivo'), async (req, res) => {
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

        const professores = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            const nome = row.getCell(1).value;
            if (!nome) return;
            professores.push({
                nome: String(nome).trim(),
                cpf: row.getCell(2).value ? String(row.getCell(2).value).trim() : null,
                email: row.getCell(3).value ? String(row.getCell(3).value).trim() : null,
                telefone: row.getCell(4).value ? String(row.getCell(4).value).trim() : null,
                nome_social: row.getCell(5).value ? String(row.getCell(5).value).trim() : null,
                data_nascimento: row.getCell(6).value ? String(row.getCell(6).value).trim() : null,
                sexo: row.getCell(7).value ? String(row.getCell(7).value).trim() : null,
                id_disciplina: row.getCell(8).value ? Number(row.getCell(8).value) : null,  
                carga_horaria: row.getCell(9).value ? String(row.getCell(9).value).trim() : null,
                id_status: row.getCell(10).value !== undefined ? Number(row.getCell(10).value) : 1,
                celular: row.getCell(11).value ? String(row.getCell(11).value).trim() : null,
                cep: row.getCell(12).value ? String(row.getCell(12).value).trim() : null,
                endereco: row.getCell(13).value ? String(row.getCell(13).value).trim() : null,
                numeros: row.getCell(14).value ? String(row.getCell(14).value).trim() : null,
                complemento: row.getCell(15).value ? String(row.getCell(15).value).trim() : null,
                bairro: row.getCell(16).value ? String(row.getCell(16).value).trim() : null,
                cidade: row.getCell(17).value ? String(row.getCell(17).value).trim() : null,
                id_estado: row.getCell(18).value ? Number(row.getCell(18).value) : null,
                matricula: row.getCell(19).value ? String(row.getCell(19).value).trim() : null,
                registro_profissional: row.getCell(20).value ? String(row.getCell(20).value).trim() : null,
                data_admissao: row.getCell(21).value ? String(row.getCell(21).value).trim() : null,
                area_formacao: row.getCell(22).value ? String(row.getCell(22).value).trim() : null,
                idFormacao: row.getCell(23).value ? Number(row.getCell(23).value) : null,
                observacoes: row.getCell(24).value ? String(row.getCell(24).value).trim() : null
            });
        });

        let importados = 0;
        for (const professor of professores) {
            await db.query(
                `INSERT INTO professores (nome, nome_social, cpf,data_nascimento,sexo,id_disciplina,carga_horaria,id_status,email, telefone, celular,cep,endereco,numero,complemento,bairro,cidade,id_estado,matricula,registro_profissional,data_admissao,area_formacao,observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [professor.nome, professor.nome_social, professor.cpf, professor.data_nascimento, professor.sexo, professor.id_disciplina, professor.carga_horaria, professor.id_status, professor.email, professor.telefone, professor.celular, professor.cep, professor.endereco, professor.numero, professor.complemento, professor.bairro, professor.cidade, professor.id_estado, professor.matricula, professor.registro_profissional, professor.data_admissao, professor.area_formacao, professor.observacoes]
            );
            importados++;
        }

        return res.json({ sucesso: true, mensagem: 'Importação concluída.', importados });
    } catch (error) {
        console.error('Erro ao importar professores:', error);
        return res.status(500).json({ sucesso: false, mensagem: 'Erro ao importar professores.', erro: error.message });
    }
});

module.exports = router;
