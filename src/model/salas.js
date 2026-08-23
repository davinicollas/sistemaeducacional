const db = require("../../database/mysql");

async function getSalas() {
    const [rows] = await db.query(
        "SELECT * FROM params_salas WHERE excluido < 1 ORDER BY nome ASC"
    );
    return rows;
}

module.exports = {
    getSalas
};
