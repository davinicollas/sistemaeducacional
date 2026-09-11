const express = require("express");
const session = require("express-session");
const path = require("path");
const crypto = require("crypto");
const helmet = require("helmet");
require("dotenv").config(); // Carrega as variáveis do .env
const rateLimit = require("express-rate-limit");

const MySQLStore = require("express-mysql-session")(session);

const usuario = require("./routes/cadastro");
const login = require("./routes/login");
const configuracoes = require("./routes/configuracoes");
const estados = require("./routes/estados");
const usuarioPermissoes = require("./routes/usuarioPermissoes");
const aparencia = require("./routes/aparencia");
const configuracao_notas = require("./routes/configuracao_notas");
const series = require("./routes/series");
const calendario = require("./routes/calendario");
const documentos = require("./routes/documentos");
const notificacoes = require("./routes/notificacoes");
const tiposDocumentos = require("./routes/tiposDocumentos");
const statusDocumentos = require("./routes/statusDocumentos");
const anosLetivos = require("./routes/anosLetivos");
const periodos = require("./routes/periodos");
const turnos = require("./routes/turnos");
const salas = require("./routes/salas");
const tiposAvaliacao = require("./routes/tiposAvaliacao");
const disciplinas = require("./routes/disciplinas");
const professores = require("./routes/professores");
const formacoes = require("./routes/formacoes");
const alunos = require("./routes/alunos");
const turmas = require("./routes/turmas");
const frequencia = require("./routes/frequencia");

const authMid = require("./middleware/auth");
const csrfProtection = require("./middleware/csrf");

const isProduction = process.env.NODE_ENV === "production";
const sessionSecret =
  process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET deve ser configurado em produção.");
}

const app = express();
app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
// Configura o EJS como view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.json({ limit: "1mb" }));
// Serve arquivos estáticos a partir da pasta `public` na raiz do projeto
app.use(express.static(path.join(__dirname, "..", "public")));
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(
  session({
    name: process.env.SESSION_NAME || "sistema_session",
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 dias
      httpOnly: true,
      sameSite: "lax",
      // Apenas cookies seguros em produção (HTTPS)
      secure: isProduction,
    },
  }),
);
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  res.locals.isTabbed = req.query && req.query.tabbed === "1";
  next();
});
app.use(csrfProtection);
app.use((req, res, next) => {
  const invalidId = Object.entries(req.params || {}).some(
    ([name, value]) => /^id/i.test(name) && !/^\d+$/.test(String(value)),
  );
  if (invalidId) return res.status(400).send("Identificador inválido.");
  next();
});

// Rotas
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/cadastro", (req, res) => {
  res.render("cadastro");
});
app.get("/privacidade", (req, res) => {
  res.render("privacidade");
});
app.get("/termos", (req, res) => {
  res.render("termos");
});

app.use(usuario);
app.use(login);
app.use(authMid);
app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});
app.use(configuracoes);
app.use(estados);
app.use(usuarioPermissoes);
app.use(aparencia);
app.use(configuracao_notas);
app.use(series);
app.use(calendario);
app.use(documentos);
app.use(tiposDocumentos);
app.use(notificacoes);
app.use(statusDocumentos);
app.use(anosLetivos);
app.use(periodos);
app.use(turnos);
app.use(salas);
app.use(tiposAvaliacao);
app.use(disciplinas);
app.use(professores);
app.use(formacoes);
app.use(alunos);
app.use(turmas);
app.use(frequencia);

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  res.status(500).send("Ocorreu um erro ao processar a solicitação.");
});

// Inicia o servidor
const server = app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log(`✓ Servidor ativo na porta ${process.env.PORT || 3000}`);
  console.log(`✓ Ambiente: ${process.env.NODE_ENV || "development"}`);
});
