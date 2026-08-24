const db = require("../../database/mysql");


async function getProfessores() {
    const [rows] = await db.query(
        `SELECT p.*, d.text AS disciplina_nome
         FROM professores p
         LEFT JOIN params_disciplina d ON d.id = p.id_disciplina
         WHERE p.excluido < 1
         ORDER BY p.nome ASC`
    );
    return rows;
}

module.exports = {
    getProfessores
};