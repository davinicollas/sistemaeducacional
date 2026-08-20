const db = require("../../database/mysql");

async function getAparencia() {

    const [rows] = await db.query(
        "SELECT * FROM sistema_aparencia"
    );
    return rows[0];
}

module.exports = {
    getAparencia
};