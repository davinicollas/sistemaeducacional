const bcrypt = require("bcrypt");
const db = require("../../database/mysql");
const Usuario = require("../model/usuario");
const telefoneRegex = /^\d{10,11}$/;

function index(req, res) {
  res.render("cadastro", { erro: null });
}
async function save(req, res) {
  const nome = String(req.body.nome || "").trim();
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();
  const telefone = String(req.body.telefone || "").trim();
  const dataNascimento = String(req.body.dataNascimento || "").trim();
  const senha = String(req.body.senha || "");
  try {
    if (!nome || !email || !senha || !dataNascimento)
      return res.render("cadastro", { erro: "Preencha todos os campos." });
    if (telefone && !telefoneRegex.test(telefone.replace(/\D/g, "")))
      return res.render("cadastro", {
        erro: "Telefone inválido. Use apenas números.",
      });
    if (await Usuario.getUsuario(email))
      return res.render("cadastro", { erro: "E-mail já cadastrado." });
    await db.query(
      "INSERT INTO usuarios (nome, email, senha, telefone, data_nascimento, termos) VALUES (?, ?, ?, ?, ?, ?)",
      [
        nome,
        email,
        await bcrypt.hash(senha, 10),
        telefone,
        dataNascimento,
        req.body.termo === "on",
      ],
    );
    const usuario = await Usuario.getUsuario(email);
    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    };
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("cadastro", { erro: "Erro ao cadastrar usuário." });
  }
}
module.exports = { index, save };
