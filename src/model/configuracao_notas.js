const db = require("../../database/mysql");

async function getConfiguracaoNotas() {

    const [rows] = await db.query(
        "SELECT * FROM configuracao_notas"
    );
    return rows[0];
}

module.exports = {
    getConfiguracaoNotas
};