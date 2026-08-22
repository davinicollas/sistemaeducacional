const db = require("../../database/mysql");

async function getNotificacoes() {

    const [rows] = await db.query(
        "SELECT * FROM notificacoes  where excluido = 0"
    );
    return rows;
}

module.exports = {
    getNotificacoes
};