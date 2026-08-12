require('dotenv').config(); // Carrega as variáveis do .env

const express = require('express');
const app = express();

// Acessando as variáveis de ambiente via process.env
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`Servidor rodando usando a porta ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Servidor ativo na porta ${PORT}`);
});