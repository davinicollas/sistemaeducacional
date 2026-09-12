const db = require("../../database/mysql");

async function getProfessores(where = "", params = [], pageSize, offset) {
  const whereSql = where ? `AND ${where}` : "";
  const limit = Number(pageSize) || 1000;
  const off = Number(offset) || 0;
  // Do not return password hash to the application. Expose has_senha boolean instead.
  const [rows] = await db.query(
    `SELECT
            p.id,
            p.nome,
            p.nome_social,
            p.cpf,
            p.data_nascimento,
            p.sexo,
            p.id_disciplina,
            p.carga_horaria,
            p.id_status,
            p.email,
            p.telefone,
            p.celular,
            p.cep,
            p.endereco,
            p.numeros,
            p.complemento,
            p.bairro,
            p.cidade,
            p.id_estado,
            p.idFormacao,
            p.matricula,
            p.registro_profissional,
            p.data_admissao,
            p.formacao,
            p.area_formacao,
            p.observacoes,
            p.excluido,
            d.text AS disciplina_nome,
            (p.senha IS NOT NULL AND p.senha <> '') AS has_senha
         FROM professores p
         LEFT JOIN params_disciplina d ON d.id = p.id_disciplina
         WHERE p.excluido < 1 ${whereSql}
         ORDER BY p.nome ASC
         LIMIT ? OFFSET ?`,
    [...params, limit, off],
  );

  return rows;
}

async function getStatusProfessor(where = "", params = []) {
  const whereSql = where ? `AND ${where}` : "";
  const [rows] = await db.query(
    `SELECT SUM(p.id_status = 1) AS total_ativos,
                SUM(p.id_status = 0) AS total_desativados
         FROM professores p
         WHERE p.excluido < 1 ${whereSql}`,
    [...params],
  );

  return rows;
}

module.exports = {
  getProfessores,
  getStatusProfessor,
};
