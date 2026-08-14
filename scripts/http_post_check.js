const http = require('http');
const querystring = require('querystring');

const postData = querystring.stringify({
  nome: 'Teste HTTP',
  email: 'teste_http@example.com',
  telefone: '11999999999',
  dataNascimento: '2000-01-01',
  senha: 'senha123'
});

const PORT = process.env.PORT || 3000;

const options = {
  hostname: '127.0.0.1',
  port: PORT,
  path: '/cadastro',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log('HEADERS:', res.headers);
  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    console.log('BODY:', rawData.slice(0, 1000));
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
  process.exit(1);
});

req.write(postData);
req.end();
