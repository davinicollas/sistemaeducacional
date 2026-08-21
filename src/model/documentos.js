const db = require("../../database/mysql");

async function getDocumentos() {
    const [rows] = await db.query(
        "SELECT * FROM documentos WHERE excluido = 0 ORDER BY nome"
    );
    return rows;
}

module.exports = {
    getDocumentos
};
