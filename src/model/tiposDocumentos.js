const db = require("../../database/mysql");

async function getTiposDocumentos() {

    const [rows] = await db.query(
        "SELECT * FROM params_tipos_documentos where excluido = 0 ORDER BY text"
    );
    return rows;
}

module.exports = {
    getTiposDocumentos
};