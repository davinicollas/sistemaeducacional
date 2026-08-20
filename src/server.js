
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

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/cadastro', (req, res) => {
  res.render('cadastro');
});
app.get('/calendario', (req, res) => {
  res.render('calendario');
});
app.get('/alunos', (req, res) => {
  res.render('alunos');
});

app.get('/professores', (req, res) => {
  res.render('professores');
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


app.get('/configuracoes_academicas', (req, res) => {
  res.render('configuracoes_academicas');
});

app.get('/documentos', (req, res) => {
  res.render('documentos');
});

app.get('/financeiro', (req, res) => {
  res.render('financeiro');
});
app.get('/notificacoes', (req, res) => {
  res.render('notificacoes');
});


app.use(usuario);
app.use(login);
app.use(configuracoes); 
app.use(estados);
app.use(usuarioPermissoes);
app.use(aparencia);
app.use(configuracao_notas);

// Inicia o servidor
const server = app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`✓ Servidor ativo na porta ${process.env.PORT || 3000}`);
  console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
