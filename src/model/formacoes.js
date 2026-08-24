const db = require("../../database/mysql");

async function getFormacoes() {

    const [rows] = await db.query(
        "SELECT * FROM params_formacao where excluido = 0 ORDER BY text"
    );
    return rows;
}

module.exports = {
    getFormacoes
};