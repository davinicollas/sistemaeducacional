const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");
const db = require("../../database/mysql");
const router = express.Router();

const documentosModel = require("../model/documentos");
const tiposDocumentosModel = require("../model/tiposDocumentos");
const statusDocumentosModel = require("../model/statusDocumentos");

const UPLOAD_DIR = path.join(__dirname, "..", "..", "public", "uploads", "documentos");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Whitelist de mimetypes evita upload de executáveis/scripts disfarçados
const TIPOS_PERMITIDOS = {
    "application/pdf": ".pdf",
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx"
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        // Nome gerado aleatoriamente: evita path traversal e colisão com arquivos existentes
        cb(null, `${crypto.randomUUID()}${TIPOS_PERMITIDOS[file.mimetype]}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!TIPOS_PERMITIDOS[file.mimetype]) {
            return cb(new Error("idTipo de arquivo não permitido"));
        }
        cb(null, true);
    }
});

function removerArquivo(nomeArquivo) {
    if (!nomeArquivo) return;
    fs.unlink(path.join(UPLOAD_DIR, path.basename(nomeArquivo)), () => {});
}

router.get("/documentos", async (req, res) => {
    try {
        const documentosList = await documentosModel.getDocumentos();
        const tiposDocumentos = await tiposDocumentosModel.getTiposDocumentos();
        const statusDocumentos = await statusDocumentosModel.getStatusDocumentos();
        res.render("documentos", { "documentos": documentosList, tiposDocumentos, statusDocumentos });
    } catch (err) {
        console.error(err);
        const tiposDocumentos = await tiposDocumentosModel.getTiposDocumentos();
        res.render("documentos", { documentosList: [], tiposDocumentos, statusDocumentos: [], erro: "Erro ao carregar documentos" });
    }
});

router.post("/documentos", upload.single("arquivo"), async (req, res) => {
    try {
        const nome = (req.body.nome || "").trim();
        if (!nome) return res.redirect("/documentos");

        const idTipo = req.body.idTipo ? Number(req.body.idTipo) : null;
        const descricao = (req.body.descricao || "").trim();
        const data_documento = req.body.data_documento || null;
        const data_validade = req.body.data_validade || null;
        const idStatus = req.body.idStatus ? Number(req.body.idStatus) : 1;
        const publico = req.body.publico ? Number(req.body.publico) : null;
        const arquivo = req.file ? req.file.filename : null;

        await db.query(
            `INSERT INTO documentos (nome, idTipo, descricao, arquivo, data_documento, data_validade, idStatus, publico)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, idTipo, descricao, arquivo, data_documento, data_validade, idStatus, publico]
        );

        res.redirect("/documentos");
    } catch (err) {
        console.error(err);
        res.redirect("/documentos");
    }
});

router.post("/documentos/:id", upload.single("arquivo"), async (req, res) => {
    try {
        const id = req.params.id;
        const nome = (req.body.nome || "").trim();
        if (!nome) return res.redirect("/documentos");

        const idTipo = req.body.idTipo ? Number(req.body.idTipo) : null;
        const descricao = (req.body.descricao || "").trim();
        const data_documento = req.body.data_documento || null;
        const data_validade = req.body.data_validade || null;
        const idStatus = req.body.idStatus ? Number(req.body.idStatus) : 1;
        const publico = req.body.publico ? Number(req.body.publico) : null;

        if (req.file) {
            const [[atual]] = await db.query("SELECT arquivo FROM documentos WHERE id = ?", [id]);
            await db.query(
                `UPDATE documentos SET
                    nome = ?, idTipo = ?, descricao = ?, data_documento = ?, data_validade = ?,
                    idStatus = ?, publico = ?, arquivo = ?
                 WHERE id = ?`,
                [nome, idTipo, descricao, data_documento, data_validade, idStatus, publico, req.file.filename, id]
            );
            if (atual && atual.arquivo) removerArquivo(atual.arquivo);
        } else {
            await db.query(
                `UPDATE documentos SET
                    nome = ?, idTipo = ?, descricao = ?, data_documento = ?, data_validade = ?,
                    idStatus = ?, publico = ?
                 WHERE id = ?`,
                [nome, idTipo, descricao, data_documento, data_validade, idStatus, publico, id]
            );
        }

        res.redirect("/documentos");
    } catch (err) {
        console.error(err);
        res.redirect("/documentos");
    }
});

router.post("/documentos/excluir/:id", async (req, res) => {
    try {
        await db.query(`UPDATE documentos SET excluido = 1 WHERE id = ?`, [req.params.id]);
        res.redirect("/documentos");
    } catch (err) {
        console.error(err);
        res.redirect("/documentos");
    }
});

// Captura erros do multer (idTipo de arquivo não permitido, tamanho excedido, etc.)
router.use((err, req, res, next) => {
    console.error(err);
    res.redirect("/documentos");
});

module.exports = router;

