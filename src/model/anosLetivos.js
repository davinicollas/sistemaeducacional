const db = require("../../database/mysql");

async function getAnosLetivos() {
    const [rows] = await db.query(
        "SELECT * FROM params_anos_letivos WHERE excluido < 1 ORDER BY ano_letivo DESC"
    );
    return rows;
}

module.exports = {
    getAnosLetivos
};
