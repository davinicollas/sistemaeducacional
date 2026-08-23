const db = require("../../database/mysql");

async function getDisciplinas() {
    const [rows] = await db.query(
        "SELECT * FROM params_disciplina WHERE excluido < 1 ORDER BY sigla ASC"
    );
    return rows;
}

module.exports = {
    getDisciplinas
};
