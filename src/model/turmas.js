const db = require("../../database/mysql");

async function getTurmas(where = '', params = [], pageSize, offset) {
    const whereSql = where ? `AND ${where}` : '';
    const limit = Number(pageSize) || 1000;
    const off = Number(offset) || 0;

    const [rows] = await db.query(
        `SELECT t.*
         FROM turmas t
         WHERE t.excluido < 1 ${whereSql}
         ORDER BY t.nome ASC
         LIMIT ? OFFSET ?`,
        [...params, limit, off]
    );
    return rows;
}

async function getTotalTurmas(where = '', params = []) {
    const whereSql = where ? `AND ${where}` : '';
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total
         FROM turmas t
         WHERE t.excluido < 1 ${whereSql}`,
        params
    );
    return Number(rows[0]?.total || 0);
}

module.exports = {
    getTurmas,
    getTotalTurmas
};