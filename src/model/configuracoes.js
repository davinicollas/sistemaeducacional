const db = require("../../database/mysql");

async function getConfig() {

    const [rows] = await db.query(
        "SELECT * FROM configuracoes"
    );
    return rows[0];
}

module.exports = {
    getConfig
};