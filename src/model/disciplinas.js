const db = require("../../database/mysql");

async function getDisciplinas(where, params, pageSize, offset) {
    const [rows] = await db.query(
        `SELECT * FROM params_disciplina WHERE excluido < 1 AND ${where} ORDER BY sigla ASC LIMIT ? OFFSET ?`,
        [...params, pageSize, offset]
    );
    return rows;
}

module.exports = {
    getDisciplinas
};
