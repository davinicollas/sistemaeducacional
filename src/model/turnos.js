const db = require("../../database/mysql");

async function getTurnos() {
    const [rows] = await db.query(
        "SELECT * FROM params_turnos WHERE excluido < 1 ORDER BY nome ASC"
    );
    return rows;
}

module.exports = {
    getTurnos
};
