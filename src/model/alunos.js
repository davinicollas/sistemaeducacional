const db = require("../../database/mysql");


async function getAlunos() {
    const [rows] = await db.query(
        `SELECT a.*, TIMESTAMPDIFF(YEAR, a.data_nascimento, CURDATE()) AS idade
         FROM alunos a
         LEFT JOIN params_estados pe ON a.id_estado_nascimento = pe.id
         LEFT JOIN params_tipos_documentos ptd ON a.id_tipo_documento = ptd.id
         WHERE a.excluido < 1
         ORDER BY a.nome ASC`
    );
    return rows;
}

module.exports = {
    getAlunos
};