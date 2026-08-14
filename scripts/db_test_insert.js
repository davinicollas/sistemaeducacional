require('dotenv').config();
const db = require('../database/mysql.js');

async function run() {
  try {
    const [result] = await db.query(
      'INSERT INTO usuarios (nome, email, senha, telefone, data_nascimento) VALUES (?, ?, ?, ?, ?)',
      ['Teste Script', 'teste_script@example.com', 'hash_de_teste', '11999999999', '2000-01-01']
    );

    console.log('Insert OK:', result);
  } catch (err) {
    console.error('Insert ERROR:');
    console.error(err && err.stack ? err.stack : err);
  } finally {
    // ensure process exits
    process.exit(0);
  }
}

run();


//docker compose exec app node scripts/db_test_insert.js