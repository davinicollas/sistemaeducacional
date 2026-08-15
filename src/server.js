
const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config(); // Carrega as variáveis do .env

const MySQLStore = require("express-mysql-session")(session);



const usuario = require('./routes/cadastro');
const login = require('./routes/login');

const authMid = require("./middleware/auth");

const app = express();
// Configura o EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.use(session({
    name: process.env.SESSION_NAME ,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 dias
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV || false
    }
}));


// Rotas
app.get('/', (req, res) => {
   res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/configuracao', (req, res) => {
  res.render('configuracao');
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


app.use(usuario);
app.use(login);

// Inicia o servidor
const server = app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`✓ Servidor ativo na porta ${process.env.PORT || 3000}`);
  console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
