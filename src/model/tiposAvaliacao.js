const db = require("../../database/mysql");

async function getTiposAvaliacao() {
    const [rows] = await db.query(
        "SELECT * FROM params_tipos_avaliacao WHERE excluido < 1 ORDER BY nome ASC"
    );
    return rows;
}

module.exports = {
    getTiposAvaliacao
};
