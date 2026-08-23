const db = require("../../database/mysql");

async function getPeriodos() {
    const [rows] = await db.query(
        "SELECT * FROM params_periodos WHERE excluido < 1 ORDER BY `ordem` ASC"
    );
    return rows;
}

module.exports = {
    getPeriodos
};
