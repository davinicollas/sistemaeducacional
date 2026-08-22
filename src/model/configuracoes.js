const db = require("../../database/mysql");

async function getConfig() {

    const [rows] = await db.query(
        "SELECT * FROM configuracoes where excluido = 0"
    );
    return rows[0];
}

module.exports = {
    getConfig
};