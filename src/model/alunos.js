const db = require("../../database/mysql");


async function getAlunos(where = '', params = [], pageSize, offset) {
    const whereSql = where ? `AND ${where}` : '';
    const limit = Number(pageSize) || 1000;
    const off = Number(offset) || 0;

    const [rows] = await db.query(
        `SELECT a.*, TIMESTAMPDIFF(YEAR, a.data_nascimento, CURDATE()) AS idade
         FROM alunos a
         LEFT JOIN params_estados pe ON a.id_estado_nascimento = pe.id
         LEFT JOIN params_tipos_documentos ptd ON a.id_tipo_documento = ptd.id
         WHERE a.excluido < 1 ${whereSql}
         ORDER BY a.nome ASC
         LIMIT ? OFFSET ?`,
        [...params, limit, off]
    );


    return rows;
}


async function getStatusAluno(where = '', params = []) {
    const whereSql = where ? `AND ${where}` : '';
    const [rows] = await db.query(
        `SELECT SUM(a.id_status = 1) AS total_ativos,
                SUM(a.id_status = 0) AS total_desativados
         FROM alunos a
         LEFT JOIN params_estados pe ON a.id_estado_nascimento = pe.id
         LEFT JOIN params_tipos_documentos ptd ON a.id_tipo_documento = ptd.id
         WHERE a.excluido < 1 ${whereSql}
        `,
        [...params]
    );

    
    return rows;
}
module.exports = {
    getAlunos,
    getStatusAluno
};