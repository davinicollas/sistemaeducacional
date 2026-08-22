const db = require("../../database/mysql");

async function getEstados() {

    const [rows] = await db.query(
        "SELECT * FROM params_estados  where excluido = 0 ORDER BY text"
    );
    return rows;
}

module.exports = {
    getEstados
};