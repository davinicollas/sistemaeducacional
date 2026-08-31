const db = require("../../database/mysql");


async function getProfessores(where = '', params = [], pageSize, offset) {
    const whereSql = where ? `AND ${where}` : '';
    const limit = Number(pageSize) || 1000;
    const off = Number(offset) || 0;
    const [rows] = await db.query(
        `SELECT p.*, d.text AS disciplina_nome
         FROM professores p
         LEFT JOIN params_disciplina d ON d.id = p.id_disciplina
         WHERE p.excluido < 1 ${whereSql}
         ORDER BY p.nome ASC
         LIMIT ? OFFSET ?`,
        [...params, limit, off]
    );
    return rows;
}

module.exports = {
    getProfessores
};