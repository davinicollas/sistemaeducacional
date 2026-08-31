const db = require("../../database/mysql");

async function getDisciplinas(where = '', params = [], pageSize, offset) {
    
    const whereSql = where ? `AND ${where}` : '';
    const limit = Number(pageSize) || 1000;
    const off = Number(offset) || 0;

    const [rows] = await db.query(
        `SELECT * FROM params_disciplina WHERE excluido < 1 ${whereSql} ORDER BY sigla ASC LIMIT ? OFFSET ?`,
        [...params, limit, off]
    );
    return rows;
}

module.exports = {
    getDisciplinas
};
