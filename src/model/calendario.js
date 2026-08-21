const db = require("../../database/mysql");

async function getEventos(ano, mes) {
    // mes é 0-indexado (0 = Janeiro), igual ao Date do JS
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    const inicio = `${ano}-${String(mes + 1).padStart(2, "0")}-01`;
    const fim = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;

    const [rows] = await db.query(
        `SELECT * FROM eventos_calendario
         WHERE excluido = 0
           AND data_inicio <= ?
           AND (data_fim IS NULL OR data_fim >= ?)
         ORDER BY data_inicio`,
        [fim, inicio]
    );
    return rows;
}

module.exports = {
    getEventos
};
