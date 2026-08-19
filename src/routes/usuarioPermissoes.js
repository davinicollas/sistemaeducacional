const express = require('express');
const router = express.Router();
const permissaoModel = require('../model/usuarioPermissoes');
const authMid = require('../middleware/auth');
const db = require('../../database/mysql.js');

/**
 * Renderiza a página de permissões com dados atuais.
 * extra: objeto opcional com chaves adicionais (ex: { erro: '...' })
 */
async function renderPage(res, extra = {}) {
    const roles = await permissaoModel.getRoles();
    const permissions = await permissaoModel.getPermissions();
    const matrix = await permissaoModel.getMatrix();
    return res.render('usuariosPermissoes', Object.assign({ roles, permissions, matrix }, extra));
}

/** Normaliza o payload `matrix` vindo do formulário para valores booleanos/strings. */
function normalizeMatrixPayload(payload) {
    const result = {};
    for (const role in payload) {
        result[role] = {};
        const perms = payload[role] || {};
        for (const perm in perms) {
            // checkbox presente => true
            result[role][perm] = !!perms[perm];
        }
    }
    return result;
}

/** GET /usuariosPermissoes */
async function handleGet(req, res) {
    try {
        return await renderPage(res);
    } catch (err) {
        console.error('Erro GET /usuariosPermissoes', err);
        return res.status(500).send('Erro ao carregar permissões');
    }
}

/** POST /usuariosPermissoes - salva a matriz de permissões */
async function handleSaveMatrix(req, res) {
    try {
        const incoming = req.body.matrix || {};
        const normalized = normalizeMatrixPayload(incoming);
        await permissaoModel.saveMatrix(normalized);
        return res.redirect('/usuariosPermissoes');
    } catch (err) {
        console.error('Erro POST /usuariosPermissoes', err);
        return res.status(500).send('Erro ao salvar permissões');
    }
}

/** Helper para inserir registros (roles/permissions) com validação simples */
async function createEntity(table, name) {
    const [exists] = await db.query(`SELECT id FROM ${table} WHERE name = ?`, [name]);
    if (exists.length > 0) return { ok: false, error: 'exists' };
    await db.query(`INSERT INTO ${table} (name) VALUES (?)`, [name]);
    return { ok: true };
}

/** POST /usuariosPermissoes/role - cria novo papel */
async function handleCreateRole(req, res) {
    const name = String(req.body.name || '').trim();
    if (!name) return await renderPage(res, { erro: 'Nome do papel é obrigatório.' });

    try {
        const result = await createEntity('roles', name);
        if (!result.ok && result.error === 'exists') {
            return await renderPage(res, { erro: 'Papel já existente.' });
        }
        return res.redirect('/usuariosPermissoes');
    } catch (err) {
        console.error('Erro criando papel', err);
        return await renderPage(res, { erro: 'Erro ao criar papel.' });
    }
}

/** POST /usuariosPermissoes/permission - cria nova permissão */
async function handleCreatePermission(req, res) {
    const name = String(req.body.name || '').trim();
    if (!name) return await renderPage(res, { erro: 'Nome da permissão é obrigatório.' });

    try {
        const result = await createEntity('permissions', name);
        if (!result.ok && result.error === 'exists') {
            return await renderPage(res, { erro: 'Permissão já existente.' });
        }
        return res.redirect('/usuariosPermissoes');
    } catch (err) {
        console.error('Erro criando permissão', err);
        return await renderPage(res, { erro: 'Erro ao criar permissão.' });
    }
}

// Routes
router.get('/usuariosPermissoes', authMid, handleGet);
router.post('/usuariosPermissoes', authMid, handleSaveMatrix);
router.post('/usuariosPermissoes/role', authMid, handleCreateRole);
router.post('/usuariosPermissoes/permission', authMid, handleCreatePermission);

module.exports = router;
