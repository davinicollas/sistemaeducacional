const db = require("../../database/mysql");

async function getConfig() {

    const [rows] = await db.query(
        "SELECT * FROM configuracoes WHERE idUsuario = ?"
    );

    if (rows.length === 0) {
        throw new Error("Configuração do usuário não encontrada.");
    }

    return rows[0];
}

module.exports = {
    getConfig
};