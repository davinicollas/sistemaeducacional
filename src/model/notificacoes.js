const db = require("../../database/mysql");

async function getNotificacoes() {

    const [rows] = await db.query(
        "SELECT * FROM notificacoes"
    );
    return rows;
}

module.exports = {
    getNotificacoes
};