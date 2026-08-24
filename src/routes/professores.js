const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();

const professoresModel = require("../model/professores");
const estadoModel = require("../model/estados");
const disciplinasModel = require("../model/disciplinas");
const formacoesModel = require("../model/formacoes");

router.get("/professores", async (req, res) => {
    try {
        const professoresList = await professoresModel.getProfessores();
        const estadosList = await estadoModel.getEstados();
        const disciplinasList = await disciplinasModel.getDisciplinas();
        const formacaoList = await formacoesModel.getFormacoes();
        res.render("professores", {
            professores: { professores: professoresList },
            estado: estadosList,
            disciplinasList,
            formacaoList
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

module.exports = router;
