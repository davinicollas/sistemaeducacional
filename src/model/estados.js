const db = require("../../database/mysql");

async function getEstados() {

    const [rows] = await db.query(
        "SELECT * FROM params_estados"
    );
    return rows;
}

module.exports = {
    getEstados
};