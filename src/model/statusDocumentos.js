const db = require("../../database/mysql");

async function getStatusDocumentos() {

    const [rows] = await db.query(
        "SELECT * FROM params_status_documentos where excluido = 0 ORDER BY text"
    );
    return rows;
}

module.exports = {
    getStatusDocumentos
};