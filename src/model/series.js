const db = require("../../database/mysql");

async function getSeries() {

    const [rows] = await db.query(
        "SELECT * FROM params_series WHERE excluido < 1 ORDER BY nome"
    );

    return rows.map(row => ({
        ...row,
        turnos: row.turnos ? row.turnos.split(',') : []
    }));
}

module.exports = {
    getSeries
};
