const express = require("express");
const session = require("express-session");
const path = require("path");
const crypto = require("crypto");
const helmet = require("helmet");
require("dotenv").config();

const PgSession = require("connect-pg-simple")(session);
const db = require("../database/mysql");

// Rotas
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
const notas = require("./routes/notas");

// Middlewares
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

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body
app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

app.use(
  express.json({
    limit: "1mb",
  }),
);

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "..", "public")));

// Health check: confirma que o servidor está no ar
app.get("/ping", (req, res) => res.send("pong"));

let sessionMiddlewareInitialized = false;

/**
 * Inicializa o armazenamento de sessão PostgreSQL
 */
async function initSessionStoreAndMiddleware() {
  if (sessionMiddlewareInitialized) return;

  console.log("========================================");
  console.log("CONFIGURAÇÃO DO POSTGRESQL");
  console.log("========================================");

  console.log({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ? "***" : undefined,
  });

  try {
    // Testa a conexão com PostgreSQL
    const pool = db.pool();
    const result = await pool.query(`
      SELECT
        current_user,
        current_database()
    `);

    console.log("✓ PostgreSQL conectado");
    console.log(`✓ Usuário: ${result.rows[0].current_user}`);
    console.log(`✓ Banco: ${result.rows[0].current_database}`);

    /*
     * A tabela session deve ser criada pelo:
     *
     * patch/create_session_table.sql
     *
     * Não precisamos criar novamente aqui.
     */

    const sessionStore = new PgSession({
      pool,
      tableName: "session",
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

          // HTTPS somente em produção
          secure: isProduction,
        },
      }),
    );

    sessionMiddlewareInitialized = true;

    console.log("✓ Session PostgreSQL configurada");
  } catch (error) {
    console.error("========================================");
    console.error("ERRO AO CONECTAR AO POSTGRESQL");
    console.error("========================================");
    console.error(error);

    throw error;
  }
}

/**
 * Registra as rotas e middlewares da aplicação
 */
function registerRoutes() {
  console.log("Registrando rotas...");
  /*
   * Variáveis disponíveis nas views EJS
   */
  app.use((req, res, next) => {
    res.locals.usuario = req.session?.usuario || null;

    res.locals.permissoes = req.session?.permissoes || {};

    res.locals.isTabbed = req.query && req.query.tabbed === "1";

    /**
     * Helper para verificar permissões
     *
     * Exemplos:
     *
     * hasPermission("alunos", "visualizar")
     * hasPermission("alunos", "editar")
     * hasPermission("alunos", "excluir")
     */
    res.locals.hasPermission = (resource, action) => {
      const perms = req.session?.permissoes || {};

      const usuarioSessao = req.session?.usuario || {};
      // `id_tipo_usuario` is stored as an integer in the session
      const tipoUsuario = usuarioSessao.id_tipo_usuario || null;

      // Administradores possuem acesso a todos os recursos, inclusive aos
      // que ainda não tenham uma permissão cadastrada no banco.
      if (Number(tipoUsuario) === 1) return true;

      const r = resource || "";
      const a = action || "";

      const candidates = [
        `${r}.${a}`,
        `${r}_${a}`,
        `${a}.${r}`,
        `${a}_${r}`,
        `${r} ${a}`,
        `${a} ${r}`,
        a,
        r,
      ];

      // Normalized forms: remove diacritics, non-alnum -> space, spaces -> underscore
      function normalizeKey(s) {
        return String(s || "")
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .replace(/[^a-zA-Z0-9 ]/g, " ")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "_");
      }

      const rNorm = normalizeKey(r);
      const aNorm = normalizeKey(a);

      const normalizedCandidates = [
        `${rNorm}.${aNorm}`,
        `${rNorm}_${aNorm}`,
        `${aNorm}.${rNorm}`,
        `${aNorm}_${rNorm}`,
        `${rNorm} ${aNorm}`,
        `${aNorm} ${rNorm}`,
        aNorm,
        rNorm,
      ];

      const allCandidates = candidates.concat(normalizedCandidates);

      for (const cand of allCandidates) {
        if (!cand) continue;

        const val = perms[cand];

        if (!val) continue;

        if (action === "visualizar") {
          if (val === "view" || val === "full") return true;
        } else {
          if (val === "full") return true;
        }
      }

      return false;
    };

    next();
  });

  /*
   * CSRF
   *
   * Deve ficar depois da sessão.
   */
  app.use(csrfProtection);

  /*
   * Validação de parâmetros ID
   *
   * Evita IDs inválidos nas rotas.
   */
  app.use((req, res, next) => {
    const invalidId = Object.entries(req.params || {}).some(
      ([name, value]) => /^id/i.test(name) && !/^\d+$/.test(String(value)),
    );

    if (invalidId) {
      return res.status(400).send("Identificador inválido.");
    }

    next();
  });

  /*
   * Rotas públicas
   */

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

  /*
   * Cadastro e login
   */
  app.use(usuario);

  app.use(login);

  // Rota de depuração pública: mostra usuário e permissões (não exige login)
  app.get("/debug-perms-public", (req, res) => {
    const usuario = req.session?.usuario || null;
    const permissoes = req.session?.permissoes || {};
    return res.json({ usuario, permissoes });
  });

  /*
   * Autenticação
   */
  app.use(authMid);

  /*
   * Dashboard
   */
  app.get("/dashboard", (req, res) => {
    res.render("dashboard");
  });

  // Rota de depuração: mostra usuário e permissões na sessão (remover em produção)
  app.get("/debug-perms", (req, res) => {
    const usuario = req.session?.usuario || null;
    const permissoes = req.session?.permissoes || {};
    if (!usuario)
      return res.status(401).json({ error: "Usuário não autenticado." });
    return res.json({ usuario, permissoes });
  });

  /*
   * Acesso negado
   */
  app.get("/acesso-negado", (req, res) => {
    res.status(403).render("acessoNegado");
  });

  /*
   * Configurações
   */
  app.use(configuracoes);

  app.use(estados);

  app.use(usuarioPermissoes);

  app.use(aparencia);

  app.use(configuracao_notas);

  /*
   * Acadêmico
   */
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
  app.use(notas);

  /*
   * Error handler
   */
  app.use((error, req, res, next) => {
    console.error("========================================");
    console.error("ERRO NA APLICAÇÃO");
    console.error("========================================");

    console.error(error);

    if (res.headersSent) {
      return next(error);
    }

    res.status(500).send("Ocorreu um erro ao processar a solicitação.");
  });
}

/**
 * Inicialização da aplicação
 */
async function start() {
  try {
    console.log("========================================");
    console.log("INICIANDO SISTEMA EDUCACIONAL");
    console.log("========================================");

    // garante que o banco exista e que o pool esteja inicializado
    await db.init();

    await initSessionStoreAndMiddleware();

    registerRoutes();

    const port = process.env.PORT || 3000;

    app.listen(port, "0.0.0.0", () => {
      console.log("========================================");
      console.log("✓ SERVIDOR INICIADO");
      console.log("========================================");

      console.log(`✓ Porta: ${port}`);

      console.log(`✓ Ambiente: ${process.env.NODE_ENV || "development"}`);

      console.log("✓ Banco: PostgreSQL");

      console.log("========================================");
    });
  } catch (err) {
    console.error("========================================");
    console.error("ERRO AO INICIALIZAR A APLICAÇÃO");
    console.error("========================================");

    console.error(err);

    process.exit(1);
  }
}

start();
