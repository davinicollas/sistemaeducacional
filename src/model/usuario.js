const db = require("../../database/mysql.js");
const bcrypt = require("bcrypt");

async function getUsuario(email) {
  const [usuario] = await db.query(
    "SELECT * FROM usuarios WHERE email = ? AND excluido = 0",
    [email],
  );

  return usuario[0];
}

async function getUsuarioPorId(id) {
  const [usuario] = await db.query(
    "SELECT * FROM usuarios WHERE id = ? AND excluido = 0",
    [id],
  );

  return usuario[0];
}

async function getByAlunoId(id_aluno) {
  const [rows] = await db.query(
    "SELECT * FROM usuarios WHERE id_aluno = ? AND excluido = 0 LIMIT 1",
    [id_aluno],
  );
  return rows[0];
}

async function getByProfessorId(id_professor) {
  const [rows] = await db.query(
    "SELECT * FROM usuarios WHERE id_professor = ? AND excluido = 0 LIMIT 1",
    [id_professor],
  );
  return rows[0];
}

async function createUsuario({
  email,
  senha,
  id_tipo_usuario = 3,
  id_aluno = null,
  id_professor = null,
  nome = null,
}) {
  const [result] = await db.query(
    "INSERT INTO usuarios (email, senha, id_tipo_usuario, id_aluno, id_professor, nome) VALUES (?, ?, ?, ?, ?, ?) RETURNING id",
    [email, senha, id_tipo_usuario, id_aluno, id_professor, nome],
  );
  const insertedId = result?.[0]?.id || null;
  return getUsuarioPorId(insertedId);
}

async function updateSenhaById(id, hashedSenha) {
  await db.query(
    "UPDATE usuarios SET senha = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?",
    [hashedSenha, id],
  );
}

async function createOrUpdateForAluno(id_aluno, email, hashedSenha) {
  // try find by id_aluno
  let u = await getByAlunoId(id_aluno);
  if (u) {
    await updateSenhaById(u.id, hashedSenha);
    if (!u.email && email) {
      await db.query("UPDATE usuarios SET email = ? WHERE id = ?", [
        email,
        u.id,
      ]);
    }
    return getUsuarioPorId(u.id);
  }

  // try find by email
  if (email) {
    const exist = await getUsuario(email);
    if (exist) {
      // attach aluno id
      await db.query(
        "UPDATE usuarios SET id_aluno = ?, id_tipo_usuario = 3 WHERE id = ?",
        [id_aluno, exist.id],
      );
      await updateSenhaById(exist.id, hashedSenha);
      return getUsuarioPorId(exist.id);
    }
  }

  // create new
  return createUsuario({
    email,
    senha: hashedSenha,
    id_tipo_usuario: 3,
    id_aluno,
  });
}

async function createOrUpdateForProfessor(id_professor, email, hashedSenha) {
  let u = await getByProfessorId(id_professor);
  if (u) {
    await updateSenhaById(u.id, hashedSenha);
    if (!u.email && email)
      await db.query("UPDATE usuarios SET email = ? WHERE id = ?", [
        email,
        u.id,
      ]);
    return getUsuarioPorId(u.id);
  }

  if (email) {
    const exist = await getUsuario(email);
    if (exist) {
      await db.query(
        "UPDATE usuarios SET id_professor = ?, id_tipo_usuario = 2 WHERE id = ?",
        [id_professor, exist.id],
      );
      await updateSenhaById(exist.id, hashedSenha);
      return getUsuarioPorId(exist.id);
    }
  }

  return createUsuario({
    email,
    senha: hashedSenha,
    id_tipo_usuario: 2,
    id_professor,
  });
}

function construirAtualizacaoPerfil({ nome, email, telefone, avatar, senha }) {
  const campos = [];
  const valores = [];

  if (nome) {
    campos.push("nome = ?");
    valores.push(nome);
  }

  if (email) {
    campos.push("email = ?");
    valores.push(email);
  }

  if (telefone) {
    campos.push("telefone = ?");
    valores.push(telefone);
  }

  /* if (avatar) {
        campos.push("avatar = ?");
        valores.push(avatar);
    }*/

  if (senha) {
    campos.push("senha = ?");
    valores.push(senha);
  }

  return {
    campos,
    valores,
  };
}

module.exports = {
  getUsuario,
  getUsuarioPorId,
  getByAlunoId,
  getByProfessorId,
  createUsuario,
  updateSenhaById,
  createOrUpdateForAluno,
  createOrUpdateForProfessor,
  construirAtualizacaoPerfil,
};
