const db = require("../../database/mysql");

async function getAlunos(where = "", params = [], pageSize, offset) {
  const whereSql = where ? `AND ${where}` : "";
  const limit = Number(pageSize) || 1000;
  const off = Number(offset) || 0;

  // Select explicit columns and do NOT return password hash to the application.
  // Instead return a boolean `has_senha` to indicate whether the aluno has a password set.
  const [rows] = await db.query(
    `SELECT
            a.id,
            a.nome,
            a.nome_social,
            a.cpf,
            a.rg,
            a.matricula,
            a.email,
            a.data_nascimento,
            a.sexo,
            a.nacionalidade,
            a.naturalidade,
            a.id_estado_nascimento,
            a.foto,
            a.id_tipo_documento,
            a.numero_documento,
            a.orgao_expedidor,
            a.data_expedicao,
            a.certidao_nascimento,
            a.numero_certidao,
            a.observacoes,
            a.id_status,
            a.excluido,
            TIMESTAMPDIFF(YEAR, a.data_nascimento, CURDATE()) AS idade,
            (u.senha IS NOT NULL AND u.senha <> '') AS has_senha
          FROM alunos a
          LEFT JOIN usuarios u ON u.id_aluno = a.id AND u.excluido < 1
          LEFT JOIN params_estados pe ON a.id_estado_nascimento = pe.id
          LEFT JOIN params_tipos_documentos ptd ON a.id_tipo_documento = ptd.id
         WHERE a.excluido < 1 ${whereSql}
         ORDER BY a.nome ASC
         LIMIT ? OFFSET ?`,
    [...params, limit, off],
  );

  return rows;
}

async function getStatusAluno(where = "", params = []) {
  const whereSql = where ? `AND ${where}` : "";
  const [rows] = await db.query(
    `SELECT SUM(a.id_status = 1) AS total_ativos,
                SUM(a.id_status = 0) AS total_desativados
         FROM alunos a
         LEFT JOIN params_estados pe ON a.id_estado_nascimento = pe.id
         LEFT JOIN params_tipos_documentos ptd ON a.id_tipo_documento = ptd.id
         WHERE a.excluido < 1 ${whereSql}
        `,
    [...params],
  );

  return rows;
}
module.exports = {
  getAlunos,
  getStatusAluno,
};
