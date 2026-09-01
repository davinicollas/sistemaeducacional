
const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config(); // Carrega as variáveis do .env

const MySQLStore = require("express-mysql-session")(session);



const usuario = require('./routes/cadastro');
const login = require('./routes/login');
const configuracoes = require('./routes/configuracoes');
const estados = require('./routes/estados');
const usuarioPermissoes = require('./routes/usuarioPermissoes');
const aparencia = require('./routes/aparencia');
const configuracao_notas = require('./routes/configuracao_notas');
const series = require('./routes/series');
const calendario = require('./routes/calendario');
const documentos = require('./routes/documentos');
const notificacoes = require('./routes/notificacoes');
const tiposDocumentos = require('./routes/tiposDocumentos');
const statusDocumentos = require('./routes/statusDocumentos');
const anosLetivos = require('./routes/anosLetivos');
const periodos = require('./routes/periodos');
const turnos = require('./routes/turnos');
const salas = require('./routes/salas');
const tiposAvaliacao = require('./routes/tiposAvaliacao');
const disciplinas = require('./routes/disciplinas');
const professores = require('./routes/professores');
const formacoes = require('./routes/formacoes');
const alunos = require('./routes/alunos');
const turmas = require('./routes/turmas');

const authMid = require("./middleware/auth");

const app = express();
// Configura o EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve arquivos estáticos a partir da pasta `public` na raiz do projeto
app.use(express.static(path.join(__dirname, '..', 'public')));
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.use(session({
  name: process.env.SESSION_NAME || 'sistema_session',
  secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 dias
    httpOnly: true,
    sameSite: "lax",
    // Apenas cookies seguros em produção (HTTPS)
    secure: process.env.NODE_ENV === 'production'
  }
}));
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario || null;
    next();
});

// Rotas
app.get('/', (req, res) => {
   res.render('index');
});

app.get('/cadastro', (req, res) => {
  res.render('cadastro');
});
app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});
app.get('/privacidade', (req, res) => {
  res.render('privacidade');
});
app.get('/termos', (req, res) => {
  res.render('termos');
});




app.use(usuario);
app.use(login);
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

// Inicia o servidor
const server = app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`✓ Servidor ativo na porta ${process.env.PORT || 3000}`);
  console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
