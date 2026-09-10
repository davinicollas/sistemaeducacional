const bcrypt = require("bcrypt");
const Usuario = require("../model/usuario");

function index(req, res) {
  res.render("login");
}
async function login(req, res) {
  const email = String(req.body.email || "").trim();
  const senha = String(req.body.senha || "");
  try {
    const usuario = await Usuario.getUsuario(email);
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha)))
      return res.render("login", { erro: "Email ou senha inválidos." });
    await new Promise((resolve, reject) => {
      req.session.regenerate((error) => (error ? reject(error) : resolve()));
    });
    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    };
    return res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.render("login", { erro: "Não foi possível realizar o login." });
  }
}
function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie(process.env.SESSION_NAME || "sistema_session");
    res.redirect("/login");
  });
}
module.exports = { index, login, logout };
