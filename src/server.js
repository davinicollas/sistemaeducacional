
const express = require('express');
const path = require('path');
require('dotenv').config(); // Carrega as variáveis do .env
const app = express();

// Acessando as variáveis de ambiente via process.env
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// Configura o EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.get('/', (req, res) => {
  res.send(`Servidor rodando usando a porta ${PORT}`);
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/cadastro', (req, res) => {
  res.render('cadastro');
});

// Inicia o servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Servidor ativo na porta ${PORT}`);
  console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando servidor...');
  server.close(() => {
    console.log('Servidor encerrado');
    process.exit(0);
  });
});